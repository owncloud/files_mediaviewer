<template>
	<div class="wrapper">
		<div class="viewer">
			<div class="viewer__container">
				<div class="viewer__wrapper">
					<div class="viewer__slide" v-for="(slide, index) in list" :key="index">
						<img v-if="getType(slide) === 'image'" class="viewer__media viewer__media--image" :src="thumbPath(index, slide)" :alt="slide.name">
						<video v-if="getType(slide) === 'video'" class="viewer__media viewer__media--video" :controls="isFullscreen" :class="{ 'viewer__media--video-paused' : isPaused }">
							<source :src="webdavPath(index, slide)" :type="slide.mimetype">
						</video>
					</div>
				</div>
			</div>
			<viewer-controls></viewer-controls>
		</div>
	</div>
</template>
<script>
import ViewerControls from './ViewerControls.vue';

export default {
	name: 'Viewer',
	components : {
		ViewerControls
	},
	data () {
		return {
			swiper : {
				activeIndex : 0
			},
			list : null
		};
	},
	methods: {
		thumbPath (i, item) {
			let webdavPath;

			if (!this.shouldRender(i))
				return "data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==";

			if (this.isPublic) {
				let path   = OC.filePath('files_sharing', 'ajax', 'publicpreview.php');
				let params = OC.buildQueryString({
					file : item.path + '/' + item.name,
					c: item.etag,
					x: this.thumbDimensions,
					y: this.thumbDimensions,
					a: 1,
					t : this.sharingToken
				})

				webdavPath = `${path}?${params}`;
			}

			else {
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

				webdavPath = encodeURI(`${path}?${params}`);
			}

			return webdavPath;
		},

		webdavPath (i, item) {
			let webdavPath;

			if (this.isPublic) {
				let path   = OC.generateUrl(`/s/${this.sharingToken}/download`);
				let params = OC.buildQueryString({
					path: item.path,
					files: item.name
				});

				webdavPath = `${path}?${params}`;
			}

			else {
				let path = OC.joinPaths(
					OC.linkToRemoteBase('webdav'),
					item.path,
					item.name
				);

				webdavPath = path;
			}

			return webdavPath;
		},

		getType (item) {
			return item.mimetype.split('/')[0];
		},

		// Returns true if i is equal or adjacent to activeIndex
		shouldRender(i) {
			return (this.swiper) ? _.contains([i - 1,i, i + 1], this.swiper.activeIndex) : false;
		},

		fetchFileList(callback) {
			
			let fetch = new Promise( (resolve, reject) => {

				let list = _.filter(FileList.files, (file) => {
					return _.contains(this.$app.config.mimetypes, file.mimetype);
				})

				if (list.length === 0) {
					reject('list length is 0');
					return;
				}
				this.list = list;
				this.$store.dispatch('setMaxIndex', list.length);
				resolve(list);
			})
			
			fetch.then((list) => {
				if (typeof callback === 'function') {
					callback(list);
				}

				return;
			});
		},
	},

	activated () {
		// Swiper is a bit tricky
		// when it comes to "this" context
		const self = this;

		this.fetchFileList((fileList) => {
			let initialSlide = _.findWhere(fileList, { name : this.$route.params.file });
				initialSlide = _.findIndex(fileList, initialSlide);

			this.swiper = new this.$wiper('#files_mediaviewer .viewer__container', {
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
								activeMediaItem : fileList[this.activeIndex],
								activeHTMLElement : $('.swiper-slide-active .viewer__media')
							});
						});
						self.$bus.$emit('swiper:init');
					},
					slideChangeTransitionStart : function() {
						self.$store.dispatch('setInTransition');
						self.$store.dispatch('setReady');
					},
					slideChangeTransitionEnd : function () {
						self.$store.dispatch('setTransitionEnd');
						self.$store.dispatch('setActive', {
							activeIndex : this.activeIndex,
							activeMediaItem : fileList[this.activeIndex],
							activeHTMLElement : $('.swiper-slide-active .viewer__media')
						});
						self.$router.push({
							params: {
								file : fileList[this.activeIndex].name
							}
						});
						self.$bus.$emit('swiper:slideChangeTransitionEnd');

						// --- pause all playing videos
						self.pauseAllVideos();
					}
				}
			});
		});
	},

	deactivated () {
		this.swiper.destroy()
		this.list = null;
	},

	mounted () {
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

		document.addEventListener("fullscreenchange", () => {
			this.$store.dispatch('setVideoState', {
				isFullscreen : document.fullscreen
			});
		});
	},

	computed: {
		slideIsVideo () {
			return this.$store.getters.itemType === 'video';
		},

		slideIsImage () {
			return this.$store.getters.itemType === 'image';
		},

		isFullscreen () {
			return this.$store.state.video.isFullscreen;
		},

		isPaused () {
			return this.$store.state.video.isPaused;
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