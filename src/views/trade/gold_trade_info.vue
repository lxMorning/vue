<template>
    <div>
        <navBar navTitle="Chi tiết kho hàng" />
        <div class="flex-between tradeInfo-title">
            <b>
                <span>{{ tradeInfoObj.sectorName }}（{{ tradeInfoObj.symbol }}）</span>
                <span class="bg-red color-white">{{ tradeInfoObj.mairu_type_name }}</span>
            </b>
            <b class="color-theme">{{ tradeInfoObj.status_name }}</b>
        </div>
        <van-cell-group>
            <van-cell title="số thứ tự" >
                <template #extra>
                    <span class="color-theme">{{ tradeInfoObj.number }}</span>
                </template>
            </van-cell>
            <van-cell title="Thời gian GD" :value="tradeInfoObj.mairu_time" />
            <van-cell title="giá mua" :value="tradeInfoObj.mairu_money" />
            <van-cell title="giới hạn giá bán" :value="tradeInfoObj.limit_maichu_price" />
            <van-cell title="số lượng mua">
                <template #default>
                    <span class="custom-title">{{ tradeInfoObj.mairu_ori/100 }}Lô</span>
                </template>
            </van-cell>
            <van-cell title="Nắm giữ hiện tại" :value="tradeInfoObj.mairu_num" >
                <template #default>
                    <span class="custom-title">{{ tradeInfoObj.mairu_num/100 }}Lô</span>
                </template>
            </van-cell>
            
            <!--<van-cell title="原始保證金" :value="tradeInfoObj.bond" />-->
            <van-cell title="tỷ lệ đòn bẩy" :value="tradeInfoObj.ganggang_beilv" />
            <van-cell title="giá trị thị trường" :value="tradeInfoObj.shizhi" />
            <van-cell title="loại hình" :value="tradeInfoObj.mairu_type_name" />
        </van-cell-group>
    </div>
</template>

<script>
import { indexGoldQchicangMingxiApi } from "@/assets/js/api";

export default {
    name: "trade_info",
    data() {
        return {
            tradeInfoObj:{
                mairu_num:0,
                mairu_ori:0,
            },
            id:"",
        }
    },
    methods: {
        getInfo(){
            indexGoldQchicangMingxiApi({
                id: this.id,
                quser_id: localStorage.getItem("userId"),
                tel: localStorage.getItem("tel"),
            }).then(res=>{
                if(res.code == 200){
                    this.tradeInfoObj = res.data;
                }
            });
        }
    },
    created() {
        this.id = this.$route.query.id;
        this.getInfo();
    },
}
</script>
<style lang="scss" scoped>
.tradeInfo-title{
    height: 50px;
    display: flex;
    align-items: center;
    background-color: #f1f4ff;
    padding: 0 20px;
    font-size: 15px;
}
</style>