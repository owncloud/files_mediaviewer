<template>
	<div v-if="show" class="viewer__spinner" aria-hidden="">Loading</div>
</template>
<script>
export default {
	props : ['show'],
	data () {
		return {
			name : "I am the spinning spinner"
		}
	}
}
</script>