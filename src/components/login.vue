<template>
	<div class="login">
		<div class="logo">
			<img src="../assets/logo.svg" alt="">
		</div>
		<mt-field  placeholder="accesstoken" v-model="accesstoken"></mt-field>
		<a href="javascript:void(0);" class="submit_btn" @click="login">登录</a>
		<div>{{ user.loginname }}</div>
	</div>
</template>

<script>
	import Vue from 'vue'
	import { Field, MessageBox, Indicator } from 'mint-ui';
	import Router from 'vue-router'

	Vue.component(Field.name, Field);

	export default {
		data(){
			return {
				accesstoken: '',
				isLogin: true,
				user: {
					
				}
			}
		},
		methods:{
			login(){
				Indicator.open('登录中');
				var url = 'https://cnodejs.org/api/v1/accesstoken';
				var params = {
					accesstoken: this.accesstoken
				}
				this.$http.post(url, params)
					.then(response => {
						this.user = response.data;
						console.log(this.user);
						localStorage.setItem("accesstoken", this.accesstoken);
						this.isLogin = true;
						Indicator.close();
						MessageBox.alert('登录成功', this.user.loginname)
							.then(action =>{
								// this.$router.push('/user/'+this.user.loginname);
								this.$router.go(-1);
							})
					})
					.catch(response => {
						Indicator.close();
						MessageBox.alert('登录失败','提示');
						console.log(response.data);
					});

			}
		},
		created(){
			if(this.isLogin && this.user.loginname){
				this.$router.push('/user/'+this.user.loginname);
			}
		}
	}
</script>

<style>
	body, html, #app{
		height: 100%;
		background: #444;
	}
	#app{
		
	}
	.login{
		padding: 0 10px;
	}
	.logo{
	}
	.logo img{
		display: block;
		margin: 0 auto;
		padding: 30px 0;
		width: 80%;
		height: auto;
	}
	.mint-field{
		/*height: 36px;*/
		min-height: 36px;
	}
</style>