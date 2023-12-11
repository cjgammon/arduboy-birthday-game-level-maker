import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";

import {
  GROUND_TILES_PER_SEGMENT,
  GROUND_TILE_SIZE,
  GROUND_TILE_IMG,
} from "../model/segments";
import { Segment } from "../model/segments";

@customElement("a-segment")
export class SegmentElement extends LitElement {
  @property({ type: Object })
  segment!: Segment;

  render() {
    return html`
      <div class="segment">
        ${this.segment.ground.map((value, i) => {
          return html`<div
            class="ground-tile"
            style="left: ${i * GROUND_TILE_SIZE}px"
            @click=${() => {
              this.segment.toggleGroundTile(i);
              this.requestUpdate();
            }}
          >
            <img src="${value === 1 ? GROUND_TILE_IMG : ""}" />
          </div>`;
        })}
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
