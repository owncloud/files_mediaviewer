import app from './setup.js';

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

	app['config'].mimetypes.forEach( (mimetype) => {

		let ViewMedia = {
			mime: mimetype,
			name: app.name,
			permissions: OC.PERMISSION_READ,
			actionHandler
		};

		OCA.Files.fileActions.registerAction(ViewMedia);
		OCA.Files.fileActions.setDefault(mimetype, app.name);
	});
});
