// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import store from './store'
import router from './router'
import App from './App'
// import FastClick from 'fastclick'
import { Indicator, MessageBox } from 'mint-ui'


Vue.config.productionTip = false

// FastClick.attach(document.body);

// 检查用户登录状态
const loginInfo = {};

loginInfo.accesstoken = localStorage.getItem('accesstoken');
loginInfo.isLogin = localStorage.getItem('isLogin');
loginInfo.user = localStorage.getItem('user');

if (loginInfo.accesstoken && loginInfo.isLogin) {
	store.commit('setLoginInfo', loginInfo);
}


//检查路由是否需要登录
router.beforeEach((to, from, next) => {

	if (to.matched.some(record => record.meta.needLogin)) {
		if (!store.state.isLogin) {
			MessageBox.confirm('您还未登录,是否登录？')
				.then(action => {
					next('/login')
				})
				.catch(action => {

				});
		} else {
			next()
		}
	} else {
		next() // 确保一定要调用 next()
	}
})


new Vue({
	el: '#app',
	router,
	store,
	template: '<App/>',
	components: { App }
})