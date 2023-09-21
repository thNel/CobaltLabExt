import settings from "../store/settings";
import {cellTypes} from "../store/cellTypes";
import {toolTypesByName, toolTypesBySrc} from "../store/toolTypes";
import {pushError} from "../utils/pushError";
import autoWalk from "../store/autoWalk";
import autoClicker from "../store/autoClicker";
import {nextStep} from "./nextStep";

const toolSortFn = (a: { id: number, type: string | null, health: number }, b: {
  id: number,
  type: string | null,
  health: number
}) => {
  if (+a.type!.slice(-1) < +b.type!.slice(-1))
    return -1;
  if (+a.type!.slice(-1) > +b.type!.slice(-1))
    return 1;
  return a.health - b.health
}

export const clicker = (cellType: typeof cellTypes[keyof typeof cellTypes] | undefined) => () => {
  autoClicker.toggleMining();
  let autoWalkTryCounter = 0;
  if (!autoClicker.mining)
    return;
  const clickerTimer = setInterval(() => {
    if (!autoClicker.mining) {
      clearInterval(clickerTimer);
      return;
    }
    const element = document.querySelector<HTMLImageElement>('.x') ?? document.querySelector<HTMLImageElement>('.iskra') ?? document.querySelector<HTMLDivElement>('.farm-wrapper__clicker-item');
    if (element) {
      if (!autoClicker.settings.autoSelectTool) {
        element.click();
        return;
      }
      const toolsNodes = settings.gameBody.querySelectorAll<HTMLDivElement>(
        'div.farm-list > div.farm-list__item:has(div.regular-item__progress-broke), ' +
        `div.farm-list > div.farm-list__item:has(img[src="${toolTypesByName['rock']}"])`
      );
      const tools = [...toolsNodes].map((item, id) => {
        const src = toolsNodes[id].querySelector('img')?.getAttribute('src') ?? null;
        const type = toolTypesBySrc[src ?? 'none'] ?? null;
        const health = +(toolsNodes[id]?.querySelector<HTMLDivElement>('div.regular-item__progress-broke > div')?.style?.height?.slice(0, -1) ?? 0);
        return {
          id,
          type,
          health: type !== 'rock' ? health : 100,
        }
      }).filter(item => item.health > 0);
      const rock = tools.find(item => item.type === 'rock');
      const rockElement = rock && toolsNodes[rock.id];
      if (cellType === 'wood') {
        const axes = tools.filter(item => item.type?.startsWith('axe'))
          .sort(toolSortFn);
        const selectTool = axes[0] ? toolsNodes[axes[0].id] : rockElement;
        if (selectTool && autoClicker.settings.autoSelectTool)
          selectTool.click()
        else {
          autoClicker.toggleMining();
          pushError('Нечем фармить!');
          console.log('Нечем фармить!');
          return;
        }
        element.click();
        return;
      } else if (cellType === 'ore' || cellType === 'road') {
        const pickaxes = tools.filter(item => item.type?.startsWith('pickaxe'))
          .sort(toolSortFn);
        const selectTool = pickaxes[0] ? toolsNodes[pickaxes[0].id] : rockElement;
        if (selectTool && autoClicker.settings.autoSelectTool)
          selectTool.click()
        else {
          autoClicker.toggleMining();
          pushError('Нечем фармить!');
          console.log('Нечем фармить!');
          return;
        }
        element.click();
        return;
      } else {
        if (rockElement && autoClicker.settings.autoSelectTool) {
          rockElement.click()
        } else {
          autoClicker.toggleMining();
          pushError('Неизвестный ресурс! Могу бить только камнем! И камень не обнаружен...');
          console.log('Неизвестный ресурс! Могу бить только камнем! И камень не обнаружен...');
          return;
        }
        element.click();
        return;
      }
    }

    clearInterval(clickerTimer);
    autoClicker.toggleMining(true);
    if (autoWalk.enabled) {
      const returnToMapElement = settings.gameBody.querySelector<HTMLButtonElement>('div.farm-wrapper button.btn.btn-blue')
      if (!returnToMapElement) {
        autoWalkTryCounter += 1;
        if (autoWalkTryCounter < 11) {
          setTimeout(() => clicker(cellType), 1000);
          pushError(`Не удалось вернуться на карту. Попытка #${autoWalkTryCounter}`, true, 800);
          console.log(`Не удалось вернуться на карту. Попытка #${autoWalkTryCounter}`);
          return;
        }
        pushError('Не найдена кнопка возврата на карту');
        console.log('Не найдена кнопка возврата на карту');
        return;
      }
      returnToMapElement.click();
      setTimeout(nextStep, 300);
    }
  }, cellType === 'road' ? autoClicker.settings.fastDelay : autoClicker.settings.delay);
}