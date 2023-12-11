import { LitElement, css, html } from "lit";
import { customElement } from "lit/decorators.js";
import segmentModel from "../model/segments";

@customElement("a-toolbar")
export class Toolbar extends LitElement {
  render() {
    return html`
      <div>
        <button @click=${() => segmentModel.addSegment()}>+</button>
        <button @click=${() => segmentModel.export()}>Export</button>
      </div>
    `;
  }

  static styles = css``;
}
