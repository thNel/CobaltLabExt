import RecyclerBase from "@contentScript/services/recyclerBase";
import {RecyclerTypes} from "@contentScript/types/recyclerTypes";
import {createButton} from "@contentScript/utils/hud/createButton";
import {createSpan} from "@contentScript/utils/hud/createSpan";
import {pushError} from "@contentScript/utils/hud/pushError";
import {pushNotification} from "@contentScript/utils/hud/pushNotification";
import {getItems} from "@contentScript/utils/inventoryUtils";
import {InventoryTypes} from "@contentScript/types/inventoryTypes";
import {InventoryItem} from "@contentScript/types/tools";
import {ResourceTypes} from "@contentScript/types/resourceTypes";

class Furnace {
  private _remaining = 0;
  private _started = false;
  private _timeout = setTimeout(() => {
  }, 1);
  private _blackList = JSON.parse(localStorage.getItem('furnaceBlackList') ?? `[${ResourceTypes.canOfTuna}]`);
  private _deleteCoal = JSON.parse(localStorage.getItem('furnaceDeleteCoal') ?? 'false');

  private readonly _button;
  private readonly recycler;

  constructor() {
    this.recycler = new RecyclerBase(RecyclerTypes.furnace);
    this._button = createButton({
      innerElements: [createSpan(this.recycler.title)],
      classes: 'btn btn-blue btn-small btn-icon btn-recycler',
      onClick: async () => {
        try {
          await this.toggle();
        } catch (e: any) {
          pushError(e?.message ?? e.reason ?? e, true, 4000);
        }
      },
    });
  }

  private enableState() {
    this._started = true;
    this._button.style.cssText = 'background-color: rgba(46,139,87,0.8) !important;';
  }

  private async disableState() {
    clearTimeout(this._timeout);
    this._started = false;
    this._button.style.cssText = '';
    this._remaining = 0;
    await this.recycler.turnOffRecycler();
    await this.recycler.emptyRecycler(true);
    this.recycler.selfDeleteNotification();
  }

  private async toggle(): Promise<void> {
    try {
      if (this._started) {
        await this.disableState();
        pushNotification(`${this.recycler.title} был${this.recycler.gender} остановлен${this.recycler.gender} пользователем.`, true);
        return;
      }
      this.enableState();
      await this.init();
    } catch (e) {
      await this.disableState();
      return Promise.reject(e);
    }
  }

  private async init() {
    try {
      await this.recycler.turnOffRecycler();
      await this.recycler.emptyRecycler();
      const recyclerInfo = await this.recycler.getRecyclerInfo();
      const userInventory = (await getItems(InventoryTypes.user)).filter((item) => item.itemID && item.quantity !== null && !this._blackList.includes(item.itemID)) as (InventoryItem & {
        itemID: ResourceTypes;
        quantity: number;
      })[];
      const resources: (InventoryItem & { itemID: ResourceTypes; quantity: number; time: number })[] = [];
      const fuels: (InventoryItem & { itemID: ResourceTypes; quantity: number; time: number })[] = [];
      for (const variation of this.recycler.variations) {
        userInventory.forEach(inventoryItem => {
          if (inventoryItem.itemID === variation.fuel?.from.itemID) {
            fuels.push({...inventoryItem, time: variation.fuel!.from.time});
            return;
          }
          const variationItem = variation.items?.find(elem => elem.from.itemID === inventoryItem.itemID)?.from;
          if (variationItem) {
            resources.push({...inventoryItem, time: variationItem.time});
          }
        })
      }
      if (resources.length === 0) {
        pushNotification(`Все ресурсы для "${this.recycler.title}" переработаны!`, true);
        await this.disableState();
        return;
      }
      if (fuels.length === 0) {
        return Promise.reject(`Нет топлива для "${this.recycler.title}"!`);
      }

      const freeResourceSlots: number[] = [];
      const freeFuelSlots: number[] = [];

      recyclerInfo.in.forEach(slot => {
        if (slot.itemID === null) {
          if (this.recycler.variations.reduce<boolean>((acc, elem) =>
              elem.fuel?.slotID === slot.slotID || acc,
            false
          )) {
            freeFuelSlots.push(slot.slotID);
          } else {
            freeResourceSlots.push(slot.slotID);
          }
        }
      });

      // Загрузка ресурсов в печь
      const movedResources: (InventoryItem & {
        itemID: ResourceTypes;
        quantity: number;
        time: number
      })[] = await this.recycler.loadResources(resources, freeResourceSlots, this.init.bind(this));

      // Загрузка топлива в печь
      const movedFuel: (InventoryItem & {
        itemID: ResourceTypes;
        quantity: number;
        time: number
      })[] = await this.recycler.loadFuel(fuels, freeFuelSlots);

      await this.recycler.turnOnRecycler(() => {
        // Вычисляем когда доставать
        const fuelTime = movedFuel.reduce((acc, item) => {
          const time = item.quantity * item.time;
          if (time > 0 && (time < acc || acc === 0))
            return time;
          return acc;
        }, 0);
        const resourceTime = movedResources.reduce((acc, item) => {
          const time = item.quantity * item.time;
          if (time > 0 && (time < acc || acc === 0))
            return time;
          return acc;
        }, 0);
        this._remaining = (fuelTime < resourceTime ? fuelTime : resourceTime) - (recyclerInfo.startTime ?? 0);

        // Печь запущена, ждём окончания
        if (this._remaining > 0) {
          this._timeout = setTimeout(() => {
            this.init().catch(e => {
              this.disableState();
              pushError(e?.message ?? e.reason ?? e, true, 4000);
            });
          }, this._remaining * 1000);
          pushNotification(`${this.recycler.title} заполнен${this.recycler.gender} по-максимуму. Включаю...`, true);
        } else {
          return Promise.reject(`Все ресурсы для "${this.recycler.title}" переработаны!`);
        }
      });
      if (this._remaining > 0) {
        const date = new Date();
        date.setSeconds(this._remaining + date.getSeconds());
        this.recycler.selfDeleteNotification = pushNotification(`${this.recycler.title} запущен${this.recycler.gender}. Перезапуск произойдёт в ${date.toLocaleTimeString(['ru', 'en-US'])}`, true, this._remaining * 1000);
      }
    } catch (e: any) {
      return Promise.reject(`Не удалось запустить "${this.recycler.title}". Причина: "${e?.message ?? e.reason ?? e}"`);
    }
  }

  public get button() {
    return this._button;
  }
}

export default new Furnace();