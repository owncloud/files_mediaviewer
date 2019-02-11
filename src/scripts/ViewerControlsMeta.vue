<template>
	<div>
		<button class="viewer__control icon__download" @click="download()">Download</button>
		<button class="viewer__control icon__close" @click="close()">Close</button>
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
		close() {
			this.$router.push('/');
		},
		download () {
			let item = this.$store.state.activeMediaItem;
			let path = OC.joinPaths(
				OC.linkToRemoteBase('dav/files'),
				OC.getCurrentUser().uid,
				item.path,
				item.name
			);

			OC.redirect(path);
		}
	}
};
</script>
