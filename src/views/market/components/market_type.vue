<template>
    <div>
        <van-button size ="mini" type="info" class="btn-select" @click="showType = true;">
            <div  class="btn-select-content">
                <div class="btn-select-name">{{ typeInfoObj.name }}</div>
                <i class="iconfont icon-xiangxia1"></i>
            </div>
        </van-button>

        <van-popup v-model="showType" position="bottom">
            <van-picker
                show-toolbar
                confirm-button-text="xác nhận"
                :columns="typeArr"
                @confirm="fnChangeType"
                @cancel="showType = false">
                <template #option="option">
                    <div>{{ option.name }}</div>
                </template>
            </van-picker>
        </van-popup>
    </div>
</template>

<script>
import { Qcategory_sel_api } from "@/assets/js/api";

export default {
    name: "login",
    props:{
        category:{
            type:String,
            default:"TAI", /* TAI=上市,TWO=上柜 */
        }
    },
    data() {
        return {
            showType: false,
            typeArr:[],
            typeInfoObj:{
                name:"選擇分類",
            },
        };
    },
    methods: {

        /*選中分类*/
        fnChangeType(val){
            console.log(val);
            this.typeInfoObj = val;
            this.showType = false;
            this.$emit("fnCheckedType", val.sectorId)
        },

        fnGetType(){
            Qcategory_sel_api({
                category: this.category,
            }).then(res=>{
                if(res.code == 200){
                    this.typeArr = res.data;
                }
            })
        }
    },
    created() {
        this.fnGetType();
    },

};
</script>
