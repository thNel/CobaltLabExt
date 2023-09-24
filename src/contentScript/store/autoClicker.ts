import {createSpan} from "../utils/hud/createSpan";
import {createButton} from "../utils/hud/createButton";
import {clicker} from "../handlers/clicker";
import {pushError} from "../utils/hud/pushError";
import {createInput} from "../utils/hud/createInput";
import {createDiv} from "../utils/hud/createDiv";

class AutoClicker {
  private _mining = false;
  private readonly _savedSettings = JSON.parse(localStorage.getItem('clickerSettings') ?? '{}');
  private readonly _settings = this._savedSettings ?
    {
      autoSelectTool: this._savedSettings.autoSelectTool ?? true,
      autoRepairTool: this._savedSettings.autoRepairTool ?? false,
      autoDeleteTool: this._savedSettings.autoDeleteTool ?? false,
      delay: this._savedSettings.delay ?? 600,
    }
    : {
      autoSelectTool: true,
      autoRepairTool: false,
      autoDeleteTool: false,
      delay: 600,
    }

  private readonly _activateButtonSpan;
  private readonly _activateButton;
  private readonly _autoSelectToolButton;
  private readonly _autoRepairButton;
  private readonly _autoDeleteButton;
  private readonly _delayInput;
  private readonly _clickerSettingsWrapper;

  constructor() {
    // Activate
    this._activateButtonSpan = createSpan('Автокликер', 'clicker-button-text');
    this._activateButton = createButton({
      innerElements: [this._activateButtonSpan],
      classes: 'btn btn-icon btn-small inherit clicker-button',
      onClick: clicker,
    });
    // Select tool
    this._autoSelectToolButton = createButton({
      innerText: 'Автоинструмент',
      classes: 'btn btn-blue btn-clicker-settings',
      onClick: this.toggleAutoSelectTool.bind(this),
    });
    this._autoSelectToolButton.style.cssText = this._settings.autoSelectTool ? 'background-color: rgba(46,139,87,0.3) !important' : '';
    // Repair tool
    this._autoRepairButton = createButton({
      innerText: 'Починка камня',
      classes: 'btn btn-blue btn-clicker-settings',
      onClick: this.toggleAutoRepairTool.bind(this),
    });
    this._autoRepairButton.style.cssText = this._settings.autoRepairTool ? 'background-color: rgba(46,139,87,0.3) !important' : '';
    // Delete tool
    this._autoDeleteButton = createButton({
      innerText: 'Удаление сломанных',
      classes: 'btn btn-blue btn-clicker-settings',
      onClick: this.toggleAutoDeleteTool.bind(this),
    });
    this._autoDeleteButton.style.cssText = this._settings.autoDeleteTool ? 'background-color: rgba(46,139,87,0.3) !important' : '';
    // Delay
    this._delayInput = createInput(this._settings.delay, 'inp-clicker-settings', (event: any) => {
      if (!isNaN(+event?.target?.value)) {
        if (+event.target.value < 1) {
          pushError('Задержка может быть только положительным числом!', true);
          this._delayInput.value = this._settings.delay.toString();
          return;
        }
        this.delay = +event.target.value
      } else {
        pushError('Задержка может быть только числом!', true);
        this._delayInput.value = this._settings.delay.toString();
      }
    });
    const delayBlock = createDiv({
      innerElements: [createSpan('Скорость добычи'), this._delayInput, createSpan('ms')],
      classes: 'clicker-settings-row',
    });
    // Controls
    const controls = createDiv({
      innerElements: [this._autoSelectToolButton, this._autoRepairButton, this._autoDeleteButton, delayBlock],
      classes: 'clicker-settings d-none',
    })
    this._clickerSettingsWrapper = createDiv({
      innerElements: [this._activateButton, controls],
      classes: 'clicker-wrapper',
      onMouseEnter: () => {
        controls.classList.remove('d-none');
      },
      onMouseLeave: () => {
        controls.classList.add('d-none');
      },
    })
  }

  public get mining() {
    return this._mining;
  }

  public get settings() {
    return this._settings;
  }

  public get controlsDiv(): HTMLDivElement {
    return this._clickerSettingsWrapper;
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

  public toggleAutoSelectTool() {
    this._settings.autoSelectTool = !this._settings.autoSelectTool;
    this._autoSelectToolButton.style.cssText = this._settings.autoSelectTool ? 'background-color: rgba(46,139,87,0.3) !important' : '';
    localStorage.setItem('clickerSettings', JSON.stringify(this._settings));
  }

  public toggleAutoRepairTool() {
    this._settings.autoRepairTool = !this._settings.autoRepairTool;
    this._autoRepairButton.style.cssText = this._settings.autoRepairTool ? 'background-color: rgba(46,139,87,0.3) !important' : '';
    localStorage.setItem('clickerSettings', JSON.stringify(this._settings));
  }

  public toggleAutoDeleteTool() {
    this._settings.autoDeleteTool = !this._settings.autoDeleteTool;
    this._autoDeleteButton.style.cssText = this._settings.autoDeleteTool ? 'background-color: rgba(46,139,87,0.3) !important' : '';
    localStorage.setItem('clickerSettings', JSON.stringify(this._settings));
  }

  public set delay(ms: number) {
    if (ms < 1) {
      pushError('Задержка может быть только положительным числом!');
      this._delayInput.value = this._settings.delay;
    }
    this._settings.delay = ms;
    localStorage.setItem('clickerSettings', JSON.stringify(this._settings));
  }
}

export default new AutoClicker();