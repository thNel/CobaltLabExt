import autoWalk from "../services/autoWalk";
import {pushError} from "../utils/hud/pushError";
import settings from "../store/settings";
import {move} from "./move";
import {roadCycleOrder} from "../store/roadCycleOrder";
import {sortByCell} from "../utils/sorts/sortByCell";

export const nextStep = () => {
  if (autoWalk.enabled) {
    try {
      if (!Object.values(autoWalk.settings).reduce((acc, item) => acc || item, false)) {
        autoWalk.toggleEnabled();
        pushError('Выберите типы ресурсов!', true);
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
          .filter(elem => elem.isUser || roadCycleOrder.findIndex(item => item === elem.label) > -1)
          .sort((a, b) => {
              if ((a.isUser && roadCycleOrder.findIndex(item => item === a.label) === -1)
                || (b.isUser && roadCycleOrder.findIndex(item => item === b.label) === -1)
              ) {
                return sortByCell(a, b);
              }
              return roadCycleOrder.findIndex(item => item === a.label) - roadCycleOrder.findIndex(item => item === b.label)
            }
          )
        : mapFarming;
      const farmMap = autoWalk.reversed
        ? mapFarmingCells.reverse()
        : mapFarmingCells;
      if (!farmMap.some(item => item.isUser)) {
        move(farmMap[0]);
        return;
      } else {
        const userCellIndex = farmMap.findIndex(item => item.isUser);
        if (userCellIndex === farmMap.length - 1) {
          if (autoWalk.autoReverse)
            autoWalk.toggleReversed();
          else {
            move(farmMap[0]);
            return;
          }
          nextStep();
          return;
        }
        move(farmMap[userCellIndex + 1]);
      }
    } catch (e: any) {
      if (e.cause !== 'MapNotFound')
        autoWalk.toggleEnabled();
      pushError(e?.message ?? e.reason ?? e, true, 10000);
    }
  } else {
    pushError('Автоходьба была отключена!');
  }
}