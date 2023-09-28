import autoWalk from "./services/autoWalk";
import {nextStep} from "./handlers/nextStep";
import settings from "./store/settings";
import {pushError} from "./utils/hud/pushError";
import {pushNotification} from "./utils/hud/pushNotification";
import autoClicker from "./services/autoClicker";
import {clicker} from "./handlers/clicker";
import furnace from "@contentScript/services/furnace";
import plant from "@contentScript/services/plant";
import barn from "@contentScript/services/barn";
import refinery from "@contentScript/services/refinery";
import Recycler from "@contentScript/services/recycler";
import {RecyclerTypes} from "@contentScript/types/recyclerTypes";

function Init() {
  const cityRecycler = new Recycler(RecyclerTypes.cityRecycler)
  const banditRecycler = new Recycler(RecyclerTypes.banditRecycler)
  setInterval(() => {
    const startGame = document.querySelector<HTMLButtonElement>('div.start-game button.btn-medium:has(span)');
    if (startGame) {
      startGame.click();
      if (autoWalk.enabled)
        setTimeout(nextStep, 2000);
    }
  }, 5000);

  setInterval(() => {
    // Автокликер
    const farmHeader = settings.gameBody.querySelector('div.farm-header');
    if (farmHeader && !farmHeader.querySelector('button.clicker-button')) {
      farmHeader.append(autoClicker.controlsDiv);
      if (autoWalk.enabled) {
        setTimeout(clicker, 1000);
      }
    }

    // Переработчики в городе и бандитке
    const bandit = settings.gameBody.querySelector('div.bandit');
    if (bandit) {
      if ([...bandit.querySelectorAll('div.bandit-list__modal-title')].some(item => item.textContent === 'НПЗ')) {
        const cityHeader = bandit.querySelector('div.bandit-content > div.bandit-header');
        if (cityHeader && !cityHeader.querySelector('button.btn-recycler')) {
          cityHeader.append(cityRecycler.button, refinery.button);
        }
      } else {
        const banditHeader = bandit.querySelector('div.bandit-content > div.bandit-header');
        if (banditHeader && !banditHeader.querySelector('button.btn-recycler')) {
          banditHeader.append(banditRecycler.button);
        }
      }
    }

    // Переработчики в доме
    const homeHeader = settings.gameBody.querySelector('div.home-header__right');
    if (homeHeader && !homeHeader.querySelector('button.btn-recycler')) {
      homeHeader.append(
        plant.button,
        barn.button,
        furnace.button,
      );
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