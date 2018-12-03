// -------------------------- Lets remove some stuff we defenitly don't need ---

// Components

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
	routes: []
});

// --------------------------------------------------------------- app setup ---

const files_mediaviewer = new Vue({
	router,
	template: '<router-view></router-view>',
	data: {
		name: 'Mediaviewer'
	}
});

// Japp … we need to wait for a ready DOM
$(document).ready(() => {
	files_mediaviewer.$mount('#files_mediaviewer > div');
});