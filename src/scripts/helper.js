const appName = require('../../package.json').name;
var moment = require("moment");

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
		},

		getDisplayTime (time) {
			if (isNaN(time) || time === 0) {
				return "00:00";
			}
			// when switching between previews, currentTime is not rounded somehow
			time = Math.round(time);
			var formatted = moment.duration(time, 'seconds').format("hh:mm:ss", { trim: "mid" });
			return formatted;
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
