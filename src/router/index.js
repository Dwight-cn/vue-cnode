import Vue from 'vue'
import Router from 'vue-router'
import Hello from '../components/Hello'
import List from '../components/list'
import Content from '../components/content'
import Login from '../components/login'
import User from '../components/user'
import Create from '../components/create'
import Message from '../components/message.vue'

Vue.use(Router)

export default new Router({
	routes: [
		{
			path: '/hello',
			name: 'Hello',
			component: Hello
		},
		{
			path: '/',
			name: 'List',
			component: List
		},
		{
			path: '/topic/:id',
			component: Content
		},
		{
			path: '/tab/:tab',
			component: List
		},
		{
			path: '/tab/:tab/page/:page',
			component: List
		},
		{
			path: '/login',
			component: Login
		},
		{
			path: '/user/:loginname',
			component: User
		},
		{
			path: '/create',
			component: Create
		},
		{
			path: '/message',
			component: Message
		}
	],
	scrollBehavior(to, from, savedPosition) {
		return { x: 0, y: 500 }
	}
})
