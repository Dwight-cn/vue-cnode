// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import { Indicator } from 'mint-ui'

Vue.config.productionTip = false



// 检查用户是否已登录
Vue.prototype.cheakLogin = function () {
	return new Promise((resolve, reject) => {
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
					resolve('已登录');
				})
				.catch(response => {
					console.log('登录失败');
					reject('登录失败')
				});
		} else {
			console.log('未登录');
			reject('登录失败')
		}
	})


}


/* eslint-disable no-new */
new Vue({
	el: '#app',
	router,
	template: '<App/>',
	components: { App }
})

// 全局路由切换时，loading
// router.beforeEach((to, from, next) => {
// 	  Indicator.open();
// 	next();
// })