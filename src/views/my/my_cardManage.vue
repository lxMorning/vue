<template>
    <div>
        <navBar navTitle="Quản lý tài khoản ngân hàng" @click="fnBtnLeft" prevPath="my" />
        <div class="full-width92">
            <div v-if="cardArr.length == 0" class="card-list">{{ $t('my_cardManage.text1') }}</div>
            <div class="card-list" v-for="item in cardArr" :key="item.id">
                <div class="flex-between">
                    <div>{{ item.card_type }}</div>
                    <div class="btn-market">
                        <van-button block native-type="submit" size="mini" @click="fnDelCard(item)">{{ $t('my_cardManage.text2') }}</van-button>
                    </div>

                </div>
                <div class="card-text">{{ item.card_id | hideBankCard }}</div>
            </div>
        </div>
        <van-button block native-type="submit" class="full-width92 btn-card bg-blueLight" to="my_cardManage_Bind">{{ $t('my_cardManage.text3') }}</van-button>

    </div>
</template>

<script>
import {qcard_sel_api, qcard_del_api} from "@/assets/js/api";

export default {
    name: "myCardManage",
    data() {
        return {
            cardArr: [],
        }
    },
    filters:{
        hideBankCard(value){
            if (value && value.length > 8) {
                return `${value.substring(0, 4)} ${"*".repeat(value.length - 8).replace(/(.{4})/g, `$1 `)}${value.length % 4 ? " " : ""}${value.slice(-4)}`;
            }
            return value;
        },
    },

    methods: {

        fnBtnLeft(){
            console.log('sdsd');
        },

        /*去绑定金融卡*/
        fnGoBind(){
          this.$router.push({
              name:"myCardManage_Bind"
          })
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

        /*删除 銀行卡 */
        fnDelCard(item){
            this.$dialog.confirm({
                title: 'xác nhận xóa',
                message: '',
                confirmButtonText:"xác nhận",
				cancelButtonText:"Hủy",
            })
            .then(() => {
                qcard_del_api({
                    id:item.id,
                }).then(res=>{
                    if(res.code == 200){
                        this.$toast(res.msg || "đã xóa thành công！");
                        this.fnGerCardList();
                    }
                })
            })
            .catch(() => {});
        },
    },
    created() {
        this.fnGerCardList();
    },
}
</script>
<style lang="scss" scoped>
.card-list{
    background-color: #3365e3;
    color: #fff;
    margin-top: 20px;
    border-radius: 6px;
    padding: 10px;
}
::v-deep .btn-card{
    margin-top: 20px;
}
.card-text{
    margin-top: 10px;
}
</style>