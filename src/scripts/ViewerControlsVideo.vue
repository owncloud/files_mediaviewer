<template>
	<div>
		<transition name="fade">
			<button v-show="isPaused && !isLoading && !isInTransition" class="viewer__video-overlay icon__play_circle" @click="togglePlay()" aria-hidden></button>
		</transition>
		<section class="viewer__controls viewer__controls--video">
			<span class="viewer__control__nametag" v-text="name"></span>
			<div class="viewer__control__scrubber" @click="skipTo(mousePos)">
				<div :style="scrubberPosition"></div>
			</div>
			<nav-controls class="viewer__controls__subgroup">
				<!-- Swipe controls -->
			</nav-controls>
			<div class="viewer__controls__subgroup">
				<button class="viewer__control icon__replay" :disabled="currentTime === 0" @click="skipTo(0)" v-translate>Replay</button>
				<button class="viewer__control icon__play" :class="[isPaused ? 'icon__play' : 'icon__pause']" @click="togglePlay()" v-translate>Play</button>
				<button class="viewer__control" :class="[isMuted ? 'icon__volume_down' : 'icon__volume_up']" @click="toggleSound()" v-translate>Mute</button>
				<button class="viewer__control icon__fullscreen" v-if="documentFullscreenEnabled" @click="requestFullscreen()" v-translate>Fullscreen</button>
			</div>
			<meta-controls class="viewer__controls__subgroup">
				<!-- Swipe controls -->
			</meta-controls>
		</section>
	</div>
</template>
<script>
import ViewerControlsNavigate from './ViewerControlsNavigate.vue';
import ViewerControlsMeta from './ViewerControlsMeta.vue';
import './geteventlisteners';

export default {
	name : 'VideoControls',
	components : {
		navControls  : ViewerControlsNavigate,
		metaControls : ViewerControlsMeta
	},
	data () {
		return {
			currentTime : {
				type    : Number,
				default : 0
			},
			duration    : {
				type    : Number,
				default : 0
			},
			mousePos    : {
				type    : Number,
				default : 0
			}
		};
	},
	methods : {
		togglePlay () {
			if (this.$video.paused) {
				this.$video.play();
			}
			else {
				this.$video.pause();
			}
		},

		toggleSound () {
			if (this.$video.muted) {
				this.$video.muted = false;
				this.$store.dispatch('setVideoState', {
					isMuted : false
				});
			}
			
			else {
				this.$video.muted = true;
				this.$store.dispatch('setVideoState', {
					isMuted : true
				});
			}
		},

		requestFullscreen () {
			if (document.fullscreenEnabled) this.$video.requestFullscreen();
			else if (document.webkitFullscreenEnabled) this.$video.webkitRequestFullscreen();
			else if (document.msFullscreenEnabled) this.$video.msRequestFullscreen();
			else return false
		},

		skipTo (seconds) {
			this.duration           = this.$video.duration;
			this.$video.currentTime = seconds;
			this.$store.dispatch('setLoading');
		},


		init () {
			if (!this.$video || !this.isActive)
			{return;}

			this.duration    = this.$video.duration;
			this.currentTime = this.$video.currentTime;

			this.$store.dispatch('setVideoState', {
				isMuted : false
			});

			if (Object.keys(this.$video.getEventListeners()).length === 0) {
				this.$video.addEventListener('loadstart', this.handleLoadstart);
				this.$video.addEventListener('canplay', this.handleCanPlay);
				this.$video.addEventListener('pause', this.handlePause);
				this.$video.addEventListener('playing', this.handlePlaying);
				this.$video.addEventListener('stalled', this.handlePause);
				this.$video.addEventListener('timeupdate', this.handleTimeupdate);
			}

			this.$scrubber.addEventListener('mousemove', (event) => {
				let refPos = this.$scrubber.getBoundingClientRect(),
					pct    = (100 / refPos.width) * (event.pageX - refPos.left);

				this.mousePos = Math.round(pct / 100 * this.duration);
			});
		},

		handleLoadstart () {
			this.$store.dispatch('setLoading');
		},

		handleCanPlay () {
			this.$store.dispatch('setReady');
		},

		handlePause () {
			this.$store.dispatch('setVideoState', {
				source : 'addEventListener handlePause',
				isPaused : true
			});
		},

		handlePlaying () {
			this.duration = this.$video.duration;
			this.$store.dispatch('setVideoState', {
				source : 'addEventListener handlePlaying',
				isPaused : false
			});
		},

		handleTimeupdate () {
			this.currentTime = Math.round(this.$video.currentTime);
		},
	},
	mounted () {
		this.$bus.$on('swiper:slideChangeTransitionEnd', () => {
			this.init();
		});
		this.$bus.$on('swiper:init', () => {
			this.init();
		});
	},
	computed : {
		$video () {
			return this.$store.getters.HTMLVideoElement;
		},
		name () {
			return this.$store.getters.itemName;
		},

		isPaused () {
			return this.$store.state.video.isPaused;
		},

		isMuted () {
			return this.$store.state.video.isMuted;
		},

		isLoading () {
			return this.$store.state.isLoading;
		},

		isInTransition () {
			return this.$store.state.isInTransition;
		},

		documentFullscreenEnabled () {
			return document.fullscreenEnabled || document.webkitFullscreenEnabled || document.msFullscreenEnabled
		},

		scrubberPosition () {
			let width = (this.currentTime === 0) ? 0 : (100 / this.duration) * this.currentTime;

			if (width > 100) {
				width = 100;
			}
			else if (isNaN(width)) {
				width = 0;
			}
			else {
				width = Math.round(width);
			}

			return `width:${width}%`;
		},
		$scrubber () {
			return $('.viewer__control__scrubber').get(0);
		}
	}
};
</script>
