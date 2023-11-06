const fs = require('node:fs');
const path = require('node:path');
const glob = require('glob');
const kdl = require('kdljs');

module.exports = class Dashboards {
	constructor() {
		this.outputExtension = `.${process.env.JALD_OUTPUT_EXTENSION || 'html' }`;
		this.inputExtension = `.${process.env.JALD_INPUT_EXTENSION || 'kdl' }`;
		this.indexAlias = process.env.JALD_INDEX_ALIAS || 'main';
		this.outputIndex = `${this.indexAlias}${this.inputExtension}`;
		this.sourceRoot = process.env.JALD_DASHBOARDS_PATH || './dashboards';
		this.sourceFiles = glob.sync(`${this.sourceRoot}/**/*${this.inputExtension}`);
		this.source = this.#compileSource();
		this.kdlDoc = this.#parseKDL();
	}

	query = (q, doc, flatten = true) => {
		const results = kdl.query(doc, q);
		if (flatten === true && results.length === 1) return results[0];
		return results;
	};

	#normalizePath = (str) => {
		const dashPath = str.replace(`${this.sourceRoot}${path.sep}`, '');
		const dashDirname = (path.dirname(dashPath) === '.' ? '' : `${path.dirname(dashPath)}${path.sep}`);
		return `${dashDirname}${path.basename(dashPath)}`;
	};

	#makePermalink = (str) => {
		if (str.includes(this.outputIndex)) {
			return str.replace(this.outputIndex, `index${this.outputExtension}`);
		}

		return str.replace(this.inputExtension, `${path.sep}index${this.outputExtension}`)
	};

	#makeDashName = (str) => {
		const segments = path.dirname(str).split(path.sep);
		const dashName = path.basename(str).replace(path.extname(str), '');
		const parent = segments.pop();
		if (parent === '.') return dashName;
		if (dashName === 'main') return parent;
		return dashName;
	};

	#compileSource = () => {
		const source = [];
		this.sourceFiles.forEach(file => {
			const dashboardPath = this.#normalizePath(file);
			const permalink = this.#makePermalink(dashboardPath);
			const dashName = this.#makeDashName(dashboardPath);
			const dashboardConfig = fs.readFileSync(file, 'utf8');
			source.push(`"${permalink}" title="${dashName}" {${dashboardConfig}}`);
		});
		return source.join('');
	};

	#convertConfigBlock = (dashboardSource, dashboardConfig) => {
		dashboardConfig.forEach(dc => {
			dashboardSource.properties = { ...dashboardSource.properties, ...dc.properties };
		});
		return dashboardSource;
	}

	#parseKDL = () => {
		const { output: parsedSource, errors: parserErrors } = kdl.parse(this.source);

		if (parserErrors.length > 0) {
			throw new Error(parserErrors);
		}

		parsedSource.forEach((source, i) => {
			const sourceConfig = this.query('config', [ source ], false);
			parsedSource[i] = this.#convertConfigBlock(source, sourceConfig);
		});

		return parsedSource;
	};
}
