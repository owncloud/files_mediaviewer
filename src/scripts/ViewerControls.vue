<template>
	<section class="viewer__controls">
		<div class="viewer__controls__subgroup">
			<button class="viewer__control viewer__control--prev">Previous</button>
			<span class="viewer__control__count">{{ activeIndex }} of {{ slidesCount }}</span>
			<button class="viewer__control viewer__control--next">Next</button>
		</div>
		<div v-if="this.slideIsImage" class="viewer__controls__subgroup">
			<button class="viewer__control viewer__control--rotate-right" @click="rotate(image.rotation + 90)">Rotate right</button>
			<button class="viewer__control viewer__control--rotate-left" @click="rotate(image.rotation - 90)">Rotate left</button>
		</div>		
		<div v-if="this.slideIsImage" class="viewer__controls__subgroup">
			<button class="viewer__control viewer__control--zoom-in" @click="scale(image.scale + .2)">Zoom in</button>
			<button class="viewer__control viewer__control--zoom-out" @click="scale(image.scale - .2)">Zoom out</button>
		</div>
		<div v-if="this.slideIsVideo" class="viewer__controls__subgroup">
			<button class="viewer__control viewer__control--replay-10" @click="skipVideo(-10)">Replay last 10 seconds</button>
			<button v-if="this.video.state === 'paused'" class="viewer__control viewer__control--play" @click="playVideo()">Play</button>
			<button v-if="this.video.state === 'playing'" class="viewer__control viewer__control--pause" @click="pauseVideo()">Pause</button>
			<button class="viewer__control viewer__control--forward-10" @click="skipVideo(10)">Skip ahead 10 seconds</button>
		</div>
		<span class="viewer__control__nametag" v-text="slide.name"></span>
		<button class="viewer__control viewer__control--close" @click="close()">Close</button>
	</section>
</template>
<script>
export default {
	data () {
		return {
			obj : null,
			slide : {
				id : null,
				mimetype : '',
				name : 'Placeholder'
			},
			video : {
				state : 'paused'
			},
			image : {
				rotation : 0,
				scale : 1
			}
		};
	},
	mounted () {
		this.getActiveObject();

		// Initial setting slide
		this.slide = this.$parent.initialFile;

		this.$parent.$on('swiperSlideChange', (slide) => {
			this.slide = slide;
			this.obj = this.getActiveObject();
			this.video.state = 'paused';
			
			this.resetTransform();
			this.videoTimeline();

			this.getWaitingImages().removeAttr('style');
			this.getWaitingVideos().get(0).pause();
		});

		// Keyboard controls for swiping and closing
		$(document).on('keyup', (e) => {
			if (e.which === 27) {
				this.close();
			}
			else if (e.which === 39) {
				this.$parent.swiper.slideNext();
			}
			else if (e.which === 37) {
				this.$parent.swiper.slidePrev();
			}
		});
	},
	methods : {
		close() {
			this.$router.push('/');
		},

		pauseVideo () {
			if (this.slideIsVideo) {
				let video = this.obj.get(0);
				video.pause();
				this.video.state = 'paused';
			}
		},

		playVideo () {
			if (this.slideIsVideo) {
				let video = this.obj.get(0);
				video.play();
				this.video.duration = video.duration;
				this.video.state = 'playing';
			}
		},

		skipVideo (seconds) {
			let video = this.obj.get(0);
			video.currentTime = video.currentTime + seconds;
		},

		videoTimeline () {
			if (this.slideIsVideo) {
				let video = this.obj.get(0);

				video.addEventListener('timeupdate', () => {
					this.video.currentTime = video.currentTime
				})
			}
		},

		rotate (deg) {
			this.image.rotation = deg;
			this.transform();
		},

		scale (factor) {
			this.image.scale = factor;
			this.transform();
		},

		transform () {
			this.getActiveObject().css('transform', `rotate(${this.image.rotation}deg) scale(${this.image.scale})`);
		},

		resetTransform () {
			this.image.rotation = 0;
			this.image.scale = 1;
		}
	},
	computed : {
		slideIsVideo () {
			return this.fileType(this.slide.mimetype) === 'video';
		},

		slideIsImage () {
			return this.fileType(this.slide.mimetype) === 'image';
		},

		videoTimelinePosition () {
			let width = (this.video.currentTime === 0) ? 0 : (100 / this.video.duration) * this.video.currentTime;
			return "width:" + width + "%";
		},

		slidesCount () {
			if (!this.$parent.swiper)
				return 0;
			
			return this.$parent.swiper.slides.length;
		},

		activeIndex () {
			if (!this.$parent.swiper)
				return 0;

			return this.$parent.swiper.activeIndex + 1;
		}
	}
};
</script>
