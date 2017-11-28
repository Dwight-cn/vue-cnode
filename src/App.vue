<template>
	<div id="app">
	<!-- <img src="./assets/logo.png"> -->
	<router-view></router-view>
	</div>
</template>

<script>
import Vue from 'vue'

// 检查用户是否已登录
Vue.prototype.cheakLogin = function() {
	var accesstoken = localStorage.getItem("accesstoken");
	if (accesstoken) {
		var url = 'https://cnodejs.org/api/v1/accesstoken';
		var params = {
			accesstoken: accesstoken
		}
		this.$http.post(url, params)
			.then(response => {
				this.isLogin = true;
				this.accesstoken = accesstoken;
				this.loginname = response.data.loginname;
				console.log('已登录');
			})
			.catch(response => {
				console.log('登录失败');
			});
	} else {
		console.log('未登录');
	}
	
}
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
	/*text-align: center;*/
	color: #333;
	/*margin-top: 60px;*/
}
</style>
