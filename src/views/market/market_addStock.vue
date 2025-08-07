<template>
    <div>
        <navBar :navTitle="navTitle" />
        <div class="full-width">
            <van-search v-model="listed_obj.where" placeholder="tên/mã"  @search="fnSearch" class="index-search"/>
        </div>
        <div class="full-width92">
            <div class="flex-between">
                <div class="font12  color-gray">{{ $t('market_addStock.text1') }}</div>
                <van-icon name="delete-o" @click="fnRemoveHistory" />
            </div>
            
            <div class="addStock-history">
                <div v-if="addWordArr.length > 0">
                    <span class="bg-gray bg-span" v-for="(item, index) in  addWordArr" :key="index"
                                   @click="fnAddStock(item)">{{item}}</span>
                </div>
                <div v-else class="color-gray font12">{{ $t('market_addStock.text2') }}</div>
       
            </div>
    
            <div class="addStock-title  color-gray">{{ $t('market_addStock.text3') }}</div>
        </div>
       
        <van-list
            v-model="listed_loading"
            :finished="listed_finished"
            finished-text=""  loading-text="Đang tải……"
            :immediate-check = "false"
            @load="fnLoadListed"
            class="addStock-van-list listed-van-list">
            <main class="listed-ul">
                <van-row v-for="(item, index) in listed_arr" :key="index" class="listed-list full-width92"
                         @click="fnGoMarketInfo(item)">
                    <van-col span="8">
                        <div class="listed-name">{{ item.symbolName }}</div>
                        <span class="bg-theme">{{ item.symbol }}</span>
                    </van-col>
                    <van-col span="8" class="tc">
                        <div class="listed-price" :class="item.regularMarketChangePercent >= 0 ? 'color-green': 'color-red' ">
                            {{ formatPrice(item.bid) || 0.00 }}
                        </div>
                    </van-col>
                    <van-col span="8" class="tr">
                        <div class="color-white type-num" :class=" item.regularMarketChangePercent >= 0 ? 'bg-green': 'bg-red' ">
                            <span v-if="item.regularMarketChangePercent >= 0">+</span>
                            <span v-else></span>
                            <span>{{ Number(item.regularMarketChangePercent).toFixed(2) || 0 }} %</span>
                        </div>
                    </van-col>
                </van-row>
            </main>
        </van-list>

    </div>
</template>

<script>
import {index_Qstockservices_sel_api} from "@/assets/js/api";

export default {
    name: "addStock",
    data() {
        return {
            navTitle:"Tìm kiếm",

            /** 上市 + 上櫃*/
            listed_loading: false,
            listed_finished: false,
            listed_arr: [],
            listed_obj:{
                where:  "",
                page: 1,
            },
            addWordArr:[]
        }
    },
    methods: {
        fnSearch(val){
            this.listed_obj.page= 1;
            this.fnLoadListed();
            if(val){
                this.addWordArr.unshift(this.listed_obj.where);
                this.addWordArr = [...new Set(this.addWordArr)];
                localStorage.setItem('addWordArr',JSON.stringify(this.addWordArr));
            }
        },
        fnRemoveHistory(){
            this.addWordArr = [];
            localStorage.removeItem('addWordArr');
        },
        fnAddStock(text){
            this.listed_obj.where = text;
            this.fnSearch();
        },
        /*詳情页*/
        fnGoMarketInfo (item){
            this.$router.push({
                name:"market_info",
                query:{
                    systexId: item.systexId,
                    symbol: item.symbol,
                    id: item.id,
                }
            })
        },
      formatPrice(price) {
        // 如果价格不存在，返回默认值
        if (!price) return '0.00';

        // 转换为字符串处理
        let priceStr = price.toString();

        // 如果包含小数点
        if (priceStr.includes('.')) {
          const parts = priceStr.split('.');
          // 如果小数点后不是两位数，则补足到两位
          if (parts[1].length < 2) {
            parts[1] = parts[1].padEnd(2, '0');
          } else if (parts[1].length > 2) {
            // 如果超过两位，保留两位小数
            parts[1] = parts[1].substring(0, 2);
          }
          return parts.join('.');
        } else {
          // 如果不包含小数点，直接添加 .00
          return priceStr + '.00';
        }
      },
        /* 上市 + 上櫃列表*/
        fnLoadListed() {
            this.listed_loading = true;
            index_Qstockservices_sel_api({
                where: this.listed_obj.where,
                page: this.listed_obj.page,
            }).then(res => {
                if(res.code == 200){
                    if (this.listed_obj.page == 1) {
                        this.listed_arr = res.data;
                    } else {
                        this.listed_arr = this.listed_arr.concat(res.data)
                    }
                    this.listed_loading = false;
                    this.listed_obj.page++;

                    // 加载状态结束
                    if (res.data.length < 20) {
                        this.listed_finished = true;
                        return
                    }
                }
            })
        },

    },
    created() {
        const searchVal = this.$route.query.searchVal;
        if(searchVal){
            this.addWordArr.unshift(searchVal);
            this.listed_obj.where = searchVal;
        }
        const localVal = localStorage.getItem("addWordArr");
        if(localVal){
            this.addWordArr = JSON.parse(localVal);
        }
       
        this.fnLoadListed();
    },
}
</script>
