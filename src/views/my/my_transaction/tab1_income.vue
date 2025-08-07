<template>
    <van-list
        v-model="listed_loading"
        :finished="listed_finished"
        finished-text=""  loading-text="Đang tải……"
        @load="fnGetTrade"
        :immediate-check = "false"
        class="trade-van-list">
        <ul class="text-note text-note2 listed-ul" v-if="listed_arr.length === 0">
            <li>{{ $t('tab1_income.text1') }}</li>
        </ul>
        <div class="transaction-list full-width92"
             v-for="(listItem, index) in listed_arr" :key="index">
            <div class="flex-between transaction-title font12">
                <div class="ellipsis2">
                    <span>MSGD：</span>
                    <span>{{ listItem.number }}</span>
                </div>
                <div class="tr">
                    <div>{{ listItem.content }}</div>
                    <div>{{ listItem.symbol_name }}</div>
                </div>
            </div>
        
            <div class="transaction-time flex-between">
                <div class="text-note">{{ listItem.add_time }}</div>
                <h4 :class="listItem.type == '+' ? 'color-red' : 'color-green' ">
                    <span>{{ listItem.type  }}</span>
                    <span>{{ listItem.money }}</span>
                </h4>
            </div>
        </div>
    
    </van-list>
</template>

<script>
import { quser_income_list_api} from "@/assets/js/api";
export default {
    name: "tab1_income",
    props: {
      type: {
        type: Number,
      },
    },
    data(){
        return{
            listed_loading: false,
            listed_finished: false,
            listed_arr: [],
            listed_obj:{
                page: 1,
                status:"", /* 不传进行中  4已终止 */
            },
        }
    },
    methods:{
        /*我的交易记录*/
        fnGetTrade(){
            quser_income_list_api({
                page:this.listed_obj.page,
                quser_id:localStorage.getItem("userId"),
				type:this.type
                // quser_id: 3,·
            }).then(res => {
                this.listed_loading = false;
                if(res.code == 200){
                    console.log(res,this.listed_arr,res.data);
                    if (this.listed_obj.page == 1) {
                        this.listed_arr = res.data;
                    } else {
                        this.listed_arr = this.listed_arr.concat(res.data)
                    }
                    this.listed_obj.page++;
                    // 加载状态结束
                    if (res.data.length < 20) {
                        this.listed_finished = true;
                        return
                    }
                } else {
                    this.listed_finished = true;
                }
            })
        },
    },
    created(){
		console.log('---------------------------');
        this.fnGetTrade();
    },
    
}
</script>

<style scoped lang="scss">
.trade-van-list{
    //overflow: auto;
    height: calc(100vh - 90px);
    padding-bottom: 56px;
    //border: solid ;
    
}
</style>