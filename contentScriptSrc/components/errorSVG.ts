const generateErrorSvg = () => {
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', "M938.7 512C938.7 747.6 747.6 938.7 512 938.7 276.4 938.7 85.3 747.6 85.3 512 85.3 276.4 276.4 85.3 512 85.3 747.6 85.3 938.7 276.4 938.7 512ZM382.7 382.7C395.2 370.2 415.5 370.2 428 382.7L512 466.7 596 382.7C608.5 370.2 628.8 370.2 641.3 382.7 653.8 395.2 653.8 415.5 641.3 428L557.2 512 641.3 596C653.8 608.5 653.8 628.8 641.3 641.3 628.8 653.8 608.5 653.8 596 641.3L512 557.3 428 641.3C415.5 653.8 395.2 653.8 382.7 641.3 370.2 628.8 370.2 608.5 382.7 596L466.7 512 382.7 428C370.2 415.5 370.2 395.2 382.7 382.7Z");
  path.setAttribute('fillRule', "evenodd");
  path.setAttribute('clipRule', "evenodd");
  const errorSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  errorSvg.setAttribute('class', 'evenodd');
  errorSvg.setAttribute('viewBox', "0 0 1024 1024");
  errorSvg.style.cssText = "display: inline-block; stroke: currentcolor; fill: currentcolor; width: calc(var(--px) * 20); height: calc(var(--px) * 20);";

  errorSvg.append(path);
  return errorSvg;
}

export {generateErrorSvg};