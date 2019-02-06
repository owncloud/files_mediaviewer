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
			<button class="viewer__control icon__replay_10" :disabled="currentTime === 0" @click="skipTo(0)">Replay</button>
			<button class="viewer__control icon__play" :class="[state === 'paused' ? 'icon__play' : 'icon__pause']" @click="togglePlay()">Play</button>
			<button class="viewer__control" :class="[audio === 'on' ? 'icon__volume_up' : 'icon__volume_down']" @click="toggleSound()">Mute</button>
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
			state       : 'paused',
			audio       : 'on',

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
			if (this.video.paused) {
				this.video.play();
			}
			else {
				this.video.pause();
			}
		},

		toggleSound () {
			if (this.video.muted) {
				this.video.muted = false;
				this.audio = 'on';
			}
			
			else {
				this.video.muted = true;
				this.audio = 'off';
			}
		},

		skipTo (seconds) {
			this.duration          = this.video.duration;
			this.video.currentTime = seconds;
			this.$store.dispatch('setLoading');
		},

		init () {

			if (!this.video)
				return;

			this.duration    = this.video.duration;
			this.currentTime = this.video.currentTime;
			
			this.video.muted = false;
			this.audio = 'on';

			this.video.addEventListener('loadstart', () => {
				this.$store.dispatch('setLoading');
			});

			this.video.addEventListener('canplay', () => {
				this.$store.dispatch('setReady');
			});

			this.video.addEventListener('pause', () => {
				this.state = 'paused';
			});

			this.video.addEventListener('playing', () => {
				this.duration = this.video.duration;
				this.state    = 'playing';
			});

			this.video.addEventListener('timeupdate', () => {
				this.currentTime = Math.round(this.video.currentTime);
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
		video () {
			return this.$store.getters.video;
		},
		name () {
			return this.$store.getters.itemName;
		},
		scrubberPosition () {
			let width = (this.currentTime === 0) ? 0 : (100 / this.duration) * this.currentTime;
			
			if (width > 100)
			{width = 100;}

			return 'width:' + width + '%';
		},
		$scrubber () {
			return $('.viewer__control__scrubber').get(0);
		}
	}
};
</script>
