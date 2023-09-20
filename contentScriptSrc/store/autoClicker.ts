import {createSpan} from "../utils/createSpan";
import {createButton} from "../utils/createButton";
import {cellTypes} from "./cellTypes";
import {clicker} from "../handlers/autoClicker";
import {pushError} from "../utils/pushError";
import {createInput} from "../utils/createInput";
import {createDiv} from "../utils/createDiv";

class AutoClicker {
  private _mining = false;
  private readonly _savedSettings = JSON.parse(localStorage.getItem('clickerSettings') ?? '{}');
  private readonly _settings = this._savedSettings ?
    {
      autoSelectTool: this._savedSettings.autoSelectTool ?? true,
      delay: +this._savedSettings.delay ?? 600,
      fastDelay: +this._savedSettings.fastDelay ?? 350
    }
    : {
      autoSelectTool: true,
      delay: 600,
      fastDelay: 350
    }

  private _activateButton;
  private readonly _activateButtonSpan;
  private readonly _autoSelectToolSpan;
  private readonly _autoSelectToolButton;
  private readonly _delayInput;
  private readonly _fastDelayInput;
  private readonly _clickerSettingsDiv;

  constructor() {
    this._activateButtonSpan = createSpan('Автокликер', 'clicker-button-text');
    this._activateButton = createButton({
      innerElements: [this._activateButtonSpan],
      classes: 'btn btn-icon btn-small inherit clicker-button',
    });
    this._autoSelectToolSpan = createSpan('Автоинструмент', 'btn-clicker-settings-text');
    this._autoSelectToolButton = createButton({
      innerElements: [this._autoSelectToolSpan],
      classes: 'btn btn-blue btn-clicker-settings',
      onClick: this.toggleAutoSelectTool.bind(this),
    });
    this._autoSelectToolButton.style.cssText = this._settings.autoSelectTool ? 'background-color: rgba(46,139,87,0.3) !important' : '';
    this._delayInput = createInput(this._settings.delay, 'inp-clicker-settings', (event: any) => {
      if (!isNaN(+event?.target?.value)) {
        if (+event.target.value < 1) {
          pushError('Только положительные числа!', true);
          this._delayInput.value = this._settings.delay.toString();
          return;
        }
        this.delay = +event.target.value
      } else {
        pushError('Только числа!', true);
        this._delayInput.value = this._settings.delay.toString();
      }
    });
    this._fastDelayInput = createInput(this._settings.fastDelay, 'inp-clicker-settings', (event: any) => {
      if (!isNaN(+event?.target?.value)) {
        if (+event.target.value < 0) {
          pushError('Только положительные числа!', true);
          this._fastDelayInput.value = this._settings.fastDelay.toString();
          return;
        }
        if (+event.target.value < this._settings.delay)
          this.fastDelay = +event.target.value
        else {
          pushError('Ускоренная добыча должна быть быстрее!', true);
          this._fastDelayInput.value = this._settings.fastDelay.toString();
        }
      } else {
        pushError('Только числа!', true);
        this._fastDelayInput.value = this._settings.fastDelay.toString();
      }
    });
    const delayBlock = createDiv({
      innerElements: [createSpan('Скорость добычи'), this._delayInput, createSpan('ms')],
      classes: 'clicker-settings',
    });
    const fastDelayBlock = createDiv({
      innerElements: [createSpan('Ускоренная добыча'), this._fastDelayInput, createSpan('ms')],
      classes: 'clicker-settings',
    });
    this._clickerSettingsDiv = createDiv({
      innerElements: [this._autoSelectToolButton, delayBlock, fastDelayBlock],
      classes: 'clicker-settings-wrapper d-none',
    })
  }

  public get mining() {
    return this._mining;
  }

  public get activateButton() {
    return this._activateButton;
  }

  public get settings() {
    return this._settings;
  }

  public get clickerSettingsDiv() {
    return this._clickerSettingsDiv;
  }

  public toggleMining(success?: boolean) {
    this._mining = !this._mining;
    if (this._mining) {
      this._activateButton.style.backgroundColor = 'rgba(105,105,105,0.3)';
      this._activateButtonSpan.innerText = 'Добыча...';
    } else {
      if (success) {
        this._activateButton.style.backgroundColor = 'rgba(46,139,87,0.3)';
        this._activateButtonSpan.innerText = 'Всё добыто!';
        this._activateButton.style.cursor = 'default';
        setTimeout(() => {
          this._activateButton.style.backgroundColor = '';
          this._activateButton.style.cursor = '';
          this._activateButtonSpan.innerText = 'Автокликер';
        }, 2000);
      } else {
        this._activateButton.style.backgroundColor = '';
        this._activateButton.style.cursor = '';
        this._activateButtonSpan.innerText = 'Автокликер';
      }
    }
  }

  public newClickerButton(cellType: typeof cellTypes[keyof typeof cellTypes] | undefined) {
    this._activateButton = createButton({
      innerElements: [this._activateButtonSpan],
      classes: 'btn btn-icon btn-small inherit clicker-button',
      onClick: clicker(cellType),
    });
  }

  public toggleAutoSelectTool() {
    this._settings.autoSelectTool = !this._settings.autoSelectTool;
    this._autoSelectToolButton.style.cssText = this._settings.autoSelectTool ? 'background-color: rgba(46,139,87,0.3) !important' : '';
    localStorage.setItem('clickerSettings', JSON.stringify(this._settings));
  }

  public set delay(ms: number) {
    const condition = ms >= this._settings.fastDelay;
    this._settings.delay = ms;
    this.fastDelay = condition ? this._settings.fastDelay : this._settings.delay - 1;
    if (!condition) {
      this._fastDelayInput.value = this._settings.fastDelay.toString();
      pushError('Ускоренная добыча не может быть быстрее обычной!', true);
    }
    localStorage.setItem('clickerSettings', JSON.stringify(this._settings));
  }

  public set fastDelay(ms: number) {
    const condition = ms < this._settings.delay;
    this._settings.fastDelay = condition ? ms : this._settings.delay;
    if (!condition)
      pushError('Ускоренная добыча не может быть быстрее обычной!', true);
    localStorage.setItem('clickerSettings', JSON.stringify(this._settings));
  }

}

export default new AutoClicker();