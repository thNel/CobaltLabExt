import {cellTypes} from "./cellTypes";
import autoWalk from "../services/autoWalk";
import {cycleOrder} from "@contentScript/store/cycleOrder";

class Settings {
  private _gameBody: HTMLDivElement | null = null;

  public get gameBody() {
    if (!this._gameBody) {
      const element = document.querySelector<HTMLDivElement>('div.game-body');
      if (element)
        this._gameBody = element;
      else
        throw new Error('Невозможно обнаружить игру :(');
    }
    return this._gameBody;
  }

  public get mapDOM() {
    const elements = this.gameBody.querySelectorAll<HTMLDivElement>('div.map-item');
    if (elements.length > 0)
      return elements;
    else
      throw new Error('Ошибка обнаружения карты!', {cause: 'MapNotFound'});
  }

  public get mapFarmingCells() {
    return [...this.mapDOM]
      .map(item => {
        const svgType = item.querySelector('svg > path')?.getAttribute('d')?.slice(0, 4) as (keyof typeof cellTypes) | undefined;
        return {
          id: item.dataset.item,
          label: item.innerText,
          isUser: !!item.querySelector('.map-item__user'),
          type: svgType ? cellTypes[svgType] : undefined,
        }
      })
      .filter(item => (item.type && autoWalk.settings[item.type]) ?? item.isUser)
      .sort((a, b) =>
        cycleOrder.findIndex(item => item === a.label) - cycleOrder.findIndex(item => item === b.label));
  }

}

export default new Settings();