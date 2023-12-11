import { LitElement, css, html } from "lit";
import { customElement } from "lit/decorators.js";
import segmentModel from "../model/segments";
import { ENEMY_DEFINITIONS } from "../model/enemy";
import appModel from "../model/app";
import { MobxLitElement } from "@adobe/lit-mobx";

@customElement("a-toolbar")
export class Toolbar extends MobxLitElement {
  render() {
    return html`
      <div>
        <button @click=${() => segmentModel.addSegment()}>+</button>
        <button @click=${() => segmentModel.export()}>Export C++</button>
        <button @click=${() => segmentModel.exportJSON()}>Export JSON</button>
        <button @click=${() => segmentModel.loadJSON()}>Load JSON</button>
      </div>
      <div>
        ${ENEMY_DEFINITIONS.map((enemy, i) => {
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
        })}
      </div>
    `;
  }

  static styles = css`
    button[selected] {
      background-color: blue;
    }
  `;
}
