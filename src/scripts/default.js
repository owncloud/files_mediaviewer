import app from './setup.js';

// Components

import Viewer from './Viewer.vue';
import Spinner from './ViewerSpinner.vue';

// Libs

import Swiper from 'swiper';

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

Vue.prototype.$bus     = new Vue();
Vue.prototype.$wiper   = Swiper;
Vue.prototype.$app     = app;

const router = new VueRouter({
	routes: [{
		path: '/',
		component: {
			name: 'Hibernate',
			template : '<!-- Sleep warm, sleep tight, when you turn off the light. -->'
		}
	}, {
		path: `/${app.name}/:file`,
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


import IE11RouterFix from './ie11routerfix';

// Japp … we need to wait for a ready DOM
$(document).ready(() => {
	new Vue({
		el : '#files_mediaviewer > div',
		router,
		store : Store,
		template: '<keep-alive><router-view>Was geht hier?</router-view></keep-alive>',
		mixins : [IE11RouterFix],
		data: {
			name: 'Mediaviewer'
		}
	});
});