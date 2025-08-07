<template>
    <div>
        <navBar :navTitle="$t('my_transaction_record.title')" />
        <van-tabs v-model="tabActive"  @click="fnChangeTab" swipeable class="tab-deposit tab-bgGray">
            <van-tab :title="$t('my_transaction_record.tradeTab')" name="1">
                <tab1_trade :tabActive="tabActive"
                            v-if=" tabActive == 1 "/>
            </van-tab>
            
            <van-tab :title="$t('my_transaction_record.rechargeTab')" name="2">
                <tab2_recharge
                    :transactionArr="transactionArr"
                    :tabActive="tabActive"
                    v-if=" tabActive == 2 "
                />
            </van-tab>
            <van-tab :title="$t('my_transaction_record.withdrawTab')" name="3">
                <tab2_recharge
                    :transactionArr="transactionArr"
                    :tabActive="tabActive"
                    v-if=" tabActive == 3 "
                />
            </van-tab>
        </van-tabs>
    </div>
</template>

<script>
import { qrecharge_sel_api, Qwithdrawal_sel_api } from "@/assets/js/api";
import tab2_recharge from "@/views/my/my_transaction/tab2_recharge";
import tab1_trade from "@/views/my/my_transaction/tab1_trade";

export default {
    name: "my_transaction_record",
    components: {
        tab1_trade,
        tab2_recharge,
    },
    data() {
        return {
            tabActive: 1,
            tabArr: [
                { id: 1, name: this.$t('my_transaction_record.trade') },
                { id: 2, name: this.$t('my_transaction_record.recharge') },
                { id: 3, name: this.$t('my_transaction_record.withdraw') },
            ],
            /*充值和提现数据*/
            transactionArr: [],
        };
    },
    methods: {
        fnChangeTab(tabActive) {
            console.log(tabActive);
            this.fnGetTabList(tabActive);
        },

        fnGetTabList(tabActive) {
            if (tabActive == 2) {
                this.fnGetQrecharge();
            }
            if (tabActive == 3) {
                this.fnGetQwith();
            }
        },

        fnGetQwith() {
            Qwithdrawal_sel_api().then(res => {
                if (res.code == 200) {
                    this.transactionArr = res.data;
                } else {
                    this.transactionArr = [];
                }
            });
        },

        fnGetQrecharge() {
            qrecharge_sel_api().then(res => {
                if (res.code == 200) {
                    this.transactionArr = res.data;
                } else {
                    this.transactionArr = [];
                }
            });
        },
    },
    created() {
        const tabActive = Number(this.$route.query.tabActive);
        if (tabActive) {
            this.tabActive = tabActive;
        }
        this.fnGetTabList(this.tabActive);
    },
};
</script>
