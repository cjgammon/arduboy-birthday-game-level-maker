import { css, html } from "lit";
import { customElement } from "lit/decorators.js";
import segmentModel from "../model/segments";
import { ENEMY_DEFINITIONS } from "../model/enemy";
import { COIN_LAYOUTS } from "../model/coins";
import appModel from "../model/app";
import { MobxLitElement } from "@adobe/lit-mobx";

@customElement("a-toolbar")
export class Toolbar extends MobxLitElement {
  renderEnemyButtons() {
    return ENEMY_DEFINITIONS.map((enemy) => {
      return html`<button
        ?selected=${appModel.selectedEnemy === enemy.type}
        @click=${() => {
          if (appModel.selectedEnemy === enemy.type) {
            appModel.setSelectedEnemy(null);
          } else {
            appModel.setSelectedEnemy(enemy.type);
          }
        }}
      >
        <img src="${enemy.src}" />
      </button>`;
    });
  }

  renderCoinButtons() {
    return COIN_LAYOUTS.map((coin) => {
      return html`<button
        ?selected=${appModel.selectedCoin === coin}
        @click=${() => {
          if (appModel.selectedCoin === coin) {
            appModel.setSelectedCoin(null);
          } else {
            appModel.setSelectedCoin(coin);
          }
        }}
      >
        ${coin}
      </button>`;
    });
  }

  render() {
    return html`
      <div>
        <button @click=${() => segmentModel.addSegment()}>+</button>
        <button @click=${() => segmentModel.export()}>Export C++</button>
        <button @click=${() => segmentModel.exportJSON()}>Export JSON</button>
        <button @click=${() => segmentModel.loadJSON()}>Load JSON</button>
      </div>
      <div>${this.renderEnemyButtons()} ${this.renderCoinButtons()}</div>
    `;
  }

  static styles = css`
    button[selected] {
      background-color: blue;
    }
  `;
}
