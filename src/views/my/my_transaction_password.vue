<template>
    <div>
        <navBar navTitle="Mật khẩu quỹ" />

        <div class="full-width92">
            <van-form ref="refFormPassword" class="public-form">
                <div v-if="ifTpwd">
                    <div class="inp-label">{{ $t('my_transaction_password.text1') }}</div>
                    <van-field v-model.trim="formPassword.old_password" class="bg-inp" placeholder="Vui lòng nhập mật khẩu quỹ hiện tại"
                               clearable type="password"  :rules="[{ required: true, message: 'Vui lòng nhập mật khẩu quỹ hiện tại' }]" />
                </div>
                <div>
                    <div class="inp-label">{{ $t('my_transaction_password.text2') }}</div>
                    <van-field v-model.trim="formPassword.t_password" class="bg-inp" placeholder="Vui lòng nhập mật khẩu mới để có tiền"
                               clearable type="password"  :rules="[{ required: true, message: 'Vui lòng nhập mật khẩu mới để có tiền' }]"/>
                </div>

                <div>
                    <div class="inp-label">{{ $t('my_transaction_password.text3') }}</div>
                    <van-field v-model.trim="formPassword.check_password" class="bg-inp" placeholder="Vui lòng xác nhận mật khẩu quỹ"
                               clearable type="password"  :rules="[{ required: true, message: 'Vui lòng xác nhận mật khẩu quỹ' },
                                {validator: checkPass, message: 'Mật khẩu được nhập hai lần không khớp' }]" />
                </div>
            </van-form>

            <van-button block type="info" native-type="submit" class="marTop40" @click="fnBtnSave"
                        v-btn-re-click>{{ $t('my_transaction_password.text4') }}</van-button>
        </div>

    </div>
</template>

<script>
import {quser_edit_api} from "@/assets/js/api";
import {quser_if_tpwd_api} from "../../assets/js/api";
export default {
    name: "myPassword",
    data() {
        return {
            ifTpwd: true, /* 是否显示 旧資金密碼 輸入框 */
            formPassword:{
                old_password: "",
                t_password: "",
                check_password: "",
            },
        }
    },
    methods: {
        /*確認密碼 验证*/
        checkPass(newPass) {
            console.log(newPass);
            return newPass === this.formPassword.t_password;
            // return /^1\d{10}$/.test(val) // 返回true或false
        },

        fnBtnSave(){
            this.$refs.refFormPassword.validate().then(()=>{
                quser_edit_api({
                    id: localStorage.getItem("userId"),

                    t_password : this.formPassword.t_password,
                    old_password : this.formPassword.old_password,
                }).then(res=>{
                    if(res.code == 200){
                        this.$toast(res.msg || "Đặt lại mật khẩu thành công！");

                        setTimeout(()=>{
                            this.$router.push({
                                name:"my"
                            })
                        },1000)
                    } else {
                        this.$toast("Mật khẩu quỹ hiện tại không chính xác！");
                    }
                })
            }).catch(res=>{})
        },

        /*验证是否有二级密碼*/
        fnCheckPass(){
            quser_if_tpwd_api().then(res=>{
                if(res.code == 201){
                    this.ifTpwd = false;
                }
            })
        },
    },
    created() {
        this.fnCheckPass();
    },
}
</script>
