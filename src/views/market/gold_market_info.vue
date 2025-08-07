<template>
    <main>
        <navBar :navTitle="navTitle" showRight_content>
            <div slot="narBarR_content">
                <van-button block type="info" v-btn-re-click size="mini" class="btnAdd-marketStar" v-if="isAdd"
                    @click="fnDelUserMarket">
                    <van-icon name="star" class="color-yellow" />
                    <span>{{ $t('gold_market_info.text1') }}</span>
                </van-button>

            </div>
        </navBar>

        <!--信息-->
        <van-row class="market-info">
            <van-col span="9" class="market-info-left">
                <div class="market-info-name">{{ info_obj.symbolName }} {{ info_obj.symbol }} </div>
                <h4 class="market-info-price" :class="gc_obj.regularMarketChange > 0 ?
                    'color-green' : 'color-red'">{{ gc_obj.bid }}</h4>
                <div :class="gc_obj.regularMarketChange >= 0 ? 'color-green' : 'color-red'">
                    <span>{{ Number(gc_obj.regularMarketChange).toFixed(2) }} </span>
                    <span> {{ Number(gc_obj.regularMarketChangePercent).toFixed(8) }}%</span>
                </div>
            </van-col>
            <van-col span="15">
                <van-row class="market-info-content tc">
                    <van-col span="10">
                        <ul>
                            <!-- <li class="bg-pink">{{ $t('gold_market_info.text2') }}</li> -->
                            <!--<li class="color-red">{{ Math.floor(info_obj.regularMarketVolume/1000) }}k</li>-->
                            <!-- <li class="color-red">{{ info_obj.CeilingPrice }}</li> -->
                        </ul>
                        <ul>
                            <!-- <li class="bg-blueLight2">{{ $t('gold_market_info.text3') }}</li> -->
                            <!--<li class="color-red">{{ (Math.floor(info_obj.regularMarketVolume/1000) * info_obj.regularMarketPreviousClose).toFixed(2) }}</li>-->
                            <!-- <li class="color-red">{{ info_obj.FloorPrice }}</li> -->
                        </ul>
                    </van-col>
                    <!-- <van-col span="7">
                        <ul>
                            <li class="bg-yellow">{{ $t('gold_market_info.text4') }}</li>
                            <li>{{ info_obj.regularMarketPreviousClose }}</li>
                        </ul>
                        <ul>
                            <li class="bg-pink">{{ $t('gold_market_info.text5') }}</li>
                            <li>{{ info_obj.regularMarketDayHigh }}</li>
                        </ul>
                    </van-col>
                    <van-col span="7">
                        <ul>
                            <li class="bg-blueLight2">{{ $t('gold_market_info.text6') }}</li>
                            <li>{{ info_obj.regularMarketOpen }}</li>
                        </ul>
                        <ul>
                            <li class="bg-greenLight">{{ $t('gold_market_info.text7') }}</li>

                            <li>{{ info_obj.regularMarketDayLow }}</li>
                        </ul>
                    </van-col> -->
                </van-row>
            </van-col>
        </van-row>

        <!--图表-->
        <infoChart :symbol="info_parm_obj.symbol" />

        <!--現价 市价-->
        <van-row gutter="20" class="market-buy-box">
            <van-col span="12" class="market-buy-left">

                <van-row gutter="6" style="display:flex;">
                    <van-col span="12">
                        <van-button size="small" :class="add_form.mairu_status == 2 ? 'bgTheme' : 'bg-gray'" block
                            @click="fnChangePrice(2)">Lệnh điều kiện
                        </van-button>
                    </van-col>
                    <van-col span="12">
                        <van-button size="small" :class="add_form.mairu_status == 1 ? 'bgTheme' : 'bg-gray'" block
                            @click="fnChangePrice(1)">Lệnh thị trường
                        </van-button>
                    </van-col>

                </van-row>
                <van-row v-if="add_form.mairu_status == 2">
                    <van-stepper min="0" step="10" v-model="add_form.mairu_money" placeholder="Giá giới hạn" />
                </van-row>

                <van-row>
                    <span class="color-theme font12">{{ $t('gold_market_info.text10') }}</span>
                    <van-stepper min="0" step="1" v-model="add_form.mairu_count" @blur="changeNum()"
                        placeholder="Số lượng mua hàng" />
                </van-row>
                <van-row v-if="add_form.xau_status == 0">
                    <van-field class="input-gg" v-model="ganggang_text" placeholder="Tỷ lệ đòn bẩy">
                        <template #extra>
                            <van-button size="mini" class="btn-select" @click="showType = true;">
                                <div class="btn-select-content">
                                    <div class="">{{ typeInfoObj.name }}</div>
                                    <i class="iconfont icon-xiangxia1 color-theme"></i>
                                </div>
                            </van-button>
                            <van-popup v-model="showType" position="bottom">
                                <van-picker show-toolbar confirm-button-text="xác nhận" cancel-button-text="Hủy bỏ"
                                    :columns="typeArr" @confirm="fnChangeType" @cancel="showType = false">
                                    <template #option="option">
                                        <div>{{ option.multiple }}</div>
                                    </template>
                                </van-picker>
                            </van-popup>
                        </template>
                    </van-field>
                </van-row>

                <van-row :gutter="6" style="display:flex;">
                    <van-col span="12">
                        <van-button size="small" class="bg-gray" :class="add_form.mairu_type == 1 ? 'bgGreen' : ''"
                            block @click="add_form.mairu_type = 1">Dư mua
                        </van-button>
                    </van-col>
                    <van-col span="12">
                        <van-button size="small" class="bg-gray" :class="add_form.mairu_type == 2 ? 'bgRed' : ''" block
                            @click="add_form.mairu_type = 2">Dư bán
                        </van-button>
                    </van-col>
                </van-row>

                <van-button block size="small" type="info" native-type="submit" @click="fnBuyMarket"
                    v-btn-re-click>Mua</van-button>
            </van-col>

            <!-- <van-col span="12" class="market-buy-right">
                <h4 class="tc">買盤檔</h4>
                <span class="bg-red color-white">委買</span>
                <ul class="market-buy-right-content">
                    <li v-for="(item, index) in maimai_obj.jin" :key="index">
                        <span>買{{ week_arr[index] }}</span>
                        <span class="color-red">{{ item }}</span>
                    </li>
                </ul>
                
                <h4 class="tc">賣盤檔</h4>
                <span class="bg-green color-white">委賣</span>
                <ul class="market-buy-right-content">
                    <li v-for="(item , index) in maimai_obj.chu" :key="index">
                        <span>賣{{ week_arr[index] }}</span>
                        <span class="color-green">{{ item }}</span>
                    </li>
                </ul>
            </van-col>  -->
        </van-row>

    </main>
</template>

<script>
import {
    index_gold_market_buy, index_gold_market_details, apiGoldMultiple , apiGoldPrice
} from "@/assets/js/api";
import infoChart from "./components/gold_market_info_chart"

export default {
    name: "market_info.vue",
    components: {
        infoChart,
    },
    data() {
        return {
            time_interval: "",
            navTitle: 'Thông tin chi tiết',
            systexId: "", /*基金id*/
            id: "", /*基金id*/
            symbol: "", /*基金*/
            userID: "",  /*用户id*/
            isAdd: false,  /*是否添加*/
            info_obj: {
                longName: "Thông tin chi tiết",
                bid: 0,
                regularMarketChange: 0,
                regularMarketChangePercent: 0,
                regularMarketVolume: 0,
                sharesOutstanding: 0,
                regularMarketPreviousClose: 0,
                regularMarketDayHigh: 0,
                regularMarketOpen: 0,
                regularMarketDayLow: 0,
            },
            gc_obj: {
                bid: 0,
                regularMarketChange: 0,
                regularMarketChangePercent: 0,
            },
            week_arr: ["一", "二", "三", "四", "五"],
            maimai_obj: {
                chu: [0, 0, 0, 0, 0],
                jin: [0, 0, 0, 0, 0],
            },

            /** 現价 市价*/
            ganggang_text: 'Tỷ lệ đòn bẩy',
            typeArr: [],
            customFieldName: {
                text: "multiple",
                value: 'id',
            },
            typeInfoObj: {
                name: 5,
            },

            showType: false,
            info_parm_obj: {
                userID: "",
                systexId: "",
                id: "",
                symbol: "",
            },

            add_form: {
                tel: "",
                symbol: "", /*股票编号*/
                mairu_status: 2, /*买入方式 1市价 2限价*/
                mairu_count: 1, /*买入張数*/
                ganggang_beilv: 1, /*杠杠倍率*/
                mairu_type: 1, /*买入方向 1 买張 2买跌*/
                mairu_money: 0, /*限价金额参数*/
                quser_id: localStorage.getItem("userId"),
                xau_status: 0,
            },
            // isEdit: false,
            bid: "", /*初始現价金额*/
            delId: "",/*删除id*/
        }
    },
    methods: {
        changeNum() {
            let _this = this;

            _this.add_form.mairu_count = parseInt(_this.add_form.mairu_count);

            _this.add_form.mairu_count = _this.add_form.mairu_count <= 0 ? 1 : _this.add_form.mairu_count;

        },

        /*詳情*/
        fnGetInfo() {
            index_gold_market_details({
                id: this.info_parm_obj.id,
            }).then(res => {
                if (res.code == 200) {
                    this.info_obj = res.data;
                    
                    this.add_form.xau_status = this.info_obj.xau_status;

                    console.log(this.add_form.xau_status);

                    
                    this.navTitle = `${res.data.symbol}`;
                }
            }).catch(err => {
                console.log(err);
            })
        },

        getLastData(){
            apiGoldPrice().then(res=>{
                this.gc_obj.bid = res.data.bid;
                this.gc_obj.regularMarketChange = res.data.change;
                this.gc_obj.regularMarketChangePercent = res.data.chp;
                
                this.bid = res.data.bid;

                if (this.add_form.mairu_money == 0) {
                    this.add_form.mairu_money = this.gc_obj.bid;
                }

            }).catch(err=>{
                console.log(err);
            })
        },

        /*限價 市價按鈕 切換*/
        fnChangePrice(num) {
            this.add_form.mairu_status = num;
            if (num == 2) {
                this.add_form.mairu_money = this.bid;
            } else {
                this.add_form.mairu_money = 0;
            }
        },

        /*選中倍数*/
        fnChangeType(val) {
            console.log(val);
            if (isNaN(val.multiple)) {
                this.add_form.ganggang_beilv = "";
            } else {
                this.add_form.ganggang_beilv = val.multiple;
            }
            this.typeInfoObj.name = val.multiple;
            this.showType = false;
        },
        getMultiple() {
            apiGoldMultiple().then(res => {
                 this.typeArr=res.data;
                this.typeInfoObj.name = res.data[0].multiple;
            }).catch(err => {
                    console.log(err);
                })
    },
    /*買入*/
    fnBuyMarket() {
        let filterForm = {};
        if (this.add_form.mairu_status == 2) {
            const {
                tel,
                symbol,
                mairu_status,
                mairu_count,
                ganggang_beilv,
                mairu_type,
                mairu_money,
                quser_id,
            } = this.add_form;
            filterForm = {
                tel,
                symbol,
                mairu_status,
                mairu_count,
                ganggang_beilv,
                mairu_type,
                mairu_money,
                quser_id,
            }
        } else {
            filterForm = this.add_form;
        }
        if (filterForm.ganggang_beilv == "") {
            filterForm.ganggang_beilv = 0;
        }
        console.log(filterForm)
        // return

        // mairu_count mairu_mo
        if (this.add_form.mairu_status == 2) {
            if (filterForm.mairu_count == 0) {
                this.$toast("Số lượng mua không được0！")
                return
            }
            if (filterForm.mairu_money == 0) {
                this.$toast("Giá giới hạn không được0！")
                return
            }
        }

        index_gold_market_buy(filterForm).then(res => {
            if (res.code == 200) {
                this.$toast(res.msg);
                localStorage.setItem("trade_tab_active", 4);
                setTimeout(() => {
                    this.$router.push({
                        name: "trade",
                    })
                }, 1000)
            }
        })
    },
},
created() {
    this.info_parm_obj = {
        userID: localStorage.getItem("userId"),
        systexId: this.$route.query.systexId,
        id: this.$route.query.id,
        symbol: this.$route.query.symbol,
    }

    this.add_form.tel = localStorage.getItem("tel");
    this.add_form.symbol = this.$route.query.symbol;

    this.fnGetInfo();
    this.getMultiple();
    this.getLastData();
    this.time_interval = setInterval(() => {
        this.getLastData();
    }, 3000)
},
destroyed() {
    clearInterval(this.time_interval);
},

}
</script>
<style lang="scss" scoped>
.market-buy {
    &-box {
        padding: 10px;

        .van-row {
            margin-bottom: 8px;
        }

        ::v-deep .van-stepper {
            border: solid 1px #ddd;

            .van-stepper__minus,
            .van-stepper__plus {
                background-color: #fff;
                height: 34px;
                width: 34px;
            }

            .van-stepper__plus {
                color: #3365e3;
            }

            .van-stepper__input {
                width: calc(100% - 68px);
                background-color: #fff;
                margin: 0;
                border-left: solid 1px #ddd;
                border-right: solid 1px #ddd;
                height: 34px;
            }
        }

        .input-gg {
            border: solid 1px #ddd;
            height: 34px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding-right: 0;

            ::v-deep .van-field__control {
                color: #abaaad;
            }
        }

        .btn-select {
            border: 0;
        }
    }

    &-right {
        h4 {
            //margin-bottom: 10px;
        }

        &-content {
            //margin-bottom: 10px;

            li {
                display: flex;
                justify-content: space-between;
                margin-top: 1px;
                font-size: 12px;
            }
        }

        >span {
            font-size: 12px !important;
            margin: 4px 0 2px;
            padding: 0px 8px !important;
        }
    }
}

.btnAdd-marketStar {
    ::v-deep .van-icon {
        font-size: 14px !important;
        margin-right: 6px;
    }
}

.market-info {
    padding: 20px 20px 0;

    &-price {
        font-size: 20px;
        margin-top: 4px;
    }

    &-content {
        li:nth-child(2) {
            font-size: 14px;
            margin: 4px 0 6px;
            min-height: 21px;
        }
    }
}

.market-info-name {
    font-size: 15px;
}

.van-col--12 {
    width: 100%;
}
</style>
