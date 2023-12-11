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

  static styles = css`
    a-toolbar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
    }

    a-editor {
      display: block;
      padding-top: 64px;
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "editor-app": EditorApp;
  }
}
