import { LitElement, css, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import segmentModel, {
  GROUND_TILES_PER_SEGMENT,
  GROUND_TILE_SIZE,
  GROUND_TILE_IMG,
} from "../model/segments";
import { ENEMY_DEFINITIONS, ENEMY_SIZE, getEnemyImage } from "../model/enemy";
import { COIN_LAYOUT_TYPES } from "../model/coins";

import { Segment } from "../model/segments";
import appModel from "../model/app";

@customElement("a-segment")
export class SegmentElement extends LitElement {
  @property({ type: Object })
  segment!: Segment;

  @state()
  draggingGroundTile = false;

  @state()
  hideTile = false;

  pointerMoveHandler: any = null;
  pointerUpHandler: any = null;

  handle_ground_POINTERDOWN(e: PointerEvent, value: number) {
    if (value === 0) {
      this.hideTile = false;
    } else {
      this.hideTile = true;
    }

    e.stopPropagation();
    this.draggingGroundTile = true;

    if (!this.pointerMoveHandler) {
      this.pointerMoveHandler = (e: PointerEvent) =>
        this.handle_ground_POINTERMOVE(e);
      window.addEventListener("pointermove", this.pointerMoveHandler);
    }

    if (!this.pointerUpHandler) {
      this.pointerUpHandler = (e: PointerEvent) =>
        this.handle_ground_POINTERUP(e);
      window.addEventListener("pointerup", this.pointerUpHandler);
    }
  }

  handle_ground_POINTERMOVE(e: PointerEvent) {
    console.log("pointermove");
    this.handle_DRAGGING_GROUND(e);
  }

  handle_ground_POINTERUP(e: PointerEvent) {
    console.log("mouseup");
    e.stopPropagation();
    this.draggingGroundTile = false;
    window.removeEventListener("pointermove", this.pointerMoveHandler);
    window.removeEventListener("pointerup", this.pointerUpHandler);

    this.pointerMoveHandler = null;
    this.pointerUpHandler = null;
  }

  handle_DRAGGING_GROUND(e: PointerEvent) {
    if (!this.draggingGroundTile) {
      return;
    }
    if (e.target instanceof HTMLElement) {
      const rect = e.target.getBoundingClientRect();
      let x = e.clientX - rect.left;
      let y = e.clientX - rect.top;
      x = Math.round(x / 4);
      y = Math.round(y / 4);

      const elements = this.shadowRoot!.elementsFromPoint(e.clientX, e.clientY);
      for (const element of elements) {
        if (element instanceof HTMLElement) {
          if (element.classList.contains("ground-tile")) {
            if (this.hideTile) {
              this.segment.hideGroundTile(parseInt(element.dataset.index!));
            } else {
              this.segment.showGroundTile(parseInt(element.dataset.index!));
            }
          }
        }
      }
      this.requestUpdate();
    }
  }

  handle_segment_CLICK(e: MouseEvent) {
    if (appModel.selectedEnemy !== null && e.target instanceof HTMLElement) {
      const rect = e.target.getBoundingClientRect();
      let x = e.clientX - rect.left;

      x = Math.round(x / 4) - ENEMY_SIZE / 2;
      this.segment.addEnemy(appModel.selectedEnemy!, x);
      this.requestUpdate();
    }
  }

  renderEnemies() {
    return this.segment.enemies.map((enemy) => {
      const enemyDefinition = ENEMY_DEFINITIONS.find(
        (d) => d.type === enemy[0]
      );
      const y = enemyDefinition!.y;
      return html`<div class="enemy" style="left: ${enemy[1]}px; top: ${y}px">
        <button
          class="enemy-delete-btn"
          @click=${(e: MouseEvent) => {
            e.stopPropagation();
            this.segment.removeEnemy(enemy);
            this.requestUpdate();
          }}
        >
          delete
        </button>
        <img src="${getEnemyImage(enemy[0])}" />
      </div>`;
    });
  }

  renderGroundTiles() {
    return this.segment.ground.map((value, i) => {
      return html`<div
        draggable="false"
        class="ground-tile"
        style="left: ${i * GROUND_TILE_SIZE}px"
        data-index=${i}
        @pointerdown=${(e: PointerEvent) =>
          this.handle_ground_POINTERDOWN(e, value)}
        @click=${(e: MouseEvent) => {
          e.stopPropagation();
          this.segment.toggleGroundTile(i);
          this.requestUpdate();
        }}
      >
        <img src="${value === 1 ? GROUND_TILE_IMG : ""}" />
      </div>`;
    });
  }

  renderCoins() {
    /*
    return this.segment.coins.map((coin) => {
      const coinLayout = COIN_LAYOUT_TYPES[coin[0]];
      return html`<div class="coin" style="left: ${coin[1]}px; top: 0">
        <img src="${coinLayout}" />
      </div>`;
    });
    */
  }

  render() {
    return html`
      <div class="container">
        <div
          class="segment"
          @click=${(e: MouseEvent) => this.handle_segment_CLICK(e)}
        >
          ${this.renderCoins()} ${this.renderEnemies()}
          ${this.renderGroundTiles()}
        </div>
        <button
          class="segment-delete-btn"
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

    .segment-delete-btn {
      transform-origin: top left;
      transform: scale(0.25);
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
      pointer-events: none;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      image-rendering: pixelated;
    }

    .enemy-delete-btn {
      position: absolute;
      top: 0;
      right: 0;
      transform-origin: top right;
      transform: scale(0.25);
    }
  `;
}
