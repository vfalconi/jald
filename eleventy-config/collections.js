const Dashboards = require('../lib/Dashboards');

module.exports.dashboards = () => {
	const compiledDashboards = new Dashboards();
	return compiledDashboards.kdlDoc;
};
