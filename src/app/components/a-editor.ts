import { MobxLitElement } from "@adobe/lit-mobx";
import { css, html } from "lit";
import { customElement } from "lit/decorators.js";

import segmentModel from "../model/segments";

import "./a-segment";

@customElement("a-editor")
export class Editor extends MobxLitElement {
  render() {
    return html`<div class="container">
      ${segmentModel.segments.map(
        (segment) => html`<a-segment .segment=${segment}></a-segment>`
      )}
    </div> `;
  }

  static styles = css`
    .container {
      display: flex;
      overflow-x: scroll;
      transform-origin: top left;
      transform: scale(4);
    }
  `;
}
