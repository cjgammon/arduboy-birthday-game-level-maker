import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";

import segmentModel, {
  GROUND_TILES_PER_SEGMENT,
  GROUND_TILE_SIZE,
  GROUND_TILE_IMG,
} from "../model/segments";
import { ENEMY_DEFINITIONS, getEnemyImage } from "../model/enemy";

import { Segment } from "../model/segments";
import appModel from "../model/app";

@customElement("a-segment")
export class SegmentElement extends LitElement {
  @property({ type: Object })
  segment!: Segment;

  handle_segment_CLICK(e: Event) {
    if (appModel.selectedEnemy !== null) {
      //get rect and adjust x and y for scale
      const rect = e.target.getBoundingClientRect();
      let x = e.clientX - rect.left;
      let y = e.clientY - rect.top;

      x = x / 4;
      y = y / 4;

      console.log("scale", x, y, appModel.selectedEnemy);
      this.segment.addEnemy(appModel.selectedEnemy, x, y);
    }
  }

  render() {
    return html`
      <div class="container">
        <div class="segment" @click=${(e) => this.handle_segment_CLICK(e)}>
          ${this.segment.enemies.map((enemy) => {
            return html`<div
              class="enemy"
              style="left: ${enemy[1] * 4}px; top: ${enemy[2] * 4}px"
            >
              <img src="${getEnemyImage(enemy[0])}" />
            </div>`;
          })}
          ${this.segment.ground.map((value, i) => {
            return html`<div
              class="ground-tile"
              style="left: ${i * GROUND_TILE_SIZE}px"
              @click=${(e) => {
                e.stopPropagation();
                this.segment.toggleGroundTile(i);
                this.requestUpdate();
              }}
            >
              <img src="${value === 1 ? GROUND_TILE_IMG : ""}" />
            </div>`;
          })}
        </div>
        <button
          @click=${() => {
            segmentModel.removeSegment(this.segment);
            this.requestUpdate();
          }}
        >
          -
        </button>
      </div>
    `;
  }

  static styles = css`
    .segment {
      position: relative;
      width: ${GROUND_TILES_PER_SEGMENT * GROUND_TILE_SIZE}px;
      height: 64px;
      background-color: black;
      border: 2px solid blue;
      color: white;
    }

    .enemy {
      position: absolute;
      width: 32px;
      height: 32px;
      image-rendering: pixelated;
    }

    .enemy img {
      width: 100%;
      height: 100%;
    }

    .ground-tile {
      position: absolute;
      width: ${GROUND_TILE_SIZE}px;
      height: ${GROUND_TILE_SIZE}px;
      bottom: 0;
      cursor: pointer;
    }

    .ground-tile img {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      image-rendering: pixelated;
    }
  `;
}
