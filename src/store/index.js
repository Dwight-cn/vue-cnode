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

    }
})

export default store