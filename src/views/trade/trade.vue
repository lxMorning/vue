<template>
    <div class="bg-gray" style="min-height: 100vh;">
        <van-tabs v-model="tabActive" swipeable class="tab-theme tab-bgGray">
            <van-tab :name="1" title="CP mới">
                <tab1_purchase :tabActive="tabActive" v-if=" tabActive == 1 " />
            </van-tab>
            <van-tab :name="2" title="Đang GD">
                <tab2_ongoing v-if="tabActive == 2" :tabActive="tabActive" @fnBackTab="fnBackTab" />
            </van-tab>
            <van-tab :name="3" title="Đã hủy">
                <tab2_ongoing :tabActive="tabActive" v-if=" tabActive == 3 " />
            </van-tab>
            <van-tab :name="4" title="Vàng Đang GD">
                <tab4_ongoing :tabActive="tabActive" v-if="tabActive == 4" @fnBackTab="fnBackTab"  />
            </van-tab>
            <van-tab :name="5" title="Vàng Đã hủy">
                <tab4_ongoing :tabActive="tabActive" v-if="tabActive == 5" />
            </van-tab>
            <van-tab>

            </van-tab>
        </van-tabs>
    </div>
</template>

<script>
import tab1_purchase from "@/views/trade/components/tab1_purchase";
import tab2_ongoing from "@/views/trade/components/tab2_ongoing";
import tab4_ongoing from '@/views/trade/components/tab4_ongoing'

export default {
    name: "login",
    components: {
        tab1_purchase,
        tab2_ongoing,
        tab4_ongoing
    },
    data() {
        return {
            tabActive: 1,
        };
    },
    methods: {
        /* 切换 */
        fnBackTab(index){
            console.log(index);
            if(index){
                this.tabActive = index;
                return
            }
            
            const trade_tab_active = Number(localStorage.getItem("trade_tab_active"));
            if(trade_tab_active){
                this.tabActive = trade_tab_active;
            }
            setTimeout(()=>{
                localStorage.removeItem("trade_tab_active");
            },1000)
        
        },
    },
    created() {
        // const market_tab_active = localStorage.getItem("trade_tab_active");
        // if (market_tab_active) {
        //     this.tabActive = Number(market_tab_active);
        // }
        this.fnBackTab();
    },
    
};
</script>
