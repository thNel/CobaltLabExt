import autoWalk from "./store/autoWalk";
import {nextStep} from "./handlers/nextStep";
import settings from "./store/settings";
import {pushError} from "./utils/hud/pushError";
import {pushNotification} from "./utils/hud/pushNotification";
import autoClicker from "./store/autoClicker";
import {clicker} from "./handlers/clicker";

function Init() {
  setInterval(() => {
    const startGame = document.querySelector<HTMLButtonElement>('div.start-game button.btn-medium:has(span)');
    if (startGame) {
      startGame.click();
      if (autoWalk.enabled)
        setTimeout(nextStep, 2000);
    }
  }, 5000);

  setInterval(() => {
    const farmContent = settings.gameBody.querySelector('div.farm-content');
    if (!farmContent)
      return;
    const farmHeader = farmContent.querySelector('div.farm-header');
    if (!farmHeader)
      return;
    if (!farmHeader.querySelector('button.clicker-button')) {
      farmHeader.append(autoClicker.controlsDiv);
      if (autoWalk.enabled) {
        setTimeout(clicker, 1000);
      }
    }
  }, 1000);

  let tryCount = 0;

  const autoWalkTimer = setInterval(() => {
    try {
      tryCount += 1;
      if (!settings.gameBody.querySelector('.map')) {
        if (tryCount > 40) {
          clearInterval(autoWalkTimer);
          pushError('Не получилось установить автоходьбу :(');
          return;
        }
        pushNotification(`Не найдена карта мира! Попытка #${tryCount}`, true)
        return;
      }
      clearInterval(autoWalkTimer);
      tryCount = 0;
      settings.gameBody.append(autoWalk.controlsDiv);
      pushNotification('Автоходьба установлена!', true);
    } catch (e: any) {
      alert(e?.message ?? e);
    }
  }, 1000);
}


Init();