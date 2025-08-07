<template>
    <main>
        <van-row class="trade-bg-stateUl bg-theme" gutter="2">
            <van-col span="5">名稱/代碼</van-col>
            <van-col span="4">現價/成本</van-col>
            <van-col span="4">持有/市值</van-col>
            <van-col span="6">損益</van-col>
            <van-col span="5">狀態</van-col>
        </van-row>
        <section class="trade-main">
   
            <van-list
                v-model="listed_loading"
                :finished="listed_finished"
                finished-text=""  loading-text="加載中……"
                @load="fnLoadListed"
                :immediate-check = "false"
                class="trade-van-list">
                <ul class="text-note text-note2 listed-ul" v-if="listed_arr.length === 0">
                    <li>暫無數據</li>
                </ul>
                <van-row class="trade-stateUl" gutter="4" v-for="(item, index) in listed_arr" :key="index">
                    <van-col span="5">
                        <div class="trade-first color-red" v-if="item.sunyi > 0">
                            {{ item.sectorName }}
                            <i class="iconfont icon-xiangshang1"></i>
                        </div>
                        <div class="trade-first color-green" v-else>
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
                            <span class="bg-red"  v-if="tabActive == 2 && item.ganggang_beilv != 0 ">{{ item.ganggang_beilv }}倍</span>
                        </div>
                        <div>{{ item.shizhi }}</div>
                    </van-col>
                    <van-col span="6">
                        <b class="trade-first" :class="item.sunyi > 0 ? 'color-red': 'color-green' ">{{ item.sunyi.toFixed(2) }}</b>
                        <div :class="item.sunyi > 0 ? 'color-red': 'color-green' ">{{ item.sunyibi }}</div>
                    </van-col>
    
                    <!--狀態-->
                    <van-col span="5">
                        <div class="trade-first">{{ item.mairu_status_name }}
                            <span :class="item.mairu_type == 1 ?'bg-red':'bg-green'"
                                  v-if="tabActive == 2">{{item.mairu_type_name}}</span>
                        </div>
                        <div v-if="tabActive == 2">
                            <!--/* 订单状态 1持仓中 2平仓中 3已平仓 10排单中  */-->
                            <div class="bgRed" @click="fnBtnShowTrade(item)" v-if="item.status == 1">
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
            cancel-text="取消"
            close-on-click-action
            @select = "fnSelectAction"
            @cancel="showTradeInfo = false;"
        />
    
        <!--確認平倉-->
        <van-dialog v-model="sure_dia"
                    :title="pc_title"
                    show-cancel-button
                    confirmButtonText= "確認"
                    cancelButtonText="取消"
                    @confirm="fnConfirmSave" class="dia-save">
            <van-form ref="refFormLogin"  class="public-form">
                <van-field class="bg-inp" v-model="can_purchased" type="number" placeholder="請輸入平倉股數"
                           label = "平倉股數："
                           :rules="[{ required: true, message: '請輸入平倉股數1' }]">
                    <template #extra>
                        <span class="span-note">股</span>
                    </template>
                </van-field>
            </van-form>
        </van-dialog>
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
          sure_dia:false, /*確認平倉彈窗*/
          pc_title:"",
          can_purchased:0,
          
          showTradeInfo:false, // 平倉/明细
          selectActionArr:[
              // { name: '平倉', id: 1, },
              { name: '明細', id: 2, },
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
                    { name: "平倉", id: 1, },
                    { name: '明細', id: 2, },
                ];
            } else if(item.status ==  10){ /*status2 = 限价 */
                // 只有限价的订单在挂单状态才需要增加【取消】按钮
                this.selectActionArr = [
                    { name: '明細', id: 2, },
                    { name: '取消掛單', id: 3, },
                ];
            } else {
                this.selectActionArr = [
                    // { name: '平倉', id: 1, },
                    { name: '明細', id: 2, },
                ];
            }
            this.id = item.id;
            this.showTradeInfo = true;
        },
        /*弹窗 选中*/
        fnConfirmSave(){
            this.$refs.refFormRegister.validate().then(()=>{
                // if(!this.purchase_obj.can_purchased){
                //     this.$toast("可申請數量不能为空！");
                //     return
                // }
                // if(this.purchase_obj.can_purchased < 0){
                //     this.$toast("可申請數量不能小於0！");
                //     return
                // }
                index_qchicang_pingchangzhong_api({
                    quser_id: localStorage.getItem("userId"),
                    id: this.id,
                }).then(res =>{
                    if(res.code == 200){
                        this.$toast(res.msg);
                        this.sure_dia = false;
                        /*跳转到 已终止*/
                        // setTimeout(()=>{
                        //     that.$emit("fnBackTab", 3);
                        // },1000)
                    }
                })
            })
            // this.$dialog.confirm({
            //     title: "提示",
            //     message: name,
            //     confirmButtonText: "確認",
            //     cancelButtonText: "取消",
            // })
            //     .then(() => {
            //
            //     })
            //     .catch(() => {
            //         // on cancel
            //     });
        },
        fnSelectAction(type){
            console.log(type);
            console.log(this.id);
    
            const that = this;
           
            /*平倉*/
            if(type.id == 1){
                const item = this.item_obj;
                this.pc_title = `當前持有${item.mairu_num}股 ${item.sectorName} ${item.symbol}，要平倉多少股？`;
                this.sure_dia = true;
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
.dia-save{
    padding: 2px 10px;
    /deep/ .van-dialog__header{
        font-size: 14px;
    }
    /deep/ .van-dialog__content{
        .bg-inp{
            align-items: center;
        }
        .van-cell__title{
            width: auto;
        }
        .span-note{
            margin-left: 16px;
        }
    }
}
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