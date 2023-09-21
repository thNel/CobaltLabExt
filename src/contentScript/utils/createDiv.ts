export const createDiv = ({innerElements, onClick, onMouseEnter, onMouseLeave, classes}: {
  innerElements?: Element[];
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  classes?: string;
}) => {
  const element = document.createElement('div');
  if (innerElements && innerElements.length > 0)
    innerElements.forEach(item => element.append(item));
  if (classes)
    element.setAttribute('class', classes);
  if (onClick)
    element.onclick = onClick;
  if (onMouseEnter)
    element.onmouseenter = onMouseEnter;
  if (onMouseLeave)
    element.onmouseleave = onMouseLeave;
  return element;
}