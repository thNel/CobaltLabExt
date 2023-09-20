import autoWalk from "./store/autoWalk";
import {nextStep} from "./handlers/nextStep";
import settings from "./store/settings";
import {pushError} from "./utils/pushError";
import {pushNotification} from "./utils/pushNotification";
import autoClicker from "./store/autoClicker";
import {clicker} from "./handlers/autoClicker";
import {createDiv} from "./utils/createDiv";

function Init() {
  setInterval(() => {
    const startGame = document.querySelector<HTMLButtonElement>('div.start-game button.btn-medium:has(span)');
    if (startGame) {
      startGame.click();
      if (autoWalk.enabled) nextStep();
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
      autoClicker.newClickerButton(autoWalk.currentCellType);
      farmHeader.append(createDiv({
        innerElements: [autoClicker.activateButton, autoClicker.clickerSettingsDiv],
        classes: 'clicker-wrapper',
        onMouseEnter: () => {
          autoClicker.clickerSettingsDiv.classList.remove('d-none')
        },
        onMouseLeave: () => {
          autoClicker.clickerSettingsDiv.classList.add('d-none')
        },
      }));
      if (autoWalk.enabled)
        clicker(autoWalk.currentCellType)();
    }
  }, 1000);

  let tryCount = 0;

  const autoWalkTimer = setInterval(() => {
    try {
      if (!settings.gameBody.querySelector('.map'))
        return;
      tryCount += 1;
      if (tryCount > 10) {
        clearInterval(autoWalkTimer);
        pushError('Не получилось установить автоходьбу :(');
        return;
      }
      clearInterval(autoWalkTimer);
      tryCount = 0;
      settings.gameBody.append(autoWalk.controlsDiv);
      pushNotification('Автоходьба установлена!', true);
    } catch (e: any) {
      alert(e?.message ?? e);
    }
  }, 400);
}


Init();