import {WorkerSettings} from "@/types/workerSettings";
import {pushError} from "@contentScript/utils/hud/pushError";
import autoClicker from "@contentScript/services/autoClicker";
import Port = chrome.runtime.Port;

export const listener = (port: Port) => (msg: { get?: keyof WorkerSettings, set?: WorkerSettings }) => {
  if (msg.get) {
    switch (msg.get) {
      case 'acs':
        port.postMessage({acs: autoClicker.settings});
        port.postMessage('Настройки автокликера получены');
        break;
      default:
        pushError('Неверный ключ для передачи данных в окно расширения CobaltLab Helper', true);
        console.log('Неверный ключ для передачи данных в окно расширения CobaltLab Helper', msg);
    }
  } else if (msg.set) {
    if (msg.set.acs) {
      autoClicker.settings = msg.set.acs;
      port.postMessage('Настройки автокликера сохранены');
    }
  } else {
    pushError('Неверный запрос от окна расширения CobaltLab Helper', true);
    console.log('Неверный запрос от окна расширения CobaltLab Helper', msg);
  }
}