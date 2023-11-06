const { inspect } = require('util');
const icons = require('./icons');
const { camelCase } = require('camel-case');

module.exports = function (block) {
	const { heading, icon } = {...block.properties};
	const renderLinks = (links) => {
		return links.map(link => {
			return renderLink(link);
		}).join('');
	};
	const renderLink = (link) => {
		const linkProperties = new Map([
			[ 'label', link.name ],
			...link.children.map(child => [ child.name, child.values[0] ]),
		]);

		return `<li class="quicklinks__item">
			<div class="quicklink">
				<svg class="quicklink__icon" viewBox="0 0 24 24">
					<path d="${icons(linkProperties.get('icon'))}" />
				</svg>
				<a class="quicklink__link" href="${linkProperties.get('href')}" ${(linkProperties.get('target') === 'newtab' ? 'target="_blank"' : '')} >
					${linkProperties.get('label')}
					<div class="quicklink__href">${linkProperties.get('href')}</div>
				</a>
			</div>
		</li>`;
	};

	return `<nav class="panel" id="${camelCase(heading)}" style="grid-area:${camelCase(heading)}">
		<div class="panel__header">
			<svg class="panel__icon" viewBox="0 0 24 24">
				<path d="${icons(icon)}" />
			</svg>
			<h2 class="panel__heading">${heading}</h2>
		</div>
		<ul class="quicklinks">
			${renderLinks(block.children)}
		</ul>
	</nav>`;
};
