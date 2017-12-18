<template>
    <div class="create_topic">
        <div class="logo">
            <img src="../assets/icon/logo.svg" alt="">
        </div>
        <mt-field placeholder="标题" v-model="title" class="title"></mt-field>
        <select name="" id="" v-model="tab" class="tab-select">
            <option v-for="(value, key) in tabs" :value="key" :key="key">{{value}}</option>
        </select>
        <div class="creat_input">
            <mavon-editor v-model="value" :toolbars="toolbars"></mavon-editor>
            <a href="javascript:void(0);" class="submit_btn" @click="createTopic">新建主题</a>
        </div>
    </div>
</template>

<script>
import Vue from 'vue'
import { mapState } from 'vuex'
import { mavonEditor } from 'mavon-editor'
import { MessageBox, Indicator, Field } from 'mint-ui';

Vue.component(Field.name, Field);

export default {
    components: {
        mavonEditor
    },
    data() {
        return {
            popupVisible: true,
            title: '',
            value: '',
            // accesstoken: '',
            tabs: {
                'share': "分享",
                'ask': "问答",
                'job': "招聘",
                'dev': "测试"
            },
            tab: 'dev',
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
                htmlcode: true,// 展示html源码
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
        createTopic() {
            Indicator.open('发表中');
            var url = 'https://cnodejs.org/api/v1/topics';
            var params = {
                accesstoken: this.accesstoken,
                title: this.title,
                tab: this.tab,
                content: this.value
            }
            this.$http.post(url, params)
                .then(response => {
                    this.$router.push('/topic/' + response.data.topic_id);
                    Indicator.close();
                })
                .catch(response => {
                    Indicator.close();
                    console.log(response);
                    console.log('发贴失败')
                })
        }
    },
    created() {
        // this.cheakLogin();
    }
}
</script>

<style scoped>
.logo img {
    display: block;
    margin: 0 auto;
    padding: 30px 0;
    width: 80%;
    height: auto;
}

.tab-select{
    width: 100%;
    height: 36px;
    background: #fff;
    margin-bottom: 10px;
    border: none;
}

.create_topic {
    position: relative;
    padding: 10px;
    z-index: 1;
    height: 100vh;
    background-color: #444;
    box-sizing: border-box;
    overflow: auto;
}

.title {
    margin-bottom: 10px;
}
</style>
