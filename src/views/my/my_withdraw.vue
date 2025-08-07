<template>
    <div>
        <navBar navTitle="rút tiền" />
        <div class="bgBlock-lightBlue">{{ $t('my_withdraw.text1') }}<span class="color-theme">{{ widthdrawObj.total_money }}</span></div>
        <div class="full-width92">
            <van-cell-group class="vanCell-padding0">
                <van-cell title="chủ thẻ" :value="widthdrawObj.username" />
                <van-cell title="Tài khoản ngân hàng" @click="fnBtnCard" isLink>
                    <template #default>
                        <ul class="tr">
                            <li>{{ cardInfo.card_type }}</li>
                            <li>{{ cardInfo.card_id }}</li>
                        </ul>
                    </template>
                </van-cell>
            </van-cell-group>

            <van-popup v-model="showCard" position="bottom">
                <van-picker
                    show-toolbar
                    confirm-button-text="xác nhận"
					cancel-button-text="Hủy"
                    :columns="cardArr"
                    @confirm="fnnChangeCard"
                    @cancel="showCard = false">
                    <template #option="option">
                        <div>{{ option.card_type }} - {{ option.card_id }}</div>
                    </template>
                </van-picker>
            </van-popup>

            <van-form ref="refFormPassword" class="public-form">
                <div>
                    <div class="inp-label">{{ $t('my_withdraw.text2') }}</div>
                    <van-field v-model.trim="formWidthdraw.money" class="bg-inp" placeholder="Vui lòng nhập số tiền rút"
                               type="number" :rules="[{validator: checkMoney, message: errMsg }]"/>
                </div>
                <div>
                    <div class="inp-label">{{ $t('my_withdraw.text3') }}</div>
                    <van-field v-model.trim="formWidthdraw.t_password" class="bg-inp" placeholder="Vui lòng nhập mật khẩu quỹ"
                               clearable type="password"  :rules="[{ required: true, message: 'Vui lòng nhập mật khẩu quỹ' }]"/>
                </div>
            </van-form>
            <van-button block type="info" native-type="submit" class="marTop40" @click="fnBtnSave"
            v-btn-re-click>{{ $t('my_withdraw.text4') }}</van-button>
        </div>
    </div>
</template>

<script>
import {quser_if_tpwd_api, qcard_sel_api ,Qwithdrawal_add_api} from "../../assets/js/api";

export default {
    name: "myWithdraw",
    data() {
        return {
            showCard:false,
            cardArr:[],

            widthdrawObj:{
                username:"",
                total_money: "",
            },
            formWidthdraw:{
                money: "",
                qcard_id:"1",  /* 卡id */
                t_password:"",

            },
            cardInfo:{},
            errMsg:"Số tiền rút không được 0",
        }
    },
    methods: {
        fnBtnCard(){
            if(this.cardArr.length > 0){
                this.showCard = true;
            } else {
                this.showCard = false;
    
                this.$dialog.confirm({
                    title: '',
                    message: 'Bạn chưa ràng buộc thẻ, bạn muốn ràng buộc thẻ ngay lập tức？',
                    confirmButtonText:"xác nhận",
					cancelButtonText:'Hủy',
                })
                    .then(() => {
                        this.$router.push({
                            name:"my_cardManage_Bind",
                        })
                    })
                    .catch(() => {
                        // on cancel
                    });
            }
            
        },
        checkMoney(val){
            console.log(val);
            if(val == 0){
                this.errMsg = "Số tiền rút không được 0！"
                return false
            }
            if(val < 0){
                this.errMsg = "Số tiền rút không được nhỏ hơn 0！"
                return false
            }
            if(val > Number(this.widthdrawObj.total_money)){
                this.errMsg = "Số tiền rút không được lớn hơn số tiền rút tài khoản！"
                return false
            }
        },

        /*選中卡*/
        fnnChangeCard(val){
            console.log(val);
            this.cardInfo = val;
            this.showCard = false;
        },
        /*提交*/
        fnBtnSave(){
            if(!this.cardInfo.card_id){
                this.$toast({ type: 'danger', message: 'Vui lòng điền tài khoản ngân hàng！' });
                return
            }
            this.$refs.refFormPassword.validate().then(()=>{
                quser_if_tpwd_api({
                    t_password: this.formWidthdraw.t_password,
                }).then(res => {
                    if(res.code == 200){
                        Qwithdrawal_add_api({
                            qcard_id:this.cardInfo.id,
                            money:this.formWidthdraw.money,
                    }).then(res => {
                            if(res.code == 200){
                                this.$toast(res.msg || "Gửi thành công！");
                                setTimeout(()=>{
                                    this.$router.push({
                                        path:"/my_transaction_record",
                                        query:{
                                            tabActive:3,
                                        }
                                    })
                                },1000)
                            }
                        })
                    } else {
                        this.$toast("Mật khẩu quỹ không chính xác！");
                    }
                })

            }).catch(res=>{})
        },

        /*获取 銀行卡 列表*/
        fnGerCardList(){
            qcard_sel_api().then(res=>{
                if(res.code == 200){
                    this.cardArr = res.data;
                } else {
                    this.cardArr = [];
                }
            })
        },
    },
    created() {
        this.widthdrawObj.username = this.$route.query.username;
        this.widthdrawObj.total_money = this.$route.query.money;

        this.fnGerCardList();
    },
}
</script>
