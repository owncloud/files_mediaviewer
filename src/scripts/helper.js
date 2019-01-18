const appName = require('../../package.json').name

const helper = {
	methods: {
		t(string, scope = appName) {
			return t(scope, string);
		},
		
		fileType(mimetype) {
			return mimetype.split('/')[0];
		},

		fileExtension(mimetype) {
			return mimetype.split('/')[1];
		}
	}
};

const directive = {
	bind(el, binding) {
		el.innerText = t(binding.value, el.innerText.trim());
	}
};

export {
	helper,
	directive
};