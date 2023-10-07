import axios from "axios";
import {createButton} from "@contentScript/utils/hud/createButton";

const subtitles = ['', 'pays x2', 'pays x4', "pays x6", "pays x11", "pays x21"];
const multipliers = [0, 2, 4, 6, 11, 21];
const titles = ['', '1', '3', '5', '10', '20'];

const setBet = async (cell: number[], quantity: number[]) => {
  const {data: {status, message}} = await axios.post<{
    status: string,
    message: string
  }>('https://cobaltlab.tech/api/wheelRoll/PLACE_BET', {
    betData: cell.map((item, index) => ({
        title: titles[item],
        subtitle: subtitles[item],
        multiplier: multipliers[item],
        id: item,
        betSum: quantity[index],
        quantity: quantity[index],
      })
    ),
  });
  if (status !== 'success') {
    return Promise.reject(`${status}: ${message}`);
  }
}

let autoRouletteOn = false;
let betSetted = false;
let interval = setInterval(() => {
}, 1);

const btn = createButton({
  innerText: 'Автоставка',
  classes: 'btn auto-roulette',
  onClick: async () => {
    clearInterval(interval);
    autoRouletteOn = !autoRouletteOn;
    btn.style.cssText = autoRouletteOn ? 'background-color: rgba(46,139,87,0.3) !important;' : '';
    if (!autoRouletteOn) {
      return;
    }
    clearInterval(interval);
    try {
      await setBet([1, 2], [0.04, 0.02]);
      betSetted = true;
      console.log('bet placed');
    } catch (e) {
      autoRouletteOn = false;
      btn.style.cssText = autoRouletteOn ? 'background-color: rgba(46,139,87,0.3) !important;' : '';
      alert(e);
      return;
    }
    interval = setInterval(async () => {
      try {
        if (document.querySelector('div.roulette-game-wrapper div.time-title')?.textContent !== 'Resets in') {
          betSetted = false;
        }
        if (document.querySelector('div.roulette-game-wrapper div.time-title')?.textContent !== 'Resets in'
          || betSetted)
          return;
        await setBet([1, 2], [0.04, 0.02]);
        betSetted = true;
        console.log('bet placed');
      } catch (e) {
        clearInterval(interval);
        autoRouletteOn = false;
        btn.style.cssText = autoRouletteOn ? 'background-color: rgba(46,139,87,0.3) !important;' : '';
        alert(e);
        return;
      }
    }, 2 * 1000);
  }
});
const placeBtn = () => {
  const rouletteHead = document.querySelector<HTMLDivElement>('div.container.roulette-container > div.case-head > div.case-head__left');
  if (!rouletteHead) {
    alert('Не нашёл куда вставить кнопку :(');
    return;
  }

  btn.style.cssText = autoRouletteOn ? 'background-color: rgba(46,139,87,0.3) !important;' : '';

  if (!rouletteHead.querySelector('button.auto-roulette')) {
    rouletteHead.append(btn);
  }
}

const init = () => {
  setTimeout(placeBtn, 5000);
}

init();