import {createSpan} from "./createSpan";
import {createDiv} from "./createDiv";

export const pushNotification = (text: string, autoDelete = false, deleteTimeout = 2000, escapeClick = false) => {
  const notifyList = document.querySelector<HTMLSpanElement>('span.notiflist:not(.errorsend)');
  if (!notifyList)
    throw new Error('Не найдено место для уведомлений');
  const notifyText = createSpan(text);
  const selfDeleteTag = `selfDelete-${Math.round(Math.random() * (10 ** 5))}`;
  const notifyDiv = createDiv({
    innerElements: [notifyText],
    classes: `notiflist-item ${selfDeleteTag} bg-dark`
  });
  const selfDelete = (deleteTag: string) => () => {
    const element = document.querySelector(`.${deleteTag}`);
    if (element) {
      element.classList.add('slide-leave-active', 'slide-leave-to');
      setTimeout(() => {
        element.remove();
      }, 1000);
    }
  }
  notifyDiv.onclick = escapeClick ? null : selfDelete(selfDeleteTag);
  notifyList.append(notifyDiv);

  if (autoDelete)
    setTimeout(selfDelete(selfDeleteTag), deleteTimeout);

  return selfDelete(selfDeleteTag);
}

