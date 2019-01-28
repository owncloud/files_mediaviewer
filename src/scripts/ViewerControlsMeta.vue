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
				$(document).off('keyup');
				this.close();
			}
		});
	},
	methods : {
		close() {
			this.$router.push('/');
		},
		download () {
			alert('I don\'t know how to trigger a download :-(');
		}
	}
}
</script>
