<template>
    <main>
        <div v-if="transactionArr.length == 0" class="text-note marTop40">{{ $t('tab2_recharge.text1') }}</div>
        <div class="transaction-list full-width92"
             v-for="(listItem, index) in transactionArr" :key="index">
            <div class="flex-between transaction-title">
                <div class="ellipsis2">
                    <span v-if = "tabActive == 2">MSGD：</span>
                    <span>{{ listItem.number }}</span>
                </div>
                <span class="record-type" :class="listItem.type == 'Đã xử lý' ? 'bg-theme': 'bg-yellow' "
                      v-if = "tabActive != 1">{{ listItem.type }}</span>
            </div>
			
			<div class="transaction-time flex-between">
			    <div class="text-note" style="text-align: left;" v-if="tabActive == 3">
				{{ listItem.remarks }}
				</div>
			</div>
            
            <div class="transaction-time flex-between">
                <div class="text-note">
				{{ listItem.reg_time }}
				</div>
                <h4 :class="tabActive == 1 ? 'color-red' : '' ">
                    <span v-if="tabActive == 2">+</span>{{ listItem.money }}
                </h4>
            </div>
        </div>
    </main>
</template>

<script>
export default {
    name: "tab2_recharge",
    props:{
        transactionArr:[],
        tabActive: {
            type:Number | String,
            default:"",
        },
    },
    data() {
        return {}
    }
}

</script>
