<template>
	<div v-if="show" class="viewer__spinner" aria-hidden v-translate>Loading</div>
</template>
<script>
export default {
	props : ['show']
};
</script>