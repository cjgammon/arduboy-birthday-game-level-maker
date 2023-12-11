import { LitElement, css, html } from "lit";
import { customElement } from "lit/decorators.js";
import "./app/components/a-toolbar.js";
import "./app/components/a-editor.js";

/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement("editor-app")
export class EditorApp extends LitElement {
  render() {
    return html`
      <div>
        <a-toolbar></a-toolbar>
        <a-editor></a-editor>
      </div>
    `;
  }

  static styles = css``;
}

declare global {
  interface HTMLElementTagNameMap {
    "editor-app": EditorApp;
  }
}
