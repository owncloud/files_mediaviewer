const appName = require('../../package.json').name;

// Components

import Viewer from './Viewer.vue';

// Libs

import Vue from 'vue/dist/vue.js';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

// --- Global Components

import {
	mixin as t_mixin,
	directive
} from './translate.js';

Vue.mixin(t_mixin);
Vue.directive('translate', directive);

const router = new VueRouter({
	routes: [{
		path: '/',
		component: {
			name: 'Hibernate',
			template : '<!-- Hibernating Mediaviewer -->'
		}
	}, {
		path: `/${appName}/:file`,
		name: 'Viewer',
		component: Viewer
	}]
});

// --------------------------------------------------------------- app setup ---

const files_mediaviewer = new Vue({
	router,
	template: '<router-view></router-view>',
	data: {
		name: 'Mediaviewer',
		initialFile : window[appName].file
	}
});

// Japp … we need to wait for a ready DOM
$(document).ready(() => {
	files_mediaviewer.$mount('#files_mediaviewer > div');

	// Free window space
	delete window[appName];
});