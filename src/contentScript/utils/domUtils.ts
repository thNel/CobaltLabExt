import {pushError} from "./hud/pushError";
import settings from "../store/settings";

let randomTarget = [false, false, false, false, false];

const generateRandomTargets = () => {
  for (let i = 0; i < 5; i++) {
    randomTarget[i] = Math.random() > 0.499;
  }
}
export const getClickerElement = (clickCounter: number): {
  type: 'wood' | 'ore' | 'road';
  element: HTMLImageElement | HTMLDivElement;
} | null => {
  const farmElementWrapper = settings.gameBody.querySelector<HTMLDivElement>('.farm-wrapper__clicker');
  if (farmElementWrapper) {
    if (clickCounter % 5 === 0)
      generateRandomTargets();
    const iskra = farmElementWrapper.querySelector<HTMLImageElement>('.iskra');
    const cross = farmElementWrapper.querySelector<HTMLImageElement>('.x');
    const farmElement = farmElementWrapper.querySelector<HTMLDivElement>('.farm-wrapper__clicker-item');
    if (cross && farmElement)
      return {
        type: 'wood',
        element: randomTarget[clickCounter % 5] ? cross : farmElement,
      }
    if (iskra && farmElement)
      return {
        type: 'ore',
        element: randomTarget[clickCounter % 5] ? iskra : farmElement,
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