<template>
	<div class="wrapper">
		<div class="viewer">
			<div class="viewer__container">
				<div class="viewer__wrapper">
					<div class="viewer__slide" v-for="(slide, index) in list" :key="index">
						<div v-if="fileType(slide.mimetype) === 'image'">
							<img v-if="shouldRender(index)" class="viewer__media viewer__media--image" :src="thumbPath(slide)" :alt="slide.name">
						</div>
						<video v-else-if="fileType(slide.mimetype) === 'video'" class="viewer__media viewer__media--video">
							<source :src="webdavPath(slide)" :type="slide.mimetype">
						</video>
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

		// Returns true if i is equal or adjacent to activeIndex
		shouldRender(i) {
			return (this.swiper) ? _.contains([i - 1,i, i + 1], this.swiper.activeIndex) : false;
		}
	},
	mounted () {
		const self = this;

		this.swiper = new Swiper('#files_mediaviewer .viewer__container', {
			initialSlide : _.findIndex(this.list, this.initialFile),
			slideClass : 'viewer__slide',
			wrapperClass : 'viewer__wrapper',
			navigation : {
				prevEl : '.viewer__control--prev',
				nextEl : '.viewer__control--next',
			},
			on : {
				slideChangeTransitionEnd : function () {
					// this scope workaround
					self.$emit('swiperSlideChange', self.list[this.activeIndex]);

					self.$router.push({
						name: config.name ,
						params: {
							file : self.list[this.activeIndex].name
						}
					});
				}
			}
		});
	},
	computed: {

		initialFile () {
			return _.findWhere(this.list, { name : this.$route.params.file });
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