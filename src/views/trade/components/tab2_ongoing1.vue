<template>
    <main>
        <van-row class="trade-bg-stateUl bg-theme" gutter="2">
            <van-col span="5" style="width:15%;">{{ $t('tab2_ongoing1.text1') }}</van-col>
            <van-col span="4">{{ $t('tab2_ongoing1.text2') }}</van-col>
            <van-col span="4" style="width:30%;">{{ $t('tab2_ongoing1.text3') }}</van-col>
            <van-col span="6" style="width:15%;">{{ $t('tab2_ongoing1.text4') }}</van-col>
            <van-col span="5">{{ $t('tab2_ongoing1.text5') }}</van-col>
        </van-row>
        <section class="trade-main">
   
            <van-list
                v-model="listed_loading"
                :finished="listed_finished"
                finished-text=""  loading-text="Đang tải……"
                @load="fnLoadListed"
                :immediate-check = "false"
                class="trade-van-list">
                <ul class="text-note text-note2 listed-ul" v-if="listed_arr.length === 0">
                    <li>{{ $t('tab2_ongoing1.text6') }}</li>
                </ul>
                <van-row class="trade-stateUl" gutter="4" v-for="(item, index) in listed_arr" :key="index">
                    <van-col span="5">
                        <div class="trade-first color-green" v-if="item.sunyi > 0">
                            {{ item.sectorName }}
                            <i class="iconfont icon-xiangshang1"></i>
                        </div>
                        <div class="trade-first color-red" v-else>
                            {{ item.sectorName }}
                            <i class="iconfont icon-xiangxia1"></i>
                        </div>
                        <div><span class="bg-theme">{{ item.symbol }}</span></div>
                    </van-col>
                    <van-col span="4">
                        <b class="trade-first">{{ item.regularMarketPrice }}</b>
                        <div>{{ item.mairu_money }}</div>
                    </van-col>
                    
                    <!--持有-->
                    <van-col span="4">
                        <div class="flex-align">
                            <b class="trade-first1">{{ item.mairu_num }} </b>
                            <span class="bg-red"  v-if="tabActive == 2 && item.ganggang_beilv != 0 ">{{ item.ganggang_beilv }}lần</span>
                        </div>
                        <div>{{ item.shizhi }}</div>
                    </van-col>
                    <van-col span="6">
                        <b class="trade-first" :class="item.sunyi > 0 ? 'color-green': 'color-red' ">{{ item.sunyi.toFixed(2) }}</b>
                        <div :class="item.sunyi > 0 ? 'color-green': 'color-red' ">{{ item.sunyibi }}</div>
                    </van-col>
    
                    <!--狀態-->
                    <van-col span="5">
                        <div class="trade-first">{{ item.mairu_status_name }}
                            <span :class="item.mairu_type == 1 ?'bg-green':'bg-red'"
                                  v-if="tabActive == 2">{{item.mairu_type_name}}</span>
                        </div>
                        <div v-if="tabActive == 2">
                            <!--/* 订单状态 1持仓中 2平仓中 3已平仓 10排单中  */-->
                            <div class="bgTheme" @click="fnBtnShowTrade(item)" v-if="item.status == 1">
                                {{ item.status_name }}
                                <van-icon name="arrow-down" />
                            </div>
                            <div class="bgYellow" @click="fnBtnShowTrade(item)" v-else-if="item.status == 10">
                                {{ item.status_name }}
                                <van-icon name="arrow-down" />
                            </div>
                            <div class="bgTheme" @click="fnBtnShowTrade(item)" v-else>
                                {{ item.status_name }}
                                <van-icon name="arrow-down" />
                            </div>
                        </div>
                        <div v-if="tabActive == 3"><span class="color-gray font12">{{ item.status_name }}</span></div>
                    </van-col>
                </van-row>
            </van-list>
        </section>
    
        <!--平倉/明细-->
        <van-action-sheet
            v-model="showTradeInfo"
            :actions="selectActionArr"
            cancel-text="Hủy bỏ"
            close-on-click-action
            @select = "fnSelectAction"
            @cancel="showTradeInfo = false;"
        />
    </main>
</template>

<script>
import {index_qchicang_sel_api, index_qchicang_pingchangzhong_api, index_qchicang_api} from "@/assets/js/api";

export default {
    name: "tab2_ongoing",
    props:{
        tabActive:{
            type:String | Number,
            default:""
        },
    },
    data(){
      return{
          
          showTradeInfo:false, // 平倉/明细
          selectActionArr:[
              // { name: '平倉', id: 1, },
              { name: 'chi tiết', id: 2, },
          ],
          id: "",
    
          listed_loading: false,
          listed_finished: false,
          listed_arr: [],
          listed_obj:{
              page: 1,
              status:"", /* 不传进行中  4已终止 */
          },
          time_interval:"",
          
          item_obj:{},
      }
    },
    
    methods:{
        fnBtnShowTrade(item){
            console.log(item);
            this.item_obj = item;
            /* 订单状态 1持仓中 2平仓中 3已平仓 10排单中  */
            if(item.status  == 1){ /* 持仓中 */
                this.selectActionArr = [
                    { name: "đóng", id: 1, },
                    { name: 'chi tiết', id: 2, },
                ];
            } else if(item.status ==  10){ /*status2 = 限价 */
                // 只有限价的订单在挂单状态才需要增加【取消】按钮
                this.selectActionArr = [
                    { name: 'chi tiết', id: 2, },
                    { name: 'Hủy đang lý', id: 3, },
                ];
            } else {
                this.selectActionArr = [
                    // { name: '平倉', id: 1, },
                    { name: 'chi tiết', id: 2, },
                ];
            }
            this.id = item.id;
            this.showTradeInfo = true;
        },
        /*弹窗 选中*/
        fnSelectAction(type){
            console.log(type);
            console.log(this.id);
    
            const that = this;
           
            /*平倉*/
            if(type.id == 1){
                const item = this.item_obj
                const name = `hiện đang được tổ chức${item.mairu_num}mở ${item.sectorName} ${item.symbol}，是否要確認平倉？`
    
                this.$dialog.confirm({
                    title: "提示",
                    message: name,
                    confirmButtonText: "確認",
                    cancelButtonText: "取消",
                })
                .then(() => {
                    index_qchicang_pingchangzhong_api({
                        quser_id: localStorage.getItem("userId"),
                        id: this.id,
                    }).then(res =>{
                        if(res.code == 200){
                            that.$toast(res.msg);
                            /*跳转到 已终止*/
                            // setTimeout(()=>{
                            //     that.$emit("fnBackTab", 3);
                            // },1000)
                        }
                    })
                })
                .catch(() => {
                    // on cancel
                });
            }
            
            /*明細*/
            if(type.id == 2){
                this.$router.push({
                    name:"trade_info",
                    query:{
                        id:this.id,
                    }
                })
                localStorage.setItem("trade_tab_active",2);
            }
            /*取消*/
            if(type.id == 3){
                index_qchicang_api({
                    quser_id: localStorage.getItem("userId"),
                    id: this.id,
                }).then(res =>{
                    if(res.code == 200){
                        this.$toast(res.msg);
                        /*跳转到 已终止*/
                        setTimeout(()=>{
                            this.$emit("fnBackTab", 3);
                        },1000)
                    }
                })
            }
        },
        
        fnLoadListed(){
            index_qchicang_sel_api({
                page:this.listed_obj.page,
                status:this.listed_obj.status,
                quser_id:localStorage.getItem("userId"),
            }).then(res => {
                this.listed_loading = false;
                if(res.code == 200){
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
        }
    },
    created(){

        const tabActive = this.tabActive;
        // console.log(tabActive);
        let status = "";
        if( tabActive == 2){
            status = "";
    
            this.time_interval = setInterval(()=>{
                // console.log("fnGetIndex");
                this.listed_obj.page--;
                this.fnLoadListed();
            },5000)
        }
        if(tabActive == 3){
            status = "4";
        }
        this.listed_obj.status = status;
        
        this.fnLoadListed();
        
    },
    destroyed(){
        clearInterval(this.time_interval);
    },
}
</script>
<style lang="scss" scoped>
.bg-red,
.bg-green
{
    height: 16px;
    display: inline-flex;
    align-items: center;
    margin-left: 2px;
    color: #fff;
    padding: 0 3px !important;
}
/deep/ .van-col{
    padding-left: 0 !important;
    padding-right: 0 !important;
}
/deep/  .van-action-sheet__item {
    padding: 14px 4px;
    font-size: 14px;
}
</style>