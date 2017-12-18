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
				<div class="collect" :class="{'is-collect':articleData['is_collect']}" @click="collect"></div>
			</div>
		</div>

		<!--话题内容-->
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
					<!--回复评论-->
					<div class="reply-box">
						<i class="reply-btn" :data-index="index" @click="replyOther"></i>
					</div>
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
			<mavon-editor v-model="value" :toolbars="toolbars"></mavon-editor>
			<a href="javascript:void(0);" class="submit_btn" @click="addReply">回复
				<span v-if="replyTo">@{{ replyTo.author.loginname }}</span>
			</a>
			<a href="javascript:void(0);" class="cancle_reply_btn" @click="cancleReply" v-if="replyTo">取消</a>
		</div>

	</div>
</template>

<script>
// import Vue from 'vue'
// import mavonEditor from 'mavon-editor'
import { MessageBox, Indicator, Toast } from 'mint-ui';
import { mavonEditor } from 'mavon-editor'
import moment from 'moment'
import { mapState } from 'vuex'

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
			replyTo: null,
			tabs: {
				'share': "分享",
				'ask': "问答",
				'job': "招聘",
				'dev': "测试"
			},
			toolbars: {
				bold: true, // 粗体
				italic: true,// 斜体
				header: true,// 标题
				// underline: true,// 下划线
				strikethrough: true,// 中划线
				// mark: true,// 标记
				// superscript: true,// 上角标
				// subscript: true,// 下角标
				quote: true,// 引用
				ol: true,// 有序列表
				ul: true,// 无序列表
				link: true,// 链接
				imagelink: true,// 图片链接
				code: true,// code
				table: true,// 表格
				// subfield: true,// 是否需要分栏
				fullscreen: true,// 全屏编辑
				readmodel: true,// 沉浸式阅读
				// htmlcode: true,// 展示html源码
				help: true// 帮助
			}
		}
	},
	// 计算属性 映射为 store.state中的属性
    computed: mapState([
        'accesstoken',
        'isLogin',
        'user'
    ]),
	methods: {
		getContent() {
			Indicator.open();
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
					Indicator.close();
					console.log(response);
				})
		},

		// 回复评论
		replyOther(event) {
			var replyIndex = event.target.dataset.index;
			this.replyTo = this.articleData.replies[replyIndex];
			this.value = '@' + this.replyTo.author.loginname + ' ';
			this.scrollToBottom();
		},
		//取消回复层主
		cancleReply() {
			this.replyTo = null;
			this.value = '';
		},
		// 滚动到底部
		scrollToBottom() {
			var h = document.body.scrollHeight - window.innerHeight;
			window.scrollTo(0, h);
		},
		// 回复话题
		addReply() {
			var replyId = this.replyTo ? this.replyTo.id : '';
			if (!this.isLogin) {
				this.toLogin();
			} else {
				var topicId = this.$route.params.id;
				var url = 'https://cnodejs.org/api/v1/topic/' + topicId + '/replies';
				var params = {
					accesstoken: this.accesstoken,
					content: this.value
				}
				this.$http.post(url, params)
					.then(response => {
						if (response.data.success) {
							Toast({
								message: '回复成功',
								duration: 1000
							});
							this.cancleReply();
							this.getContent();
						} else {
							Toast({
								message: response.data.error_msg,
								duration: 2000
							});
						}

					})
					.catch(response => {
						console.log(response);
						var errMsgArr = response.data.error_msg.split('：');
						MessageBox.alert(errMsgArr[1],errMsgArr[0]);
					});
			}
		},
		// 收藏帖子
		collect() {
			if (!this.isLogin) {
				this.toLogin();
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
				this.toLogin();
			} else {
				var url = 'https://cnodejs.org/api/v1/reply/' + replyId + '/ups';
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
		// this.cheakLogin();
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

.col_fade{
    margin-top: 20px;
    border-left: 2px solid #80bd01;
	background-color: #f3f6f9;
	padding: 10px 14px;
}

/*======================标题区域======================*/
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
/*====================================================*/

/*======================收藏按钮======================*/

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

/*====================================================*/


/*==========================文章内容======================*/
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
.markdown-text p, .preview p {
    white-space: pre-wrap;
    white-space: -moz-pre-wrap;
    white-space: -pre-wrap;
    white-space: -o-pre-wrap;
    word-wrap: break-word;
    line-height: 1.5;
}

.preview p, .reply_content p, .reply_form p, .topic_content p {
    font-size: 15px;
    line-height: 1.7em;
    overflow: auto;
}

.panel .markdown-text a {
    color: #08c;
}

code, pre {
    padding: 0 3px 2px;
    font-family: Monaco,Menlo,Consolas,"Courier New",monospace;
    font-size: 12px;
    color: #333;
    -webkit-border-radius: 3px;
    -moz-border-radius: 3px;
    border-radius: 3px;
}

code {
    padding: 2px 4px;
    color: #d14;
    /*white-space: nowrap;*/
    background-color: #f7f7f9;
    border: 1px solid #e1e1e8;
}

code {
    padding: 0;
    border: none;
}

.markdown-text li code, .markdown-text p code, .preview li code, .preview p code {
    color: #000;
    background-color: #fcfafa;
    padding: 4px 6px;
}
/*代码样式*/
.prettyprint{
	background: #f7f7f9;
	overflow-x: scroll;
}

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
/*=====================================================*/



/*=====================评论区==========================*/
.panel{
	padding: 0 10px;
	list-style: none;
	background-color: #fefefe;
}
.panel > li{
	border-bottom: 1px solid #eee;
	padding: 14px 10px;
}
.author_content img{
	width: 30px;
	height: 30px;
	margin-right: 10px;
	border-radius: 5px;
}
/*=====================================================*/

/*======================取消回复按钮===================*/

.cancle_reply_btn {
	display: block;
	margin: 10px 0;
	line-height: 32px;
	border-radius: 3px;
	font-size: 14px;
	color: #5a6e79;
	text-align: center;
	background-color: #f3f6f9;
}
/*====================================================*/






/*========================赞==========================*/

.up-box {
	float: right;
	margin-right: 16px;
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

.up-num {
	color: #80bd01;
}
/*====================================================*/



/*======================回复评论======================*/

.reply-box {
	float: right;
}

.reply-btn {
	display: inline-block;
	width: 20px;
	height: 20px;
	background: url(../assets/icon/reply-2.svg);
	background-size: 100%;
}
/*====================================================*/


/*=====================添加回复区域====================*/
.reply_input {
	margin: 10px;
}
/*======================================================*/



</style>