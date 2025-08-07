<template>
    <div>
        <navBar navTitle="Mật khẩu quỹ"  />

        <div class="full-width92 pass-box">
            <h4>{{ $t('my_authentication_password.text1') }}</h4>
            <div class="text-note">{{ $t('my_authentication_password.text2') }}</div>
            <!-- 密碼輸入框 -->
            <van-password-input
                :value="t_password"
                :gutter="4"
                :focused="showKeyboard"
                @focus="showKeyboard = true"/>

            <van-number-keyboard
                v-model="t_password"
                :show="showKeyboard"
                @blur="showKeyboard = false"/>

            <van-button block type="info" native-type="submit" class="marTop40" @click="fnBtnSave"
                        v-btn-re-click>{{ $t('my_authentication_password.text3') }}</van-button>

            <van-button block type="text" class="btn-text marTop40" to="my_transaction_password">{{ $t('my_authentication_password.text4') }}</van-button>
        </div>
    </div>
</template>

<script>
export default {
    name: "myAuthentication_password.vue",
    data() {
        return {
            t_password: '',
            showKeyboard: false,
        }
    },
    methods: {
        /*绑定*/
        fnBtnSave(){

        },
    },
    created() {

    },
}
</script>

