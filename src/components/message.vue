<template>
    <div class="message">
        <mt-navbar v-model="selected">
            <mt-tab-item id="1">未读消息
                <span>{{ messageData.hasnot_read_messages.length }}</span>
            </mt-tab-item>
            <mt-tab-item id="2">已读消息
                <span></span>
            </mt-tab-item>
        </mt-navbar>

        <div class="message-tab-con">
            <mt-tab-container v-model="selected" :swipeable="true">
                <mt-tab-container-item id="1" class="message-tab-container-item">
                    <div v-if="!messageData.hasnot_read_messages.length" class="no-message">
                        空空如也~
                    </div>
                    <router-link class="message-content-item" v-for="item in messageData.hasnot_read_messages" :title="item.title" is-link :key="item.id" :to="'/topic/'+item.topic.id">
                        <div class="item-content clearfix">
                            <div class="item-content-avatar"><img :src="item.author.avatar_url" alt=""></div>
                            <div class="item-content-info">
                                <div class="info-detail">
                                    <span class="info-author">{{ item.author.loginname }}</span>
                                    在帖子
                                    <span class="info-title">{{ item.topic.title }}</span>
                                    <span class="info-type">{{messageTypeMap[item.type]}}了你</span>
                                </div>
                                <div class="info-content" v-html="item.reply.content"></div>
                                <div class="info-time">{{ fromNow(item.reply.create_at) }}</div>
                            </div>
                        </div>
                    </router-link>
                </mt-tab-container-item>
                <mt-tab-container-item id="2" class="message-tab-container-item">
                    <div v-if="!messageData.has_read_messages.length" class="no-message">
                        空空如也~
                    </div>
                    <router-link class="message-content-item" v-for="item in messageData.has_read_messages" :title="item.title" is-link :key="item.id" :to="'/topic/'+item.topic.id">
                        <div class="item-content clearfix">
                            <div class="item-content-avatar"><img :src="item.author.avatar_url" alt=""></div>
                            <div class="item-content-info">
                                <div class="info-detail">
                                    <span class="info-author">{{ item.author.loginname }}</span>
                                    在帖子
                                    <span class="info-title">{{ item.topic.title }}</span>
                                    <span class="info-type">{{messageTypeMap[item.type]}}了你</span>
                                </div>
                                <div class="info-content" v-html="item.reply.content"></div>
                                <div class="info-time">{{ fromNow(item.reply.create_at) }}</div>
                            </div>
                        </div>
                    </router-link>
                </mt-tab-container-item>
            </mt-tab-container>
        </div>

    </div>
</template>

<script>
import moment from 'moment'
import Vue from 'vue'
import { Navbar, TabItem, TabContainer, TabContainerItem, Cell, MessageBox, Indicator } from 'mint-ui'

Vue.component(Navbar.name, Navbar);
Vue.component(TabItem.name, TabItem);
Vue.component(TabContainer.name, TabContainer);
Vue.component(TabContainerItem.name, TabContainerItem);
Vue.component(Cell.name, Cell);

moment.locale('zh-cn');

export default {
    data() {
        return {
            selected: '1',
            isLogin: false,
            accesstoken: '',
            messageData: {
                has_read_messages: [],
                hasnot_read_messages: []
            },
            messageTypeMap: {
                'at': '@',
                'reply': '回复'
            }
        }
    },
    methods: {
        fetchMessageData() {
            var _this = this;
            console.log(this.isLogin)
            if (!this.isLogin) {
                this.toLogin();
            } else {
                var accesstoken = this.accesstoken ? this.accesstoken : ''
                var url = 'https://cnodejs.org/api/v1/messages' + '?mdrender=false&accesstoken=' + accesstoken;
                this.$http.get(url)
                    .then(function(response) {
                        _this.messageData = response.data.data;
                        Indicator.close();
                        console.log(_this.messageData);
                    })
                    .catch(function(response) {
                        Indicator.close();
                        console.log(response);
                    })
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
        }
    },
    created() {
        this.selected = this.$route.params.tab || '1';
        this.cheakLogin()
            .then(action => {
                this.fetchMessageData();
            });
    },
	watch: {
		selected: function(val) {
			this.$router.push('/message/' + val);
		}
	}
}
</script>

<style>
.message-tab-con .mint-tab-container-wrap {
    height: 100%;
}
</style>


<style scoped>
/*layout*/

.message {
    height: 100vh;
    position: relative;
    background: #fafaff;
}

.message-tab-con {
    height: 100vh;
    padding-top: 49px;
    margin-top: -49px;
    box-sizing: border-box;
}

.message-tab-con .mint-tab-container,
.message-tab-con .mint-tab-container-wrap,
.message-tab-con .user-tab-container-item {
    height: 100%;
}

.message-tab-con .message-tab-container-item {
    overflow: auto;
}




/*消息*/

.message-content-item {
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

.item-content-avatar {
    float: left;
    width: 50px;
    min-height: 50px;
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
}

.item-content-avatar img {
    border-radius: 50%;
    width: 44px;
    height: 44px;
    background-color: #eee;
    box-shadow: 2px 3px 5px rgba(51, 51, 51, 0.5);
}

.item-content-info {
    margin-left: 62px;
    font-size: 14px;
}

.info-detail{
    line-height:1;
    vertical-align: top;
    /*padding-bottom: 10px;*/
}
.info-author,
.info-title {
    color: #80bd01;
}
.info-title {
    display: inline-block;
    max-width: 7em;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    vertical-align: top;
}
.info-content{
     overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: #6a737d;
    line-height: 2.5;
}
.info-time{
    font-size: 12px;
    text-align: right;
    padding-right: 0.5em;
}
.no-message {
    font-size: 16px;
    line-height: 80px;
    color: #cccccc;
    text-align: center;
}








/*tab*/

.mint-navbar .mint-tab-item {
    color: #666;
}

.mint-navbar .mint-tab-item.is-selected {
    border-bottom: 3px solid #80bd01;
    color: #444;
    margin-bottom: 0;
}
</style>

