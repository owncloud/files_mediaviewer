<template>
	<section class="viewer__controls viewer__controls--image">
		<span class="viewer__control__nametag" v-text="name"></span>
		<nav-controls class="viewer__controls__subgroup">
			<!-- Swipe controls -->
		</nav-controls>
		<div class="viewer__controls__subgroup">
			<button class="viewer__control icon__rotate_90_degrees_ccw" @click="rotate(rotation - 90)" v-translate>Rotate 90° counterclockwise</button>
			<button class="viewer__control icon__zoom_in" @click="scale(scaling + .2)" v-translate>Zoom in</button>
			<button class="viewer__control icon__zoom_out" @click="scale(scaling - .2)" v-translate>Zoom out</button>
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
			// We don't want to go overboard here
			if (factor < .25 || factor > 5) {
				return false;
			}

			this.scaling = factor;
			this.transform();
		},

		transform () {
			// We need the jQuery element here
			this.$store.state.activeHTMLElement.css('transform', `rotate(${this.rotation}deg) scale(${this.scaling})`);
		},

		resetTransform () {
			this.rotation = 0;
			this.scaling = 1;
		},

		checkImageState () {
			if (!this.$image || !this.isActive)
			{return;}

			this.$store.dispatch('setLoading');

			let recheck = setInterval( () => {
				if (this.$image.complete) {
					this.$store.dispatch('setReady');
					clearInterval(recheck);
				}
			}, 1000);

			if (Object.keys(this.$image.getEventListeners()).length === 0) {
				this.$image.addEventListener('error', () => {
					OC.Notification.show( this.t('Failed to load image data'), {type: 'error', timeout: 15})
				})
			}
		}
	},
	mounted () {
		this.$nextTick( () => {
			this.checkImageState();
		});

		this.$bus.$on('swiper:slideChangeTransitionEnd', () => {
			this.checkImageState();
			this.resetTransform();
		});
	},
	computed : {
		$image () {
			return this.$store.getters.HTMLImageElement;
		},
		name () {
			return this.$store.getters.itemName;
		}
	}
};
</script>
