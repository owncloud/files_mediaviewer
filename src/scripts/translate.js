const appName = require('../../package.json').name

const mixin = {
	methods: {
		t(string, scope = appName) {
			return t(scope, string);
		}
	}
};

const directive = {
	bind(el, binding) {
		el.innerText = t(binding.value, el.innerText.trim());
	}
};

export {
	mixin,
	directive
};