<template>
    <div>
        <navBar navTitle="Đổi mật khẩu" />
        <div class="full-width92">
            <van-form ref="refFormPassword" class="public-form">
                <div>
                    <div class="inp-label">{{ $t('my_password.text1') }}</div>
                    <van-field v-model.trim="formPassword.old_password" class="bg-inp" placeholder="Vui lòng nhập mật khẩu hiện tại"
                               clearable type="password"  :rules="[{ required: true, message: 'Vui lòng nhập mật khẩu hiện tại' }]" />
                </div>
                <div>
                    <div class="inp-label">{{ $t('my_password.text2') }}</div>
                    <van-field v-model.trim="formPassword.password" class="bg-inp" placeholder="Vui lòng nhập mật khẩu mới"
                               clearable type="password"  :rules="[{ required: true, message: 'Vui lòng nhập mật khẩu mới' }]"/>
                </div>

                <div>
                    <div class="inp-label">{{ $t('my_password.text3') }}</div>
                    <van-field v-model.trim="formPassword.check_password" class="bg-inp" placeholder="Vui lòng xác nhận mật khẩu mới"
                               clearable type="password"  :rules="[{ required: true, message: 'Vui lòng xác nhận mật khẩu mới' },
                                {validator: checkPass, message: 'Mật khẩu được nhập hai lần không khớp' }]" />
                </div>
            </van-form>

            <van-button block type="info" native-type="submit" class="marTop40" @click="fnBtnSave"
            v-btn-re-click>{{ $t('my_password.text4') }}</van-button>
        </div>
    </div>
</template>

<script>
import {quser_edit_api} from "@/assets/js/api";

export default {
    name: "myPassword",
    data() {
        return {
            formPassword:{
                old_password: "",
                password: "",
                check_password: "",
            },
        }
    },
    methods: {
        /*確認密碼 验证*/
        checkPass(newPass) {
            console.log(newPass);
            return newPass === this.formPassword.password;
            // return /^1\d{10}$/.test(val) // 返回true或false
        },

        fnBtnSave() {
            this.$refs.refFormPassword.validate().then(()=>{
                quser_edit_api({
                    id: localStorage.getItem("userId"),
                    password : this.formPassword.password,
                    old_password : this.formPassword.old_password,
                }).then(res=>{
                    if(res.code == 200){
                        this.$toast(res.msg || "Đặt lại mật khẩu thành công！");
                        localStorage.removeItem("userId");
                        setTimeout(()=>{
                            this.$router.push({
                                path:"/login",
                            })
                        },1000)
                    } else {
                        this.$toast("Mật khẩu hiện tại không chính xác！");
                    }
                })
            }).catch(res=>{})
        }
    },
    created() {

    },
}
</script>
