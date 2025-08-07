<template>
    <section class="mySet-contain">
        <navBar navTitle="Cài đặt" />
        <main class="full-width92">
            <van-cell-group class="vanCell-padding0">
                <van-cell title="Tên thật" :value="userInfoObj.username" v-if="userInfoObj.username" />
                <van-cell title="Tên thật" is-link to="my_authentication"  v-else />
                <van-cell title="Số tài khoản" :value="userInfoObj.tel" />
                <van-cell title="Đổi mật khẩu" is-link @click="fnGoPassword" />
                <!--<van-cell title="隱私政策" is-link />-->
            </van-cell-group>

            <van-button block class="marTop40 bg-blueLight" @click="fnBtnLogout">{{ $t('my_setup.text1') }}</van-button>
        </main>

    </section>
</template>

<script>
import {del_login_api} from "@/assets/js/api";

export default {
    name: "mySetup",
    data() {
        return {
            userInfoObj:{
                header:"",
                username:"",
                tel:"",
            },
        }
    },
    methods: {
        /*退出登錄*/
        fnBtnLogout(){
            del_login_api().then(res=>{
                if(res.code == 200){
                    this.$toast(res.msg || "Đăng xuất và đăng nhập thành công！");
                    localStorage.removeItem("userId");
                    setTimeout(()=>{
                        this.$router.push({
                            path:"/login"
                        })
                    },1000)
                }
            })
        },

        /*修改密碼  */
        fnGoPassword(){
            this.$router.push({
                name:"my_password",
            })
        },
    },
    created() {
        this.userInfoObj.username = this.$route.query.username;
        this.userInfoObj.tel = this.$route.query.tel;
    },
}
</script>
