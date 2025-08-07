<template>
    <main class="trade-box">
      
        <van-list
            v-model="listed_loading"
            :finished="listed_finished"
            finished-text=""  loading-text="Đang tải……"
            @load="fnLoadListed"
            :immediate-check = "false"
            class="trade-new-van-list">
            <ul class="text-note text-note2 listed-ul" v-if="listed_arr.length === 0">
                <li>{{ $t('tab1_purchase.text1') }}</li>
            </ul>
            <ul class="listed-ul">
                <li v-for="(item, index) in listed_arr" :key="index">
                    <div class="flex purchase-title">
                        <span class="purchase-name">{{ item.symbol_name }}</span>
                        <span class="bg-theme">{{ item.symbol }}</span>
                    </div>
                    <van-row class="purchase-content">
                        <van-col span="15">
                            <div><span class="color-gray">{{ $t('tab1_purchase.text2') }}</span> {{ item.shengou_money }}</div>
                            <div><span class="color-gray">{{ $t('tab1_purchase.text3') }}</span> {{ item.shengou_num }}</div>
							<div><span class="color-gray">{{ $t('tab1_purchase.text4') }}</span> {{ item.draw_date }}</div>
							<div><span class="color-gray">{{ $t('tab1_purchase.text5') }}</span> {{ item.roll_date }}</div>
                        </van-col>
                        <van-col span="15">
                            <div><span class="color-gray">{{ $t('tab1_purchase.text6') }}</span> {{ item.zhongqian_num }}</div>
							<div><span class="color-gray">{{ $t('tab1_purchase.text7') }}</span> {{ item.yirenji_money >= item.zhongqian_renji_money ? 0.00 : (item.zhongqian_renji_money || 0.00) }}</div>
							<div><span class="color-gray">{{ $t('tab1_purchase.text8') }}</span> {{ item.yirenji_money }}</div>
							<div><span class="color-gray">{{ $t('tab1_purchase.text9') }}</span> {{ item.yukoukuan }}</div>
                        </van-col>
                        
                    </van-row>
					<div class="align-sc">
					    <div class="btn-market">
					        <!--status 0 待中籤 3 认缴成功-->
					        <van-button size="small" @click="fnBtnTradePurchase(item)"
					        v-if="item.status == 0 " type="info">{{ item.status_name }}</van-button>
					        <van-button size="small" @click="fnBtnTradePurchase(item)"
					        v-else-if="item.status == 3 " class="bgRed">{{ item.status_name }}</van-button>
					        <van-button size="small" @click="fnBtnTradePurchase(item)"
					        v-else="item.status == 0 " class="bgGreen">{{ item.status_name }}</van-button>
					    </div>
					</div>
                </li>
            </ul>
        </van-list>
    </main>
</template>

<script>
import {index_qxingushengou_sel_api} from "@/assets/js/api";

export default {
    name: "tab1_purchase",
    data() {
        return {
            listed_loading: false,
            listed_finished: false,
            listed_arr: [],
            listed_obj:{
                page: 1,
            },
            
        }
    },
    methods: {
        /*狀態*/
        fnBtnTradePurchase(item) {
            console.log(item)
        },
    
        fnLoadListed(){
            index_qxingushengou_sel_api({
                page:this.listed_obj.page,
                quser_id:localStorage.getItem("userId"),
            }).then(res => {
                this.listed_loading = false;
                if(res.code == 200){
                    if (this.listed_obj.page == 1) {
                        this.listed_arr = res.data;
                    } else {
                        this.listed_arr = this.listed_arr.concat(res.data)
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
        }
    },
    created() {
        this.fnLoadListed();
    },
}
</script>
<style lang="scss" scoped>
.btn-market {
	//text-align: left;
	padding-bottom: 20px;
	margin-right: 16px;;
    .van-button {
        padding: 6px 10px;
        min-width: 70px;
        text-align: center;
    }
}
</style>