import Vue from 'vue'
import Vuex from 'vuex'
import VueResource from 'vue-resource'


Vue.use(VueResource)
Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        accesstoken: '',
        isLogin: false,
        user: null
    },
    mutations: {
        setLoginInfo(state, loginInfo){
            state.accesstoken = loginInfo.accesstoken || state.accesstoken;
            state.isLogin = loginInfo.isLogin || state.isLogin;
            state.user = loginInfo.user || state.user;
        },
        resetLoginInfo(state){
            state.accesstoken = '';
            state.isLogin = false;
            state.user = null;
        }
    },
    actions: {
        /*login(context, accesstoken) {
            if (accesstoken) {
                var url = 'https://cnodejs.org/api/v1/accesstoken';
                var params = {
                    accesstoken: accesstoken
                }
                this.$http.post(url, params)
                    .then(response => {
                        context.commit('setAccesstoken',accesstoken);
                        context.commit('setIsLogin', true);
                        context.commit('setUser', response.data);
                        resolve('已登录')
                    })
                    .catch(response => {
                        reject('登录失败')
                    });
            } else {
                reject('未登录')
            }
        }*/
    }
})

export default store