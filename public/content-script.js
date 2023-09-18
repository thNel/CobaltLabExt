let gameBody = document.querySelector('div.game-body');

let mining = false;

let autoWalk = false;

let reversed = false;

const cellTypes = {
  M128: 'ore',
  M513: 'road',
  M415: 'wood',
}

let autoWalkSettings = {
  [cellTypes.M128]: false,
  [cellTypes.M415]: false,
  [cellTypes.M513]: false,
}

function triggerMouseEvent(node, eventType) {
  const clickEvent = new MouseEvent(eventType, {bubbles: true, cancelable: true});
  node.dispatchEvent(clickEvent);
}

const clickerButton = document.createElement('button');
const clickerButtonText = document.createElement('span');
clickerButton.className = 'btn btn-icon btn-small inherit clicker-button';
clickerButtonText.innerText = 'Автокликер';
clickerButtonText.className = 'clicker-button-text';
clickerButton.append(clickerButtonText);

const autoWalkBlock = document.createElement('div');
autoWalkBlock.className = 'btn-auto-walk-block'
const autoWalkToggler = document.createElement('button');
autoWalkToggler.className = 'btn btn-blue btn-icon btn-auto-walk';
autoWalkToggler.innerHTML = '<svg viewBox="0 0 512 512" style=" display: inline-block; stroke: currentcolor; fill: currentcolor; width: calc(var(--px) * 20); height: calc(var(--px) * 20);"><path d="M278.796 94.952c26.218 0 47.472-21.254 47.472-47.481C326.268 21.254 305.014 0 278.796 0c-26.227 0-47.481 21.254-47.481 47.472 0 26.226 21.254 47.48 47.481 47.48zm129.064 141.82-54.377-28.589-22.92-47.087a83.27 83.27 0 0 0-59.679-45.439l-23.58-4.386a57.484 57.484 0 0 0-35.027 4.542l-68.67 32.426a34.453 34.453 0 0 0-16.969 17.601l-30.539 71.308a18.366 18.366 0 0 0-.11 14.202 18.425 18.425 0 0 0 10.046 10.055l.686.275c9.102 3.726 19.532-.384 23.654-9.314l28.03-60.704 44.368-14.34-43.964 195.39-42.82 106.765a22.392 22.392 0 0 0 .715 18.26 22.412 22.412 0 0 0 14.074 11.667l1.85.512a22.413 22.413 0 0 0 25.42-10.357l50.751-87.663 30.237-59.998 55.182 60.896 40.76 86.354c4.596 9.734 15.466 14.834 25.887 12.133l.458-.128a22.434 22.434 0 0 0 14.13-11.09 22.491 22.491 0 0 0 1.438-17.903l-29.99-86.93a114.906 114.906 0 0 0-18.47-33.79l-48.699-64.394 17.866-92.92 23.058 29.294a28.782 28.782 0 0 0 10.741 8.426l60.658 27.388a17.807 17.807 0 0 0 13.864.33 17.807 17.807 0 0 0 9.9-9.716l.192-.467c3.551-8.507.008-18.314-8.151-22.609z" fillRule="evenodd" clipRule="evenodd"/></svg>' +
  '<span class="toggled-text">Автоходьба</span>';
const autoWalkText = autoWalkToggler.querySelector('.toggled-text');

const selectOre = document.createElement('button');
const selectOreText = document.createElement('span');
selectOre.className = 'btn btn-blue btn-auto-walk-settings';
selectOreText.innerText = 'Камень / Руды';
selectOre.append(selectOreText);
selectOre.style.cssText = autoWalkSettings[cellTypes.M128] ? 'background-color: rgba(46,139,87,0.6) !important' : '';
selectOre.onclick = () => {
  autoWalkSettings[cellTypes.M128] = !autoWalkSettings[cellTypes.M128];
  selectOre.style.cssText = autoWalkSettings[cellTypes.M128] ? 'background-color: rgba(46,139,87,0.6) !important' : '';
}

const selectWood = document.createElement('button');
const selectWoodText = document.createElement('span');
selectWood.className = 'btn btn-blue btn-auto-walk-settings';
selectWoodText.innerText = 'Дерево';
selectWood.append(selectWoodText);
selectWood.style.cssText = autoWalkSettings[cellTypes.M415] ? 'background-color: rgba(46,139,87,0.6) !important' : '';
selectWood.onclick = () => {
  autoWalkSettings[cellTypes.M415] = !autoWalkSettings[cellTypes.M415];
  selectWood.style.cssText = autoWalkSettings[cellTypes.M415] ? 'background-color: rgba(46,139,87,0.6) !important' : '';
}

const selectRoad = document.createElement('button');
const selectRoadText = document.createElement('span');
selectRoad.className = 'btn btn-blue btn-auto-walk-settings';
selectRoadText.innerText = 'Дорога';
selectRoad.append(selectRoadText);
selectRoad.style.cssText = autoWalkSettings[cellTypes.M513] ? 'background-color: rgba(46,139,87,0.6) !important' : '';
selectRoad.onclick = () => {
  autoWalkSettings[cellTypes.M513] = !autoWalkSettings[cellTypes.M513];
  selectRoad.style.cssText = autoWalkSettings[cellTypes.M513] ? 'background-color: rgba(46,139,87,0.6) !important' : '';
}

autoWalkBlock.append(selectOre, selectWood, selectRoad, autoWalkToggler);

function Init() {
  let tryCount = 0;
  const gameBodyTimer = setInterval(() => {
    tryCount += 1;
    gameBody = document.querySelector('div.game-body');
    if (tryCount > 10) {
      clearInterval(gameBodyTimer);
      alert('Не получилось найти игру :(');
      return;
    }
    if (!gameBody)
      return;
    clearInterval(gameBodyTimer);
    tryCount = 0;
    console.log('GameBody found!');
  }, 600)
  
  const autoWalkTimer = setInterval(() => {
    if (!gameBody.querySelector('.map'))
      return;
    tryCount += 1;
    if (tryCount > 10) {
      clearInterval(autoWalkTimer);
      alert('Не получилось установить кнопку автоходьбы :(');
      return;
    }
    clearInterval(autoWalkTimer);
    tryCount = 0;
    autoWalkToggler.onclick = walker;
    gameBody.append(autoWalkBlock);
    console.log('AutoWalker added');
  }, 400);
  
  setInterval(() => {
    const farmContent = gameBody.querySelector('div.farm-content');
    if (!farmContent)
      return;
    const farmHeader = farmContent.querySelector('div.farm-header');
    if (!farmHeader)
      return;
    if (!farmHeader.querySelector('button.clicker-button')) {
      clickerButton.onclick = clicker;
      farmHeader.append(clickerButton);
      if (autoWalk)
        clicker();
    }
  }, 1000);
}

function go(target) {
  let tryCount = 0;
  const targetCell = gameBody.querySelector(`div[data-item="${target.id}"] > div`);
  if (!targetCell) {
    walker();
    alert('Не получилось сходить на следующую клетку :(');
  }
  triggerMouseEvent(targetCell, 'mousedown');
  let walkButton = gameBody.querySelector('.map-modal__buttons.relative > button');
  const walkButtonInterval = setInterval(() => {
    tryCount += 1
    if (tryCount > 10) {
      clearInterval(walkButtonInterval);
      walker();
      alert('Не получилось сходить на следующую клетку :(');
      return;
    }
    walkButton = gameBody.querySelector('.map-modal__buttons.relative > button');
    if (!walkButton) {
      return;
    }
    clearInterval(walkButtonInterval);
    tryCount = 0;
    console.log('Walk Button found!');
    walkButton.click();
  }, 600);
}

function nextStep() {
  if (!Object.values(autoWalkSettings).reduce((acc, item) => acc || item)) {
    autoWalk = false;
    autoWalkText.innerText = 'Выкл';
    autoWalkToggler.style.cssText = '';
    alert('Выберите типы фарминга!');
    return;
  }
  const mapDOM = gameBody.querySelectorAll('.farm.active:not(.home)');
  if (mapDOM.length === 0) {
    alert('Только в режиме карты!');
    walker();
    return;
  }
  const mapFarmingObject = [...mapDOM]
    .map(item => {
      const svgType = item.querySelector('svg > path')?.getAttribute('d').slice(0, 4);
      return {
        id: item.dataset.item,
        label: item.innerText,
        isUser: !!item.querySelector('.map-item__user'),
        type: cellTypes[svgType]
      }
    })
    .filter(item => autoWalkSettings[item.type] || item.isUser)
    .sort((a, b) => {
      if (a.label[0] > b.label[0]) {
        return 1
      }
      if (a.label[0] < b.label[0]) {
        return -1
      }
      return +a.label.slice(1) - +b.label.slice(1);
    })
    .reduce((acc, item) => {
      if (acc[item.label[0]])
        acc[item.label[0]].push(item)
      else
        acc[item.label[0]] = [item];
      acc[item.label[0]] = acc[item.label[0]].sort((a, b) => +a.label.slice(1) - +b.label.slice(1));
      return acc;
    }, {});
  const mapFarming = Object.values(mapFarmingObject).reduce((acc, item, index) => {
    if (index % 2 === 0)
      acc.push(...item)
    else
      acc.push(...item.reverse());
    return acc;
  }, [])
  console.log(mapFarming);
  const mapFarmingCells = reversed ? mapFarming.reverse() : mapFarming;
  if (!mapFarmingCells.some(item => item.isUser)) {
    go(mapFarmingCells[0]);
  } else {
    const userCellIndex = mapFarmingCells.findIndex(item => item.isUser);
    if (userCellIndex === mapFarmingCells.length - 1) {
      reversed = !reversed;
      nextStep();
      return;
    }
    go(mapFarmingCells[userCellIndex + 1]);
  }
}

function walker() {
  if (!Object.values(autoWalkSettings).reduce((acc, item) => acc || item)) {
    autoWalk = false;
    autoWalkText.innerText = 'Выкл';
    autoWalkToggler.style.cssText = '';
    alert('Выберите типы фарминга!');
    return;
  }
  autoWalk = !autoWalk;
  autoWalkText.innerText = autoWalk ? 'Вкл' : 'Выкл';
  autoWalkToggler.style.cssText = autoWalk ? 'background-color: rgba(46,139,87,0.3) !important' : '';
  if (autoWalk) {
    nextStep();
  }
}

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
      if (autoWalk) {
        const returnToMapElement = gameBody.querySelector('div.farm-wrapper button.btn.btn-blue')
        if (!returnToMapElement) {
          console.error('Не найдена кнопка возврата на карту');
          setTimeout(() => clicker(), 1000);
          return;
        }
        returnToMapElement.click();
        setTimeout(nextStep, 300);
      }
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

Init();

setInterval(() => {
  const startGame = document.querySelector('div.start-game button.btn-medium:has(span)');
  if (startGame) {
    startGame.click();
    if (autoWalk) nextStep();
  }
}, 5000);