const appName = require('../../package.json').name;

// Components

import Viewer from './Viewer.vue';
import Spinner from './ViewerSpinner.vue';

// Libs

import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

// --- Global Components

import {
	helper,
	directive
} from './helper.js';


Vue.mixin(helper);
Vue.directive('translate', directive);
Vue.component('spinner', Spinner);

Vue.prototype.$bus = new Vue();

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

// ------------------------------------------------------------------- store ---

import Vuex from 'vuex';
Vue.use(Vuex);

import store from './store.js';
const Store = new Vuex.Store(store);

// --------------------------------------------------------------- app setup ---

const files_mediaviewer = new Vue({
	el : '#files_mediaviewer > div',
	router,
	store : Store,
	template: '<router-view></router-view>',
	data: {
		name: 'Mediaviewer'
	}
});

// Japp … we need to wait for a ready DOM
$(document).ready(() => {
	files_mediaviewer.$mount('');
});