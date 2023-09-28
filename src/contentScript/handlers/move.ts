import {cellTypes} from "../store/cellTypes";
import settings from "../store/settings";
import autoWalk from "../services/autoWalk";
import {triggerMouseEvent} from "../utils/hud/mouseEvent";
import {pushError} from "../utils/hud/pushError";
import {pushNotification} from "@contentScript/utils/hud/pushNotification";

export const move = (target: {
  id: string | undefined,
  label: string,
  isUser: boolean,
  type: typeof cellTypes[keyof typeof cellTypes] | undefined
}) => {
  let tryCounter = 0;
  let targetClicked = false;
  const walkButtonInterval = setInterval(() => {
    if (!targetClicked) {
      const targetCell = settings.gameBody.querySelector<HTMLDivElement>(`div[data-item="${target.id}"] > div`);
      if (!targetCell) {
        tryCounter += 1;
        if (tryCounter > 10) {
          clearInterval(walkButtonInterval);
          autoWalk.toggleEnabled();
          pushError('Не получилось сходить на следующую клетку :(');
          return;
        }
        pushNotification(`Не найдена целевая клетка. Попытка #${tryCounter}`, true, 600);
        return;
      }
      targetClicked = true;
      triggerMouseEvent(targetCell, 'mousedown');
    }
    const walkButton = settings.gameBody.querySelector<HTMLButtonElement>('.map-modal__buttons.relative > button');
    setTimeout(() => {
      if (!walkButton) {
        tryCounter += 1
        if (tryCounter > 10) {
          clearInterval(walkButtonInterval);
          autoWalk.toggleEnabled();
          pushError('Не получилось сходить на следующую клетку :(');
          return;
        }
        pushNotification(`Не найдена кнопка ходьбы. Попытка #${tryCounter}`, true, 600);
        return;
      }
      clearInterval(walkButtonInterval);
      tryCounter = 0;
      walkButton.click();
    }, 400);
  }, 800);
}