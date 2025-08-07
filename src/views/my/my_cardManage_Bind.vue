<template>
    <div class="bind-box">
        <navBar :navTitle="$t('myCardManage_Bind.title')" />
        <van-form ref="refFormCard" class="full-width92 public-form public-form-label">
            <van-field v-model.trim="formCard.card_name" class="bg-inp" :placeholder="$t('myCardManage_Bind.placeholderCardName')" 
                       :label="$t('myCardManage_Bind.labelCardName')"
                       :rules="[{ required: true, message: $t('myCardManage_Bind.errorCardName') }]"/>
            <van-field v-model.trim="formCard.card_id" class="bg-inp" :placeholder="$t('myCardManage_Bind.placeholderCardId')" 
                       :label="$t('myCardManage_Bind.labelCardId')"
                       :rules="[{ required: true, message: $t('myCardManage_Bind.errorCardId') }]"/>
            <van-field v-model.trim="formCard.card_type" class="bg-inp" :placeholder="$t('myCardManage_Bind.placeholderCardType')" 
                       :label="$t('myCardManage_Bind.labelCardType')"
                       :rules="[{ required: true, message: $t('myCardManage_Bind.errorCardType') }]"/>
            <van-field v-model.trim="formCard.card_branch" class="bg-inp" :placeholder="$t('myCardManage_Bind.placeholderCardBranch')" 
                       :label="$t('myCardManage_Bind.labelCardBranch')"
                       :rules="[{ required: true, message: $t('myCardManage_Bind.errorCardBranch') }]"/>
<!--            <van-field v-model.trim="formCard.branch_number" class="bg-inp" :placeholder="$t('myCardManage_Bind.placeholderBranchNumber')" 	
                       :label="$t('myCardManage_Bind.labelBranchNumber')"
                       :rules="[{ required: true, message: $t('myCardManage_Bind.errorBranchNumber') }]"/> -->
            <van-button block type="info" native-type="submit" class="marTop40" @click="fnBtnSave('refFormCard')" v-btn-re-click>{{ $t('myCardManage_Bind.text1') }}</van-button>
        </van-form>
    </div>
</template>

<script>
import { qcard_add_api } from "@/assets/js/api";

export default {
    name: "myCardManage_Bind",
    data() {
        return {
            formCard: {
                quser_id: "",
                card_name: "",
                card_id: "",
                card_type: "",
                card_branch: "",
                branch_number: "0000",
            },
        }
    },
    methods: {
        // 保存绑定
        fnBtnSave(refForm) {
            this.$refs[refForm].validate().then(() => {
                qcard_add_api(this.formCard).then(res => {
                    if (res.code == 200) {
                        this.$toast(res.msg || this.$t("myCardManage_Bind.successMessage"));
                        setTimeout(() => {
                            this.$router.push({
                                name: "my_cardManage"
                            })
                        }, 1000)
                    }
                })
            }).catch(res => {});
        },
    },
    created() {
        this.formCard.quser_id = localStorage.getItem("userId");
    },
}
</script>

<style>
.bind-box .van-cell {
    height: 4em;
    overflow: visible;
}
.public-form .van-cell .van-field__body {
    margin-left: 10px;
    height: 60px;
}
</style>
