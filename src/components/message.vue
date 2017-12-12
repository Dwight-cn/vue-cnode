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
                        <div class="item-head">
                            <span class="item-title">{{ item.topic.title }}</span>
                        </div>
                        <div class="item-content">
                            <div class="item-content-avatar"><img :src="item.author.avatar_url" alt=""></div>
                            <div class="item-content-info">
                                <div class="info-title">由
                                    <span class="info-author">{{ item.author.loginname }}</span>
                                    <span class="info-time">{{ fromNow(item.reply.create_at) }}</span>
                                    <span class="info-type">{{messageTypeMap[item.type]}}了你</span>
                                </div>
                                <div class="info-content">{{ item.reply.content }}</div>
                            </div>
                        </div>
                    </router-link>
                </mt-tab-container-item>
                <mt-tab-container-item id="2" class="message-tab-container-item">
                    <div v-if="!messageData.has_read_messages.length" class="no-message">
                        空空如也~
                    </div>
                    <router-link class="message-content-item" v-for="item in messageData.has_read_messages" :title="item.title" is-link :key="item.id" :to="'/topic/'+item.topic.id">
                        <div class="item-head">
                            <!--<span class="item-title">{{ item.topic.title }}</span>-->
                        </div>
                        <div class="item-content">
                            <div class="item-content-avatar"><img :src="item.author.avatar_url" alt=""></div>
                            <div class="item-content-info">
                                <div class="info-title">
                                    <span class="info-author">{{ item.author.loginname }}</span>
                                    <!--<span class="info-time">{{ fromNow(item.reply.create_at) }}</span>-->
                                    在帖子<span class="info-title">{{ item.topic.title }}</span>
                                    <span class="info-type">{{messageTypeMap[item.type]}}了你</span>
                                </div>
                                <div class="info-content" v-html="item.reply.content"></div>
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
                var url = 'https://cnodejs.org/api/v1/messages' + '?accesstoken=' + accesstoken;
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
        this.cheakLogin()
            .then(action => {
                this.fetchMessageData();
            });
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

.info-content .markdown-text * {
    display: inline!important;
}












/*消息*/

.item-content .item-content-info,
.item-content,
.message-content-item .item-head,
.message-content-item,
{
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -ms-flex-wrap: wrap;
    flex-wrap: wrap;
}

.item-content .item-content-avatar,
.noreadnum,
.readnum {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
}

.item-content {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -ms-flex-wrap: wrap;
    flex-wrap: wrap;
}

.message-content-item {
    /*display: block;
    box-shadow: 0 1px 7px hsla(202, 4%, 62%, .24);
    border: 1px solid #eee;
    height: 112px;
    width: 100%;
    border-radius: 4px;
    margin-bottom: 8px;
    padding: 4px;
    box-sizing: border-box;
    overflow: hidden;*/
    display: block;
    width: 98%;
    margin: 8px auto;
    background-color: #fff;
    border-radius: 5px;
    padding: 10px 5px;
    box-sizing: border-box;
    box-shadow: 0 1px 7px hsla(202, 4%, 62%, .24);
    color: #888;
    position: relative;
}

.message-content-item .item-head {
    padding: 4px;
    width: 100%;
    height: 28%;
}

.message-content-item .item-head .item-title {
    text-decoration: none;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-tap-highlight-color: transparent;
    color: #324057;
}

.item-content {
    margin-top: -4px;
    height: 73%;
    padding: 2px;
    width: 100%;
}

.item-content .item-content-avatar {
    width: 14%;
}

.item-content .item-content-info {
    width: 86%;
}

.item-content .item-content-avatar img {
    width: 42px;
    height: 42px;
    border: 1px solid #ddd;
    border-radius: 50%;
    margin-right: 8px;
}

.item-content .item-content-info .info-title {
    width: 100%;
    height: 50%;
    font-size: 14px;
}

.info-author,
.info-type {
    color: #2196f3;
}

.info-time {
    color: #e4404c;
    font-size: 12px;
}

.item-content .item-content-info .info-content {
    margin-top: 4px;
    width: 100%;
    height: 50%;
    -webkit-line-clamp: 2;
    font-size: 12px;
    color: #232323;
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

