import {createSpan} from "./createSpan";
import {createDiv} from "./createDiv";
import {generateErrorSvg} from "../components/errorSVG";

export const pushError = (text: string, autoDelete = false, deleteTimeout = 2000) => {
  const errorList = document.querySelector<HTMLSpanElement>('span.notiflist.errorsend');
  if (!errorList)
    throw new Error('Не найдено место для ошибок');
  const errorText = createSpan(text);
  const selfDeleteTag = `selfDelete-${Math.round(Math.random() * (10 ** 5))}`;
  const errorDiv = createDiv({
    innerElements: [generateErrorSvg(), errorText],
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

  if (autoDelete)
    setTimeout(selfDelete, deleteTimeout);
}

