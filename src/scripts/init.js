if (!OCA.Mediaviewer) {
	/**
	 * @namespace
	 */
	OCA.Mediaviewer = {};
}

OCA.Mediaviewer.app = require('./setup.js').default;

$(document).ready(function () {
	const app = OCA.Mediaviewer.app;
	const mountPoint = $('<div>', {
		id: app.name,
		html: '<div>'
	});

	if (!OCA.Files) {
		return;
	}
	
	// ---- Register fileactions -------

	let actionHandler = (fileName, context) => {
		$('body').append(mountPoint);

		OCA.Mediaviewer.files = context.fileList.files;

		OC.addScript(app.name, app.name).then(() => {
			OC.redirect(OC.joinPaths('#', app.name, fileName));
		});
	};

	app.config.mimetypes.forEach( (mimetype) => {

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
