import {pushError} from "../utils/hud/pushError";
import autoClicker from "../services/autoClicker";
import {nextStep} from "./nextStep";
import {deleteItem, getItems, getTools, repairItem, selectQuickSlot} from "../utils/inventoryUtils";
import {getClickerElement, getReturnToMap} from "../utils/domUtils";
import {pushNotification} from "../utils/hud/pushNotification";
import {InventoryTypes} from "@contentScript/types/inventoryTypes";

export const clicker = async () => {
  try {
    autoClicker.toggleMining();
    let autoWalkTryCounter = 0;
    if (!autoClicker.mining) {
      pushNotification('Автокликер был завершён!', true);
      return;
    }
    let errorCounter = 0;
    let clickCounter = 1;
    let selectedSlot = 0;
    let {axes, pickaxes, rock} = await getTools();
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
          clickCounter += 1;
          return;
        } else {
          if (rock?.durability === 0 && autoClicker.settings.autoRepairTool) {
            await repairItem('3', rock.slotID);
            const newTools = await getTools();
            axes = newTools.axes;
            pickaxes = newTools.pickaxes;
            rock = newTools.rock;
            return;
          }
          let selectedTool = rock;
          if (elementInfo.type === 'wood') {
            selectedTool = axes[0] ?? rock;
          }
          if (elementInfo.type === 'ore' || elementInfo.type === 'road') {
            selectedTool = pickaxes[0] ?? rock;
          }
          if (clickCounter % 50 === 0 || selectedTool?.durability === 0) {
            const newTools = await getTools();
            axes = newTools.axes;
            pickaxes = newTools.pickaxes;
            rock = newTools.rock;
            clickCounter += 1;
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
              errorCounter += 1;
              if (errorCounter > 10) {
                clearInterval(clickerTimer);
                if (autoClicker.mining) {
                  autoClicker.toggleMining();
                  pushError('Не найдены инструменты!');
                }
                return;
              }
              pushNotification(`Не найден инструмент! Попытка #${errorCounter}`, true);
              return;
            }
          }
          if (selectedTool.availableAfter) {
            clearInterval(clickerTimer);
            if (autoClicker.mining) {
              autoClicker.toggleMining();
              const timeOut = selectedTool.availableAfter * 1000 + 1000;
              const date = new Date();
              date.setSeconds(selectedTool.availableAfter + date.getSeconds());
              autoClicker.selfDeleteTag = pushNotification(`Автокликер будет перезапущен автоматически в ${date.toLocaleTimeString(['ru', 'en-US'])}, когда камень починится...`, true, timeOut);
              autoClicker.setIdle(setTimeout(clicker, timeOut), timeOut);
            }
            return;
          }
          elementInfo.element.click();
          clickCounter += 1;
          if (elementInfo.type === 'wood') {
            axes = axes.map((item, index) => index === 0 ? {...item, durability: item.durability - 1} : item);
          }
          if (elementInfo.type === 'ore' || elementInfo.type === 'road') {
            pickaxes = pickaxes.map((item, index) => index === 0 ? {...item, durability: item.durability - 1} : item);
          }
          return;
        }
      } else if (errorCounter < 10) {
        errorCounter += 1;
        pushNotification(`Попытка найти,что бить, #${errorCounter}`, true, 1000);
        return;
      }

      clearInterval(clickerTimer);
      autoClicker.toggleMining(true);
      if (autoClicker.deleteList?.length > 0) {
        const userInventory = await getItems(InventoryTypes.user);
        for (const item of userInventory) {
          if (item.itemID && item.quantity && autoClicker.deleteList.includes(item.itemID)) {
            await deleteItem({
              boxID: InventoryTypes.user,
              itemID: item.itemID,
              slotID: item.slotID,
              quantity: item.quantity,
            })
          }
        }
      }
      const returnToMapElement = getReturnToMap();
      if (returnToMapElement !== null) {
        returnToMapElement.click();
        setTimeout(nextStep, 800);
      }
      if (returnToMapElement === null && !autoClicker.mining) {
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
    }, autoClicker.settings.delay);
  } catch (e) {
    alert(e);
  }
}