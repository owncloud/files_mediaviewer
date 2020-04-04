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
		},

		getDisplayTime (time) {
			if (time === 0) return "00:00";

			// when switching between previews, currentTime is not rounded somehow
			time = Math.round(time);

			let hour = Math.floor(time / 3600);
			let minute = Math.floor(time % 3600 / 60);
			let second = time % 60;

			let times = [minute, second];
			if ( hour > 0 ) times = [hour, minute, second];
			times = times.map( el => el < 10 ? (el+"").padStart(2, "0") : el);

			return times.join(":");
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
