import autoWalk from "./store/autoWalk";
import {nextStep} from "./handlers/nextStep";
import settings from "./store/settings";
import {pushError} from "./utils/hud/pushError";
import {pushNotification} from "./utils/hud/pushNotification";
import autoClicker from "./store/autoClicker";
import {clicker} from "./handlers/clicker";
import Recycler from "@contentScript/store/recycler";
import {RecyclerTypes} from "@contentScript/types/recyclerTypes";

function Init() {
  const cityRecycler = new Recycler(RecyclerTypes.cityRecycler, 'Переработчик');
  const banditRecycler = new Recycler(RecyclerTypes.banditRecycler, 'Переработчик');
  const refinery = new Recycler(RecyclerTypes.NPZ, 'НПЗ');
  const forge = new Recycler(RecyclerTypes.forge, 'Печка');
  const barn = new Recycler(RecyclerTypes.barn, 'Конюшня');
  const plant = new Recycler(RecyclerTypes.plant, 'Плантация');

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
          cityHeader.append(refinery.button, cityRecycler.button);
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
      homeHeader.append(plant.button, barn.button, forge.button);
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