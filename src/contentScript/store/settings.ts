import {cellTypes} from "./cellTypes";
import autoWalk from "./autoWalk";
import {sortByCell} from "../utils/sortByCell";

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
    const elements = this.gameBody.querySelectorAll<HTMLDivElement>('div.farm.active:not(.home):not(:has(div.map-item__wrapper > div.map-item__user)), div.map-item:has(div.map-item__wrapper > div.map-item__user)');
    if (elements.length > 0)
      return elements;
    else
      throw new Error('Невозможно обнаружить карту :(');
  }

  public get mapFarmingObject() {
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
      .sort(sortByCell)
      .reduce<Record<string, {
        id: string | undefined,
        label: string,
        isUser: boolean,
        type: typeof cellTypes[keyof typeof cellTypes] | undefined,
      }[]>>((acc, item) => {
        if (acc[item.label[0]])
          acc[item.label[0]].push(item)
        else
          acc[item.label[0]] = [item];
        acc[item.label[0]] = acc[item.label[0]].sort((a, b) => +a.label.slice(1) - +b.label.slice(1));
        return acc;
      }, {});
  }

}

export default new Settings();