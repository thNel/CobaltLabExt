import {createSpan} from "./createSpan";
import {createDiv} from "./createDiv";

export const pushNotification = (text: string, autoDelete = false, deleteTimeout = 2000) => {
  const notifyList = document.querySelector<HTMLSpanElement>('span.notiflist:not(.errorsend)');
  if (!notifyList)
    throw new Error('Не найдено место для уведомлений');
  const notifyText = createSpan(text);
  const selfDeleteTag = `selfDelete-${Math.round(Math.random() * (10 ** 5))}`;
  const notifyDiv = createDiv({
    innerElements: [notifyText],
    classes: `notiflist-item ${selfDeleteTag}`
  });
  const selfDelete = () => {
    const element = document.querySelector(`.${selfDeleteTag}`);
    if (element) {
      element.classList.add('slide-leave-active', 'slide-leave-to');
      setTimeout(() => {
        element.remove();
      }, 1000);
    }
  }
  notifyDiv.onclick = selfDelete;
  notifyList.append(notifyDiv);

  if (autoDelete)
    setTimeout(selfDelete, deleteTimeout);
}
