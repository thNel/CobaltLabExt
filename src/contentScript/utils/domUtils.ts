import {pushError} from "./hud/pushError";
import settings from "../store/settings";
import {sleep} from "@contentScript/handlers/sleep";

export const getClickerElement = async (currentType?: 'wood' | 'ore' | 'road'): Promise<{
  type?: 'wood' | 'ore' | 'road';
  element: HTMLImageElement | HTMLDivElement;
} | null> => {
  const farmElementWrapper = settings.gameBody.querySelector<HTMLDivElement>('.farm-wrapper__clicker');
  if (farmElementWrapper) {
    const iskra = farmElementWrapper.querySelector<HTMLImageElement>('.iskra');
    const cross = farmElementWrapper.querySelector<HTMLImageElement>('.x');
    const farmElement = farmElementWrapper.querySelector<HTMLDivElement>('.farm-wrapper__clicker-item');
    if (currentType === 'wood') {
      if (cross) {
        return {
          type: currentType,
          element: cross,
        }
      } else {
        await sleep(200);
        return getClickerElement(currentType);
      }
    }
    if (currentType === 'ore') {
      if (iskra) {
        return {
          type: currentType,
          element: iskra,
        }
      } else {
        await sleep(200);
        return getClickerElement(currentType);
      }
    }
    if (currentType === 'road') {
      if (farmElement) {
        return {
          type: currentType,
          element: farmElement,
        }
      } else {
        await sleep(200);
        return getClickerElement(currentType);
      }
    }

    if (cross)
      return {
        type: 'wood',
        element: cross,
      }
    if (iskra)
      return {
        type: 'ore',
        element: iskra,
      }
    if (farmElement)
      return {
        type: 'road',
        element: farmElement,
      }
    return null;
  } else {
    return null;
  }
}

export const getReturnToMap = () => {
  const returnToMapCentralButton = settings.gameBody.querySelector<HTMLButtonElement>('div.farm-wrapper button.btn.btn-blue');
  const returnToMapTopButton =
    settings.gameBody.querySelector<HTMLButtonElement>('div.farm-header > button')
    ?? settings.gameBody.querySelector<HTMLButtonElement>('div.bandit-header > button');
  if (!(returnToMapCentralButton || returnToMapTopButton)) {
    pushError('Не удалось вернуться на карту!', true);
    return null;
  }
  return returnToMapCentralButton ?? returnToMapTopButton;
}