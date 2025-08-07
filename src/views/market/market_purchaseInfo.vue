<template>
    <div  class="bg-gray" style="min-height: 100vh;">
        <navBar navTitle="Chi tiết đăng ký" />
        <div class="purchase-box">
            <div class="flex-between purchase-title">
                <div class="">
                    <span class="purchase-name">{{ purchase_obj.symbol_name }}</span>
                    <span class="bg-theme">{{ purchase_obj.symbol }}</span>
                </div>
                <div class="color-red">
                    <span class="bg-pink purchase-time-note">{{ $t('market_purchaseInfo.text1') }}</span>
                    <span class="purchase-time">{{ purchase_obj.jiezhi_date }}</span>
                </div>
            </div>

            <van-row class="purchase-content" gutter="16">
                <van-col span="12">
                    <div class="flex-between"><span class="color-gray">{{ $t('market_purchaseInfo.text2') }}</span>
                        {{ can_buy_num }}
                        <!--<span v-if="can_buy_num == 0">不限</span>-->
                        <!--<span v-else>{{can_buy_num }}張</span>-->
                        </div>
                    <div class="flex-between"><span class="color-gray">{{ $t('market_purchaseInfo.text3') }}</span> {{ purchase_obj.total_subscription }}mở</div>
                    <div class="flex-between"><span class="color-gray">{{ $t('market_purchaseInfo.text4') }}</span> {{ purchase_obj.underwriting_price }}</div>

                </van-col>
                <van-col span="12">
                    <div class="color-red flex-between"><span>{{ $t('market_purchaseInfo.text5') }}</span> {{ purchase_obj.market_price }}</div>
                    <div class="color-red flex-between"><span>{{ $t('market_purchaseInfo.text6') }}</span> {{ purchase_obj.spread }}</div>
                    <div class="color-red flex-between"><span class="color-gray">{{ $t('market_purchaseInfo.text7') }}</span> {{ (purchase_obj.yijiacha*100).toFixed(2) }}%</div>

                </van-col>
            </van-row>

        </div>

        <van-row class="purchaseInfo-day">
            <van-col span="6" v-for="(item, index) in purchaseTimeArr" :key="index">
                <h4>{{ item.name }}</h4>
                <div class="purchase-day-time">{{ item.day }}</div>
            </van-col>
        </van-row>

        <van-row class="purchaseInfo-content">
            <van-col span="12">
                <div class="purchaseInfo-list">
                    <div class="color-gray">{{ $t('market_purchaseInfo.text8') }}</div>
                    <div>{{ purchase_obj.issue_market }}</div>
                </div>
                <div class="purchaseInfo-list">
                    <div class="color-gray">{{ $t('market_purchaseInfo.text9') }}</div>
                    <div>{{ purchase_obj.winning_rate }}%</div>
                </div>
<!--                <div class="purchaseInfo-list">-->
<!--                    <div class="color-gray">主办券商</div>-->
<!--                    <div>  </div>-->
<!--                </div>-->
            </van-col>
            <van-col span="12">
                <div class="purchaseInfo-list">
                    <div class="color-gray">{{ $t('market_purchaseInfo.text10') }}</div>
                    <div>{{purchase_obj.underwriting_price }}</div>
                </div>
<!--                <div class="purchaseInfo-list">-->
<!--                    <div class="color-gray">暂时承銷價</div>-->
<!--                    <div>  </div>-->
<!--                </div>-->
                <div class="purchaseInfo-list">
                    <div class="color-gray">{{ $t('market_purchaseInfo.text11') }}</div>
                    <div>{{ purchase_obj.quser_money }}</div>
                </div>
            </van-col>
        </van-row>

        <div class="purchase-buyNum">
            <b>{{ $t('market_purchaseInfo.text12') }}</b>
            <van-field v-model="can_buy_num2" type="number" placeholder="Vui lòng nhập số lượng đơn đăng ký" />
        </div>

        <van-button block type="info" class="bg-save btn-wid92" @click="fnBtnSave"
        v-btn-re-click>{{ $t('market_purchaseInfo.text13') }}</van-button>
    </div>
</template>

<script>
import {index_qxingushengou_add_api, index_xingu_details_api} from "@/assets/js/api";

export default {
    name: "purchaseInfo",
    data() {
        return {
            buyNum:null,
            purchase_obj:{
                can_purchased:1,
            },
            market_id:0,
            purchaseTimeArr:[
                {
                    name:"Khoảng thời gian đăng ký",
                    day:"2021/01/10",
                }, {
                    name:"Ngày rút thăm",
                    day:"2021/01/10",
                }, {
                    name:"Ngày ghi nợ",
                    day:"2021/01/10",
                }, {
                    name:"Ngày nhận phiếu",
                    day:"2021/01/10",
                },
            ],
            can_buy_num: "",
            can_buy_num2: 1,
        }
    },
    methods: {
        fnBtnSave(){
            /*上限 判断*/
            // if(this.purchase_obj.can_purchased > this.purchase_obj.total_subscription){
            //     this.$toast("可申請數量超出上限！");
            //     return
            // }
            if(!this.can_buy_num2){
                this.$toast("Số lượng ứng dụng không được để trống！");
                return
            }
            if(this.can_buy_num2 < 0){
                this.$toast("Số lượng ứng dụng có thể được áp dụng không được ít hơn 0！");
                return
            }
    
            console.log(
                this.can_buy_num2,
                this.market_id,
            )
         
            index_qxingushengou_add_api({
                quser_id:localStorage.getItem("userId"),
                // can_purchased:this.purchase_obj.can_purchased,
                can_purchased:this.can_buy_num2,
                qstocks_new_id:this.market_id,
            }).then(res => {
                if(res.code == 200){
                    this.$toast(res.msg);
                    setTimeout(()=>{
                        this.$router.push({
                            name:"trade",
                        })
                    },1000)
                } else {
                    this.$toast(res.msg);
                }
            })
        },
        
        fnGetInfo(){
            index_xingu_details_api({
                id: this.market_id,
                quser_id:localStorage.getItem("userId"),
            }).then(res => {
                if(res.code == 200){
                    this.purchase_obj =res.data;
                    // console.log(res.data.can_purchased);
                    this.can_buy_num = res.data.can_purchased;
                    this.purchaseTimeArr[0].day = res.data.subscription_period;
                    this.purchaseTimeArr[1].day = res.data.draw_date;
                    this.purchaseTimeArr[2].day = res.data.yukoukuan;
                    this.purchaseTimeArr[3].day = res.data.roll_date;
                }
            })
        },
    },
    created() {
        this.market_id = this.$route.query.id;
        this.fnGetInfo();
    },
}
</script>
<style lang="scss" scoped>
.purchaseInfo-day{
    padding: 10px;
    background-color: #fff;
    text-align: center;
    .purchase-day-time{
        font-size: 12px;
        color: #abaaad;
        margin-top: 4px;
    }
}
.purchaseInfo-content{
    background-color: #fff;
    padding: 10px 16px 0;
    margin-top: 6px;
    .purchaseInfo-list{
        border-bottom: solid 1px #d5d2d5;
        padding: 10px 0;
        div:last-child{
            min-height: 25px;
        }
        &:last-child{
            border-bottom: 0;
        }
        .color-gray{
            margin-bottom: 4px;
        }
    }
}
.purchase-buyNum{
    background-color: #fff;
    padding: 10px 16px;
    margin-top: 6px;
    .van-cell{
        padding: 4px 0;
        border-bottom: solid 1px #d5d2d5;
    }
}
.bg-save{
    margin: 30px auto 10px;
}
</style>