<template>
    <div>
        <navBar navTitle="Trang chi tiết" />
        <div class="full-width92">
            <div class="news-title borderBtm">
                <h4>{{ newsInfoObj.title.value }}</h4>
                <div class="bg-theme news-time">
                    <van-icon name="underway-o" />
                    <span>{{ newsInfoObj.tranTime.value }}</span>
                </div>
            </div>

            <div v-for="(item , index) in newsInfoObj.content.value" :key="index">
                <article v-html="item" class="article"></article>
            </div>
        </div>

    </div>
</template>

<script>
import { index_article_api } from "@/assets/js/api";

export default {
    name: "newsInfo",
    data() {
        return {
            newsInfoObj:{
                title:{},
                tranTime:{},
                content:{
                    value:[],
                },
            },
        }
    },
    methods: {
        fnGetNewsInfo(){
            index_article_api({
                id: this.$route.query.id,
            }).then(res=>{
                if(res.code == 200){
                    this.newsInfoObj = res.data;
                }
            })
        },
    },
    created() {
        this.fnGetNewsInfo();
    },
}
</script>
<style>
	img{width: 90%;}
</style>