<template>
    <div class="create_topic">
        <mt-field  placeholder="标题" v-model="title" class="title"></mt-field>
        <div class="creat_input">
            <mavon-editor v-model="value" :toolbars="toolbars"></mavon-editor>
            <a href="javascript:void(0);" class="submit_btn" @click="createTopic">新建主题</a>
        </div>
    </div>
    
</template>

<script>
    import Vue from 'vue'
    import { mavonEditor } from 'mavon-editor'
    import { MessageBox, Indicator, Field } from 'mint-ui';

    Vue.component(Field.name, Field);

    export default {
        components: {
	        mavonEditor
	    },
        data(){
            return {
                title:'',
                value: '',
                accesstoken: '',
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
        methods: {
            createTopic(){
                Indicator.open('发表中');
                var url = 'https://cnodejs.org/api/v1/topics';
				var params = {
					accesstoken: this.accesstoken,
                    title: this.title,
                    tab: 'dev',
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
        created(){
            this.cheakLogin();
        }
    }
</script>

<style>
.create_topic{
    padding: 10px;
}
.title{
    margin-bottom: 10px;
}
</style>
