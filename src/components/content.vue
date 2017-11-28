<template>
	<div class="content">
		<div class="topic-header">
			<h3>{{ articleData.title}}</h3>
			<div class="user">
				<div class="user-l">
					<a href="" class="">
						<img alt="" :src="author.avatar_url">
					</a> 
					<div class="user-name">
						<p>
							<span class="type type-top" v-show="articleData.top">置顶</span>
							<span class="name">{{ author.loginname }}</span>
						</p> 
						<p>
							<span class="create-time">{{ articleData.create_at }}</span> 
							<span class="views"> {{articleData.visit_count}} 次浏览</span>
						</p>
					</div>
				</div> 
				<!-- <div class="user-r">
					<i aria-hidden="true" class="md-icon md-theme-default material-icons">favorite_border</i>
				</div> -->
			</div>
		</div>
		
		<div class="topic_content" v-html="articleData.content" ></div>
		<!-- 评论 -->
		<div class="col_fade">
				<span >{{articleData.reply_count}} 回复</span>
		</div>
		<ul class="panel">
			
			<li v-for="item in articleData.replies" :key="item.author.loginname">
				<div class="author_content">
					<img :src="item.author.avatar_url" alt="" width="50">
					<span class="reply_author">{{ item.author.loginname }}</span>
				</div>
				<div class="reply_content" v-html="item.content"></div>
			</li>
		</ul>
		<!-- 发表评论 -->
		<div class="col_fade">
				<span >添加回复</span>

		</div>
		<div class="reply_input">
			<mavon-editor v-model="value" ></mavon-editor>
			<a href="javascript:void(0);" class="submit_btn" @click="addReply">回复</a>
		</div>
		
	</div>
</template>

<script>
	// import Vue from 'vue'
	// import mavonEditor from 'mavon-editor'
	import { MessageBox, Indicator } from 'mint-ui';
	import { mavonEditor } from 'mavon-editor'
	import 'mavon-editor/dist/css/index.css'

	// Vue.use(mavonEditor)
	
	export default {
		components: {
	        mavonEditor
	    },
		data(){
			return {
				id: 0,
				articleData: {},
				author: {},
				value: '',
				isLogin: false,
				accesstoken: '',
				loginname: ''
			}
		},
		methods: {
			getContent() {
				var _this = this;
				this.id = this.$route.params.id;
				var url = 'https://cnodejs.org/api/v1/topic/' + this.id;

				this.$http.get(url)
					.then(function(response){
						 _this.articleData = response.data.data;
						 _this.author = _this.articleData.author;
						 console.log(this.articleData)
					})
					.catch(function(response){
						console.log(response);
					})
			},
			// 检查用户是否已登录
			// cheakLogin(atk) {
			// 	var url = 'https://cnodejs.org/api/v1/accesstoken';
			// 	var params = {
			// 		accesstoken: atk
			// 	}
			// 	this.$http.post(url, params)
			// 		.then(response => {
			// 			this.isLogin = true;
			// 			this.accesstoken = atk;
			// 			console.log('已登录');
			// 		})
			// 		.catch(response => {
			// 			console.log('未登录');
			// 		});
			// },
			// 添加回复
			addReply() {
				if(!this.isLogin){
					MessageBox.confirm('您还未登录,是否登录？')
						.then(action => {
							this.$router.push('/login');
						})
						.catch(action => {

						});
					
				} else {
					var topicId = this.$route.params.id;
					var url = 'https://cnodejs.org/api/v1/topic/' + topicId + '/replies' ;
					var params = {
						accesstoken: this.accesstoken,
						content: this.value
					}

					this.$http.post(url, params)
						.then(response => {
							this.value = '';
							MessageBox.alert('回复成功','');
							this.getContent();
						})
						.catch(response => {
							console.log(response.data);
						});
				}
			}
		},
		created(){
			this.cheakLogin();
			this.getContent();
		}
	}
	
</script>

<style>
	.content{
		background: #fff;
	}
	.reply_input{
		margin: 10px;
	}


.mint-tab-container{
	padding-top: 50px;
	min-height: 500px;
}
.mint-cell-value{
	font-size: 0.6rem;
}
.topic-header{
	padding: 10px;
	background-color: #f6f6f6;
}
.topic-header h3 {
    font-size: 1rem;
    font-weight: 700;
    margin-bottom: .4rem;
    line-height: 1.3;
}

.topic-header .user, .topic-header .user .user-l {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
}
.topic-header .user {
    -webkit-box-pack: justify;
    -ms-flex-pack: justify;
    justify-content: space-between;
}

.topic-header .user .user-l a {
    display: inline-block;
    margin-right: 10px;
    width: 46px;
    height: 46px;
    border-radius: 50%;
    overflow: hidden;
}

.topic-header .user .user-l a img {
    width: 100%;
    height: 100%;
}

.topic-header .user .user-l .user-name {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -ms-flex-direction: column;
    flex-direction: column;
    -webkit-box-pack: justify;
    -ms-flex-pack: justify;
    justify-content: space-between;
    margin-left: 5px;
    padding: 6px 0;
    font-size: 12px;
}
.topic-header .user .user-l .user-name p{
	padding: 0;
	margin: 3px 0;
}


.topic-header .user .user-l .user-name .type {
    margin-right: 5px;
    padding: 1px 6px;
    background-color: #ddd;
    color: #555;
    font-size: 10px;
    border-radius: 3px;
}
.topic-header .user .user-l .user-name .type-top {
    color: #fff;
    background-color: #388e3c;
}

.topic-header .user .user-l .user-name .name {
    color: #000;
    font-size: 12px;
}
.topic-header .user .user-l .user-name .create-time {
    font-size: 12px;
    color: #555;
    margin-right: .1rem;
}
.topic-header .user .user-l .user-name .create-time:before {
    content: "\2022";
}
.topic-header .user .user-l .user-name .views:before {
    content: "\2022";
}

.topic_content {
    margin: 10px;
}
.topic_content h1 {
    font-size: 32.5px;
}
.preview h1, .preview h2, .preview h3, .preview h4, .preview h5, .preview h6, .reply_area h1, .reply_area h2, .reply_area h3, .reply_area h4, .reply_area h5, .reply_area h6, .topic_content h1, .topic_content h2, .topic_content h3, .topic_content h4, .topic_content h5, .topic_content h6 {
    margin: 30px 0 15px;
    border-bottom: 1px solid #eee;
}
</style>