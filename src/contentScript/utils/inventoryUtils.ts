import axios from "axios";
import {filteredTool, InventoryItem} from "../types/tools";
import {pushError} from "./hud/pushError";
import {ResourceTypes, stackSize} from "../types/resourceTypes";
import {toolSortFn} from "./sorts/toolSort";
import autoClicker from "@contentScript/services/autoClicker";
import settings from "@contentScript/store/settings";
import {InventoryTypes} from "@contentScript/types/inventoryTypes";
import {RecyclerInfo, RecyclerTypes} from "@contentScript/types/recyclerTypes";

export const getItems = async (boxID: InventoryTypes): Promise<InventoryItem[]> => {
  const {data} = await axios.get<{
    status: string;
    data: InventoryItem[];
    message: string;
  }>(`https://cobaltlab.tech/api/cobaltGame/inventory?boxID=${boxID}`);

  if (data.status !== 'success') {
    pushError(data.message || data.status, true);
    throw new Error(data.message || data.status);
  }

  return data.data;
}

const fetchTools = async () => (await getItems(InventoryTypes.toolbar)).map((item) => {
  const type = item.itemID ? ResourceTypes[item.itemID] : undefined;
  if (!type && item.itemID !== null)
    console.log({...item, type});
  return {
    ...item,
    type,
  }
}).filter(item => item.itemID && item.quantity && item.durability !== null) as filteredTool[]

export const getTools = async () => {
  let tools = await fetchTools();
  if (autoClicker.settings.autoDeleteTool) {
    const deleteList = tools.filter(item => item.type !== 'rock' && item.type?.slice(-1) !== '4' && item.durability < 1);
    if (deleteList.length > 0) {
      for (const item of deleteList) {
        await deleteItem({
          boxID: InventoryTypes.toolbar,
          itemID: item.itemID,
          slotID: item.slotID,
          quantity: item.quantity
        });
      }
      tools = await fetchTools();
    }
  }
  return {
    axes: tools.filter(item => item.type?.startsWith('axe') && item.durability > 0)
      .sort(toolSortFn),
    pickaxes: tools.filter(item => item.type?.startsWith('pickaxe') && item.durability > 0)
      .sort(toolSortFn),
    rock: tools.find(item => item.type === 'rock'),
  }
}

export const repairItem = async (boxID: string, slotID: number) => {
  const {data} = await axios.post<{
    status: string;
    data: InventoryItem[];
    message: string;
  }>('https://cobaltlab.tech/api/cobaltGame/inventoryRepair', {
    boxID: boxID,
    slotID: slotID,
  });

  if (data.status !== 'success') {
    pushError(data.message || data.status, true);
    throw new Error(data.message || data.status);
  }

  return data.data;
}

export const moveItem = async <From = InventoryTypes | RecyclerTypes, To = InventoryTypes | RecyclerTypes>(moveInfo: {
  boxFrom: From;
  boxTo: To;
  slotFrom: number;
  slotTo: number;
}) => {
  const {data} = await axios.post<{
    status: string;
    data: {
      from: From extends InventoryTypes ? InventoryItem[] : From extends RecyclerTypes ? RecyclerInfo['data'] : unknown;
      to: To extends InventoryTypes ? InventoryItem[] : To extends RecyclerTypes ? RecyclerInfo['data'] : unknown;
    };
    message: string;
  }>('https://cobaltlab.tech/api/cobaltGame/inventoryMove', {
    boxFrom: `${moveInfo.boxFrom}`,
    boxTo: `${moveInfo.boxTo}`,
    slotFrom: moveInfo.slotFrom.toString(),
    slotTo: moveInfo.slotTo.toString(),
  });

  if (data.status !== 'success') {
    pushError(data.message || data.status, true);
    throw new Error(data.message || data.status);
  }

  return data.data;
}

export const splitItem = async (boxID: InventoryTypes, slotID: number) => {
  const {data} = await axios.post<{
    status: string;
    data: InventoryItem[];
    message: string;
  }>('https://cobaltlab.tech/api/cobaltGame/inventorySplit', {
    boxID: `${boxID}`,
    slotID: slotID,
  });

  if (data.status !== 'success') {
    pushError(data.message || data.status, true);
    throw new Error(data.message || data.status);
  }

  return data.data;
}

export const deleteItem = async (itemInfo: {
  boxID: InventoryTypes;
  slotID: number;
  itemID: ResourceTypes;
  quantity: number;
}) => {
  const {data} = await axios.post<{
    status: string;
    data: InventoryItem[];
    message: string;
  }>('https://cobaltlab.tech/api/cobaltGame/inventoryRemove', {
    ...itemInfo,
    boxID: itemInfo.boxID.toString(),
    confirmed: 1,
  })

  if (data.status !== 'success') {
    pushError(data.message || data.status, true);
    throw new Error(data.message || data.status);
  }

  return data.data;
}

export const selectQuickSlot = async (slotID: number) => {
  const {data} = await axios.get<{
    status: string;
    data: any;
    message: string;
  }>(`https://cobaltlab.tech/api/cobaltGame/selectQuickSlot?slotID=${slotID}`);

  if (data.status !== 'success') {
    pushError(data.message || data.status, true);
    throw new Error(data.message || data.status);
  }

  const slots = settings.gameBody.querySelectorAll<HTMLDivElement>(
    'div.farm-list > div.farm-list__item'
  );
  const tools = await getItems(InventoryTypes.toolbar);
  const toolIndex = tools.findIndex(item => item.slotID === slotID);
  if (toolIndex < 0) {
    pushError(`slotID ${slotID} не найден!`);
    return;
  }
  const selectedTool = slots[toolIndex]
  if (!selectedTool) {
    pushError('Слот с инструментом не обнаружен');
    return;
  }
  selectedTool.click();
}

export const compileItems = async (boxID: InventoryTypes = InventoryTypes.user) => {
  let inventory = await getItems(boxID);
  for (let i = inventory.length - 1; i > -1; i--) {
    const fromCell = {...inventory[i]};
    if (fromCell.itemID === null || fromCell.quantity === stackSize(fromCell.itemID))
      continue;
    inventory[i].itemID = null;
    if (fromCell) {
      const sameResources = inventory.filter(
        item => item.itemID && item.itemID === fromCell.itemID && item.quantity !== stackSize(item.itemID)
      );
      for (const toCell of sameResources) {
        await moveItem({
          boxFrom: boxID,
          boxTo: boxID,
          slotFrom: fromCell.slotID,
          slotTo: toCell.slotID,
        });
        inventory = await getItems(boxID);
        if (inventory[i]?.itemID === undefined || inventory[i]?.itemID === null) {
          break;
        }
      }
    }
  }
}
