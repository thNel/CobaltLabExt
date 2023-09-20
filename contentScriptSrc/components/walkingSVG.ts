const generateWalkingSVG = () => {
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', "M278.796 94.952c26.218 0 47.472-21.254 47.472-47.481C326.268 21.254 305.014 0 278.796 0c-26.227 0-47.481 21.254-47.481 47.472 0 26.226 21.254 47.48 47.481 47.48zm129.064 141.82-54.377-28.589-22.92-47.087a83.27 83.27 0 0 0-59.679-45.439l-23.58-4.386a57.484 57.484 0 0 0-35.027 4.542l-68.67 32.426a34.453 34.453 0 0 0-16.969 17.601l-30.539 71.308a18.366 18.366 0 0 0-.11 14.202 18.425 18.425 0 0 0 10.046 10.055l.686.275c9.102 3.726 19.532-.384 23.654-9.314l28.03-60.704 44.368-14.34-43.964 195.39-42.82 106.765a22.392 22.392 0 0 0 .715 18.26 22.412 22.412 0 0 0 14.074 11.667l1.85.512a22.413 22.413 0 0 0 25.42-10.357l50.751-87.663 30.237-59.998 55.182 60.896 40.76 86.354c4.596 9.734 15.466 14.834 25.887 12.133l.458-.128a22.434 22.434 0 0 0 14.13-11.09 22.491 22.491 0 0 0 1.438-17.903l-29.99-86.93a114.906 114.906 0 0 0-18.47-33.79l-48.699-64.394 17.866-92.92 23.058 29.294a28.782 28.782 0 0 0 10.741 8.426l60.658 27.388a17.807 17.807 0 0 0 13.864.33 17.807 17.807 0 0 0 9.9-9.716l.192-.467c3.551-8.507.008-18.314-8.151-22.609z");
  path.setAttribute('fillRule', "evenodd");
  path.setAttribute('clipRule', "evenodd");
  const walkingSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  walkingSvg.setAttribute('class', 'evenodd');
  walkingSvg.setAttribute('viewBox', "0 0 512 512");
  walkingSvg.style.cssText = "display: inline-block; stroke: currentcolor; fill: currentcolor; width: calc(var(--px) * 16); height: calc(var(--px) * 16);";

  walkingSvg.appendChild(path);
  return walkingSvg;
}
export {generateWalkingSVG};