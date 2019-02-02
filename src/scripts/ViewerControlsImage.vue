<template>
	<section class="viewer__controls viewer__controls--image">
		<span class="viewer__control__nametag" v-text="name"></span>
		<nav-controls class="viewer__controls__subgroup">
			<!-- Swipe controls -->
		</nav-controls>
		<div class="viewer__controls__subgroup">
			<button class="viewer__control icon__rotate_90_degrees_ccw" @click="rotate(rotation - 90)">Rotate 90° counterclockwise</button>
			<button class="viewer__control icon__zoom_in" @click="scale(scaling + .2)">Zoom in</button>
			<button class="viewer__control icon__zoom_out" @click="scale(scaling - .2)">Zoom out</button>
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
	name : 'ImageControls',
	components : {
		navControls  : ViewerControlsNavigate,
		metaControls : ViewerControlsMeta
	},
	data () {
		return {
			rotation : 0,
			scaling  : 1
		};
	},
	methods : {
		rotate (deg) {
			this.rotation = deg;
			this.transform();
		},

		scale (factor) {
			this.scaling = factor;
			this.transform();
		},

		transform () {
			this.image.css('transform', `rotate(${this.rotation}deg) scale(${this.scaling})`);
		},

		resetTransform () {
			this.rotation = 0;
			this.scaling = 1;
		},

		checkImageState () {
			if (!this.image.get(0).complete) {

				this.$store.dispatch('setLoading');

				this.image.get(0).decode().then(() => {
					this.$store.dispatch('setReady');
				});
			}
		}
	},
	mounted () {
		this.$nextTick( () => {
			this.checkImageState();
		});

		this.$bus.$on('swiper:slideChangeTransitionEnd', () => {
			this.checkImageState();
		});
	},
	computed : {
		image () {
			return this.$store.state.activeDomNode;
		},
		name () {
			return this.$store.getters.itemName;
		}
	}
};
</script>
