export const createButton = ({innerText, innerElements, onClick, classes}: {
  innerText?: string;
  innerElements?: Element[];
  onClick?: () => void;
  classes?: string;
}) => {
  const element = document.createElement('button');
  if (innerElements && innerElements.length > 0)
    innerElements.forEach(item => element.append(item));
  if (innerText) {
    const text = document.createTextNode(innerText);
    element.append(text);
  }
  if (classes)
    element.setAttribute('class', classes);
  if (onClick)
    element.onclick = onClick;
  return element;
}