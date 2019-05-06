export default {
	methods: {
		hashChangeHandler () { 
			this.$router.push(window.location.hash.substring(1, window.location.hash.length));
		},
		isIE11 () {
			return !!window.MSInputMethodContext && !!document.documentMode;
		}
	},
	mounted () { 
		if ( this.isIE11() ) {
			window.addEventListener('hashchange', this.hashChangeHandler);
		}
	},
	destroyed () {
		if ( this.isIE11() ) {
			window.removeEventListener('hashchange', this.hashChangeHandler);
		}
	}
};