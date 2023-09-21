import {cellTypes} from "../store/cellTypes";
import settings from "../store/settings";
import autoWalk from "../store/autoWalk";
import {triggerMouseEvent} from "../utils/mouseEvent";
import {pushError} from "../utils/pushError";

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
          console.log('Не получилось сходить на следующую клетку :(');
          return;
        }
        pushError(`Не найдена целевая клетка. Попытка #${tryCounter}`, true, 600);
        console.log(`Не найдена целевая клетка. Попытка #${tryCounter}`);
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
          console.log('Не получилось сходить на следующую клетку :(');
          return;
        }
        pushError(`Не найдена кнопка ходьбы. Попытка #${tryCounter}`, true, 600);
        console.log(`Не найдена кнопка ходьбы. Попытка #${tryCounter}`);
        return;
      }
      clearInterval(walkButtonInterval);
      tryCounter = 0;
      walkButton.click();
    }, 400);
  }, 800);
}