<template>
    <div>
        <navBar navTitle="Thông tin cá nhân" />
        <main class="full-width92">
            <div class="my-header">
                <van-image :src="userInfoObj.userHeader ? userInfoObj.userHeader : defaultHeader"/>
            </div>

            <van-cell-group class="vanCell-padding0">
                <van-cell title="Họ và tên" :value="userInfoObj.username" />
                <van-cell title="Số CMND/CCCD" :value="userInfoObj.name_id" />
                <van-cell title="Trạng thái xác minh" :value="userInfoObj.status" />
            </van-cell-group>
        </main>
    </div>
</template>

<script>
import defaultHeader from '@/assets/images/default_avatar.svg'
export default {
    name: "myAuthentication_success.vue",
    data() {
        return {
            defaultHeader,
            userInfoObj:{
                header:"",
                username:"",
                name_id:"",
                status:"",
            },
        }
    },
    methods: {},
    created() {
        this.userInfoObj.username = this.$route.query.username;
        this.userInfoObj.name_id = this.$route.query.name_id;
        this.userInfoObj.status = this.$route.query.status;
    },
}
</script>
<style scoped lang="scss">
.my-header{
    padding-top: 20px;
    text-align: center;
}

</style>