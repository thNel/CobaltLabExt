import axios from "axios";
import {filteredTool, inventoryItem} from "../types/tools";
import {pushError} from "./hud/pushError";
import {resourceTypes} from "../store/resourceTypes";
import {toolSortFn} from "./sorts/toolSort";
import autoClicker from "@contentScript/store/autoClicker";
import settings from "@contentScript/store/settings";

export const getItems = async (boxID: string): Promise<inventoryItem[]> => {
  const {data} = await axios.get<{
    status: string;
    data: inventoryItem[];
    message: string;
  }>(`https://cobaltlab.tech/api/cobaltGame/inventory?boxID=${boxID}`);

  if (data.status !== 'success') {
    pushError(data.message, true);
    throw new Error(data.message);
  }

  return data.data;
}

const fetchTools = async () => (await getItems('3')).map((item) => {
  const type = item.itemID ? resourceTypes[item.itemID] : undefined;
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
        await deleteItem({boxID: '3', itemID: item.itemID, slotID: item.slotID, quantity: item.quantity});
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
    data: inventoryItem[];
    message: string;
  }>('https://cobaltlab.tech/api/cobaltGame/inventoryRepair', {
    boxID: boxID,
    slotID: slotID,
  });

  if (data.status !== 'success')
    pushError(data.message, true);


  console.log('repairItem response', data);

  return data.data;
}

export const moveItem = async (moveInfo: {
  boxFrom: string;
  boxTo: string;
  slotFrom: number;
  slotTo: number;
}) => {
  const {data} = await axios.post<{
    status: string;
    data: any;
    message: string;
  }>('https://cobaltlab.tech/api/cobaltGame/inventoryRepair', {
    ...moveInfo,
  });

  if (data.status !== 'success') {
    pushError(data.message, true);
    throw new Error(data.message);
  }

  console.log('moveItem response', data);

  return data.data;
}

export const splitItem = async (boxID: string, slotID: number) => {
  const {data} = await axios.post<{
    status: string;
    data: any;
    message: string;
  }>('https://cobaltlab.tech/api/cobaltGame/inventorySplit', {
    boxID: boxID,
    slotID: slotID,
  });

  if (data.status !== 'success') {
    pushError(data.message, true);
    throw new Error(data.message);
  }

  console.log('splitItem response', data);

  return data.data;
}

export const deleteItem = async (itemInfo: {
  boxID: string;
  slotID: number;
  itemID: number;
  quantity: number;
}) => {
  const {data} = await axios.post<{
    status: string;
    data: any;
    message: string;
  }>('https://cobaltlab.tech/api/cobaltGame/inventoryRemove', {
    ...itemInfo,
    confirmed: 1,
  })

  if (data.status !== 'success') {
    pushError(data.message, true);
  }

  console.log('deleteItem response', data);

  return data.data;
}

export const selectQuickSlot = async (slotID: number) => {
  // const {data} = await axios.get<{
  //   status: string;
  //   data: any;
  //   message: string;
  // }>(`https://cobaltlab.tech/api/cobaltGame/selectQuickSlot?slotID=${slotID}`);
  //
  // if (data.status !== 'success') {
  //   pushError(data.message, true);
  // }
  //
  // console.log('selectQuickSlot response', data);

  // return data.data;

  const slots = settings.gameBody.querySelectorAll<HTMLDivElement>(
    'div.farm-list > div.farm-list__item'
  );
  const tools = await getItems('3');
  const toolIndex = tools.findIndex(item => item.slotID === slotID);
  if (toolIndex < 0) {
    pushError('Слот с инструментом не обнаружен 1');
    return;
  }
  const selectedTool = slots[toolIndex]
  if (!selectedTool) {
    pushError('Слот с инструментом не обнаружен 2');
    return;
  }
  selectedTool.click();
}
