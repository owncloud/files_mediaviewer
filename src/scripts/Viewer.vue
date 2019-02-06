<template>
	<div class="wrapper">
		<div class="viewer">
			<div class="viewer__container">
				<div class="viewer__wrapper">
					<div class="viewer__slide" v-for="(slide, index) in list" :key="index">
						<template v-if="shouldRender(index)">
							<img v-if="getType(slide) === 'image'" class="viewer__media viewer__media--image" :src="thumbPath(slide)" :alt="slide.name">
							<video v-else-if="getType(slide) === 'video'" class="viewer__media viewer__media--video">
								<source :src="webdavPath(slide)" :type="slide.mimetype">
							</video>
						</template>
						<span v-else>Pending: {{ slide.name }}</span>
					</div>
				</div>
			</div>
			<viewer-controls></viewer-controls>
		</div>
	</div>
</template>
<script>
const config = require('../config.json');

import Swiper from 'swiper';
import ViewerControls from './ViewerControls.vue';

export default {
	name: 'Viewer',
	components : {
		ViewerControls
	},
	data () {
		return {
			swiper : null
		};
	},
	methods: {
		thumbPath (item) {
			let path = OC.joinPaths(
				OC.linkToRemoteBase('dav/files'),
				OC.getCurrentUser().uid,
				item.path,
				item.name
			);

			// path = FileList.filesClient.getBaseUrl() + `${item.path}/${item.name}`;

			let params = $.param({
				c: item.etag,
				x: this.thumbDimensions,
				y: this.thumbDimensions,
				a: 1,
				preview: 1
			});

			return `${path}?${params}`;
		},

		webdavPath (item) {
			let path = OC.joinPaths(
				OC.getRootPath(),
				OC.linkToRemoteBase('webdav'),
				item.path,
				item.name
			);

			return path;
		},

		getType (item) {
			return item.mimetype.split('/')[0];
		},

		// Returns true if i is equal or adjacent to activeIndex
		shouldRender(i) {
			return (this.swiper) ? _.contains([i - 1,i, i + 1], this.swiper.activeIndex) : false;
		}
	},
	mounted () {
		const self = this;

		let initialSlide = _.findWhere(this.list, { name : this.$route.params.file });
			initialSlide = _.findIndex(this.list, initialSlide);

		this.$store.dispatch('setMaxIndex', this.list.length);

		this.swiper = new Swiper('#files_mediaviewer .viewer__container', {
			initialSlide,
			slideClass   : 'viewer__slide',
			wrapperClass : 'viewer__wrapper',
			navigation : {
				prevEl : '.viewer__control--prev',
				nextEl : '.viewer__control--next',
			},
			on : {
				init : function () {
					// Wait for re-render
					self.$nextTick(() => {
						self.$store.dispatch('setActive', {
							activeIndex : this.activeIndex,
							activeMediaItem : self.list[this.activeIndex],
							activeDomNode : $('.swiper-slide-active .viewer__media')
						});
					});
					self.$bus.$emit('swiper:init');
				},
				slideChangeTransitionEnd : function () {
					self.$store.dispatch('setActive', {
						activeIndex : this.activeIndex,
						activeMediaItem : self.list[this.activeIndex],
						activeDomNode : $('.swiper-slide-active .viewer__media')
					});
					self.$router.push({
						name: config.name,
						params: {
							file : self.list[this.activeIndex].name
						}
					});
					self.$bus.$emit('swiper:slideChangeTransitionEnd');

					// --- pause all playing videos
					self.pauseAllVideos();
				}
			}
		});

		this.$bus.$on('swiper:slideTo', (to) => {
			if (to === 'next') {
				this.swiper.slideNext();
			}
			else if (to === 'prev') {
				this.swiper.slidePrev();
			}
			else if (typeof to === 'number') {
				this.swiper.slideTo(to);
			}
		});
	},
	computed: {
		slideIsVideo () {
			return this.$store.getters.itemType === 'video';
		},

		slideIsImage () {
			return this.$store.getters.itemType === 'image';
		},

		list() {
			return _.filter(FileList.files, (file) => {
				return _.contains(config.mimetypes, file.mimetype);
			});
		},

		thumbDimensions() {
			let width = $(window).width();
			switch (true) {
			case (width <= 1024) : return 1024;
			case (width <= 1280) : return 1280;
			case (width <= 1920) : return 1920;
			case (width <= 2160) : return 2160;
			default: return 3840;
			}
		}
	}
};
</script>