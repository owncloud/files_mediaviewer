let pkg, config, enabledImages;

pkg    = require('../../package.json');
config = require('../config.json');

// Add enabledPreviewProviders to mimeType list
enabledImages = _.filter(OC.appConfig.core.enabledPreviewProviders, (mimeType) => { return !mimeType.search('image'); });
enabledImages = _.map(enabledImages, (mimeType) => { return mimeType.replace(/\\/g, ''); }); // strip slashes

config.mimetypes = config.mimetypes.concat(enabledImages);

pkg['config'] = config;

export default pkg;