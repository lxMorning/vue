<template>
    <main class="listed-box user-listed-box">
        <van-row class="listed-list-first full-width92">
            <van-col span="8">
                <div>{{ $t('tab4_userChecked.text1') }}</div>
            </van-col>
            <van-col span="8" class="tc">
                <div>{{ $t('tab4_userChecked.text2') }}</div>
            </van-col>
            <van-col span="8" class="tr">
                <div>{{ $t('tab4_userChecked.text3') }}</div>
            </van-col>
        </van-row>
    
        <ul class="text-note text-note2 listed-ul" v-if="user_arr.length === 0">
            <li>{{ $t('tab4_userChecked.text4') }}</li>
        </ul>
        
        <van-list
            v-model="user_loading"
            :finished="user_finished"
            finished-text=""  loading-text="Đang tải……"
            :immediate-check = "false"
            class="user-van-list"
            @load="fnLoadUser_user" v-else>
            <main class="listed-ul">
                <van-row v-for="(item, index) in user_arr" :key="index" class="listed-list full-width92"
                @click="fnGoMarketInfo(item)">
                    <van-col span="8">
                        <div class="listed-name">{{ item.symbolName }}</div>
                        <span class="bg-theme">{{ item.symbol }}</span>
                    </van-col>
                    <van-col span="8" class="tc">
                        <div class="listed-price" :class="item.regularMarketChangePercent >= 0 ? 'color-green': 'color-red' ">
                            {{ item.bid || 0 }}
                        </div>
                    </van-col>
                    <van-col span="8" class="tr">
                        <div class="color-white type-num" :class=" item.regularMarketChangePercent >= 0 ? 'bg-green': 'bg-red' ">
                            <span v-if=" item.regularMarketChangePercent >= 0 ">+</span>
                            <span>{{ Number(item.regularMarketChangePercent).toFixed(2) || 0 }}%</span>
                        </div>
                    </van-col>
                </van-row>
            </main>
        </van-list>
        <van-button block type="info" native-type="submit" class="btn-wid92 btn-addMarket" @click="fnGOAddMarket">{{ $t('tab4_userChecked.text5') }}</van-button>
    </main>
</template>

<script>
import { QuserQstockservices_sel_api,} from "@/assets/js/api";
export default {
    name: "tab4_userChecked",
    data() {
        return {
            /** 個人*/
            user_loading: false,
            user_finished: false,
            user_arr: [],
            user_obj:{
                quser_id:"",
                page: 1,
            },
            time_interval:"",
        }
    },
    methods: {
        /** 自选*/
        fnGOAddMarket() {
            this.$router.push({
                name: "market_addStock",
            })
        },

        /*詳情页*/
        fnGoMarketInfo(item){
            console.log(item);
            this.$router.push({
                name:"market_info",
                query:{
                    systexId: item.systexId,
                    symbol: item.symbol,
                    id: item.qstockservices_id,
                }
            })
            localStorage.setItem("market_tab_active",4);
        },

        /* 個人列表*/
        fnLoadUser_user() {
            QuserQstockservices_sel_api({
                quser_id: localStorage.getItem("userId"),
                page: this.user_obj.page,
            }).then(res => {
                this.user_loading = false;
                if(res.code == 200){
                    console.log(res.data);
                    if (this.user_obj.page == 1) {
                        this.user_arr = res.data
                    } else {
                        this.user_arr = this.user_arr.concat(res.data)
                    }
                    this.user_obj.page++
                    console.log( this.user_obj.page)
                    // 加载状态结束
                    if (res.data.length < 20) {
                        this.user_finished = true;
                        return
                    }
                } else {
                    this.listed_finished = true;
                }
            })
        },
    },
    created() {
        this.fnLoadUser_user();
        
        this.time_interval = setInterval(()=>{
            // console.log("fnGetIndex");
            this.user_obj.page--;
            this.fnLoadUser_user();
        },5000)
    },
    destroyed(){
        clearInterval(this.time_interval);
    },
}
</script>
