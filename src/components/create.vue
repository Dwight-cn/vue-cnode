<template>
    <div class="create_topic">
        <div class="logo">
            <img src="../assets/icon/logo.svg" alt="">
        </div>
        <mt-field placeholder="标题 10字以上" v-model="title" class="title"></mt-field>
        <select name="" id="" v-model="tab" class="tab-select">
            <option v-for="(value, key) in tabs" :value="key" :key="key">{{value}}</option>
        </select>
        <div class="creat_input">
            <mavon-editor v-model="value" :toolbars="toolbars" :subfield="false" ref=md @imgAdd="$imgAdd" @imgDel="$imgDel"></mavon-editor>
            <a href="javascript:void(0);" class="submit_btn" @click="createTopic">新建主题</a>
        </div>
        <!--返回首页-->
        <router-link class="home-btn btn-bottom btn-rb" to="/"></router-link>
    </div>
</template>

<script>
import Vue from 'vue'
import { mapState } from 'vuex'
import axios from 'axios'
import { mavonEditor } from 'mavon-editor'
import editorConfig from '../config/editor'
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
            toolbars: editorConfig
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
            axios.post(url, params)
                .then(response => {
                    this.$router.push('/topic/' + response.data.topic_id);
                    Indicator.close();
                })
                .catch(err => {
                    Indicator.close();
                    var errMsgArr = err.response.data.error_msg.split('：');
                    MessageBox.alert(errMsgArr[1], errMsgArr[0]);
                    console.log(errMsgArr)
                })
        },
        $imgAdd(pos, $file) {
            // 第一步.将图片上传到服务器.
            var formdata = new FormData();
            formdata.append('smfile', $file);
            console.log(formdata);
            axios({
                url: 'https://sm.ms/api/upload',
                method: 'post',
                data: formdata,
                headers: { 'Content-Type': 'multipart/form-data' },
            }).then((response) => {
                // 第二步.将返回的url替换到文本原位置![...](./0) -> ![...](url)
				/**
				* $vm 指为mavonEditor实例，可以通过如下两种方式获取
				* 1. 通过引入对象获取: `import {mavonEditor} from ...` 等方式引入后，`$vm`为`mavonEditor`
				* 2. 通过$refs获取: html声明ref : `<mavon-editor ref=md ></mavon-editor>，`$vm`为 ``
				*/
                if (response.data.code == 'success') {
                    this.$refs.md.$img2Url(pos, response.data.data.url);
                } else {
                    Toast({
                        message: '图片上传失败',
                        duration: 1000
                    });
                }
            })
        },

        $imgDel(pos) {
            delete this.img_file[pos];
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
    padding: 18px 0;
    width: 60%;
    height: auto;
}

.tab-select {
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
    height: 100%;
    background-color: #444;
    box-sizing: border-box;
    overflow: auto;
}

.title {
    margin-bottom: 10px;
}
</style>
