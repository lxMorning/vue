<template>
    <main>
        <van-row class="trade-bg-stateUl bg-theme" gutter="2">
            <van-col span="5" style="width:20%;text-align:center;">{{ $t('tab2_ongoing.text1') }}</van-col>
            <van-col span="4" style="width: 20%;text-align:center;">{{ $t('tab2_ongoing.text2') }}</van-col>
            <van-col span="5" style="width:20%;text-align:center;">TT</van-col>
            <van-col span="5" style="width:40%;text-align:center;">{{ $t('tab2_ongoing.text3') }}</van-col>
            <!-- <van-col span="5">{{ $t('tab2_ongoing.text4') }}</van-col> -->
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
                    <li>{{ $t('tab2_ongoing.text5') }}</li>
                </ul>
                <van-row class="trade-stateUl" gutter="4" v-for="(item, index) in listed_arr" :key="index">
                    <van-col span="5">
                        <div class="trade-first color-green" v-if="item.sunyi > 0">
                            <span class="ellipsis">{{ item.symbol }}</span>
                            <i class="iconfont icon-xiangshang1"></i>
                        </div>
                        <div class="trade-first color-red" v-else>
                            <span class="ellipsis">{{ item.symbol }}</span>
                            <i class="iconfont icon-xiangxia1"></i>
                        </div>
                        
                    </van-col>
                    <van-col span="4">
                        <b class="trade-first">{{ item.regularMarketPrice }}</b>
                        <div>{{ item.mairu_money }}</div>
                    </van-col>
                    
                    <!--持有-->
                    <van-col span="7">
                        <div class="flex-align">
                            <b class="trade-first1">{{ item.mairu_num }} </b>
                            <!--tabActive == 2 &&-->
                            <span class="bg-red"  v-if=" item.ganggang_beilv != 0 ">x{{ item.ganggang_beilv }}</span>
                        </div>
                        <div>{{ item.shizhi }}</div>
                    </van-col>
                    <van-col span="8">
                        <b class="trade-first center" :class="item.sunyi > 0 ? 'color-green': 'color-red' ">{{ Number(item.sunyi).toFixed(2) }}</b>
                        <div :class="item.sunyi > 0 ? 'color-green': 'color-red' " class="center">{{ item.sunyibi }}</div>
                    </van-col>
                    
                    <!--狀態-->
                    <!-- <van-col span="5">
                        <div class="trade-first">{{ item.mairu_status_name }}
                           
                            <span :class="item.mairu_type == 1 ?'bg-green':'bg-red'" style="width: 50px;line-height: 15px;">{{item.mairu_type_name}}</span>
                        </div>
                        <div v-if="tabActive == 2">
                           
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
                    </van-col> -->
					<div style="display: flex;margin-top: 60px;">
					<div class="trade-first">{{ item.mairu_status_name }}
					   
					    <!-- <span :class="item.mairu_type == 1 ?'bg-green':'bg-red'" style="width: 50px;line-height: 15px;">{{item.mairu_type_name}}</span> -->
					</div>
					<div style="flex:1;" v-if="tabActive == 2">
					   
					    <a class="bgRed" @click="fnBtnShowTrade(item)" v-if="item.status == 1">
					        {{ item.status_name }}
					        <van-icon name="arrow-down" />
					    </a>
					    <a class="bgYellow" @click="fnBtnShowTrade(item)" v-else-if="item.status == 10">
					        {{ item.status_name }}
					        <van-icon name="arrow-down" />
					    </a>
					    <a class="bgTheme" @click="fnBtnShowTrade(item)" v-else>
					        {{ item.status_name }}
					        <van-icon name="arrow-down" />
					    </a>
					</div>
					<div style="flex:1;" v-if="tabActive == 3">
						<a ><span class="color-gray font12">{{ item.status_name }}</span></a>
					<div>
					</div>
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
        
        <!--確認平倉-->
        <van-dialog
            v-if="sure_dia"
            v-model="sure_dia"
            :title="pc_title"
            show-cancel-button
            confirmButtonText= "xác nhận"
            cancelButtonText="Hủy bỏ"
            @cancel="num = 0; sure_dia = false;"
            @confirm="fnConfirmSave"
            :before-close="beforeClose"
            class="dia-save">
            <van-form ref="refFormRegister"  class="public-form">
                <!--:rules="[{ required: true, message: '請輸入平倉股數' }]"-->
                <van-field class="bg-inp" v-model="num" type="digit" placeholder="Vui lòng nhập số vị trí đã đóng"
                           label = "SL：" >
                    <!-- <template #extra>
                        <span class="span-note">{{ $t('tab2_ongoing.text6') }}</span>
                    </template> -->
                </van-field>
				
				<van-field class="bg-inp" v-model="price" type="number" placeholder="Không làm mất hoặc điền số 0 là giá thị trường"
				           label = "Giá：" >
				    <template #extra>
				        <span class="span-note"></span>
				    </template>
				</van-field>
            </van-form>
        </van-dialog>
    </main>
</template>

<script>
import {index_qchicang_sel_api, index_qchicang_pingchangzhong_api, index_qchicang_api,index_cancelpingchang_api} from "@/assets/js/api";

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
            sure_dia: false, /*確認平倉彈窗*/
            pc_title:"",
            num:null,
            price:null,
            showTradeInfo:false, // 平倉/明细
            selectActionArr:[
                // { name: '平倉', id: 1, },
                { name: 'chi tiết', id: 2, },
            ],
            id: "",
            
            listed_loading: false,
            listed_finished: false,
            listed_arr: [],
			list_ids:[],
            listed_obj:{
                page: 1,
                status:"", /* 不传进行中  4已终止 */
            },
            time_interval:"",
            
            item_obj:{},
        }
    },
    
    methods:{
        beforeClose(action,done){
            // console.log(action);
            // console.log(done);
            if(action == "confirm"){
                return done(false);
            } else {
                return done()
            }
            
        },
        
        fnBtnShowTrade(item){
            console.log(item);
            this.item_obj = item;
            /* 订单状态 1持仓中 2平仓中 3已平仓 10排单中  */
            if(item.status  == 1){ /* 持仓中 */
                this.selectActionArr = [
                    { name: "Bán", id: 1, },
                    { name: 'Chi tiết', id: 2, },
                ];
            } else if(item.status ==  10){ /*status2 = 限价 */
                // 只有限价的订单在挂单状态才需要增加【取消】按钮
                this.selectActionArr = [
                    { name: 'chi tiết', id: 2, },
                    { name: 'Hủy đang lý', id: 3, },
                ];
            } else if(item.status  == 2){
				this.selectActionArr = [
				    { name: 'chi tiết', id: 2, },
				    { name: 'Hủy đóng cửa', id: 4, },
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
        fnConfirmSave(){
            if(!this.num){
                this.$toast("Số tiền đóng không được để trống！");
                return
            }
            if(this.num == 0 ){
                this.$toast("Số tiền đóng không được 0！");
                return
            }
            if(this.num < 0){
                this.$toast("Số lượng vị thế đã đóng không được ít hơn 0！");
                return
            }
            if(Number(this.num ) > Number( this.item_obj.mairu_num)){
                this.$toast("Số tiền đóng không được lớn hơn số tiền nắm giữ！");
                return
            }
           
            // this.$refs.refFormRegister.validate().then(()=>{
                index_qchicang_pingchangzhong_api({
                    quser_id: localStorage.getItem("userId"),
                    id: this.id,
                    num: this.num,
					price:this.price
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
            // })
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
                this.pc_title = `hiện đang được tổ chức ${item.mairu_num}  ${item.symbol}，Có bao nhiêu để đóng？`;
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
			
			/*取消平倉*/
			if(type.id == 4){
			    index_cancelpingchang_api({
			        quser_id: localStorage.getItem("userId"),
			        id: this.id,
			    }).then(res =>{
			        if(res.code == 200){
			            this.$toast(res.msg);
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
					
					for(var i=0;i<res.data.length;i++){
						if(this.list_ids.indexOf(res.data[i].id) >= 0){
							return;
						}
						
						this.list_ids.push(res.data[i].id);
					}

                    if (this.listed_obj.page == 1) {
                        this.listed_arr = res.data;
                    } else {
                        this.listed_arr = this.listed_arr.concat(res.data)
                    }
                    // 加载状态结束
                    if (res.data.length < 20) {
                        this.listed_finished = true;
                        return
                    }
					
					this.listed_obj.page++;
                } else {
                    this.listed_finished = true;
                }
            })
        }
    },
    created(){
        
        const tabActive = this.tabActive;
        // console.log(tabActive);
		//this.listed_obj.page = 1;
        let status = "";
        if( tabActive == 2){
            status = "";
            
            this.time_interval = setInterval(()=>{
                // console.log("fnGetIndex");
				//console.log(this.listed_obj.page);
				if(this.listed_obj.page > 1){
					return;
				}
				//this.listed_obj.page--;
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
    ::v-deep .van-dialog__header{
        font-size: 14px;
    }
    ::v-deep .van-dialog__content{
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
::v-deep .van-col{
    padding-left: 0 !important;
    padding-right: 0 !important;
	text-align: center;
}
::v-deep  .van-action-sheet__item {
    padding: 14px 4px;
    font-size: 14px;
}
.trade-first,.trade-first+div,.flex-align{
	display: block !important;
}
.center{
	text-align:center;
}
.ellipsis{
	display: block !important;
}
a{
	float: right;
}
</style>