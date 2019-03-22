<template>
	<div>
		<component :is="controlComponent"></component>
		<spinner :show="isLoading"></spinner>
	</div>
</template>
<script>
import ViewerControlsVideo   from './ViewerControlsVideo.vue';
import ViewerControlsImage   from './ViewerControlsImage.vue';
export default {
	name : 'Controls',
	components : {
		ViewerControlsVideo,
		ViewerControlsImage
	},
	mounted () {
		// Keyboard controls for swiping and closing
		$(document).on('keyup', (e) => {
			if (e.which === 39) {
				this.$bus.$emit('swiper:slideTo', 'next');
			}
			else if (e.which === 37) {
				this.$bus.$emit('swiper:slideTo', 'prev');
			}
		});

		this.$bus.$on('swiper:slideChangeTransitionEnd', () => {
			// Reset styles on transformed images
			$('.viewer__media--image[style]').removeAttr('style');
		});

	},
	computed : {
		controlComponent () {
			let component;

			if (this.slideIsVideo) {
				component = 'ViewerControlsVideo';
			}
			else if (this.slideIsImage) {
				component = 'ViewerControlsImage';
			}

			return component;
		},

		isLoading () {
			return this.$store.state.isLoading;
		},

		slideIsVideo () {
			return this.$store.getters.itemType === 'video';
		},

		slideIsImage () {
			return this.$store.getters.itemType === 'image';
		}
	}
};
</script>
