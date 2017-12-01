<template>
	<div class="content">
		<div class="topic-header">
			<!--标题-->
			<h3>
				<mt-badge size="small" type="success" v-show="articleData.top">置顶</mt-badge>
				<mt-badge size="small" type="error" v-show="!articleData.top && articleData.good">精华</mt-badge>
				<mt-badge size="small" v-show="tabs[articleData.tab]" color="#aaa">{{tabs[articleData.tab]}}</mt-badge>
				{{ articleData.title}}
			</h3>
			<div class="user">
				<div class="user-l">
					<!--头像-->
					<router-link :to="'/user/'+author.loginname" class="avatar">
						<img alt="" :src="author.avatar_url">
					</router-link>
					<div class="user-name">
						<p>
							<router-link :to="'/user/'+author.loginname" class="name">{{ author.loginname }}</router-link>
						</p>
						<p>
							<span class="create-time"> 发布于{{ fromNow(articleData.create_at) }}</span>
							<span class="views"> {{articleData.visit_count}} 次浏览</span>
						</p>
					</div>
				</div>
				<!--收藏-->
				<div class="collect" :class="{'is-collect':articleData['is_collect']}" @click="collect">

				</div>
			</div>
		</div>

		<div class="topic_content" v-html="articleData.content"></div>
		<!-- 评论 -->
		<div class="col_fade">
			<span>{{articleData.reply_count}} 回复</span>
		</div>
		<ul class="panel">

			<li v-for="(item, index) in articleData.replies" :key="item.author.loginname">
				<div class="author_content">
					<img :src="item.author.avatar_url" alt="" width="50">
					<span class="reply_author">{{ item.author.loginname }}</span>
					<!--赞-->
					<div class="up-box">
						<i class="up-btn" :class="{'is-up':item.is_uped}" :data-index="index" @click="ups"></i>
						<span class="up-num" v-if="item.ups.length">{{item.ups.length}}</span>
					</div>

				</div>
				<div class="reply_content" v-html="item.content"></div>
			</li>
		</ul>
		<!-- 发表评论 -->
		<div class="col_fade">
			<span>添加回复</span>

		</div>
		<div class="reply_input">
			<mavon-editor v-model="value"></mavon-editor>
			<a href="javascript:void(0);" class="submit_btn" @click="addReply">回复</a>
		</div>

	</div>
</template>

<script>
// import Vue from 'vue'
// import mavonEditor from 'mavon-editor'
import { MessageBox, Indicator, Toast } from 'mint-ui';
import { mavonEditor } from 'mavon-editor'
import moment from 'moment'

import 'mavon-editor/dist/css/index.css'

moment.locale('zh-cn');

// Vue.use(mavonEditor)

export default {
	components: {
		mavonEditor
	},
	data() {
		return {
			id: 0,
			articleData: {},
			author: {},
			value: '',
			isLogin: false,
			accesstoken: '1',
			loginname: '',
			tabs: {
				'share': "分享",
				'ask': "问答",
				'job': "招聘",
				'dev': "测试"
			}
		}
	},
	methods: {
		getContent() {
			var _this = this;
			this.id = this.$route.params.id;
			var accesstoken = this.accesstoken ? this.accesstoken : ''
			var url = 'https://cnodejs.org/api/v1/topic/' + this.id + '?accesstoken=' + accesstoken;
			this.$http.get(url)
				.then(function(response) {
					_this.articleData = response.data.data;
					_this.author = _this.articleData.author;
					Indicator.close();
					console.log(_this.articleData)
				})
				.catch(function(response) {
					console.log(response);
				})
		},

		// 回复话题或话题
		addReply() {
			if (!this.isLogin) {
				toLogin();
			} else {
				var topicId = this.$route.params.id;
				var url = 'https://cnodejs.org/api/v1/topic/' + topicId + '/replies';
				var params = {
					accesstoken: this.accesstoken,
					content: this.value
				}
				this.$http.post(url, params)
					.then(response => {
						this.value = '';
						MessageBox.alert('回复成功', '');
						this.getContent();
					})
					.catch(response => {
						console.log(response.data);
					});
			}
		},
		// 收藏帖子
		collect() {
			if (!this.isLogin) {
				toLogin();
			} else if (!this.articleData.is_collect) {
				var url = 'https://cnodejs.org/api/v1/topic_collect/collect';
				var params = {
					accesstoken: this.accesstoken,
					topic_id: this.articleData.id
				}
				this.$http.post(url, params)
					.then(response => {
						if (response.data.success) {
							this.articleData.is_collect = true;
							Toast({
								message: '收藏成功',
								duration: 1000
							});
						} else {
							this.articleData.is_collect = true;
							Toast({
								message: '已经收藏过啦',
								duration: 1000
							});
						}

					})
					.catch(response => {
						Toast({
							message: '收藏失败',
							duration: 1000
						});
					});
			} else {
				var url = 'https://cnodejs.org/api/v1/topic_collect/de_collect';
				var params = {
					accesstoken: this.accesstoken,
					topic_id: this.articleData.id
				}
				this.$http.post(url, params)
					.then(response => {
						if (response.data.success) {
							this.articleData.is_collect = false;
							Toast({
								message: '取消收藏成功',
								duration: 1000
							});
						} else {
							this.articleData.is_collect = false;
							Toast({
								message: '已经取消收藏',
								duration: 1000
							});
						}

					})
					.catch(response => {
						Toast({
							message: '取消收藏失败',
							duration: 1000
						});
					});
			}
		},
		// 点赞
		ups(event) {
			var _this = this;
			var replyIndex = event.target.dataset.index;
			var thisReply = this.articleData.replies[replyIndex]
			var replyId = thisReply.id;
			if (!this.isLogin) {
				toLogin();
			} else {
				var url = 'https://cnodejs.org/api/v1/reply/'+ replyId +'/ups';
				var params = {
					accesstoken: this.accesstoken
				}
				this.$http.post(url, params)
					.then(response => {
						if (response.data.success && response.data.action == 'up') {
							thisReply.is_uped = true;
							thisReply.ups.push(_this.accesstoken);
						} else if (response.data.success && response.data.action == 'down') {
							thisReply.is_uped = false;
							thisReply.ups.length--;
						}

					})
					.catch(response => {
						Toast({
							message: '操作失败',
							duration: 1000
						});
					});
			}
		},
		// 登录
		toLogin() {
			MessageBox.confirm('您还未登录,是否登录？')
				.then(action => {
					this.$router.push('/login');
				})
				.catch(action => {

				});
		},
		fromNow(date) {
			return moment(date).fromNow()
		},
	},
	created() {
		this.cheakLogin();
		this.getContent();
	},
	watch: {
		accesstoken: function(val) {
			this.getContent();
		}
	}
}

</script>

<style>
.content {
	background: #fff;
	color: #5a6e79;
}

.reply_input {
	margin: 10px;
}



.mint-cell-value {
	font-size: 0.6rem;
}

.topic-header {
	padding: 10px;
	background-color: #f3f6f9;
	border-top: 2px solid #80bd01;
}

.topic-header h3 {
	font-size: 16px;
	font-weight: 700;
	margin-bottom: .4rem;
	line-height: 1.8;
	color: #6a737d;
	min-height: 20px;
}

.topic-header h3>span {
	line-height: 1.4;
	vertical-align: middle;
}

.topic-header .user,
.topic-header .user .user-l {
	display: -webkit-box;
	display: -ms-flexbox;
	display: flex;
}

.topic-header .user {
	-webkit-box-pack: justify;
	-ms-flex-pack: justify;
	justify-content: space-between;
}

.topic-header .user .user-l .avatar {
	display: inline-block;
	margin-right: 10px;
	width: 46px;
	height: 46px;
	border-radius: 50%;
	overflow: hidden;
	background-color: #fff;
}

.topic-header .user .user-l a img {
	width: 100%;
	height: 100%;
}


.topic-header .user .user-l .user-name p {
	padding: 0;
	line-height: 23px;
	height: 23px;
}

.topic-header .user .user-l .user-name .name {
	color: #80bd01;
	font-size: 16px;
}

.topic-header .user .user-l .user-name span {
	font-size: 12px;
	color: #555;
}

.topic-header .user .user-l .user-name .create-time:before {
	content: "\2022";
}

.topic-header .user .user-l .user-name .views:before {
	content: "\2022";
}







/*收藏按钮*/

.collect {
	margin-top: 8px;
	margin-right: 8px;
	width: 30px;
	height: 30px;
	background: url(../assets/icon/collect.svg);
	background-size: 100%;
}

.collect.is-collect {
	background: url(../assets/icon/de-collect.svg);
	background-size: 100%;
}



/*赞*/

.up-box {
	float: right;
	line-height: 20px;
}

.up-btn {
	display: inline-block;
	width: 20px;
	height: 20px;
	background: url(../assets/icon/up.svg);
	background-size: 100%;
	vertical-align: middle;
}

.up-btn.is-up {
	background: url(../assets/icon/is-up.svg);
	background-size: 100%;
}

.up-box span {
	vertical-align: middle;
}
.up-num{
	color: #80bd01;
}




/*帖子内容*/

.topic_content {
	margin: 10px;
}

.topic_content h1 {
	font-size: 32.5px;
}

.topic_content p {
	margin: 1em auto;
	text-align: justify;
	line-height: 1.7;
}










/*代码样式*/

.preview h1,
.preview h2,
.preview h3,
.preview h4,
.preview h5,
.preview h6,
.reply_area h1,
.reply_area h2,
.reply_area h3,
.reply_area h4,
.reply_area h5,
.reply_area h6,
.topic_content h1,
.topic_content h2,
.topic_content h3,
.topic_content h4,
.topic_content h5,
.topic_content h6 {
	margin: 30px 0 15px;
	border-bottom: 1px solid #eee;
}
</style>