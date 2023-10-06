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
import banditRecycler from "@contentScript/services/banditRecycler";
import cityRecycler from "@contentScript/services/cityRecycler";
import {createButton} from "@contentScript/utils/hud/createButton";


const sellFn = (sellButton: HTMLButtonElement) => {
  if (sellButton.getAttribute('disabled') === 'disabled') return;
  sellButton.click();
  setTimeout(sellFn, 500 + Math.round(Math.random() * 400), sellButton);
}

const shopper = () => {
  const shopList = settings.gameBody.querySelector('div.shop-list');
  if (!shopList) {
    pushError('Нет магазина!', true);
    return;
  }
  for (const element of shopList.querySelectorAll('div.upgrade-item')) {
    const buttonDiv = element.querySelector<HTMLDivElement>('div.upgrade-item__rewards');
    if (!buttonDiv) {
      pushError('Нет блока с кнопкой продажи', true)
      continue;
    }
    if (buttonDiv.querySelector('.auto-sell-btn')) {
      pushNotification('Уже есть кнопка авто', true);
      continue;
    }
    const sellButton = buttonDiv.querySelector('button');
    if (!sellButton) {
      pushError('Не найдена кнопка продажи', true);
      continue;
    }
    const autoSell = createButton({
      innerText: 'Авто',
      classes: 'btn btn-blue btn-small upgrade-item__buy btn-icon auto-sell-btn',
      onClick: () => sellFn(sellButton),
    });
    buttonDiv.append(autoSell);
  }
}

function Init() {
  setInterval(() => {
    const startGame = document.querySelector<HTMLButtonElement>('div.start-game button.btn-medium:has(span)');
    if (startGame) {
      startGame.click();
      if (autoWalk.enabled)
        setTimeout(nextStep, 2000);
    }
  }, 3000);

  setInterval(() => {
    // Автокликер
    const farmHeader = settings.gameBody.querySelector('div.farm-header');
    if (farmHeader && !farmHeader.querySelector('button.clicker-button')) {
      farmHeader.append(autoClicker.controlsDiv);
      if (autoWalk.enabled && !autoClicker.mining) {
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
          if (autoWalk.enabled && !cityRecycler.enabled) {
            setTimeout(cityRecycler.toggle, 1000);
          }
          if (autoWalk.enabled && !refinery.enabled) {
            setTimeout(refinery.toggle, 2000);
          }
        }
      } else {
        const banditHeader = bandit.querySelector('div.bandit-content > div.bandit-header');
        if (banditHeader && !banditHeader.querySelector('button.btn-recycler')) {
          banditHeader.append(banditRecycler.button);
          if (autoWalk.enabled && !banditRecycler.enabled) {
            setTimeout(banditRecycler.toggle, 1000);
          }
        }
      }
    }

    const shopHeader = settings.gameBody.querySelector('div.pageload-header');
    if (shopHeader && settings.gameBody.querySelector('div.shop-list') && !shopHeader.querySelector('.btn-recycler')) {
      const button = createButton({
        innerText: 'Добавить автопродажи',
        classes: 'btn btn-blue btn-small btn-icon btn-recycler',
        onClick: shopper,
      });
      shopHeader.append(button);
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