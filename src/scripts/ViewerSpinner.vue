<template>
	<div class="viewer__spinner__wrapper">
		<div v-if="show" class="viewer__spinner" aria-hidden v-translate>Loading</div>
	</div>
</template>
<script>
export default {
	props : ['show']
};
</script>