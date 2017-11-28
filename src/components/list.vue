<template>
	<div class="list">
		<!-- tab -->
		<mt-navbar v-model="tab" :fixed="true" :value="tab">
			<mt-tab-item v-for="(value, key) in homeData" :id="key" :key="key"><router-link :to="'/tab/' + key">{{ value.name }}</router-link></mt-tab-item>
		</mt-navbar>
		<!-- 列表 -->
		<mt-tab-container v-model="tab" :swipeable="true">
		  <mt-tab-container-item v-for="(value, key) in homeData" :id="key" :key="key" >
			<mt-loadmore :top-method="loadTop" :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" ref="loadmore" :auto-fill="false" @top-status-change="handleTopChange">
				<mt-cell v-for="item in value.content"  :to="getUrl(item.id)" :key="item.id">
					<!-- 标题 -->
					<span slot="title">
						<mt-badge size="small" type="success" v-show="item.top">置顶</mt-badge>
						<mt-badge size="small" type="error" v-show="!item.top && item.good">精华</mt-badge>
						{{ item.title }}
					</span>
					<!-- 浏览量 -->
					<span class="reply_visit_count">
						<span class="reply_count">{{ item.reply_count }}</span>
						/<span class="visit_count">{{ item.visit_count }}</span>
					</span>
					<!--发表时间-->
					<span>{{ fromNow(item.create_at) }}</span>
					<!-- 头像 -->
					<img slot="icon" :src="item.author.avatar_url" width="34" height="34">
				</mt-cell>
				<div v-show="allLoaded" class="no-more">没有更多了喂</div>
			</mt-loadmore>
		  </mt-tab-container-item>
		</mt-tab-container>

		<div class="menu">
			<!--圆形菜单-->
			<mt-palette-button content="" direction="lt" class="palette_btn" :radius="60" ref="target_1" mainButtonStyle="color:#fff;background-color:#80bd01;"
		>
				<div class="my-icon-button indexicon icon-popup" @click="createTopic">
					<!--<span>新建主题</span> -->
					<i><img src="../assets/create-topic-icon.svg" alt=""></i>
				</div>
				<div class="my-icon-button indexicon icon-popup">
					<!--<span>消息</span> -->
					<i><img src="../assets/msg-icon.svg" alt=""></i>
				</div>
				<div class="my-icon-button indexicon icon-popup" @click="enterUser">
					<!--<span>个人中心</span>-->
					<i><img src="../assets/login-icon.svg" alt=""></i>
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
	import {Navbar, TabItem, TabContainer, TabContainerItem, Loadmore, Cell, Indicator, Badge, PaletteButton, MessageBox} from 'mint-ui'
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
				tab : 'all',
				listLoading: false,
				topStatus: '',
				allLoaded: false,
				isLogin: false,
				accesstoken: '',
				loginname: '',
				atTop: true
			}
		},
		methods: {
			getUrl(id){
				return '/topic/' + id
			},
			/*获取数据*/
			fetchData(param){
				this.tab = param.tab || this.$route.params.tab || 'all';
				this.homeData[this.tab].page = param.page || this.$route.params.page || 1;
				console.log(this.tab);
				var url = 'https://cnodejs.org/api/v1/topics'; 
				var params = {
					tab: this.tab,
					page: this.homeData[this.tab].page,
					limit: 20
				}
				return this.$http.get(url, {params: params})
			},
			// 更新列表
			updateListData(tab){
				Indicator.open();
				this.fetchData({tab: tab})
					.then(function(response){ 
						this.$data.homeData[this.tab].content = response.data.data;
						// console.log(this.$data.homeData[this.tab].content);
						console.log(response.data);
						// console.log(response.json());
						Indicator.close();
					})
					.catch(function(response){
						console.log(response);
					});
			},
			// 下拉刷新
			loadTop(){
				this.allLoaded = false;
				this.fetchData({tab: this.tab})
					.then(function(response){ 
						this.$data.homeData[this.tab].content = response.data.data;
						console.log(this.$data.homeData[this.tab].content);
						var index = 0;
						var ii = 0
						for(var i in this.$data.homeData){
							if(i == this.tab){
								ii = index;
							}
							index++;
						}
						this.$refs.loadmore[ii].onTopLoaded();
					})
					.catch(function(response){
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
					page: this.homeData[this.tab].page +1
				}
				this.fetchData(params)
					.then(function(response){
						if(response.data.data.length === 0){
							this.allLoaded = true;// 若数据已全部获取完毕
						}
						var moreData = this.$data.homeData[this.tab].content.concat(response.data.data);
						this.$data.homeData[this.tab].content = moreData;
						
						var index = 0;
						var ii = 0
						for(var i in this.$data.homeData){
							if(i == this.tab){
								ii = index;
							}
							index++;
						}
						
						self.$refs.loadmore[ii].onBottomLoaded();
						console.log(self.$refs.loadmore); 
					})
					.catch(function(response){
						console.log(response);
					}); 
			},
			handleTopChange(status) {
				this.topStatus = status;
			},
			enterUser(){
				if(!this.isLogin){
					this.toLogin();
				} else {
					this.$router.push('/user/'+this.loginname);
				}
			},
			createTopic(){
				if(!this.isLogin){
					this.toLogin();
				} else {
					this.$router.push('/create');
				}
			},
			fromNow(date){
				return moment(date).fromNow()
			},
			toLogin(){
				MessageBox.confirm('您还未登录,是否登录？')
						.then(action => {
							this.$router.push('/login');
						})
						.catch(action => {

						});
			},
			// 返回顶部
			toTop(){
				document.body.scrollTop = 0;
				
			}
		},
		created(){
			this.tab =  this.$route.params.tab || 'all';
			this.cheakLogin();
			this.updateListData();

			var scrollTop = 0;
			window.addEventListener('scroll', (e)=>{
				scrollTop = document.body.scrollTop;
				this.atTop = (scrollTop<300)
			},false)
		},
		watch: {
			'$route': function(to, from) {
				this.allLoaded = false;
				this.updateListData();
			},
			tab: function(val){
				this.$router.push('/tab/' + val);
			}
		}
	}
	
</script>

<style>
	.list{
		background: #fff;
	}
 	.list .no-more{
		text-align: center;
		line-height: 2;
		color: #333;
	}

	/*圆形菜单*/
	.list .palette_btn {
		/*position: fixed;*/
		/*right: 14px;*/
		/*bottom: 14px;*/
	}
	.list .mint-main-button{
		background-image: url(../assets/more-icon.svg);
		background-repeat: no-repeat;
		background-position: center;
		background-size: auto 70%;
	}
	.list .mint-palette-button{
		display: block;
		width: 40px;
		height: 40px;
	}

	.list .my-icon-button{
		width: 30px;
		height: 30px;
	}

	.list .my-icon-button i{
		position: relative;
		display: block;
		/*float: left;*/
		line-height: 30px;
		text-align: center;
		width: 30px;
		height: 30px;
		background: rgb(128, 189, 1);
		border-radius: 50%;
		/*z-index: 2;*/
	}
	.list .my-icon-button i img{
		width: 70%;
		height: 70%;
	}
	.mint-sub-button-container>* {
		top: 7px;
		left: 7px;
	}

	.list .mint-cell-title {
	overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    padding-right: 1rem;
}
.list .mint-cell-title > img{
	margin-right: 10px;
	border-radius: 50%;
}

.list .mint-cell-wrapper{
	border-bottom: 1px solid #ddd;
}

.list .mint-navbar{
	background-color: #444;
}
.list .mint-navbar a{
	color: #fff;
	text-decoration: none;
	font-size: 1rem;
}
.list .mint-navbar .mint-tab-item.is-selected {
	border-bottom: 3px solid #80bd01;
}
.list .mint-navbar .mint-tab-item.is-selected a{
	color: #80bd01;
}

.list .mint-cell-wrapper{
	font-size: 14px;
}
.mint-tab-container{
	padding-top: 50px;
	min-height: 500px;
}
.mint-cell-value{
	font-size: 0.6rem;
}

/*返回顶部*/
.toTop{
	width: 40px;
    height: 40px;
	border-radius: 50%;
	color: rgb(255, 255, 255);
    background-color: rgb(128, 189, 1);
	/*position: fixed;*/
    /*right: 14px;*/
    /*bottom: 64px;*/
	background-image: url(../assets/top.svg);
	background-repeat: no-repeat;
	background-position: center;
	background-size: auto 60%;
}

/*菜单*/
.menu{
	position: fixed;
	right: 10px;
	bottom: 10px;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .5s
}
.fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
  opacity: 0
}
</style>