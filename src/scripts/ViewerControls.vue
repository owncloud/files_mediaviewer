<template>
	<section class="viewer__controls">
		<button class="viewer__control viewer__control--prev">Previous</button>
		<button class="viewer__control viewer__control--next">Next</button>

		<div v-if="this.isVideo">
			<button v-if="this.playing" class="viewer__control viewer__control--pause" @click="pauseVideo()">Pause</button>
			<button v-else class="viewer__control viewer__control--play" @click="playVideo()">Play</button>
		</div>

		<!-- <button class="viewer__control viewer__control--rotate">Rotate</button>
		<button class="viewer__control viewer__control--zoom-in">Zoom in</button>
		<button class="viewer__control viewer__control--zoom-out">Zoom out</button> -->
		<button class="viewer__control viewer__control--close" @click="close()">Close</button>
	</section>
</template>
<script>
export default {
	data () {
		return {
			playing : false,
			obj : null,
			slide : {
				id : null,
				mimetype : '',
				name : 'Placeholder'
			}
		}
	},
	mounted () {
		this.getActiveObject();

		// Initial setting slide
		this.slide = this.$parent.initialFile;

		this.$parent.$on('swiperSlideChange', (slide) => {
			this.slide = slide;
			this.getActiveObject();
		});

		// Keyboard controls for swiping and closing
		$(document).on("keyup", (e) => {
			if (e.which === 27) {
				this.close();
			}
			else if (e.which === 39) {
				this.$parent.swiper.slideNext()
			}
			else if (e.which === 37) {
				this.$parent.swiper.slidePrev()
			}
		});
	},
	methods : {
		close() {
			this.$router.push('/');
		},

		pauseVideo () {
			if (this.slideIsVideo) {
				this.obj.get(0).pause();
				this.playing = false;
			}
		},

		playVideo () {
			if (this.slideIsVideo) {
				this.obj.get(0).play();
				this.playing = true;
			}
		},

		// Fetch current slide for videoplayback manipulation
		getActiveObject () {
			this.obj = $('.swiper-slide-active .viewer__media');
		}
	},
	computed : {
		slideIsVideo () {
			return this.fileType(this.slide.mimetype) === 'video';
		}
	}
}
</script>
