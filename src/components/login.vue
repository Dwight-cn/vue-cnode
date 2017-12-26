<template>
	<div class="login">
		<div class="logo">
			<img src="../assets/icon/logo.svg" alt="">
		</div>
		<mt-field placeholder="accesstoken" v-model="accesstoken"></mt-field>
		<a href="javascript:void(0);" class="submit_btn" @click="login">登录</a>
		<div class="login-help" @click="loginHelp">
			<i><img src="../assets/icon/tip.svg" alt=""></i>如何获取Access Token?
		</div>

		<!--返回首页-->
		<router-link class="home-btn btn-bottom btn-rb" to="/"></router-link>
	</div>
</template>

<script>
import Vue from 'vue'
import { Field, MessageBox, Indicator } from 'mint-ui';
import Router from 'vue-router'
import { mapMutations } from 'vuex'
import axios from 'axios'

Vue.component(Field.name, Field);

export default {
	data() {
		return {
			accesstoken: '',
			isLogin: true,
			user: {

			},
			popupVisible: true
		}
	},
	methods: {
		login() {
			var _this = this
			Indicator.open('登录中');
			var url = 'https://cnodejs.org/api/v1/accesstoken';
			var params = {
				accesstoken: this.accesstoken
			}
			axios.post(url, params)
				.then(response => {
					var userJSON = JSON.stringify(response.data)
					_this.setLoginInfo({
						accesstoken: this.accesstoken,
						isLogin: true,
						user: userJSON
					})
					localStorage.setItem("accesstoken", this.accesstoken);
					localStorage.setItem("isLogin", true);
					localStorage.setItem("user", userJSON);

					Indicator.close();
					MessageBox.alert('登录成功', this.user.loginname)
						.then(action => {
							// this.$router.push('/user/'+this.user.loginname);
							this.$router.go(-1);
						})
				})
				.catch(err => {
					Indicator.close();
					MessageBox.alert('登录失败', '提示');
					console.log(err.response.data);
				});

		},
		loginHelp() {
			MessageBox({
				title: '如何获取Access Token?',
				message: '进入<a href="https://cnodejs.org/">https://cnodejs.org/</a>，<br>登录后，在设置页面可以看到自己的 Access Token。'
			});
		},
		// 将组件中的 methods 映射为 store.commit 调用
		...mapMutations([
			'setLoginInfo'
		])
	},
	created() {
		if (this.isLogin && this.user.loginname) {
			this.$router.push('/user/' + this.user.loginname);
		}
	}
}
</script>

<style>
.login {
	padding: 0 10px;
	height: 100vh;
	box-sizing: border-box;
	background-color: #444;
	;
}

.logo img {
	display: block;
	margin: 0 auto;
	padding: 30px 0;
	width: 80%;
	height: auto;
}

.mint-field {
	/*height: 36px;*/
	min-height: 36px;
}

.login-help {
	margin-top: 20px;
	line-height: 26px;
	color: #fff;
}

.login-help i {
	display: inline-block;
	width: 26px;
	height: 26px;
	vertical-align: top;
	margin-right: 8px;
}

.login-help i img {
	width: 100%;
	height: 100%;
	vertical-align: top;
}
</style>