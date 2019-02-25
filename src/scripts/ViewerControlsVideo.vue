<template>
	<section class="viewer__controls viewer__controls--video">
		<span class="viewer__control__nametag" v-text="name"></span>
		<div class="viewer__control__scrubber" @click="skipTo(mousePos)">
			<div :style="scrubberPosition"></div>
		</div>
		<nav-controls class="viewer__controls__subgroup">
			<!-- Swipe controls -->
		</nav-controls>
		<div class="viewer__controls__subgroup">
			<button class="viewer__control icon__replay_10" :disabled="currentTime === 0" @click="skipTo(0)" v-translate>Replay</button>
			<button class="viewer__control icon__play" :class="[isPaused ? 'icon__play' : 'icon__pause']" @click="togglePlay()" v-translate>Play</button>
			<button class="viewer__control" :class="[isMuted ? 'icon__volume_down' : 'icon__volume_up']" @click="toggleSound()" v-translate>Mute</button>
			<button class="viewer__control icon__fullscreen" v-if="documentFullscreenEnabled" @click="requestFullscreen()" v-translate>Fullscreen</button>
		</div>
		<meta-controls class="viewer__controls__subgroup">
			<!-- Swipe controls -->
		</meta-controls>
	</section>
</template>
<script>
import ViewerControlsNavigate from './ViewerControlsNavigate.vue';
import ViewerControlsMeta from './ViewerControlsMeta.vue';

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
			this.$video.requestFullscreen();
		},

		skipTo (seconds) {
			this.duration          = this.$video.duration;
			this.$video.currentTime = seconds;
			this.$store.dispatch('setLoading');
		},

		init () {

			if (!this.$video)
				return;

			this.duration    = this.$video.duration;
			this.currentTime = this.$video.currentTime;

			this.$store.dispatch('setVideoState', {
				isMuted : false
			});

			this.$video.addEventListener('loadstart', () => {
				this.$store.dispatch('setLoading');
			});

			this.$video.addEventListener('canplay', () => {
				this.$store.dispatch('setReady');
			});

			this.$video.addEventListener('pause', () => {
				this.$store.dispatch('setVideoState', {
					isPaused : true
				});
			});

			this.$video.addEventListener('playing', () => {
				this.duration = this.$video.duration;
				this.$store.dispatch('setVideoState', {
					isPaused : false
				});
			});

			this.$video.addEventListener('stalled', () => {
				this.$store.dispatch('setLoading');
				console.warn(`Loading ${this.name} stalled!`);
			});

			this.$video.addEventListener('timeupdate', () => {
				this.currentTime = Math.round(this.$video.currentTime);
			});

			this.$scrubber.addEventListener('mousemove', (event) => {
				let refPos = this.$scrubber.getBoundingClientRect(),
					pct    = (100 / refPos.width) * (event.pageX - refPos.x);

				this.mousePos = Math.round(pct / 100 * this.duration);
			});
		},
	},
	mounted () {
		this.$bus.$on('swiper:slideChangeTransitionEnd', () => {
			this.init();
		});
	},
	created () {
		this.$nextTick(() => {
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

		scrubberPosition () {
			let width = (this.currentTime === 0) ? 0 : (100 / this.duration) * this.currentTime;
			
			if (width > 100)
			{width = 100;}

			return `width:${width}%`;
		},
		$scrubber () {
			return $('.viewer__control__scrubber').get(0);
		}
	}
};
</script>
