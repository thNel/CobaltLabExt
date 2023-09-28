import {createSpan} from "./createSpan";
import {createDiv} from "./createDiv";
import {generateErrorSvg} from "@contentScript/components/errorSVG";
import settings from "@contentScript/store/settings";

export const pushError = (text: string, autoDelete = false, deleteTimeout = 3000) => {
  const errorList = settings.gameBody.querySelector<HTMLSpanElement>('span.notiflist.errorsend');
  if (!errorList)
    throw new Error('Не найдено место для ошибок');
  const selfDeleteTag = `selfDelete-${Math.round(Math.random() * (10 ** 5))}`;
  const errorDiv = createDiv({
    innerElements: [generateErrorSvg(), createSpan(text)],
    classes: `notiflist-item error ${selfDeleteTag}`
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
  errorDiv.onclick = selfDelete;
  errorList.append(errorDiv);

  console.log(text);

  if (autoDelete)
    setTimeout(selfDelete, deleteTimeout);
}

