<template>
	<div class="login">
		<div class="logo">
			<img src="../assets/icon/logo.svg" alt="">
		</div>
		<mt-field placeholder="accesstoken" v-model="accesstoken"></mt-field>
		<a href="javascript:void(0);" class="submit_btn" @click="login">登录</a>
		<div>{{ user.loginname }}</div>
	</div>
</template>

<script>
import Vue from 'vue'
import { Field, MessageBox, Indicator } from 'mint-ui';
import Router from 'vue-router'
import { mapMutations } from 'vuex'

Vue.component(Field.name, Field);

export default {
	data() {
		return {
			accesstoken: '',
			isLogin: true,
			user: {

			}
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
			this.$http.post(url, params)
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
				.catch(response => {
					Indicator.close();
					MessageBox.alert('登录失败', '提示');
					console.log(response.data);
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
</style>