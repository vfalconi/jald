const fs = require('fs');

const Config = class Config {
	constructor(configOptions) {
		configOptions.children.forEach(item => {
			this[item.name] = (item.values.length === 1 ? item.values[0] : item.values);
		});
	}
}

module.exports = class Dashboards {
	data() {
		return {
			pagination: {
				'data': 'collections.layouts',
				'size': 1,
				'alias': 'layout',
				'addAllPagesToCollections': true,
			},
			css: function(data) {
				return this.collections.css.get(data.layout.name);
			},
			config: function() {
				// TODO: use a KDL Query to get the config block, more efficient maybe?
				return new Config(this.layout.children.filter(child => child.name === 'config')[0]);
			},
			permalink: function(data) {
        return `${data.layout.name}`;
      }
		}
	}

	css(data) {
		return data.css(data);
	}

	title(data) {
		return data.config().title;
	}

	icon(data) {
		const iconPath = data.config().icon;
		if (iconPath !== undefined && fs.existsSync(iconPath)) {
			if (iconPath.endsWith('.svg')) {
				return fs.readFileSync(iconPath, 'utf8');
			}
			return `<img src="${iconPath}" width="64" />`;
		}
		return '';
	}

	renderPanels(blocks) {
		const renderedBlocks = [];
		blocks.forEach(block => {
			switch (true) {
				case (block.name === 'links'):
					renderedBlocks.push(this.links(block));
					break;
				case (block.name === 'feed'):
					renderedBlocks.push(this.feed(block));
					break;
				case (block.name === 'panelGroup'):
					// TODO: a panelGroup class
					renderedBlocks.push(`<div class="panels">${this.renderPanels(block.children)}</div>`);
					break;
			}
		});
		return renderedBlocks.join('');
	}

	render(data) {
		return `<!DOCTYPE html>
		<html lang="en">
		<head>
			<meta charset="UTF-8">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<link rel="icon" href="${data.config().icon}" type="image/svg+xml" />
			<title>${this.title(data)} | JALD.</title>
			<style>${this.css(data)}</style>
		</head>
		<body>
			<p>${this.config}</p>
		</body>
		</html>`
	}
}
