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

class Recycler {
  private _remaining = 0;
  private _started = false;
  private _timeout = setTimeout(() => {
  }, 1);
  private _blackList = JSON.parse(localStorage.getItem('furnaceBlackList') ?? `[${ResourceTypes.canOfTuna}, ${ResourceTypes.electricFuse}]`);

  private readonly _button;
  private readonly recyclerBase;

  constructor(type: RecyclerTypes.cityRecycler | RecyclerTypes.banditRecycler) {
    this.recyclerBase = new RecyclerBase(type);
    this._button = createButton({
      innerElements: [createSpan(this.recyclerBase.title)],
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
    await this.recyclerBase.turnOffRecycler();
    await this.recyclerBase.emptyRecycler(true);
    this.recyclerBase.selfDeleteNotification();
  }

  private async toggle(): Promise<void> {
    try {
      if (this._started) {
        await this.disableState();
        pushNotification(`${this.recyclerBase.title} был${this.recyclerBase.gender} остановлен${this.recyclerBase.gender} пользователем.`, true);
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
      await this.recyclerBase.turnOffRecycler();
      await this.recyclerBase.emptyRecycler();
      const recyclerInfo = await this.recyclerBase.getRecyclerInfo();
      const userInventory = (await getItems(InventoryTypes.user)).filter((item) => item.itemID && item.quantity !== null && !this._blackList.includes(item.itemID)) as (InventoryItem & {
        itemID: ResourceTypes;
        quantity: number;
      })[];
      const resources: (InventoryItem & { itemID: ResourceTypes; quantity: number; time: number })[] = [];
      for (const variation of this.recyclerBase.variations) {
        userInventory.forEach(inventoryItem => {
          const variationItem = variation.items?.find(elem => elem.from.itemID === inventoryItem.itemID)?.from;
          if (variationItem) {
            resources.push({...inventoryItem, time: variationItem.time});
          }
        })
      }
      if (resources.length === 0) {
        pushNotification(`Все ресурсы для "${this.recyclerBase.title}" переработаны!`, true);
        await this.disableState();
        return;
      }

      const freeResourceSlots: number[] = [];

      recyclerInfo.in.forEach(slot => {
        if (slot.itemID === null) {
          freeResourceSlots.push(slot.slotID);
        }
      });

      // Загрузка ресурсов в печь
      const movedResources: (InventoryItem & {
        itemID: ResourceTypes;
        quantity: number;
        time: number
      })[] = await this.recyclerBase.loadResources(resources, freeResourceSlots);

      await this.recyclerBase.turnOnRecycler(() => {
        // Вычисляем когда доставать
        const resourceTime = movedResources.reduce((acc, item) => {
          const time = item.quantity * item.time;
          return acc + time;
        }, 0);
        this._remaining = resourceTime - (recyclerInfo.startTime ?? 0);

        // Печь запущена, ждём окончания
        if (this._remaining > 0) {
          this._timeout = setTimeout(() => {
            this.init().catch(e => {
              this.disableState();
              pushError(e?.message ?? e.reason ?? e, true, 4000);
            });
          }, this._remaining * 1000);
          pushNotification(`${this.recyclerBase.title} заполнен${this.recyclerBase.gender} по-максимуму. Включаю...`, true);
        } else {
          return Promise.reject(`Все ресурсы для "${this.recyclerBase.title}" переработаны!`);
        }
      });
      if (this._remaining > 0) {
        const date = new Date();
        date.setSeconds(this._remaining + date.getSeconds());
        this.recyclerBase.selfDeleteNotification = pushNotification(`${this.recyclerBase.title} запущен${this.recyclerBase.gender}. Перезапуск произойдёт в ${date.toLocaleTimeString(['ru', 'en-US'])}`, true, this._remaining * 1000);
      }
    } catch (e: any) {
      return Promise.reject(`Не удалось запустить "${this.recyclerBase.title}". Причина: "${e?.message ?? e.reason ?? e}"`);
    }
  }

  public get button() {
    return this._button;
  }
}

export default Recycler;