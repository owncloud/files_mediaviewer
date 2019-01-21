const appName = require('../../package.json').name;

const helper = {
	methods: {
		t(string, scope = appName) {
			return t(scope, string);
		},
		
		fileType(mimetype) {
			return mimetype.split('/')[0];
		},

		fileExtension(mimetype) {
			return mimetype.split('/')[1];
		},

		getActiveObject () {
			return $('.swiper-slide-active .viewer__media');
		},

		getWaitingVideos () {
			return $('.viewer__slide .viewer__media--video');
		},
		
		getWaitingImages () {
			return $('.viewer__slide .viewer__media--image');
		}
	}
};

const directive = {
	bind(el, binding) {
		el.innerText = t(binding.value, el.innerText.trim());
	}
};

export {
	helper,
	directive
};