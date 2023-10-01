import autoWalk from "../services/autoWalk";
import {pushError} from "../utils/hud/pushError";
import settings from "../store/settings";
import {move} from "./move";
import {alphabet, cycleOrder} from "../store/cycleOrder";

export const nextStep = () => {
  if (autoWalk.enabled) {
    try {
      if (!Object.values(autoWalk.settings).reduce((acc, item) => acc || item, false)) {
        autoWalk.toggleEnabled();
        pushError('Выберите типы ресурсов!', true);
        return;
      }
      const mapFarming = settings.mapFarmingCells;
      let minimalLength = 1000;
      const mapFarmingCells = mapFarming
        .filter(elem => elem.isUser || cycleOrder.findIndex(item => item === elem.label) > -1);
      if (mapFarmingCells[0].isUser) {
        const user = mapFarmingCells.shift();
        if (user) {
          const userX = alphabet.indexOf(user?.label[0]);
          const userY = +user.label.slice(1);
          mapFarmingCells.forEach(item => {
            const itemX = alphabet.indexOf(item.label[0]);
            const itemY = +item.label.slice(1);
            const length = Math.sqrt((userX - itemX) ** 2 + (userY - itemY) ** 2);
            if (length < minimalLength)
              minimalLength = length;
          });
          const nextCell = mapFarmingCells.find(item => {
            const itemX = alphabet.indexOf(item.label[0]);
            const itemY = +item.label.slice(1);
            const length = Math.sqrt((userX - itemX) ** 2 + (userY - itemY) ** 2);
            return length === minimalLength;
          });
          if (nextCell) {
            move(nextCell);
            return;
          }
        }
      }
      const farmMap = autoWalk.reversed
        ? mapFarmingCells.reverse()
        : mapFarmingCells;
      if (!farmMap.some(item => item.isUser)) {
        move(farmMap[0]);
        return;
      } else {
        const userCellIndex = farmMap.findIndex(item => item.isUser);
        if (userCellIndex === farmMap.length - 1) {
          move(farmMap[0]);
          return;
        }
        move(farmMap[userCellIndex + 1]);
      }
    } catch (e: any) {
      if (e.cause !== 'MapNotFound')
        autoWalk.toggleEnabled();
      pushError(e?.message ?? e.reason ?? e, true, 5000);
    }
  } else {
    pushError('Автоходьба была отключена!');
  }
}