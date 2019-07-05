export default {
	state: {
		activeIndex: 0,
		maxIndex : 0,
		activeMediaItem : {},
		activeHTMLElement : null,
		isLoading : false,
		isInTransition : false,
		video : {
			isPaused : true,
			isMuted : false,
			isFullscreen : false
		}
	},
	getters : {
		itemName (state) {
			if (state.activeMediaItem.length === 0) {
				return 'Loading ...';
			}
			return state.activeMediaItem.name;
		},
		itemType (state) {
			if (!state.activeMediaItem.mimetype) {
				return null;
			}
			return state.activeMediaItem.mimetype.split('/')[0];
		},
		HTMLImageElement (state) {
			if (state.activeHTMLElement === null)
			{return null;}

			return (state.activeHTMLElement.get(0) instanceof HTMLImageElement) ? state.activeHTMLElement.get(0) : false;
		},
		HTMLVideoElement (state) {
			if (state.activeHTMLElement === null)
			{return null;}

			return (state.activeHTMLElement.get(0) instanceof HTMLVideoElement) ? state.activeHTMLElement.get(0) : false;
		}
	},
	mutations: {
		setActiveIndex (state, index) {
			state.activeIndex = parseInt(index);
		},
		setActiveMediaItem (state, item) {
			state.activeMediaItem = item;
		},
		setActiveHTMLElement (state, node) {
			state.activeHTMLElement = (typeof node === 'object') ? node : null;
		},
		setLoadingState(state, setTo) {
			state.isLoading = setTo;
		},
		setMaxIndex(state, max) {
			state.maxIndex = (typeof max === 'number') ? max : parseInt(max);
		},
		setVideoState(state, payload) {
			state.video = _.extend(state.video, payload);
		},
		setTransitionState(state, setTo) {
			state.isInTransition = setTo;
		},
		resetAll(state) {
			state.activeIndex= 0;
			state.maxIndex = 0;
			state.activeMediaItem = {};
			state.isLoading = false;
			state.isInTransition = false;
			state.video = {
				isPaused : true,
				isMuted : false,
				isFullscreen : false
			};
		}
	},
	actions : {
		setActive(context, payload) {
			context.commit('setActiveIndex', payload.activeIndex);
			context.commit('setActiveMediaItem', payload.activeMediaItem);
			context.commit('setActiveHTMLElement', payload.activeHTMLElement);
		},
		setLoading(context) {
			context.commit('setLoadingState', true);
		},
		setInTransition(context) {
			context.commit('setTransitionState', true);
		},
		setTransitionEnd(context) {
			context.commit('setTransitionState', false);
		},
		setReady(context) {
			context.commit('setLoadingState', false);
		},
		setMaxIndex(context, payload) {
			context.commit('setMaxIndex', payload);
		},
		setVideoState(context, payload) {
			context.commit('setVideoState', payload);
		},
		resetAll(context) {
			context.commit('resetAll');
		}
	}
};