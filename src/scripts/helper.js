const appName = require('../../package.json').name;

const helper = {
	methods: {
		t(string, scope = appName) {
			return t(scope, string);
		},

		pauseAllVideos () {
			$('.viewer__slide .viewer__media--video').each(function() {
				$(this).get(0).pause();
			});
		}
	},
	computed : {
		isPublic () {
			return typeof OCA.Sharing.PublicApp === 'object';
		},
		sharingToken () {
			return (this.isPublic) ? $('#sharingToken').val() : null;
		},
		documentFullscreenEnabled () {
			return document.fullscreenEnabled;
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