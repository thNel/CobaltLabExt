export const createSpan = (innerText: string, classes?: string) => {
  const span = document.createElement('span');
  const text = document.createTextNode(innerText);
  span.appendChild(text);
  if (classes)
    span.setAttribute('class', classes);
  return span;
}