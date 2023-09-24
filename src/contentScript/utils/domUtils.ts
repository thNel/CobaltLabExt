import {pushError} from "./hud/pushError";
import settings from "../store/settings";

export const getClickerElement = (): {
  type: string;
  element: HTMLImageElement | HTMLDivElement;
} | null => {
  const farmElement = settings.gameBody.querySelector<HTMLDivElement>('.farm-wrapper__clicker-item');
  if (farmElement) {
    const iskra = farmElement.querySelector<HTMLImageElement>('.iskra');
    const cross = farmElement.querySelector<HTMLImageElement>('.x');
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
    return {
      type: 'road',
      element: farmElement,
    }
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