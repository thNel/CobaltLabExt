let gameBody = document.querySelector('div.game-body');

while (!gameBody) {
  gameBody = document.querySelector('div.game-body');
  console.log('GameBody found!');
}

const clickerButton = document.createElement('button');
const clickerButtonText = document.createElement('span');
clickerButton.className = 'btn btn-icon btn-small inherit clicker-button';
clickerButtonText.innerText = 'Автокликер';
clickerButtonText.className = 'clicker-button-text';
clickerButton.append(clickerButtonText);

function clicker() {
  const elementClickerButton = document.querySelector('button.clicker-button');
  const elementClickerText = elementClickerButton.querySelector('span.clicker-button-text');
  elementClickerButton.onclick = undefined;
  elementClickerButton.style.backgroundColor = 'rgba(105,105,105,0.3)';
  elementClickerText.innerText = 'Добыча...';
  var clickerTimer = setInterval((button, text) => {
    const element = document.querySelector('.x') ?? document.querySelector('.iskra') ?? document.querySelector('.farm-wrapper__clicker-item');
    if (element) {
      element.click();
    } else {
      clearInterval(clickerTimer);
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
  if (!farmHeader.querySelector('button.clicker-button'))
    farmHeader.append(clickerButton);
}, 1000);