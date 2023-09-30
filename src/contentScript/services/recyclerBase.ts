import axios from "axios";
import {RecyclerInfo, RecyclerTypes, Variation} from "@contentScript/types/recyclerTypes";
import {recyclerStrings} from "@contentScript/store/recyclerNames";
import {pushNotification} from "@contentScript/utils/hud/pushNotification";
import {pushError} from "@contentScript/utils/hud/pushError";
import {compileItems, getItems, moveItem, splitItem} from "@contentScript/utils/inventoryUtils";
import {InventoryTypes} from "@contentScript/types/inventoryTypes";
import {groupBy} from "@contentScript/utils/groupBy";
import {InventoryItem} from "@contentScript/types/tools";
import {ResourceTypes} from "@contentScript/types/resourceTypes";

class RecyclerBase {
  private _variations: Variation[] = [];
  private _emptyRecyclerTryCount = 0;
  private _timerNotificationSelfDelete: () => void = () => {
  };

  private readonly _type;
  private readonly _strings;

  constructor(type: RecyclerTypes) {
    this._type = type;
    this._strings = recyclerStrings[type];
  }

  public async getRecyclerInfo(): Promise<RecyclerInfo['data']> {
    const {
      data: {
        data,
        status,
        message
      }
    } = await axios.get<RecyclerInfo>(`https://cobaltlab.tech/api/cobaltGame/recycler/get?type=${this._type}`);
    if (status !== 'success') {
      return Promise.reject(message || status);
    }
    this._variations = data.variations;
    return data;
  }

  public async turnOffRecycler(): Promise<void> {
    const {
      data: {
        status,
        message
      }
    } = await axios.get<RecyclerInfo>(`https://cobaltlab.tech/api/cobaltGame/recycler/turnOff?type=${this._type}`);
    if (status !== 'success' && message !== 'needTurnOn') {
      return Promise.reject(message || status);
    }
    try {
      this._timerNotificationSelfDelete();
    } catch (e: any) {
      pushError(
        `Не удалось удалить уведомление о перезапуске "${
          this._strings.title
        }". Причина: "${
          e?.message ?? e.reason ?? e
        }". Можете удалить его вручную, кликнув на него.`,
        true,
        5000
      );
    }
  }

  public async turnOnRecycler(callBack?: () => void): Promise<void> {
    try {
      const {
        data: {
          status,
          message
        }
      } = await axios.get<RecyclerInfo>(`https://cobaltlab.tech/api/cobaltGame/recycler/turnOn?type=${this._type}`);
      if (status !== 'success') {
        return Promise.reject(message || status);
      }
      if (callBack)
        return callBack();
    } catch (e) {
      return Promise.reject(e);
    }
  }

  public async emptyRecycler(restart = false, noAutoCompileItems = false): Promise<void> {
    let deleteNotify = () => {
    };
    try {
      const recycler = await this.getRecyclerInfo();
      const userInventory = await getItems(InventoryTypes.user);
      const filledCells = [...recycler.in, ...recycler.out].filter(item => item.itemID !== null);
      if (filledCells.length > 0) {
        if (restart) {
          deleteNotify = pushNotification('Запущена уборка в инвентаре. Подождите.')
          await compileItems(InventoryTypes.user);
          deleteNotify();
        }
        for (const cell of filledCells) {
          if (restart) {
            this._emptyRecyclerTryCount += 1;
            if (this._emptyRecyclerTryCount > 5)
              return Promise.reject('В инвентаре нет места?');
          }
          try {
            await moveItem({
              boxFrom: this._type,
              boxTo: InventoryTypes.user,
              slotFrom: cell.slotID,
              slotTo: userInventory[0].slotID,
            });
          } catch (e) {
            pushNotification(`Не удалось переместить предмет. Попытка #${this._emptyRecyclerTryCount}`, true);
          }
        }
        return await this.emptyRecycler(true, noAutoCompileItems);
      } else {
        this._emptyRecyclerTryCount = 0;
        if (restart) {
          if (noAutoCompileItems) {
            deleteNotify = pushNotification('Запущена уборка в инвентаре. Подождите.')
            await compileItems(InventoryTypes.user);
            deleteNotify();
          }
          pushNotification(`${this._strings.title} очищен${this._strings.gender}!`, true);
        }
      }
    } catch (e: any) {
      deleteNotify();
      return Promise.reject(`Не удалось очистить "${this._strings.title}". Причина: "${e?.message ?? e.reason ?? e}"`);
    }
  }

  public async loadFuel(
    fuels: (InventoryItem & {
      itemID: ResourceTypes;
      quantity: number;
      time: number
    })[],
    freeFuelSlots: number[]
  ) {
    const groupedFuel = groupBy(fuels, 'itemID');
    const fuelToLoad = Object.entries(groupedFuel).reduce<(InventoryItem & {
      itemID: ResourceTypes;
      quantity: number;
      time: number
    })[]>(
      (acc, [, value], index) => {
        if (index === 0)
          return value;
        if (acc.length < value.length)
          return value
        else
          return acc;
      },
      []
    ).sort((a, b) => a.quantity - b.quantity);
    const movedFuel: (InventoryItem & { itemID: ResourceTypes; quantity: number; time: number })[] = [];
    for (const fuel of fuelToLoad) {
      const slotTo = freeFuelSlots.pop();
      if (slotTo) {
        await moveItem({boxFrom: InventoryTypes.user, boxTo: this._type, slotFrom: fuel.slotID, slotTo});
        movedFuel.push(fuel);
      }
    }
    return movedFuel;
  }

  public async loadResources(
    resources: (InventoryItem & {
      itemID: ResourceTypes;
      quantity: number;
      time: number
    })[],
    freeResourceSlots: number[],
  ): Promise<(InventoryItem & { itemID: ResourceTypes; quantity: number; time: number })[]> {
    const groupedResources = groupBy(resources, 'itemID');
    const resourcesToLoad = Object.entries(groupedResources)
      .reduce<(InventoryItem & { itemID: ResourceTypes; quantity: number; time: number })[]>(
        (acc, [, value], index) => {
          if (this._type === RecyclerTypes.furnace) {
            if (index === 0)
              return value;
            if (acc.length < value.length)
              return value
            else
              return acc;
          } else {
            acc.push(...value);
            return acc;
          }
        },
        []
      ).sort((a, b) => b.quantity - a.quantity);
    if (this._type === RecyclerTypes.furnace) {
      if (resourcesToLoad.length === 1 && resourcesToLoad[0].quantity > 1 && this._type === RecyclerTypes.furnace) {
        await this.emptyRecycler();
        const newInventory = (await splitItem(InventoryTypes.user, resourcesToLoad[0].slotID)).filter((item) => resources.some(elem => elem.itemID === item.itemID)) as (InventoryItem & {
          itemID: ResourceTypes;
          quantity: number;
        })[];
        const newResources: (InventoryItem & { itemID: ResourceTypes; quantity: number; time: number })[] = [];
        for (const variation of this._variations) {
          newInventory.forEach(inventoryItem => {
            const variationItem = variation.items?.find(elem => elem.from.itemID === inventoryItem.itemID)?.from;
            if (variationItem) {
              newResources.push({...inventoryItem, time: variationItem.time});
            }
          })
        }
        pushNotification('Разбиваю последний стак такого вида ресурсов пополам. Перезапускаю', true)
        return await this.loadResources(newResources, freeResourceSlots);
      }
    }
    const movedResources: (InventoryItem & { itemID: ResourceTypes; quantity: number; time: number })[] = [];
    for (const resource of resourcesToLoad) {
      const slotTo = freeResourceSlots.pop();
      if (slotTo) {
        await moveItem({
          boxFrom: InventoryTypes.user,
          boxTo: this._type,
          slotFrom: resource.slotID,
          slotTo
        });
        movedResources.push(resource);
      }
    }
    return movedResources;
  }

  public get variations() {
    return this._variations;
  }

  public get title() {
    return this._strings.title;
  }

  public get gender() {
    return this._strings.gender;
  }

  public set selfDeleteNotification(fn: () => void) {
    this._timerNotificationSelfDelete = fn;
  }

  public get selfDeleteNotification() {
    return this._timerNotificationSelfDelete;
  }
}

export default RecyclerBase;