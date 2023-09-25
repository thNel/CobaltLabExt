import {pushError} from "./hud/pushError";
import settings from "../store/settings";

export const getClickerElement = (): {
  type: string;
  element: HTMLImageElement | HTMLDivElement;
} | null => {
  const farmElementWrapper = settings.gameBody.querySelector<HTMLDivElement>('.farm-wrapper__clicker');
  if (farmElementWrapper) {
    const iskra = farmElementWrapper.querySelector<HTMLImageElement>('.iskra');
    const cross = farmElementWrapper.querySelector<HTMLImageElement>('.x');
    const farmElement = farmElementWrapper.querySelector<HTMLDivElement>('.farm-wrapper__clicker-item');
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
  const returnToMapTopButton = settings.gameBody.querySelector<HTMLButtonElement>('div.farm-header > button');
  if (!(returnToMapCentralButton || returnToMapTopButton)) {
    pushError('Не удалось вернуться на карту!', true);
    return null;
  }
  return returnToMapCentralButton ?? returnToMapTopButton;
}