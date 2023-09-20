export const createInput = (innerNumber: number, classes?: string, onChange?: (e: any) => void) => {
  const input = document.createElement('input');
  input.setAttribute('type', 'number');
  input.setAttribute('value', innerNumber?.toString() ?? '');
  if (classes)
    input.setAttribute('class', classes);
  if (onChange) {
    input.onchange = onChange;
  }
  return input;
}