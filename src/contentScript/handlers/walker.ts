import autoWalk from "../store/autoWalk";
import {pushError} from "../utils/hud/pushError";
import {nextStep} from "./nextStep";


export const walker = () => {
  if (!Object.values(autoWalk.settings).reduce((acc, item) => acc || item, false)) {
    pushError('Выберите типы ресурсов!', true);
    return;
  }
  autoWalk.toggleEnabled();
  if (autoWalk.enabled) {
    nextStep();
  }
}