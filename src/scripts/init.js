const app    = require('../../package.json');
const config = require('../config.json');

$(document).ready(function () {

	const mountPoint = $('<div>', {
		id: app.name,
		html: '<div>'
	});

	if (!OCA.Files) {
		return;
	}

	// ---- Register fileactions -------

	let actionHandler = (fileName) => {
		$('body').append(mountPoint);
		
		OC.addScript(app.name, app.name).then(() => {
			OC.redirect(OC.joinPaths('#', app.name, fileName));
		});
	};
	config.mimetypes.forEach( (type) => {
		let ViewMedia = {
			mime: type,
			name: app.name,
			permissions: OC.PERMISSION_READ,
			actionHandler
		};

		OCA.Files.fileActions.registerAction(ViewMedia);
		OCA.Files.fileActions.setDefault(type, app.name);
	});
});
