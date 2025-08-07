<template>
    <div class="bg-gray" style="height: 100vh;">
        <van-tabs v-model="tabActive" swipeable class="tab-theme tab-bgGray">
            <van-tab :name="1" title="HOSE">
                <tab1_tai :tabActive="tabActive" v-if="tabActive == 1" @fnGoMarketInfo="fnGoMarketInfo" />
            </van-tab>
            <van-tab :name="2" title="HNX">
                <tab1_tai :tabActive="tabActive" v-if="tabActive == 2" @fnGoMarketInfo="fnGoMarketInfo" />
            </van-tab>
            <van-tab :name="5" title="UPCOM">
                <tab1_tai :tabActive="tabActive" v-if="tabActive == 5" @fnGoMarketInfo="fnGoMarketInfo" />
            </van-tab>
            <van-tab :name="6" title="XAU/USDT">
                <tab6_gc v-if="tabActive == 6" @fnGoMarketInfo="fnGoGoldMarketInfo" />
            </van-tab>
            <van-tab :name="3" title="CP mới">
                <tab3_new v-if="tabActive == 3" />
            </van-tab>
            <van-tab :name="4" title="Theo dõi">
                <tab4_userChecked v-if="tabActive == 4" />
            </van-tab>
        </van-tabs>
    </div>
</template>

<script>

import tab1_tai from "./components/tab1_tai";
import tab3_new from "./components/tab3_new";
import tab4_userChecked from "./components/tab4_userChecked";
import tab6_gc from "./components/tab6_gc.vue";
export default {
    name: "market",
    components: {
        tab1_tai,
        tab3_new,
        tab4_userChecked,
        tab6_gc
    },
    data() {
        return {
            tabActive: 1,
        };
    },
    methods: {
        /* 切换 */
        fnBackTab() {
            this.tabActive = Number(localStorage.getItem("market_tab_active"));
            setTimeout(() => {
                localStorage.removeItem("market_tab_active");
            }, 1000)

        },
        /*进入詳情*/
        fnGoMarketInfo(item) {
            console.log(item);
            this.$router.push({
                name: "market_info",
                query: {
                    systexId: item.systexId,
                    symbol: item.symbol,
                    id: item.id,
                }
            })
            localStorage.setItem("market_tab_active", this.tabActive);
        },
        fnGoGoldMarketInfo(item) {
            console.log(item);
            this.$router.push({
                name: "gold_market_info",
                query: {
                    systexId: item.systexId,
                    symbol: item.symbol,
                    id: item.id,
                }
            })
            localStorage.setItem("market_tab_active", this.tabActive);
        },

    },
    created() {
        // const market_tab_active = localStorage.getItem("market_tab_active");
        // if(market_tab_active){
        //     this.tabActive = Number(market_tab_active);
        // }
        this.fnBackTab();

    },

};
</script>
