<template>
	<div class="list">
		<!-- tab -->
		<mt-navbar v-model="tab" :fixed="true" :value="tab">
			<mt-tab-item v-for="(value, key) in homeData" :id="key" :key="key">
				<router-link :to="'/tab/' + key">{{ value.name }}</router-link>
			</mt-tab-item>
		</mt-navbar>
		<!-- 列表 -->
		<mt-tab-container v-model="tab" :swipeable="true">
			<mt-tab-container-item v-for="(value, key) in homeData" :id="key" :key="key">
				<div class="list-wrap">
					<mt-loadmore :top-method="loadTop" :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" ref="loadmore" :auto-fill="false" @top-status-change="handleTopChange" @bottom-status-change="handleBottomChange">

						<router-link class="list-cell clearfix" v-for="item in value.content" :to="getUrl(item.id)" :key="item.id">
							<div class="author-box">
								<img :src="item.author.avatar_url" alt="" class="avatar">
								<span class="name">{{item.author.loginname}}</span>
							</div>
							<div class="cell-right">
								<div class="title-bar">
									<mt-badge size="small" type="success" v-show="item.top">置顶</mt-badge>
									<mt-badge size="small" type="error" v-show="!item.top && item.good">精华</mt-badge>
									<mt-badge size="small" v-show="!item.top && !item.good" color="#aaa">{{homeData[item.tab?item.tab:'share']['name']}}</mt-badge>
									<span class="title">{{ item.title }}</span>
								</div>
								<div class="article-info clearfix">
									<i><img src="../assets/icon/reply.svg" alt=""></i>
									<span class="reply_count">{{ item.reply_count }}</span>
									<i><img src="../assets/icon/look.svg" alt=""></i>
									<span class="visit_count">{{ item.visit_count }}</span>

									<span class="create-at">{{ fromNow(item.last_reply_at) }}</span>
								</div>
							</div>
						</router-link>
						<div slot="top" class="mint-loadmore-top">
							<span v-show="topStatus !== 'loading'" :class="{ 'rotate': topStatus === 'drop' }">下拉刷新↓</span>
							<span v-show="topStatus === 'loading'">
								<mt-spinner type="triple-bounce"></mt-spinner>
							</span>
						</div>
						<div slot="bottom" class="mint-loadmore-bottom">
							<span v-show="bottomStatus !== 'loading'" :class="{ 'rotate': bottomStatus === 'drop' }">加载更多...</span>
							<span v-show="bottomStatus === 'loading'">
								<mt-spinner type="triple-bounce"></mt-spinner>
							</span>
						</div>

						<div v-show="allLoaded" class="no-more">没有更多了喂</div>
					</mt-loadmore>
				</div>
			</mt-tab-container-item>
		</mt-tab-container>

		<div class="menu">
			<!--圆形菜单-->
			<mt-palette-button content="" direction="lt" class="palette_btn" :radius="80" ref="target_1" mainButtonStyle="color:#fff;background-color:#80bd01;">
				<div class="my-icon-button indexicon icon-popup" @click="createTopic">
					<!--<span>新建主题</span> -->
					<i><img src="../assets/icon/create-topic-icon.svg" alt=""></i>
				</div>
				<div class="my-icon-button indexicon icon-popup" @click="viewMessage">
					<!--<span>消息</span> -->
					<i><img src="../assets/icon/msg-icon.svg" alt=""></i>
				</div>
				<div class="my-icon-button indexicon icon-popup" @click="enterUser">
					<!--<span>个人中心</span>-->
					<i><img src="../assets/icon/login-icon.svg" alt=""></i>
				</div>
			</mt-palette-button>

			<transition name="fade">
				<div class="toTop" v-show="!atTop" @click="toTop"></div>
			</transition>
		</div>

	</div>
</template>

<script>
import Vue from 'vue'
import { Navbar, TabItem, TabContainer, TabContainerItem, Loadmore, Cell, Indicator, Badge, PaletteButton, MessageBox, Spinner, Toast } from 'mint-ui'
import VueResource from 'vue-resource'
import moment from 'moment'

// Vue.use(MintUI)
Vue.use(VueResource)

Vue.component(Loadmore.name, Loadmore);
Vue.component(Navbar.name, Navbar);
Vue.component(TabItem.name, TabItem);
Vue.component(TabContainer.name, TabContainer);
Vue.component(TabContainerItem.name, TabContainerItem);
Vue.component(Cell.name, Cell);
Vue.component(Badge.name, Badge);
Vue.component(PaletteButton.name, PaletteButton);
Vue.component(Spinner.name, Spinner);

moment.locale('zh-cn');

export default {
	components: {

	},
	data() {
		return {
			homeData: {
				'all': {
					name: "全部",
					page: 1,
					content: []
				},
				'good': {
					name: "精华",
					page: 1,
					content: []
				},
				'share': {
					name: "分享",
					page: 1,
					content: []
				},
				'ask': {
					name: "问答",
					page: 1,
					content: []
				},
				'job': {
					name: "招聘",
					page: 1,
					content: []
				},
				'dev': {
					name: "测试",
					page: 1,
					content: []
				}
			},
			tab: 'all',
			listLoading: false,
			topStatus: '',
			bottomStatus: '',
			allLoaded: false,
			isLogin: false,
			accesstoken: '',
			loginname: '',
			atTop: true
		}
	},
	methods: {
		getUrl(id) {
			return '/topic/' + id
		},
		/*获取数据*/
		fetchData(param) {
			Indicator.open();
			this.tab = param.tab || this.$route.params.tab || 'all';
			this.homeData[this.tab].page = param.page || this.$route.params.page || 1;
			console.log(this.tab);
			var url = 'https://cnodejs.org/api/v1/topics';
			var params = {
				tab: this.tab,
				page: this.homeData[this.tab].page,
				limit: 20
			}
			return this.$http.get(url, { params: params })
		},
		// 更新列表
		updateListData(tab) {
			// Indicator.open();
			this.fetchData({ tab: tab })
				.then(function(response) {
					this.$data.homeData[this.tab].content = response.data.data;
					console.log(response.data);
					Indicator.close();
				})
				.catch(function(response) {
					console.log(response);
				});
		},
		// 下拉刷新
		loadTop() {
			this.allLoaded = false;
			this.fetchData({ tab: this.tab })
				.then(function(response) {
					Indicator.close();
					this.$data.homeData[this.tab].content = response.data.data;
					console.log(this.$data.homeData[this.tab].content);
					var index = 0;
					var ii = 0
					for (var i in this.$data.homeData) {
						if (i == this.tab) {
							ii = index;
						}
						index++;
					}
					this.$refs.loadmore[ii].onTopLoaded();
					Toast({
						message: '更新成功',
						duration: 1000
					});
				})
				.catch(function(response) {
					Toast({
						message: '更新失败',
						duration: 1000
					});
					console.log(response);
				});
		},
		// 上划加载更多
		loadBottom() {
			console.log("加载更多...")
			// this.listLoading = true;
			var self = this;
			var params = {
				tab: this.tab,
				page: this.homeData[this.tab].page + 1
			}
			this.fetchData(params)
				.then(function(response) {
					Indicator.close();
					if (response.data.data.length === 0) {
						this.allLoaded = true;// 若数据已全部获取完毕
					}
					var moreData = this.$data.homeData[this.tab].content.concat(response.data.data);
					this.$data.homeData[this.tab].content = moreData;

					var index = 0;
					var ii = 0
					for (var i in this.$data.homeData) {
						if (i == this.tab) {
							ii = index;
						}
						index++;
					}

					self.$refs.loadmore[ii].onBottomLoaded();
					console.log(self.$refs.loadmore);
				})
				.catch(function(response) {
					console.log(response);
				});
		},
		handleTopChange(status) {
			this.topStatus = status;
		},
		handleBottomChange(status) {
			this.bottomStatus = status;
		},
		enterUser() {
			if (!this.isLogin) {
				this.toLogin();
			} else {
				this.$router.push('/user/' + this.loginname);
			}
		},
		viewMessage() {
			if (!this.isLogin) {
				this.toLogin();
			} else {
				this.$router.push('/message');
			}
		},
		createTopic() {
			if (!this.isLogin) {
				this.toLogin();
			} else {
				this.$router.push('/create');
			}
		},
		fromNow(date) {
			return moment(date).fromNow()
		},
		toLogin() {
			MessageBox.confirm('您还未登录,是否登录？')
				.then(action => {
					this.$router.push('/login');
				})
				.catch(action => {

				});
		},
		// 返回顶部
		toTop() {
			document.body.scrollTop = 0;

		}
	},
	created() {
		this.tab = this.$route.params.tab || 'all';
		this.cheakLogin();
		this.updateListData();

		var scrollTop = 0;
		window.addEventListener('scroll', (e) => {
			scrollTop = document.body.scrollTop;
			this.atTop = (scrollTop < 300)
		}, false)
	},
	watch: {
		'$route': function(to, from) {
			this.allLoaded = false;
			this.updateListData();
		},
		tab: function(val) {
			this.$router.push('/tab/' + val);
		}
	}
}

</script>

<style>


.list {
	background: #fafaff;
}

.list .no-more {
	text-align: center;
	line-height: 2;
	color: #333;
}

.list-wrap {
	padding-top: 50px;
	height: 100vh;
	overflow: auto;
	box-sizing: border-box;
}

/*主题列表*/

.list-cell::after {
	content: ".";
	display: block;
	height: 0;
	clear: both;
	visibility: hidden
}

.list-cell {
	display: block;
	width: 97%;
	margin: 8px auto;
	background-color: #fff;
	border-radius: 5px;
	padding: 10px 5px;
	box-sizing: border-box;
	box-shadow: 0 1px 7px hsla(202, 4%, 62%, .24);
	color: #888;
	position: relative;
}

.list-cell .author-box {
	float: left;
	width: 50px;
	text-align: center;
	overflow: hidden;
	text-overflow: ellipsis;
}

.list-cell .author-box .name {
	white-space: nowrap;
	font-size: 12px;
}

.list-cell .author-box>img {
	border-radius: 50%;
	width: 44px;
	height: 44px;
	background-color: #eee;
	box-shadow: 2px 3px 5px rgba(51, 51, 51, 0.5);
}

.cell-right {
	margin-left: 66px;
}

.list-cell .title-bar {
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	padding-right: 1rem;
	font-size: 14px;
	height: 36px;
}

.list-cell .title {
	font-size: 16px;
	color: #6a737d;
}

.article-info i {
	width: 16px;
	display: inline-block;
	vertical-align: top;
	margin-left: 10px;
}

.article-info span {
	font-size: 14px;
	line-height: 20px;
}

.create-at {
	float: right;
	margin-right: 10px;
}

.mint-loadmore-top span {
	transition: all 0.5s;
}

.mint-loadmore-top span.rotate {
	transform: rotate(90deg);
}




/*==================================*/

.list .mint-navbar {
	background-color: #444;
}

.list .mint-navbar a {
	color: #fff;
	text-decoration: none;
	font-size: 1rem;
}

.list .mint-navbar .mint-tab-item.is-selected {
	border-bottom: 3px solid #80bd01;
}

.list .mint-navbar .mint-tab-item.is-selected a {
	color: #80bd01;
}

.list .mint-cell-wrapper {
	font-size: 14px;
}


.mint-cell-value {
	font-size: 0.6rem;
}





/*返回顶部*/

.toTop {
	width: 40px;
	height: 40px;
	border-radius: 50%;
	color: rgb(255, 255, 255);
	background-color: rgb(128, 189, 1);
	/*position: fixed;*/
	/*right: 14px;*/
	/*bottom: 64px;*/
	background-image: url(../assets/icon/top.svg);
	background-repeat: no-repeat;
	background-position: center;
	background-size: auto 60%;
}








/*菜单*/

.menu {
	position: fixed;
	right: 10px;
	bottom: 10px;
}

.fade-enter-active,
.fade-leave-active {
	transition: opacity .5s
}

.fade-enter,
.fade-leave-to
/* .fade-leave-active in <2.1.8 */

{
	opacity: 0
}
</style>