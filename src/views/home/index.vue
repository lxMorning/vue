<template>
    <main>
        <navBar :navTitle="$t('index.title')" showRight :showLeft="true" />
        <div class="full-width">
            <van-search v-model="searchVal" :placeholder="$t('index.searchPlaceholder')" @search="fnSearch" class="index-search"/>

            <!--加权指数-->
            <van-row class="index-box">
                <van-col span="8" v-for="(item, index) in indexArr" :key="index" @click="fnIndex(item.type)">
                    <div>{{ item.name }}</div>
                    <i class="iconfont icon-xiangshang1 color-blueLight"></i>
                    <ul :class="item[56] > 0 ? 'color-green': 'color-red' ">
                        <li class="index-num">{{ item[6] }}</li>
                        <li><span v-if="item[56] > 0">+</span>{{ item[56] }}%</li>
                        <li>{{ item[11] }}</li>
                    </ul>

                </van-col>
            </van-row>

            <!--四大导航按钮-->
          <van-row class="index-btn-box" gutter="8">
            <van-col span="6" v-for="(item, index) in btnIndex4" :key="index">
              <div class="btn-list" :class="'index-btn'+(index+1)" @click="fnNavGo(index)">
                <van-image :src="require('@/assets/images/index_'+(index+1)+'.png')"/>
                <span class="txt-menu">{{item.name}}</span>
              </div>
            </van-col>
          </van-row>

            <!--实时股票咨询-->
            <ul class="news-box">
                <van-image :src="require('@/assets/images/index_news.png')" class="img-index-news"/>
				<span class="news">{{ $t('index.text1') }}</span>
                <li v-for="(item,index) in newsArr" :key="item.id" class="news-list"
                @click="btnGoNewsInfo(item)">
                    <van-image class="img-news" :src="item.thumb" fit="fill" />
                    <div class="news-content">
                        <h4 class="ellipsis2 news-title">{{ item.title }}</h4>
                        <div class="bg-theme">
                            <van-icon name="underway-o"/>
                            <span>{{ item.tranTime }}</span>
                        </div>
                    </div>
                </li>
            </ul>

        </div>
    </main>
</template>

<script>
import {index_dating_api, quser_sel_api, index_articlelist_api} from "@/assets/js/api";
export default {
	name: "index",
	data() {
		return {
            time_interval:"",
            navTitle:"index.title", // key 用于显示语言包内容
            searchVal:"",
            indexArr:[
                {
                    "6": 0,
                    "11": 0,
                    "56": 0,
					"type":"VN",
                    "name": "VNINDEX",
                },
                {
                    "6": 0,
                    "11": 0.65,
                    "56": 0,
					"type":"HNX",
                    "name": "HNX",
                },
                {
                    "6": 0,
                    "11": 0,
                    "56": 0,
					"type":"UPCOM",
                    "name": "UPCOM",
                }
            ],
            btnIndex4:[
                {
                    name:this.$t('index.menu1'),
                    path:"",
                }, {
                    name:this.$t('index.menu2'),
                    path:"",
                },{
                    name:this.$t('index.menu3'),
                    path:"",
                },{
                    name:this.$t('index.menu4'),
                    path:"",
                },
            ],

            /*新闻列表*/
            pageNo: 1,
            newsArr:[],
		};
	},
	methods: {
        /*大厅指数*/
        fnGetIndex(){
            index_dating_api({
                page:1,
            }).then(res=>{
                if(res.code == 200){
                    this.index_obj = res.data;
                    const data_arr = res.data;
                    this.indexArr = [
                        {
                            name: "VNINDEX",
                            ...data_arr.jiaquan,

                        }, {
                            name: "HNX",
                            ...data_arr.guimai,
                        }, {
                            name: "UPCOM",
                            ...data_arr.taizhi,
                        }
                    ]
                }
            })
        },
        fnSearch(val){
            console.log(val);
            this.$router.push({
                name:"market_addStock",
                query:{
                    searchVal:val,
                }
            })
        },

		// fnIndex(type){
		// 	this.$router.push({
		// 	    name:"market_index",
		// 	    query:{
		// 	        type:type,
		// 	    }
		// 	})
		// },

        /*四大導航 跳轉*/
        fnNavGo(index){
            let market_tab_active = index+1;
            console.log(market_tab_active);
            if(index == 1){
                market_tab_active = 3
            }
            if([0,1,3].includes(index)){
                this.$router.push({
                    name:"market",
                })

                localStorage.setItem("market_tab_active", market_tab_active);
            }

            /*licai*/
            if(index == 2){
                this.$router.push({
                    name:"trade",
                })
            }
        },

        /*新闻詳情*/
        btnGoNewsInfo(item){

            this.$router.push({
                name:"index_newsInfo",
                query:{
                    id: item.id,
                }
            })
        },

        /*获取新闻列表*/
        fnGetNews(){
            index_articlelist_api({
                page: this.pageNo,
            }).then(res=>{
                if(res.code == 200){
                    this.newsArr = res.data;
                }
            })
        },
	},
    created() {
        this.fnGetNews();
        this.fnGetIndex();

        this.time_interval = setInterval(()=>{
            this.fnGetIndex();
        },5000)
	},
    destroyed(){
        clearInterval(this.time_interval);
    },
};
</script>
<style lang="scss" scoped>
.full-width{
    padding-bottom: 50px
}

.index-box{
    text-align: center;
    margin: 20px 0;
    .index-num{
        font-size: 16px ;
        font-weight: bold;
    }
}
.index-btn-box {
  background-color: #000; /* 设置背景颜色为黑色 */
  .btn-list {
    color: #fff; /* 设置文字颜色为白色 */
    border-radius: 6px;
    padding: 10px; /* 增加内边距，使内容更清晰 */
    font-size: 14px;
    text-align: center; /* 文字居中 */
  }
  .txt-menu {
    font-family: 'Inter', 'Segoe UI', 'Roboto', sans-serif;
    font-size: 14px;
    letter-spacing: 0.5px;
    color: white;
    display: block;
    margin-top: 5px;
    text-align: center;
    position: relative;
    width: 100%; /* 确保文字宽度为100% */
    left: auto;
  }
}
    //.index-btn1{
    //    background: url("~@/assets/images/index_1_old.png") no-repeat;
    //    background-size: 100% 100%;
    //}
    //.index-btn2{
    //    background: url("~@/assets/images/index_2_old.png") no-repeat;
    //    background-size: 100% 100%;
    //}
    //.index-btn3{
    //    background: url("~@/assets/images/index_3.png") no-repeat;
    //    background-size: 100% 100%;
    //}
    //.index-btn4{
    //    background: url("~@/assets/images/index_4.png") no-repeat;
    //    background-size: 100% 100%;
    //}



.txt-menu {
  font-family: 'Inter', 'Segoe UI', 'Roboto', sans-serif;
  font-size: 14px;
  letter-spacing: 0.5px;
  color: white;
  display: block;
  margin-top: 5px;
  text-align: center;
  position: relative;
  width: 100%; /* 确保文字宽度为100% */
  left: auto;
}
.img-index-news{
    width: 30%;
    margin-bottom: 4px;
}
.news-box{
    margin-top: 12px;
    //padding-top: 20px;
    //height: calc( 100vh - 50px);
    //border: solid 1px red;
    //overflow: auto;
}
.news-list{
    display: flex;
    margin-bottom: 20px;
    .img-news{
        width: 36%;
        //flex: 1;
        ::v-deep .van-image__img{
            border-radius: 4px;
        }
    }
    .news-content{
        //flex: 2;
        width: 64%;
        padding-left: 10px;
    }
    .news-title{
        margin-bottom: 0;
        font-weight: bold;
    }
    .news-time{
        font-size: 12px;
        padding: 2px 3px;
        border-radius: 4px;
        background-color: #8ba6e6;
        color: #3365e3;
    }
}
.news-title{
    max-height: 50px;
}
.txt-menu{
	position: absolute;
	z-index: 99;
	padding-left: 5px;
	margin-top: 5px;
	font-size:12px;
	width:20%;
}
.news{
	    position: absolute;
	    left: 33px;
	    font-size: 1.3rem;
	    font-weight: bold;

	    color: #3d6ce4
}
::v-deep .icon-kefu1{
	font-size: 30px !important;
}
</style>