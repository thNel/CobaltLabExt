import autoWalk from "../store/autoWalk";
import {pushError} from "../utils/pushError";
import {nextStep} from "./nextStep";


export const walker = () => {
  if (!Object.values(autoWalk.settings).reduce((acc, item) => acc || item, false)) {
    pushError('Выберите типы ресурсов!', true);
    console.log('Выберите типы ресурсов!');
    return;
  }
  autoWalk.toggleEnabled();
  if (autoWalk.enabled) {
    nextStep();
  }
}