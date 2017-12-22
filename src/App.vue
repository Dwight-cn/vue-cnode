<template>
	<div id="app">
		<!-- <img src="./assets/logo.png"> -->
		<transition name="fade-in-left">
			<router-view></router-view>
		</transition>
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

/*===================过渡效果================*/

.fade-in-left-enter-active {
  animation: fade-in-left .3s .3s ;
}
.fade-in-left-leave-active {
  animation: fade-out-left .3s ;
}
@keyframes fade-in-left {
  0% {
    transform: translateX(-50%);
	opacity: 0;
  }
  100% {
    transform: translateX(0);
	opacity: 1;
  }
}
@keyframes fade-out-left {
  0% {
    transform: translateX(0%);
	opacity: 1;
  }
  100% {
    transform: translateX(50%);
	opacity: 0;
  }
}
/*==========================================*/
</style>
