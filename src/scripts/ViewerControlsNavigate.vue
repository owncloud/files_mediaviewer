<template>
	<div>
		<button class="viewer__control icon__prev" @click="slideTo('prev')" v-translate>Previous</button>
		<span class="viewer__control__count">{{ activeSlide }} {{ t('of') }} {{ lastSlide }}</span>
		<button class="viewer__control icon__next" @click="slideTo('next')" v-translate>Next</button>
	</div>
</template>
<script>
export default {
	computed : {
		activeSlide () {
			return this.$store.state.activeIndex + 1;
		},
		lastSlide () {
			return this.$store.state.maxIndex;
		}
	},
	methods : {
		slideTo (to) {
			this.$bus.$emit('swiper:slideTo', to);
		}
	}
};
</script>
