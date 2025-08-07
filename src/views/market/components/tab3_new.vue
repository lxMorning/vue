<template>
    <main class="tab3-purchase-box">
        <ul class="text-note text-note2 listed-ul" v-if="purchase_arr.length === 0">
            <li>{{ $t('tab3_new.text1') }}</li>
        </ul>
        <van-list
            v-model="listed_loading"
            :finished="listed_finished"
            finished-text=""  loading-text="Đang tải……"
            @load="fnLoadListed_new"
            :immediate-check = "false"
            class="new-van-list">
            <div v-for="(item, index) in purchase_arr" :key="index" class="purchase-box">
                <main class="listed-ul">
                    <div class="flex-between purchase-title">
                        <div class="">
                            <span class="purchase-name">{{ item.symbol_name }}</span>
                            <span class="bg-theme">{{ item.symbol }}</span>
                        </div>
                        <div class="color-red">
                            <span class="bg-pink purchase-time-note">{{ $t('tab3_new.text2') }}</span>
                            <span class="purchase-time">{{ item.subscription_period.split("~")[1] }}</span>
                        </div>
                    </div>
                    <van-row class="purchase-content purchase-tab-content">
                        <van-col span="9">
                            <div><span class="color-gray">{{ $t('tab3_new.text3') }}</span>
                                <span v-if="item.can_purchased == 0"> vô hạn</span>
                                <span v-else> {{ item.can_purchased }}mở</span>
                            </div>
                            <div><span class="color-gray">{{ $t('tab3_new.text5') }}</span> {{ item.total_subscription }}mở</div>
                            <div><span class="color-gray">{{ $t('tab3_new.text6') }}</span> {{ item.underwriting_price }}</div>
                        </van-col>
                        <van-col span="9">
                            <div class="color-red">Giá thị trường {{ item.market_price }}</div>
                            <div class="color-red">Truyền đi {{ item.spread }}</div>
                            <div class="color-red"><span class="color-gray">{{ $t('tab3_new.text7') }}</span>
                                {{ (Number(item.yijiacha)*100).toFixed(2) }}%
                            </div>
                        </van-col>
                        <van-col span="6" class="align-sc">
                            <div class="btn-market">
                                <van-button size="small" type="info" disabled v-if="item.type == 'đã hết hạn'">{{ item.type }}</van-button>
                                <van-button size="small" type="info" @click="fnBtnGoPurchase(item)"
                                v-else>{{ item.type }}</van-button>
                            </div>
                        </van-col>
                    </van-row>
                </main>
            </div>
        </van-list>
    </main>
</template>

<script>
import {index_xingu_api,} from "@/assets/js/api";

export default {
    name: "tab3_new",
    data() {
        return {
            /** 新股*/
            purchase_arr:[],
            listed_obj:{
                page:1,
            },
            listed_loading: false,
            listed_finished: false,
        }
    },
    methods: {
        /*进入申購詳情*/
        fnBtnGoPurchase(item) {
            console.log(item);
            this.$router.push({
                name: "market_purchaseInfo",
                query: {
                    id: item.id,
                }
            })
            localStorage.setItem("market_tab_active", 3);
        },
        
        fnLoadListed_new() {
            index_xingu_api({
                page: this.listed_obj.page,
            }).then(res => {
                this.listed_loading = false;
                if(res.code == 200){
                    if (this.listed_obj.page == 1) {
                        this.purchase_arr = res.data;
                    } else {
                        this.purchase_arr = this.purchase_arr.concat(res.data)
                    }
                    this.listed_obj.page++;

                    // 加载状态结束
                    if (res.data.length < 20) {
                        this.listed_finished = true;
                        return
                    }
                } else {
                    this.listed_finished = true;
                }
            })
        },
    
    },
    created() {
        this.fnLoadListed_new();
    },

}
</script>
