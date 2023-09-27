import {RecyclerInfo, RecyclerTypes} from "@contentScript/types/recyclerTypes";
import axios from "axios";
import {getItems, moveItem} from "@contentScript/utils/inventoryUtils";
import {inventoryItem} from "@contentScript/types/tools";
import {createButton} from "@contentScript/utils/hud/createButton";
import {pushNotification} from "@contentScript/utils/hud/pushNotification";
import {pushError} from "@contentScript/utils/hud/pushError";
import {createSpan} from "@contentScript/utils/hud/createSpan";

class Recycler {
  private _tryCount = 0;
  private _remaining = 0;
  private _started = false;
  private _timeout = setTimeout(() => {
  }, 1);

  private readonly _fromHouse;
  private readonly _type;
  private readonly _label;
  private readonly _genderLabel;
  private readonly _button;

  constructor(type: RecyclerTypes, label: string) {
    this._type = type;
    this._fromHouse = [RecyclerTypes.barn, RecyclerTypes.plant, RecyclerTypes.forge].includes(type);
    this._label = label;
    this._genderLabel = ['а', 'я'].includes(this._label.slice(-1)) ? 'a' : '';
    this._button = createButton({
      innerElements: [createSpan(label)],
      classes: 'btn btn-blue btn-small btn-icon',
      onClick: async () => {
        try {
          await this.toggle();
        } catch (e: any) {
          pushError(e?.message ?? e.reason ?? e, true);
        }
      },
    })
  }

  public get button() {
    return this._button;
  }

  public async toggle(): Promise<void> {
    try {
      if (this._started) {
        clearTimeout(this._timeout);
        await this.turnOff();
        this._started = false;
        this._remaining = 0;
        pushNotification(`${this._label} был${this._genderLabel} остановлен${this._genderLabel} пользователем.`, true);
        await this.takeBack();
        return;
      }
      await this.init();
    } catch (e) {
      return Promise.reject(e);
    }
  }

  private async turnOn(): Promise<void> {
    const {
      data: {
        data,
        status,
        message
      }
    } = await axios.get<RecyclerInfo>(`https://cobaltlab.tech/api/cobaltGame/recycler/turnOn?type=${this._type}`);
    if (status !== 'success')
      return Promise.reject(message || status);
    const fuel = data.variations[0].fuel;
    const resourceTime = data.in.filter(item => item.slotID !== fuel?.slotID)
      .reduce(
        (acc, item) =>
          acc
          + ((item.quantity ?? 0)
            * (data.variations[0]?.items
                ?.find(elem => elem.from.itemID === item.itemID)
                ?.from.time ?? 0
            ))
        , 0);
    const fuelTime = data.in.filter(item => item.slotID === (fuel && (fuel.slotID ?? 1)))
      .reduce(
        (acc, item) =>
          acc
          + ((item.quantity ?? 0)
            * (fuel?.from.time ?? 0))
        , 0);
    const forgeResourceTime = this._type !== RecyclerTypes.forge
      ? null
      : await (async () => {
        const {data: forge} = await axios.get<RecyclerInfo>(`https://cobaltlab.tech/api/cobaltGame/recycler/get?type=${this._type}`);
        if (forge.status !== 'success') {
          return Promise.reject(forge.message || forge.status);
        }
        const max = forge.data.in.filter(item => item.slotID !== fuel?.slotID).reduce(
          (acc, item) => {
            const time = (item.quantity ?? 0) * (forge.data.variations[0].items.find(elem => elem.from.itemID === item.itemID)?.from.time ?? 0);
            if (acc < time)
              return time
            else
              return acc;
          }
          , 0);
        return max / (fuel?.from.time ?? 1)
      })();
    this._remaining = (fuelTime > (forgeResourceTime ?? resourceTime) && !(this._type === RecyclerTypes.barn || this._type === RecyclerTypes.plant) ? (forgeResourceTime ?? resourceTime) : fuelTime) - (data.startTime ?? 0);
    if (this._remaining > 0) {
      this._started = true;
      this._timeout = setTimeout(() => {
        this.init();
      }, this._remaining * 1000);
      pushNotification(`${this._label} заполнен${this._genderLabel} по-максимуму. Включаю...`, true);
      this._button.style.cssText = 'background-color: rgba(46,139,87,1) !important;'
    } else {
      this._started = false;
      pushNotification('Все ресурсы переработаны!', true);
    }
  }

  private async turnOff(): Promise<void> {
    const {data} = await axios.get<RecyclerInfo>(`https://cobaltlab.tech/api/cobaltGame/recycler/turnOff?type=${this._type}`);
    if (data.status !== 'success' && data.message !== 'needTurnOn') {
      pushError(data.message || data.status, true);
    }
    this._button.style.cssText = '';
  }

  private async takeBack(restart = false): Promise<void> {
    try {
      const {data: recyclerInfo} = await axios.get<RecyclerInfo>(`https://cobaltlab.tech/api/cobaltGame/recycler/get?type=${this._type}`);
      if (recyclerInfo.status !== 'success') {
        return Promise.reject(recyclerInfo.message || recyclerInfo.status);
      }
      const inventoriesArray = [await getItems('1'), this._fromHouse ? await getItems('2') : []];
      const filledCells = recyclerInfo.data.out
        .filter(item => item.itemID !== null)
        .concat(recyclerInfo.data.in?.filter(item => item.itemID !== null) ?? []);
      for (let i = 0; i < inventoriesArray.length; i++) {
        if (i > 0) break; //Напрямую в сундук чё-т не получается опустошать перерабы
        const inventory = inventoriesArray[i];
        if (filledCells.some(item => item.itemID !== null)) {
          if (restart) {
            this._tryCount += 1;
            if (this._tryCount > 5)
              return Promise.reject('В инвентаре нет места!');
          }
          try {
            for (const item of filledCells) {
              await moveItem({
                boxFrom: this._type.toString(),
                boxTo: (i + 1).toString(),
                slotFrom: item.slotID,
                slotTo: inventory[0].slotID
              });
            }
          } catch (e) {
            continue;
          }
          return await this.takeBack(true);
        }
      }
      this._tryCount = 0;
      if (filledCells.length > 0 || restart)
        pushNotification(`${this._label} очищен${this._genderLabel}!`, true);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  private async init(): Promise<void> {
    try {
      const {data: recyclerInfo} = await axios.get<RecyclerInfo>(`https://cobaltlab.tech/api/cobaltGame/recycler/get?type=${this._type}`);
      if (recyclerInfo.status !== 'success') {
        return Promise.reject(recyclerInfo.message || recyclerInfo.status);
      }
      await this.turnOff();
      await this.takeBack();
      const inventoriesArray = [await getItems('1'), this._fromHouse ? await getItems('2') : []];

      for (let i = 0; i < inventoriesArray.length; i++) {
        if (i > 0) break; //Напрямую из сундука чё-т не получается наполнять перерабы
        const inventory = inventoriesArray[i];
        // Заполнение ячеек переработки
        const filteredInventory = inventory.filter(
          item => recyclerInfo.data.variations[0]?.items?.some(
            elem => elem.from.itemID === item.itemID
          )
        ).sort((a, b) => (a.quantity ?? 0) - (b.quantity ?? 0));
        const movedResources: inventoryItem[] = [];
        for (const item of recyclerInfo.data.in.filter(elem => elem.itemID === null && (recyclerInfo.data.variations[0].fuel && (recyclerInfo.data.variations[0].fuel.slotID ?? 1)) !== elem.slotID)) {
          const resource = filteredInventory.pop();
          if (!resource) {
            break;
          }
          await moveItem({
            boxFrom: (i + 1).toString(),
            slotFrom: resource.slotID,
            boxTo: this._type.toString(),
            slotTo: item.slotID
          });
          movedResources.push(resource);
        }

        // Заполнение ячеек топлива
        const fuelArray = recyclerInfo.data.variations.map(item => item.fuel);
        let filled = false;
        for (const fuel of fuelArray) {
          if (filled) break;
          if (fuel !== null) {
            const inventoryFuel = inventory.filter(item => item.itemID === fuel.from.itemID).sort((a, b) => (b.quantity ?? 0) - (a.quantity ?? 0));
            let fuelCount = 0
            for (const item of inventoryFuel) {
              fuelCount += item.quantity ?? 0;
              await moveItem({
                boxFrom: (i + 1).toString(),
                slotFrom: item.slotID,
                boxTo: this._type.toString(),
                slotTo: fuel.slotID ?? 1
              });
              if (
                fuelCount >= movedResources
                  .reduce(
                    (acc, elem) => acc
                      + (elem.quantity ?? 0) * (recyclerInfo.data.variations[0]?.items
                        .find(resource => resource.from.itemID === elem.itemID)?.from.time ?? 0)
                    , 0) / fuel.from.time
                || fuelCount === 3000 || this._type === RecyclerTypes.forge
              ) {
                filled = true;
                break;
              }
            }
          }
        }
      }
      await this.turnOn();
      if (this._remaining > 0) {
        const date = new Date();
        date.setSeconds(this._remaining + date.getSeconds());
        pushNotification(`${this._label} запущен${this._genderLabel}. Время перезапуска: ${date.toLocaleTimeString('ru-RU')}`, true, this._remaining * 1000);
      }
    } catch (e) {
      return Promise.reject(`Не удалось запустить ${this._label}. Причина: ${e}`);
    }
  }
}

export default Recycler;