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

class Plant {
  private _remaining = 0;
  private _started = false;
  private _timeout = setTimeout(() => {
  }, 1);

  private readonly _button;
  private readonly recycler;

  constructor() {
    this.recycler = new RecyclerBase(RecyclerTypes.plant);
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
    await this.recycler.emptyRecycler(true, true);
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
      const userInventory = (await getItems(InventoryTypes.user)).filter((item) => item.itemID && item.quantity !== null) as (InventoryItem & {
        itemID: ResourceTypes;
        quantity: number;
      })[];
      const fuels: (InventoryItem & { itemID: ResourceTypes; quantity: number; time: number })[] = [];
      for (const variation of this.recycler.variations) {
        userInventory.forEach(inventoryItem => {
          if (inventoryItem.itemID === variation.fuel?.from.itemID) {
            fuels.push({...inventoryItem, time: variation.fuel!.from.time});
            return;
          }
        })
      }
      if (fuels.length === 0) {
        return Promise.reject(`Нет дерьма для "${this.recycler.title}"!`);
      }

      const freeFuelSlots: number[] = [];

      recyclerInfo.in.forEach(slot => {
        if (slot.itemID === null) {
          if (this.recycler.variations.reduce<boolean>((acc, elem) =>
              ((elem.fuel?.slotID ?? 1) === slot.slotID || acc),
            false
          )) {
            freeFuelSlots.push(slot.slotID);
          }
        }
      })

      // Загрузка дерьма в плантацию
      const movedFuel: (InventoryItem & {
        itemID: ResourceTypes;
        quantity: number;
        time: number
      })[] = await this.recycler.loadFuel(fuels, freeFuelSlots);

      await this.recycler.turnOnRecycler(() => {
        // Вычисляем когда доставать
        this._remaining = movedFuel.reduce((acc, item) => {
          const time = item.quantity * item.time;
          if (time > 0 && (time < acc || acc === 0))
            return time;
          return acc;
        }, 0) - (recyclerInfo.startTime ?? 0);

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

export default new Plant();