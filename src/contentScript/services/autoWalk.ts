import {cellTypes} from "../store/cellTypes";
import {createSpan} from "../utils/hud/createSpan";
import {createButton} from "../utils/hud/createButton";
import {generateWalkingSVG} from "../components/walkingSVG";
import {createDiv} from "../utils/hud/createDiv";
import {walker} from "../handlers/walker";

class AutoWalk {
  private _enabled = localStorage.getItem('walkerEnabled') === 'true';
  private _reversed = localStorage.getItem('walkerReversed') === 'true';
  private readonly _savedSettings = JSON.parse(localStorage.getItem('walkerSettings') ?? '{}');
  private readonly _settings: Record<typeof cellTypes[keyof typeof cellTypes], boolean> = this._savedSettings ?
    {
      ore: !!this._savedSettings.ore,
      road: !!this._savedSettings.road,
      wood: !!this._savedSettings.wood,
      bandit: !!this._savedSettings.bandit,
      card: !!this._savedSettings.card,
      city: !!this._savedSettings.city,
    }
    : {
      ore: false,
      road: false,
      wood: false,
      bandit: false,
      card: false,
      city: false,
    };
  private readonly _activateButtonSpan;
  private readonly _activateButton;
  private readonly _reverseButton;
  private readonly _banditButton;
  private readonly _cityButton;
  private readonly _oreButton;
  private readonly _woodButton;
  private readonly _roadButton;
  private readonly _controlsDiv;


  constructor() {
    this._activateButtonSpan = createSpan('Автоходьба');
    this._activateButton = createButton({
      innerElements: [generateWalkingSVG(), this._activateButtonSpan],
      classes: 'btn btn-blue btn-icon btn-auto-walk',
      onClick: walker,
    });
    this._activateButton.style.cssText = this._enabled ? 'background-color: rgba(46,139,87,1) !important;' : '';

    this._reverseButton = createButton({
      innerText: 'Реверс маршрута',
      classes: 'btn btn-blue btn-auto-walk-settings',
      onClick: this.toggleReversed.bind(this),
    })
    this._reverseButton.style.cssText = this._reversed ? 'background-color: rgba(46,139,87,0.3) !important;' : '';
    this._banditButton = createButton({
      innerText: 'Бандитка',
      classes: 'btn btn-blue btn-auto-walk-settings',
      onClick: this.toggleBandit.bind(this),
    })
    this._banditButton.style.cssText = this._settings.bandit ? 'background-color: rgba(46,139,87,0.3) !important;' : '';
    this._cityButton = createButton({
      innerText: 'Город',
      classes: 'btn btn-blue btn-auto-walk-settings',
      onClick: this.toggleCity.bind(this),
    })
    this._cityButton.style.cssText = this._settings.city ? 'background-color: rgba(46,139,87,0.3) !important;' : '';
    const left = createDiv({
      innerElements: [this._reverseButton, this._banditButton, this._cityButton],
      classes: 'button-group',
    });

    this._oreButton = createButton({
      innerText: 'Камень / Руды',
      classes: 'btn btn-blue btn-auto-walk-settings',
      onClick: this.toggleOres.bind(this),
    })
    this._oreButton.style.cssText = this._settings.ore ? 'background-color: rgba(46,139,87,0.3) !important;' : '';
    this._woodButton = createButton({
      innerText: 'Дерево',
      classes: 'btn btn-blue btn-auto-walk-settings',
      onClick: this.toggleWood.bind(this),
    })
    this._woodButton.style.cssText = this._settings.wood ? 'background-color: rgba(46,139,87,0.3) !important;' : '';
    this._roadButton = createButton({
      innerText: 'Дорога',
      classes: 'btn btn-blue btn-auto-walk-settings',
      onClick: this.toggleRoad.bind(this),
    })
    this._roadButton.style.cssText = this._settings.road ? 'background-color: rgba(46,139,87,0.3) !important;' : '';
    const right = createDiv({
      innerElements: [this._woodButton, this._oreButton, this._roadButton],
      classes: 'button-group',
    });

    const controls = createDiv({
      innerElements: [left, right],
      classes: 'auto-walk-controls d-none',
    });
    this._controlsDiv = createDiv({
      innerElements: [controls, this._activateButton],
      classes: 'auto-walk-wrapper',
      onMouseEnter: () => {
        controls.classList.remove('d-none');
      },
      onMouseLeave: () => {
        controls.classList.add('d-none');
      }
    })
  }

  public get enabled(): Boolean {
    return this._enabled;
  }

  public get controlsDiv(): HTMLDivElement {
    return this._controlsDiv;
  }

  public get reversed() {
    return this._reversed;
  }

  public get settings() {
    return this._settings;
  }

  public toggleEnabled() {
    this._enabled = !this._enabled;
    this._activateButton.style.cssText = this._enabled ? 'background-color: rgba(46,139,87,1) !important;' : '';
    this._activateButtonSpan.innerText = this._enabled ? 'Вкл' : 'Выкл';
    localStorage.setItem('walkerEnabled', JSON.stringify(this._enabled));
  }

  public toggleOres() {
    this._settings.ore = !this._settings.ore;
    this._oreButton.style.cssText = this._settings.ore ? 'background-color: rgba(46,139,87,0.3) !important;' : '';
    localStorage.setItem('walkerSettings', JSON.stringify(this._settings));
  }

  public toggleWood() {
    this._settings.wood = !this._settings.wood;
    this._woodButton.style.cssText = this._settings.wood ? 'background-color: rgba(46,139,87,0.3) !important;' : '';
    localStorage.setItem('walkerSettings', JSON.stringify(this._settings));
  }

  public toggleRoad() {
    this._settings.road = !this._settings.road;
    this._roadButton.style.cssText = this._settings.road ? 'background-color: rgba(46,139,87,0.3) !important;' : '';
    localStorage.setItem('walkerSettings', JSON.stringify(this._settings));
  }

  public toggleReversed() {
    this._reversed = !this._reversed;
    this._reverseButton.style.cssText = this._reversed ? 'background-color: rgba(46,139,87,0.3) !important;' : '';
    localStorage.setItem('walkerReversed', JSON.stringify(this._reversed));
  }

  public toggleCity() {
    this._settings.city = !this._settings.city;
    this._cityButton.style.cssText = this._settings.city ? 'background-color: rgba(46,139,87,0.3) !important;' : '';
    localStorage.setItem('walkerSettings', JSON.stringify(this._settings));
  }

  public toggleBandit() {
    this._settings.bandit = !this._settings.bandit;
    this._banditButton.style.cssText = this._settings.bandit ? 'background-color: rgba(46,139,87,0.3) !important;' : '';
    localStorage.setItem('walkerSettings', JSON.stringify(this._settings));
  }


}

export default new AutoWalk();