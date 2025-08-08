<template>
    <div>
        <navBar navTitle="Chuyển đổi tiền tệ" />
        <div class="bgBlock-lightBlue" v-show="activeType==1">{{ $t('my_exchange.text1') }}<span class="color-theme">{{
                 formatCurrency(widthdrawObj.total_money) }}</span></div>
        <div class="bgBlock-lightBlue" v-show="activeType == 2">{{ $t('my_exchange.text1') }}<span class="color-theme">{{
                formatCurrency (widthdrawObj.usd_money) }}</span></div>
        <div class="full-width92">
            <van-row class="money-box" gutter="10">
                <van-col span="12">
                    <div class="money-num" :class="activeType == 1 ? 'van-active' : ''" @click="fnnChangeCard(1)">
                      Đổi sang USD</div>
                </van-col>
                <van-col span="12">
                    <div class="money-num" :class="activeType == 2 ? 'van-active' : ''" @click="fnnChangeCard(2)">
                      Đổi sang VND</div>
                </van-col>
            </van-row>

            <van-form ref="refFormPassword" class="public-form">
                <div>
                    <div class="inp-label">{{ $t('my_exchange.text5') }}</div>
                    <van-field v-model.trim="formExchange.money" class="bg-inp" placeholder="Nhập số tiền"
                        type="number" :rules="[{ validator: checkMoney, message: errMsg }]" />
                </div>
                <div>
                    <div class="inp-label">{{ $t('my_exchange.text6') }}</div>
                    <van-field v-model.trim="formExchange.t_password" class="bg-inp"
                        placeholder="Nhập mật khẩu" clearable type="password"
                        :rules="[{ required: true, message: 'Vui lòng nhập mật khẩu quỹ' }]" />
                </div>
            </van-form>
            <van-button block type="info" native-type="submit" class="marTop40" @click="fnBtnSave" v-btn-re-click>{{ $t('my_exchange.text7') }}</van-button>
          <div> Lưu ý thêm dấu chấm vào phần số tiền  ví dụ là 500.000.000.000 VNĐ</div>
        </div>
    </div>
</template>

<script>
import { quser_sel_api, quser_if_tpwd_api, index_exchange_save_api } from "../../assets/js/api";

export default {
    name: "myWithdraw",
    data() {
        return {
            showCard: false,
            activeType: 1,
            tel:"",
            widthdrawObj: {
                username: "",
                total_money: "",
                usd_money: "",
            },
            formExchange: {
                money: "",
                type: 1,  /* 兑换类型id */
                t_password: "",
            },
            errMsg: "Số tiền rút không được 0",
        }
    },
    methods: {
        checkMoney(val) {
            console.log(val);
            if (val == 0) {
                this.errMsg = "Số tiền trao đổi không được bằng 0！"
                return false
            }
            if (val < 0) {
                this.errMsg = "Số tiền trao đổi không được nhỏ hơn 0!"
                return false
            }
            if (val > Number(this.widthdrawObj.total_money)) {
                this.errMsg = "Số tiền trao đổi không được lớn hơn số dư ！"
                return false
            }
        },

        /*選中卡*/
        fnnChangeCard(val) {
            this.activeType = val;
        },

      formatCurrency(value) {
        if (!value) return '0';
        let stringValue = value.toString();
        // 使用点号(.)作为千分位符号
        return stringValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
      },
        /*提交*/
        fnBtnSave() {
            this.$refs.refFormPassword.validate().then(() => {
                quser_if_tpwd_api({
                    t_password: this.formExchange.t_password,
                }).then(res => {
                    if (res.code == 200) {
                        index_exchange_save_api({
                            exchange_type: this.activeType,
                            money: this.formExchange.money,
                            tel:this.tel,
                        }).then(res => {
                            if (res.code == 200) {
                                this.$toast(res.msg || "Gửi thành công！");
                                setTimeout(() => {
                                    this.$router.push({
                                        path: "/my_transaction_record",
                                        query: {
                                            tabActive: 3,
                                        }
                                    })
                                }, 1000)
                            }
                        })
                    } else {
                        this.$toast("Mật khẩu quỹ không chính xác！");
                    }
                })

            }).catch(res => { })
        },
        fnQuserInfo() {
            quser_sel_api().then(res => {
                this.widthdrawObj.username = res.data.username;
                this.widthdrawObj.total_money = res.data.money;
                this.widthdrawObj.usd_money = res.data.usd_money;
                this.tel=res.data.tel;
            }).catch(err => {
                console.log(err);
            })
        }

    },
    created() {
        this.fnQuserInfo();
    },
}
</script>

<style lang="scss" scoped>
.deposit-note {
    font-size: 12px;
    margin: 6px 0;
}

.money-box {
    margin-top: 20px;

    .money-num {
        background-color: #f1eff0;
        border-radius: 6px;
        margin-bottom: 10px;
        text-align: center;
        height: 42px;
        line-height: 42px;
        font-size: 16px;
        //font-weight: bold;
    }

    .van-active {
        background-color: #3365e3;
        color: #fff;
    }
}

.btn-save {
    margin: 30px auto 10px;
}
</style>