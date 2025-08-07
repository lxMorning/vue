<template>
    <main>
        <!--{{ this.listed_obj }}-->
        <div class="listed-box">
            <van-row class="listed-list-first full-width92">
                <van-col span="8">
                    <div>Lựa chọn vàng </div>
                </van-col>
                <van-col span="8" class="tc">
                    <div>{{ $t('tab6_gc.text2') }}</div>
                </van-col>
                <van-col span="8" class="tr">
                    <div>+/-</div>
                </van-col>
            </van-row>
                <main class="listed-ul">
                    <van-row class="listed-list full-width92"
                        @click="fnGoMarketInfo(listed_arr)">
                        <van-col span="8">
                            <div class="listed-name">{{ listed_arr.symbolName }}</div>
                            <span class="bg-theme">{{ listed_arr.symbol }}</span>
                        </van-col>
                        <van-col span="8" class="tc">
                            <div class="listed-price"
                                :class="listed_arr.regularMarketChangePercent >= 0 ? 'color-green': 'color-red' ">
                                {{ listed_arr.bid || 0 }}
                            </div>
                        </van-col>
                        <van-col span="8" class="tr">
                            <div class="color-white type-num"
                                :class="listed_arr.regularMarketChangePercent >= 0 ? 'bg-green': 'bg-red' ">
                                <span v-if="listed_arr.regularMarketChangePercent >= 0">+</span>
                                <!--<span v-else>-</span>-->
                                <span>{{ listed_arr.regularMarketChangePercent}} %</span>
                            </div>
                        </van-col>
                    </van-row>
                </main>
           

        </div>
    </main>
</template>

<script>
import { index_gold_market_api , apiGoldPrice} from "@/assets/js/api";
import axios from 'axios';
import market_type from "./market_type";
export default {
    name: "tab1_tai",
    components: {
        market_type,
    },
    props:{
        exchange:{
            type:String,
        }
    },
    data() {
        return {
            /** 上市 + 上櫃*/
            time_interval:"",
            
            listed_loading: false,
            listed_finished: false,
            listed_arr: {
                regularMarketChangePercent:0,
                symbolName:"",
                symbol:"",
                bid:"",

            },
            listed_obj:{
                exchange:  "hose",  //TAI=上市,TWO=上柜
                sectorId:  "",
                page: 1,
            },
            
        }
    },
    methods: {
        /** 上市 + 上櫃列表*/
        /*分类选择*/
        fnCheckedType(sectorId){
            console.log(sectorId);
            this.listed_obj.page = 1;
            this.listed_obj.sectorId = sectorId;
            this.fnLoadListed()
        },
        
        /*詳情页*/
        fnGoMarketInfo (item){
          this.$emit("fnGoMarketInfo", item);
        },

        /* 上市 + 上櫃列表*/
        fnLoadListed() {
            index_gold_market_api().then(res=>{
                this.listed_arr=res.data[0];
                this.listed_arr.regularMarketChangePercent = 0;
                this.listed_arr.bid = 0;
            }).catch(err=>{
                console.log(err);
            })
        },

        getLastData(){
            apiGoldPrice().then(res=>{
                this.listed_arr.regularMarketChangePercent = res.data.chp;
                this.listed_arr.bid = res.data.bid;
            }).catch(err=>{
                console.log(err);
            })
        }

    },
    created() {
        this.fnLoadListed();
        this.time_interval = setInterval(()=>{
            this.getLastData();
        },1000)
        
    },
    destroyed(){
        clearInterval(this.time_interval);
    },
}
</script>
