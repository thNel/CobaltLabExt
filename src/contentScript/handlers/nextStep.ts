import autoWalk from "../store/autoWalk";
import {pushError} from "../utils/pushError";
import settings from "../store/settings";
import {move} from "./move";
import {cycleOrder} from "../store/cycleOrder";
import {sortByCell} from "../utils/sortByCell";

export const nextStep = () => {
  if (autoWalk.enabled) {
    try {
      if (!Object.values(autoWalk.settings).reduce((acc, item) => acc || item, false)) {
        autoWalk.toggleEnabled();
        pushError('Выберите типы ресурсов!', true);
        console.log('Выберите типы ресурсов!');
        return;
      }
      const mapFarming = Object.values(settings.mapFarmingObject).reduce((acc, item, index) => {
        if (index % 2 === 0)
          acc.push(...item)
        else
          acc.push(...item.reverse());
        return acc;
      }, []);
      const mapFarmingCells = autoWalk.cycled
        ? mapFarming
          .filter(elem => elem.isUser || cycleOrder.findIndex(item => item === elem.label) > -1)
          .sort((a, b) => {
              if ((a.isUser && cycleOrder.findIndex(item => item === a.label) === -1)
                || (b.isUser && cycleOrder.findIndex(item => item === b.label) === -1)
              ) {
                return sortByCell(a, b);
              }
              return cycleOrder.findIndex(item => item === a.label) - cycleOrder.findIndex(item => item === b.label)
            }
          )
        : autoWalk.reversed
          ? mapFarming.reverse()
          : mapFarming;
      if (!mapFarmingCells.some(item => item.isUser)) {
        move(mapFarmingCells[0]);
        autoWalk.currentCellType = mapFarmingCells[0].type;
        return;
      } else {
        const userCellIndex = mapFarmingCells.findIndex(item => item.isUser);
        if (userCellIndex === mapFarmingCells.length - 1) {
          if (autoWalk.autoReverse)
            autoWalk.toggleReversed();
          else {
            move(mapFarmingCells[0]);
            autoWalk.currentCellType = mapFarmingCells[0].type;
            return;
          }
          nextStep();
          return;
        }
        move(mapFarmingCells[userCellIndex + 1]);
        autoWalk.currentCellType = mapFarmingCells[userCellIndex + 1].type;
      }
    } catch (e: any) {
      if (e.cause !== 'MapNotFound')
        autoWalk.toggleEnabled();
      pushError(e?.message ?? e, true, 10000);
      console.log(e);
    }
  } else {
    pushError('Автоходьба была отключена!');
    console.log('Автоходьба была отключена!');
  }

}