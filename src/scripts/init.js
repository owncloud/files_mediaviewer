const appName = require('../../package.json').name;

$(document).ready(function () {

	const mountPoint = $('<div>', {
		id: appName,
		html: '<div>'
	});

	if (!OCA.Files) {
		return;
	}

	// ---- Register fileactions -------

	let ViewMedia = {
		mime: 'image/png',
		name: appName,
		permissions: OC.PERMISSION_READ,
		actionHandler(fileName, context) {

			window[appName] = {
				fileName,
				context
			};

			window.location = ['#', appName, fileName].join('/');

			$('body').append(mountPoint);
			OC.addScript(appName, appName);
		}
	};

	OCA.Files.fileActions.registerAction(ViewMedia);
	OCA.Files.fileActions.setDefault('image/png', appName);
});
