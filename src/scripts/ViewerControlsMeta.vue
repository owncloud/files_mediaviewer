<template>
	<div>
		<button class="viewer__control icon__download" @click="download()" v-translate>Download</button>
		<button class="viewer__control icon__close" @click="closeViewer()" v-translate>Close</button>
	</div>
</template>
<script>
export default {
	mounted () {
		$(document).on('keyup', (e) => {
			if (e.which === 27) {
				this.close();
			}
		});
	},
	methods : {
		// @TODO: make path creation a helper
		download () {
			let webdavPath;
			let item = this.$store.state.activeMediaItem;

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

			OC.redirect(webdavPath);
		}
	}
};
</script>
