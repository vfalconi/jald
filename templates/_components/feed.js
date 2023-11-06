const { inspect } = require('util');
const icons = require('./icons');
const { camelCase } = require('camel-case');

module.exports = function (block) {
	const { heading, icon, url } = {...block.properties};

	return `<nav class="panel" id="${camelCase(heading)}">
		<div class="panel__header">
			<svg class="panel__icon" viewBox="0 0 24 24">
				<path d="${icons(icon)}" />
			</svg>
			<h2 class="panel__heading">${heading}</h2>
		</div>
		<rss-feed url="${url}" expandIcon="${icons('arrow-expand-down')}"></rss-feed>
	</nav>`;
};
