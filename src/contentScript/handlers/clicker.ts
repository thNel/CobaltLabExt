import {pushError} from "../utils/hud/pushError";
import autoWalk from "../store/autoWalk";
import autoClicker from "../store/autoClicker";
import {nextStep} from "./nextStep";
import {getTools, repairItem, selectQuickSlot} from "../utils/inventoryUtils";
import {getClickerElement, getReturnToMap} from "../utils/domUtils";
import {pushNotification} from "../utils/hud/pushNotification";

export const clicker = () => {
  try {
    autoClicker.toggleMining();
    let autoWalkTryCounter = 0;
    if (!autoClicker.mining) {
      pushNotification('Автокликер был завершён!', true);
      return;
    }
    let counter = 0;
    let selectedSlot = 0;
    const clickerTimer = setInterval(async () => {
      if (!autoClicker.mining) {
        clearInterval(clickerTimer);
        pushNotification('Автокликер был завершён!', true);
        return;
      }
      const elementInfo = getClickerElement();
      if (elementInfo !== null) {
        if (!autoClicker.settings.autoSelectTool) {
          elementInfo.element.click();
        } else {
          const {axes, pickaxes, rock} = await getTools();
          if (rock?.durability === 0 && autoClicker.settings.autoRepairTool) {
            await repairItem('3', rock.slotID);
            return;
          }
          let selectedTool = rock;
          if (elementInfo.type === 'wood') {
            selectedTool = axes[0] ?? rock;
          }
          if (elementInfo.type === 'ore' || elementInfo.type === 'road') {
            selectedTool = pickaxes[0] ?? rock;
          }
          if (selectedTool?.durability === 0) {
            clearInterval(clickerTimer);
            if (autoClicker.mining) {
              autoClicker.toggleMining();
              pushError('Все инструменты сломаны :(');
            }
            return;
          }
          if (!selectedTool) {
            clearInterval(clickerTimer);
            if (autoClicker.mining) {
              autoClicker.toggleMining();
              pushError('Инструменты для этого типа ресурса не найдены :(');
            }
            return;
          }
          if (selectedSlot !== selectedTool.slotID) {
            if (selectedTool) {
              await selectQuickSlot(selectedTool.slotID);
              selectedSlot = selectedTool.slotID;
              return;
            } else {
              counter += 1;
              if (counter > 20) {
                clearInterval(clickerTimer);
                if (autoClicker.mining) {
                  autoClicker.toggleMining();
                  pushError('Не найдены инструменты!');
                }
                return;
              }
              pushNotification(`Не найден инструмент! Попытка #${counter}`, true);
              return;
            }
          }
          if (selectedTool.availableAfter) {
            clearInterval(clickerTimer);
            if (autoClicker.mining) {
              autoClicker.toggleMining();
              const timeOut = selectedTool.availableAfter * 1000 + 1000;
              pushNotification(`Автокликер будет перезапущен автоматически через ${Math.round(timeOut / 600) / 100} минут. Когда камень починится...`, true, timeOut);
              setTimeout(clicker, timeOut);
            }
            return;
          }
          elementInfo.element.click();
          return;
        }
      } else if (counter < 21) {
        counter += 1;
        pushNotification(`Попытка найти,что бить, #${counter}`, true, 1000);
        return;
      }

      clearInterval(clickerTimer);
      const returnToMapElement = getReturnToMap();
      autoClicker.toggleMining(true);
      if (autoWalk.enabled) {
        if (returnToMapElement === null) {
          autoWalkTryCounter += 1;
          if (autoWalkTryCounter > 10) {
            clearInterval(clickerTimer);
            pushError('Не найдена кнопка возврата на карту');
            return;
          }
          setTimeout(clicker, 1000);
          pushNotification(`Не найдены элементы иры. Попытка #${autoWalkTryCounter}`, true);
          return;
        }
        returnToMapElement.click();
        setTimeout(nextStep, 800);
      }
    }, autoClicker.settings.delay);
  } catch (e) {
    alert(e);
  }
}