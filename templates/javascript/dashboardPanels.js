import {LitElement, css, html, unsafeHTML, map} from 'https://cdn.jsdelivr.net/gh/lit/dist@2/all/lit-all.min.js';

const linkPanels = document.querySelector()

export class DashboardPanels extends LitElement {
  constructor() {
    super();
  };

	static properties = {

  };

	async connectedCallback() {
		super.connectedCallback();
	};

  render() {
		return html`<style>
			.links { background: red; }
		</style>`;
  };
}
customElements.define('dashboard-panels', DashboardPanels);
