<template>
	<div class="user">
		<!--用户信息-->
		<div class="user-con">
			<div class="blur-bg" :style="'background-image: url('+ userDetail.avatar_url +')'"></div>
			<div class="user-info">
				<img class="avatar" :src="userDetail.avatar_url" alt="">
				<h2 class="loginname">{{ userDetail.loginname }}</h2>
				<div class="other-info">
					<span>{{ fromNow(userDetail.create_at) }}注册</span>
					<span>{{ userDetail.score }} 积分</span>
				</div>
				<div class="user-exit" v-if="userObj && userObj.loginname == userDetail.loginname" @click="logout"> </div>
			</div>
		</div>

		<mt-navbar v-model="selected">
			<mt-tab-item id="1">创建的话题</mt-tab-item>
			<mt-tab-item id="2">参与的话题</mt-tab-item>
			<mt-tab-item id="3">收藏的话题</mt-tab-item>
		</mt-navbar>

		<div class="user-tab-con">
			<mt-tab-container v-model="selected" :swipeable="true">
				<mt-tab-container-item id="1" class="user-tab-container-item">
					<mt-cell v-for="item in userDetail.recent_topics" :title="item.title" is-link :key="item.id" :to="'/topic/'+item.id"></mt-cell>
				</mt-tab-container-item>
				<mt-tab-container-item id="2" class="user-tab-container-item">
					<mt-cell v-for="item in userDetail.recent_replies" :title="item.title" is-link :key="item.id" :to="'/topic/'+item.id"></mt-cell>
				</mt-tab-container-item>
				<mt-tab-container-item id="3" class="user-tab-container-item">
					<mt-cell v-for="item in topicCollect" :title="item.title" is-link :key="item.id" :to="'/topic/'+item.id"></mt-cell>
				</mt-tab-container-item>
			</mt-tab-container>
		</div>
		<!--返回首页-->
		<router-link class="home-btn btn-bottom btn-rb" to="/"></router-link>
	</div>
</template>

<script>
import moment from 'moment'
import Vue from 'vue'
import axios from 'axios'
import { mapState, mapMutations } from 'vuex'
import { Navbar, TabItem, TabContainer, TabContainerItem, Cell, MessageBox, Indicator, Toast } from 'mint-ui'

Vue.component(Navbar.name, Navbar);
Vue.component(TabItem.name, TabItem);
Vue.component(TabContainer.name, TabContainer);
Vue.component(TabContainerItem.name, TabContainerItem);
Vue.component(Cell.name, Cell);

moment.locale('zh-cn');

export default {
	data() {
		return {
			userDetail: {

			},
			topicCollect: null,
			selected: '1'
		}
	},
	// 计算属性 映射为 store.state中的属性
	computed: {
		userObj() {
			return JSON.parse(this.user);
		},
		...mapState([
			'accesstoken',
			'isLogin',
			'user'
		])
	},

	methods: {
		fetchUserData() {
			var loginname = this.$route.params.loginname || this.userObj.loginname;
			var url = 'https://cnodejs.org/api/v1/user/' + loginname;
			axios.get(url)
				.then(response => {
					this.userDetail = response.data.data;
					Indicator.close();
					console.log(this.userDetail);
				})
		},
		getchTopicollectData() {
			var loginname = this.$route.params.loginname || this.userObj.loginname;
			var url = 'https://cnodejs.org/api/v1/topic_collect/' + loginname;
			axios.get(url)
				.then(response => {
					this.topicCollect = response.data.data;
					Indicator.close();
					console.log(this.topicCollect);
				})
		},
		logout() {
			localStorage.removeItem("accesstoken");
			localStorage.removeItem("isLogin");
			localStorage.removeItem("user");
			this.resetLoginInfo();
			Toast({
				message: '退出成功',
				duration: 1000
			});
			this.$router.push('/');
		},
		fromNow(date) {
			return moment(date).fromNow()
		},
		// 将组件中的 methods 映射为 store.commit 调用
		...mapMutations([
			'resetLoginInfo'
		])
	},
	created() {
		this.fetchUserData();
		this.getchTopicollectData();
	}
}
</script>

<style>
.user-tab-con .mint-tab-container-wrap {
	height: 100%;
}
</style>


<style scoped>
/*layout*/

.user {
	height: 100%;
	position: relative;
}

.user-con {
	position: relative;
	overflow: hidden;
}

.user-tab-con {
	height: 100vh;
	padding-top: 204px;
	margin-top: -204px;
	box-sizing: border-box;
	color: #6a737d;
}

.user-tab-con .mint-tab-container,
.user-tab-con .mint-tab-container-wrap,
.user-tab-con .user-tab-container-item {
	height: 100%;
}

.user-tab-con .user-tab-container-item {
	overflow: auto;
	position: relative;
}











/*======================用户信息=====================*/

.user-info {
	width: 100%;
	background: rgba(0, 0, 0, .2);
	overflow: hidden;
	position: relative;
}









/*登出*/

.user-exit {
	position: absolute;
	top: 8px;
	right: 8px;
	width: 30px;
	height: 30px;
	background: url(../assets/icon/exit.svg);
	background-size: 100%;
}









/*背景模糊*/

.blur-bg {
	position: absolute;
	top: 0;
	left: 0;
	z-index: -1;
	width: 100%;
	height: 100%;
	background-position: center;
	background-size: cover;
	-webkit-filter: blur(10px);
}


.avatar {
	display: block;
	margin: 26px auto 10px;
	height: 60px;
	width: 60px;
	border-radius: 50%;
	border: 2px solid #fff;
}

.loginname {
	color: #fff;
	text-align: center;
	font-size: 20px;
}

.other-info {
	color: #eee;
	text-align: center;
	line-height: 2;
}

.other-info>span {
	margin: 0 .5em;
}






/*==============================================*/

.mint-navbar .mint-tab-item {
	color: #666;
}

.mint-navbar .mint-tab-item.is-selected {
	border-bottom: 3px solid #80bd01;
	color: #444;
	margin-bottom: 0;
}
</style>

