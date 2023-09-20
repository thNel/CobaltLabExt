import {createSpan} from "../utils/createSpan";

const clickerButton = document.createElement('button');
const clickerButtonText = createSpan('Автокликер', 'clicker-button-text');
clickerButton.className = 'btn btn-icon btn-small inherit clicker-button';
clickerButton.append(clickerButtonText);

export {clickerButton};