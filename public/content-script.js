let gameBody = document.querySelector('div.game-body');

let mining = false;

while (!gameBody) {
  gameBody = document.querySelector('div.game-body');
  console.log('GameBody found!');
}

function triggerMouseEvent (node, eventType) {
  const clickEvent = new MouseEvent(eventType, {bubbles: true, cancelable: true});
  node.dispatchEvent(clickEvent);
}

const clickerButton = document.createElement('button');
const clickerButtonText = document.createElement('span');
clickerButton.className = 'btn btn-icon btn-small inherit clicker-button';
clickerButtonText.innerText = 'Автокликер';
clickerButtonText.className = 'clicker-button-text';
clickerButton.append(clickerButtonText);

let autoWalk = false;
const autoWalkToggler = document.createElement('button');
autoWalkToggler.className = 'btn btn-blue btn-icon btn-auto-walk';
autoWalkToggler.innerHTML = '<svg viewBox="0 0 512 512" style=" display: inline-block; stroke: currentcolor; fill: currentcolor; width: calc(var(--px) * 20); height: calc(var(--px) * 20);"><path d="M278.796 94.952c26.218 0 47.472-21.254 47.472-47.481C326.268 21.254 305.014 0 278.796 0c-26.227 0-47.481 21.254-47.481 47.472 0 26.226 21.254 47.48 47.481 47.48zm129.064 141.82-54.377-28.589-22.92-47.087a83.27 83.27 0 0 0-59.679-45.439l-23.58-4.386a57.484 57.484 0 0 0-35.027 4.542l-68.67 32.426a34.453 34.453 0 0 0-16.969 17.601l-30.539 71.308a18.366 18.366 0 0 0-.11 14.202 18.425 18.425 0 0 0 10.046 10.055l.686.275c9.102 3.726 19.532-.384 23.654-9.314l28.03-60.704 44.368-14.34-43.964 195.39-42.82 106.765a22.392 22.392 0 0 0 .715 18.26 22.412 22.412 0 0 0 14.074 11.667l1.85.512a22.413 22.413 0 0 0 25.42-10.357l50.751-87.663 30.237-59.998 55.182 60.896 40.76 86.354c4.596 9.734 15.466 14.834 25.887 12.133l.458-.128a22.434 22.434 0 0 0 14.13-11.09 22.491 22.491 0 0 0 1.438-17.903l-29.99-86.93a114.906 114.906 0 0 0-18.47-33.79l-48.699-64.394 17.866-92.92 23.058 29.294a28.782 28.782 0 0 0 10.741 8.426l60.658 27.388a17.807 17.807 0 0 0 13.864.33 17.807 17.807 0 0 0 9.9-9.716l.192-.467c3.551-8.507.008-18.314-8.151-22.609z" fillRule="evenodd" clipRule="evenodd"/></svg>' +
  '<span class="toggled-text">Off</span>';
const autoWalkText = autoWalkToggler.querySelector('.toggled-text');
autoWalkToggler.onclick = () => {
  autoWalk = !autoWalk;
  autoWalkText.innerText = autoWalk ? 'On' : 'Off';
  autoWalkToggler.style.cssText = autoWalk ? 'background-color: rgba(46,139,87,0.3) !important' : '';
  if (autoWalk) {
    const mapDOM = gameBody.querySelectorAll('.farm.active:not(.home)');
    if (mapDOM.length === 0) {
      autoWalkText.innerText = 'Только в режиме карты!';
      autoWalkToggler.style.cssText = 'background-color: rgba(255,49,49,0.3) !important';
      setTimeout(() => autoWalkToggler.click(), 1000);
      return
    }
    const mapFarmingCells = [...mapDOM]
      .map(item => {
        const isUser = !!item.querySelector('.map-item__user');
        return {id: item.dataset.item, label: item.innerText, isUser, visited: isUser}
      })
      .sort((a, b) => {
        if (a.label[0] > b.label[0]) {
          return 1
        }
        if (a.label[0] < b.label[0]) {
          return -1
        }
        return +a.label.slice(1) - +b.label.slice(1);
      });
    if (!mapFarmingCells.some(item => item.isUser)) {
      const startCell = gameBody.querySelector(`div[data-item="${mapFarmingCells[0].id}"] > div`);
      triggerMouseEvent(startCell, 'mousedown');
      let walkButton = gameBody.querySelector('.map-modal__buttons.relative > button');
      while (!walkButton) {
        walkButton = gameBody.querySelector('.map-modal__buttons.relative > button');
        console.log('Walk Button found!');
      }
      walkButton.click();
    }
    console.log(mapFarmingCells);
  }
};

const autoWalkTimer = setInterval((gameBodyLocal, walkButton) => {
  if (!gameBodyLocal.querySelector('.map'))
    return;
  clearInterval(autoWalkTimer);
  gameBody.append(autoWalkToggler);
}, 400, gameBody, autoWalkToggler);

function clicker() {
  mining = true;
  const elementClickerButton = document.querySelector('button.clicker-button');
  const elementClickerText = elementClickerButton.querySelector('span.clicker-button-text');
  elementClickerButton.onclick = undefined;
  elementClickerButton.style.backgroundColor = 'rgba(105,105,105,0.3)';
  elementClickerText.innerText = 'Добыча...';
  const clickerTimer = setInterval((button, text) => {
    const element = document.querySelector('.x') ?? document.querySelector('.iskra') ?? document.querySelector('.farm-wrapper__clicker-item');
    if (element) {
      element.click();
    } else {
      clearInterval(clickerTimer);
      mining = false;
      button.style.backgroundColor = 'rgba(46,139,87,0.3)';
      text.innerText = 'Всё добыто!';
      elementClickerButton.style.cursor = 'default';
      setTimeout((text, button) => {
        button.style.backgroundColor = '';
        elementClickerButton.style.cursor = '';
        text.innerText = 'Автокликер';
        button.onclick = clicker;
      }, 2000, text, button);
    }
  }, 400, elementClickerButton, elementClickerText);
  elementClickerButton.onclick = () => {
    clearInterval(clickerTimer);
    mining = false;
    elementClickerText.innerText = 'Автокликер';
    elementClickerButton.style.backgroundColor = '';
    elementClickerButton.onclick = clicker;
  };
}

clickerButton.onclick = clicker;

setInterval(() => {
  const farmContent = gameBody.querySelector('div.farm-content');
  if (!farmContent)
    return;
  const farmHeader = farmContent.querySelector('div.farm-header');
  if (!farmHeader)
    return;
  if (!farmHeader.querySelector('button.clicker-button')) {
    farmHeader.append(clickerButton);
    if (autoWalk)
      clickerButton.click();
  }
}, 1000);