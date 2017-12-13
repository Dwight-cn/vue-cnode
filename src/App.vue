<template>
	<div id="app">
	<!-- <img src="./assets/logo.png"> -->
	<router-view></router-view>
	</div>
</template>

<script>
import Vue from 'vue'

export default {
	name: 'app'
}

</script>

<style>
@import 'common/app.css';


#app {
	font-family: 'Avenir', Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
}
</style>
