
<template>
    <div>
        <navBar navTitle="Kênh giá trị được lưu trữ" />
        <van-tabs v-model="depositForm.qpassageway_id"  @click="fnChangeTab" swipeable class="tab-deposit tab-bgGray">
            <van-tab :title="`lối đi${index+1}`" :name="tabItem.id" v-for="(tabItem, index) in tabArr" :key="tabItem.id">

                <section class="full-width92 deposit-box">
                    <van-row class="deposit-list borderBtm">
                        <van-col span="8">{{ $t('my_deposit_passageway.text1') }}</van-col>
                        <van-col span="8">
                            <div class="text-note"> {{ tabItem.card_name }} </div>
                            <!--<van-field clearable v-model.trim="tabItem.card_name" placeholder="帳戶戶名" />-->
                        </van-col>
                        <van-col span="8" class="tr">
                            <van-button class="btn-copy" @click="fnBtnCopy(tabItem.card_name)">{{ $t('my_deposit_passageway.text2') }}</van-button>
                        </van-col>
                    </van-row>

                    <van-row class="deposit-list borderBtm">
                        <van-col span="8">{{ $t('my_deposit_passageway.text3') }}</van-col>
                        <van-col span="8">
                            <div class="text-note"> {{ tabItem.card_id }} </div>
                            <!--<van-field clearable  v-model.trim="tabItem.card_id" placeholder="帳戶帳號" />-->
                        </van-col>
                        <van-col span="8" class="tr">
                            <van-button class="btn-copy" @click="fnBtnCopy(tabItem.card_id)">{{ $t('my_deposit_passageway.text2') }}</van-button>
                        </van-col>
                    </van-row>

                    <van-row class="deposit-list borderBtm">
                        <van-col span="8">{{ $t('my_deposit_passageway.text5') }}</van-col>
                        <van-col span="8">
                            <div class="text-note"> {{ tabItem.branch_name }} </div>
                            <!--<van-field clearable  v-model.trim="tabItem.branch_name" placeholder="收款銀行" />-->
                        </van-col>
                        <van-col span="8" class="tr">
                            <van-button class="btn-copy" @click="fnBtnCopy(tabItem.branch_name)">{{ $t('my_deposit_passageway.text2') }}</van-button>
                        </van-col>
                    </van-row>

                    <van-row class="deposit-list borderBtm">
                        <van-col span="8">{{ $t('my_deposit_passageway.text7') }}</van-col>
                        <van-col span="8">
                            <div class="text-note"> {{ tabItem.card_branch }} </div>
                            <!--<van-field clearable  v-model.trim="tabItem.card_branch" placeholder="收款分行" />-->
                        </van-col>
                        <van-col span="8" class="tr">
                            <van-button class="btn-copy" @click="fnBtnCopy(tabItem.card_branch)">{{ $t('my_deposit_passageway.text2') }}</van-button>
                        </van-col>
                    </van-row>

                    <!--<van-row class="deposit-list borderBtm">-->
                    <!--    <van-col span="8">收款地址</van-col>-->
                    <!--    <van-col span="8">-->
                    <!--        <div class="text-note"> {{ tabItem.address }} </div>-->
                    <!--        &lt;!&ndash;<van-field clearable  v-model.trim="tabItem.address" placeholder="收款地址" />&ndash;&gt;-->
                    <!--    </van-col>-->
                    <!--    <van-col span="8" class="tr">-->
                    <!--        <van-button class="btn-copy" @click="fnBtnCopy(tabItem.address)">複製</van-button>-->
                    <!--    </van-col>-->
                    <!--</van-row>-->

                    <van-row class="deposit-list borderBtm">
                        <van-col span="8">{{ $t('my_deposit_passageway.text9') }}</van-col>
                        <van-col span="8">
                            <div class="text-note"> {{ tabItem.branch_number }} </div>
                            <!--<van-field clearable  v-model.trim="tabItem.branch_number" placeholder="銀行代碼" />-->
                        </van-col>
                        <van-col span="8" class="tr">
                            <van-button class="btn-copy" @click="fnBtnCopy(tabItem.branch_number)">{{ $t('my_deposit_passageway.text2') }}</van-button>
                        </van-col>
                    </van-row>

                    <van-row class="deposit-list borderBtm">
                        <van-col span="8">{{ $t('my_deposit_passageway.text11') }}</van-col>
                        <van-col span="18" class="tr color-theme money-text">{{ showmoney  }}</van-col>
                    </van-row>

                    <div class="passageway-note">{{ $t('my_deposit_passageway.text12') }}</div>
                    <van-button block type="info" class="marTop20 btn-save" @click="fnSave" v-btn-re-click>{{ $t('my_deposit_passageway.text13') }}</van-button>

                </section>
            </van-tab>
        </van-tabs>
    </div>
</template>

<script>
import {qpassageway_sel_api , qrecharge_add_api } from "@/assets/js/api";

export default {
    name: "myDeposit_passageway.vue",
    data() {
        return {
            tabArr:[],
            depositForm:{
                qpassageway_id: 0,
                money: 10 ,
                tel:"",
            },
			showmoney:0,
        }
    },
    methods: {
        /*tab 切换*/
        fnChangeTab(name){
            console.log(name);
        },

        fnSave(){
            qrecharge_add_api(this.depositForm).then(res=>{
                if(res.code == 200){
                    this.$toast(res.msg || "Giá trị được lưu trữ thành công！");
                    setTimeout(()=>{
                        this.$router.push({
                            path:"/my_transaction_record",
                            query:{
                                tabActive:2,
                            }
                        })
                    },1000)
                }
            })
        },

        /*獲取通道信息*/
        fnGetList(){
            qpassageway_sel_api().then( res => {
                if(res.code == 200){
                    this.tabArr = res.data;
                    this.qpassageway_id = res.data[0].id;
                }
            })
        },

        fnCopy(copyText){

            let textArea = document.createElement("textarea");
            textArea.style.position = 'fixed';
            textArea.style.top = '0';
            textArea.style.left = '0';

            textArea.style.opacity = '0';

            textArea.style.width = '2em';
            textArea.style.height = '2em';
            textArea.style.padding = '0';
            textArea.style.border = 'none';
            textArea.style.outline = 'none';
            textArea.style.boxShadow = 'none';
            textArea.style.background = 'transparent';
            textArea.value = copyText;
            document.body.appendChild(textArea);
            textArea.select();

            try {
              
                const successful = document.execCommand('copy');
                const msg = successful ? 'Đã sao chép thành công vào pasteboard' : 'Trình duyệt này hiện không hỗ trợ sao chép vào bảng dán';
                // alert(msg);
                this.$toast(msg);
            } catch (err) {
                this.$toast("Trình duyệt này hiện không hỗ trợ sao chép vào bảng dán");
            }

        },
        fnBtnCopy(copyText){
            this.fnCopy(copyText);
            // this.$toast(item.wxNumber);
        },
		toThousands(num) {
		    return (num || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1.');
		}
    },
    created() {
        this.depositForm.tel = JSON.parse(localStorage.getItem("userObj")).tel;
        this.depositForm.money = this.$route.query.money;
		this.showmoney = this.toThousands(this.depositForm.money);
        this.fnGetList();
    },
}
</script>
<style lang="scss" scoped>
.text-note{
    text-align: left !important;
    font-size: 14px;
}
.deposit-box{
    .deposit-list{
        display: flex;
        align-items: center;
        height: 80px;
        .btn-copy{
            background-color: #ebeffe;
            color: #3365e3;
            padding: 4px 14px;
            font-size: 12px;
            border-radius: 3px;
            height: auto;
        }
    }
    .money-text{
        font-size: 16px;
        font-weight: bold;
    }
}
.passageway-note{
    background-color: #f0f0f0;
    margin-top: 30px;
    padding: 10px;
    border-radius: 3px;
    font-size: 12px;
}
</style>