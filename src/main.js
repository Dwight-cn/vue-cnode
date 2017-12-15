// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import { Indicator, MessageBox } from 'mint-ui'

Vue.config.productionTip = false



// 检查用户登录状态
const loginInfo = {};

loginInfo.accesstoken = localStorage.getItem('accesstoken');
loginInfo.isLogin = localStorage.getItem('isLogin');
loginInfo.user = localStorage.getItem('user');

if (loginInfo.accesstoken && loginInfo.isLogin) {
	store.commit('setLoginInfo', loginInfo);
}


new Vue({
	el: '#app',
	router,
	store,
	template: '<App/>',
	components: { App }
})

// 全局路由切换时，loading
// router.beforeEach((to, from, next) => {
// 	  Indicator.open();
// 	next();
// })

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