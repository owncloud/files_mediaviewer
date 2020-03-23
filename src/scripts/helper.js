const appName = require('../../package.json').name;

const helper = {
	methods: {
		t(string, scope = appName) {
			return t(scope, string);
		},

		$gettext(string, scope = appName) {
			return t(scope, string);
		},

		pauseAllVideos () {
			$('.viewer__slide .viewer__media--video').each(function() {
				$(this).get(0).pause();
			});
		},

		closeViewer () {
			this.$router.push('/');
		}
	},
	computed : {
		isActive () {
			return (this.$route.params.file) ? true : false;
		},
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
		console.log(binding.value, el.innerText.trim());
		el.innerText = t('files_mediaviewer', el.innerText.trim());
	}
};

export {
	helper,
	directive
};
