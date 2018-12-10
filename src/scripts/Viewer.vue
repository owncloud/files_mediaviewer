<template>
	<div class="wrapper">
		<div class="viewer">
			<button class="viewer--close" @click="close"></button>
			<div class="viewer--container" :style="'background-image:url(' + imgSrc+ ')'"></div>
		</div>
	</div>
</template>

<script>
const app = require('../../package.json');

export default {
	name: "Viewer",
	methods: {
		close() {
			this.$router.push('/');
		}
	},
	computed: {
		file() {
			return _.findWhere(FileList.files, {
				name: this.$route.params.file
			});
		},
		dir() {
			return window[app.name].context.dir;
		},
		list() {
			return _.filter(FileList.files, (file) => {
				return _.contains(app.mimetypes, file.mimetype);
			});
		},
		thumbDimensions() {
			let width = $(window).width();
			switch (true) {
				case (width <= 1024) : return 1024
				case (width <= 1280) : return 1280
				case (width <= 1920) : return 1920
				default: return 2160
			}
		},
		imgSrc() {
			let path = OC.joinPaths(
				OC.getRootPath(),
				'remote.php/dav/files',
				OC.getCurrentUser().uid,
				this.file.path,
				this.file.name
			);

			let params = $.param({
				c: this.file.etag,
				x: this.thumbDimensions,
				y: this.thumbDimensions,
				a: 1,
				preview: 1
			});

			return `/${path}?${params}`;
		}
	}
};
</script>
<style lang="scss">
.viewer {
	position: absolute;
	top: 45px;
	right: 0;
	bottom: 0;
	left: 0;

	&--container {
		position: absolute;
		top: 20px;
		right: 20px;
		bottom: 20px;
		left: 20px;
		background: {
			position: center center;
			repeat: no-repeat;
			size: contain;
		}
	}

	&--close {
		position: absolute;
		display: block;
		top: 20px;
		right: 20px;
		width: 20px;
		height: 20px;
		border: 0 none;
		z-index: 99;
		background: {
			color: transparent !important;
			position: center center;
			repeat: no-repeat;
			image: url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDIyLjEuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkViZW5lXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IgoJIHZpZXdCb3g9IjAgMCAxNyAxNyIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgMTcgMTc7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4KPHN0eWxlIHR5cGU9InRleHQvY3NzIj4KCS5zdDB7ZmlsbDojRkZGRkZGO30KCS5zdDF7ZmlsbDpub25lO30KPC9zdHlsZT4KPGc+Cgk8cG9seWdvbiBjbGFzcz0ic3QwIiBwb2ludHM9IjguNSwxMC42IDIuOSwxNi4yIDAuOCwxNC4xIDYuNCw4LjUgMC44LDIuOSAyLjksMC44IDguNSw2LjQgMTQuMSwwLjggMTYuMiwyLjkgMTAuNiw4LjUgMTYuMiwxNC4xIAoJCTE0LjEsMTYuMiAJIi8+Cgk8cGF0aCBkPSJNMTQuMSwxLjVsMS40LDEuNEw5LjksOC41bDUuNiw1LjZsLTEuNCwxLjRMOC41LDkuOWwtNS42LDUuNmwtMS40LTEuNGw1LjYtNS42TDEuNSwyLjlsMS40LTEuNGw1LjYsNS42TDE0LjEsMS41CgkJIE0xNC4xLDAuMWwtMC43LDAuN0w4LjUsNS43TDMuNiwwLjhMMi45LDAuMUwyLjIsMC44TDAuOCwyLjJMMC4xLDIuOWwwLjcsMC43bDQuOSw0LjlsLTQuOSw0LjlsLTAuNywwLjdsMC43LDAuN2wxLjQsMS40bDAuNywwLjcKCQlsMC43LTAuN2w0LjktNC45bDQuOSw0LjlsMC43LDAuN2wwLjctMC43bDEuNC0xLjRsMC43LTAuN2wtMC43LTAuN2wtNC45LTQuOWw0LjktNC45bDAuNy0wLjdsLTAuNy0wLjdsLTEuNC0xLjRMMTQuMSwwLjFMMTQuMSwwLjEKCQl6Ii8+CjwvZz4KPHBhdGggY2xhc3M9InN0MSIgZD0iTS0zLjUtMy41aDI0djI0aC0yNFYtMy41eiIvPgo8L3N2Zz4K');
		}
	}
}
</style>
