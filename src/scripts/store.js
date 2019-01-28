export default {
	state: {
		activeIndex: 0,
		maxIndex : 0,
		activeMediaItem : {},
		activeDomNode : null,
		isLoading : false
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
		}
	},
	mutations: {
		setActiveIndex (state, index) {
			state.activeIndex = parseInt(index);
		},
		setActiveMediaItem (state, item) {
			state.activeMediaItem = item;
		},
		setActiveDomNode (state, node) {
			state.activeDomNode = (typeof node === 'object') ? node : null;
		},
		setLoadingState(state, setTo) {
			state.isLoading = setTo;
		},
		setMaxIndex(state, max) {
			state.maxIndex = (typeof max === 'number') ? max : parseInt(max);
		}
	},
	actions : {
		setActive(context, payload) {
			context.commit('setActiveIndex', payload.activeIndex);
			context.commit('setActiveMediaItem', payload.activeMediaItem);
			context.commit('setActiveDomNode', payload.activeDomNode);
		},
		setLoading(context) {
			context.commit('setLoadingState', true);
		},
		setReady(context) {
			context.commit('setLoadingState', false);
		},
		setMaxIndex(context, payload) {
			context.commit('setMaxIndex', payload);
		}
	}
};