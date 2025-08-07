<template>
    <main>
        <navBar :navTitle="navTitle" showRight_content>
            <div slot="narBarR_content">
                <van-button block type="info" v-btn-re-click size="mini" class="btnAdd-marketStar" v-if="isAdd"
                    @click="fnDelUserMarket">
                    <van-icon name="star" class="color-yellow" />
                    <span>{{ $t('market_info.text1') }}</span>
                </van-button>
                <van-button block type="info" v-btn-re-click size="mini" class="btnAdd-marketStar" v-else
                    @click="fnAddMarket">
                    <van-icon name="star-o" class="color-white" />
                    <span>{{ $t('market_info.text2') }}</span>
                </van-button>
            </div>
        </navBar>

        <!--信息-->
        <van-row class="market-info">
            <van-col span="24">
                <van-row>
                    <van-col span="9" class="market-info-left">
                        <div class="market-info-name">{{ info_obj.symbolName }} {{ info_obj.symbol }} </div>
                        <h4 class="market-info-price" :class="info_obj.regularMarketChange > 0 ?
                            'color-green' : 'color-red'">{{ info_obj.bid }}</h4>
                        <div :class="info_obj.regularMarketChange >= 0 ? 'color-green' : 'color-red'">
                            <span>{{ Number(info_obj.regularMarketChange).toFixed(2) }} </span>
                            <span> {{ Number(info_obj.regularMarketChangePercent).toFixed(2) }}%</span>
                        </div>
                    </van-col>
                  <van-col span="15">
                    <van-row class="market-info-content tc">
                      <!-- 第一行 -->

                      <van-col span="10">
                        <div class="info-item">
                          <span class="bg-blueLight2 info-label">{{ $t('market_info.text6') }}</span>
                          <span class="info-value" :class="marketChangeClass">{{ info_obj.regularMarketDayHigh }}</span>
                        </div>
                      </van-col>


                      <van-col span="7">
                        <div class="info-item">
                          <span class="bg-blueLight2 info-label">{{ $t('market_info.text3') }}</span>
                          <span class="info-value" :class="marketChangeClass">{{ (info_obj.twoHundredDayAverageChange*(1+0.07)/1000).toFixed(2) }}</span>
                        </div>
                      </van-col>


                      <!-- 第二行 -->
                      <van-col span="10">
                        <div class="info-item">
                          <span class="bg-blueLight2 info-label">{{ $t('market_info.text7') }}</span>
                          <span class="info-value" :class="marketChangeClass">{{ info_obj.regularMarketOpen }}</span>
                        </div>
                      </van-col>

                      <van-col span="7">
                        <div class="info-item">
                          <span class="bg-blueLight2 info-label">{{ $t('market_info.text5') }}</span>
                          <span class="info-value" :class="marketChangeClass">{{ info_obj.regularMarketPreviousClose }}</span>
                        </div>
                      </van-col>

                      <!-- 第三行 -->

                      <van-col span="10">
                        <div class="info-item">
                          <span class="bg-blueLight2 info-label">{{ $t('market_info.text8') }}</span>
                          <span class="info-value" :class="marketChangeClass">{{ info_obj.regularMarketDayLow }}</span>
                        </div>
                      </van-col>
                      <van-col span="7">
                        <div class="info-item">
                          <span class="bg-blueLight2 info-label">{{ $t('market_info.text4') }}</span>
                          <span class="info-value" :class="marketChangeClass">{{ (info_obj.twoHundredDayAverageChange*(1-0.07)/1000).toFixed(2) }}</span>
                        </div>
                      </van-col>
                    </van-row>
                  </van-col>
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
                            @click="fnChangePrice(1)">Giá thị trường
                        </van-button>
                    </van-col>

                </van-row>
                <van-row v-if="add_form.mairu_status == 2 && add_form.is_dazhong == 0">
                    <van-stepper min="0" step="10" v-model="add_form.mairu_money" placeholder="Giá giới hạn" />
                </van-row>

                <van-row v-if="add_form.mairu_status == 2 && add_form.is_dazhong == 1">
                    <van-stepper min="0" step="10" v-model="add_form.mairu_money" disabled placeholder="Giá giới hạn" />
                </van-row>

                <van-row>
                    <span class="color-theme font12">{{ $t('market_info.text11') }}</span>
                    <van-stepper min="0" step="1" v-model="add_form.mairu_count" @blur="changeNum()"
                        placeholder="Số lượng mua hàng" />
                </van-row>
                <van-row v-if="user_from.is_lever == 1">

                    <!-- <span class="color-theme font12">{{ $t('market_info.text12') }}</span> -->
                    <van-field class="input-gg"  v-model="ganggang_text" placeholder="Tỷ lệ đòn bẩy">
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
                                        <div>{{ option }}</div>
                                    </template>
                                </van-picker>
                            </van-popup>
                        </template>
                    </van-field>
                </van-row>

                <!-- <van-row :gutter="6" style="display:flex;">
                    <van-col span="12">
                        <van-button size="small" class="bg-gray" :class="add_form.mairu_type == 1 ? 'bgGreen': '' " block
                                    @click="add_form.mairu_type = 1 ">mua thêm
                        </van-button>
                    </van-col>
                    <van-col span="12">
                        <van-button size="small" class="bg-gray" :class="add_form.mairu_type == 2 ? 'bgRed': '' " block
                                    @click="add_form.mairu_type = 2 ">mua ngắn
                        </van-button>
                    </van-col>
                </van-row> -->

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
            </van-col> -->
        </van-row>

    </main>
</template>

<script>
import {
    Qcategory_add_api, index_maimai_pandang_api,
    index_sel_gupiao_api, QuserQstockservices_del_api, index_gupiao_details_api,
    index_qchicang_add_api,quser_sel_multiple
} from "@/assets/js/api";
import infoChart from "./components/market_info_chart"

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
                is_dazhong: 0,
            },
            week_arr: ["一", "二", "三", "四", "五"],
            maimai_obj: {
                chu: [0, 0, 0, 0, 0],
                jin: [0, 0, 0, 0, 0],
            },

            /** 現价 市价*/
            ganggang_text: 'Tỷ lệ đòn bẩy',
            typeArr: ["Không được dùng"],
            typeInfoObj: {
                name: "Không được dùng",
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
                ganggang_beilv: "", /*杠杠倍率*/
                mairu_type: 1, /*买入方向 1 买張 2买跌*/
                mairu_money: 0, /*限价金额参数*/
                is_dazhong: 0,
            },

            user_from: {
                is_lever: 0,
                multiple: ''
            },
            // isEdit: false,
            bid: "", /*初始現价金额*/
            delId: "",/*删除id*/
        }
    },
    methods: {


        // fnChangeMoney(val){
        //     // console.log(val);
        //     this.isEdit = true;
        // },
        /** 自选*/
        /*判断是否自选*/
        fnGetUserInfo() {
            let _this = this;
            quser_sel_multiple({
                quser_id: localStorage.getItem("userId"),
            }).then((res) => {
                if (res.code == 200) {
                    _this.user_from.is_lever = res.data.is_lever;
                    _this.user_from.multiple = res.data.multiple;
                    
                    const parts = res.data.multiple.split('|');
                  //  _this.typeArr.concat(parts);

                    parts.forEach((item, index) => {

                        //console.log(item); // 打印每个元素
                        _this.typeArr.push(item);
                    });

                    // console.log(_this.user_from.multiple);
                    // console.log(parts);
                     console.log(_this.typeArr);
                }
            });
        },
        changeNum() {
            let _this = this;

            // _this.add_form.mairu_count = _this.add_form.mairu_count % 100 == 0 ? _this.add_form.mairu_count : parseInt(_this.add_form.mairu_count / 100) * 100;

            // _this.add_form.mairu_count = _this.add_form.mairu_count <= 0 ? 1 : _this.add_form.mairu_count;

            _this.add_form.mairu_count = parseInt(_this.add_form.mairu_count);

            _this.add_form.mairu_count = _this.add_form.mairu_count <= 0 ? 1 : _this.add_form.mairu_count;

        },

        fnIfAdd() {
            index_sel_gupiao_api({
                quser_id: this.info_parm_obj.userID,
                symbol: this.info_parm_obj.symbol,
            }).then(res => {
                if (res.code == 200) {
                    this.isAdd = true;
                    this.delId = res.data;
                    // this.$toast("添加自選成功！");
                } else {
                    this.isAdd = false;
                }
            })
        },
        /*取消 自选*/
        fnDelUserMarket() {
            console.log("del");
            QuserQstockservices_del_api({
                id: this.delId,
                // id: "22",
            }).then(res => {
                if (res.code == 200) {
                    this.isAdd = false;
                    this.$toast("Hủy thành công tùy chọn！");
                }
            })
        },
        /*添加股票 自选*/
        fnAddMarket() {
            console.log("add");
            Qcategory_add_api({
                quser_id: this.info_parm_obj.userID,
                qstockservices_id: this.info_parm_obj.id,
                // systexId: this.info_parm_obj.systexId,
            }).then(res => {
                if (res.code == 200) {
                    this.isAdd = true;
                    this.$toast(res.msg);
                    setTimeout(() => {
                        this.fnIfAdd();
                    }, 300)

                }
            })
        },

        /*詳情*/
        fnGetInfo() {
            index_gupiao_details_api({
                id: this.info_parm_obj.id,
            }).then(res => {
                if (res.code == 200) {
                    this.info_obj = res.data;
                    this.bid = this.info_obj.bid;

                    this.add_form.is_dazhong = this.info_obj.is_dazhong;
                    if (this.add_form.is_dazhong == 1) {
                        this.add_form.mairu_money = this.info_obj.bid2;
                    } else {
                        if (this.add_form.mairu_money == 0) {
                            this.add_form.mairu_money = this.info_obj.bid;
                        }
                    }
                    
                    //    console.log( res.data )
                    this.navTitle = `${res.data.symbol}`;
                }
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
            if (isNaN(val)) {
                this.add_form.ganggang_beilv = "";
            } else {
                this.add_form.ganggang_beilv = val;
            }
            this.typeInfoObj.name = val;
            this.showType = false;
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
                } = this.add_form;
                filterForm = {
                    tel,
                    symbol,
                    mairu_status,
                    mairu_count,
                    ganggang_beilv,
                    mairu_type,
                    mairu_money: mairu_money * 1000,
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

            index_qchicang_add_api(filterForm).then(res => {
                if (res.code == 200) {
                    this.$toast(res.msg);
                    localStorage.setItem("trade_tab_active", 2);
                    setTimeout(() => {
                        this.$router.push({
                            name: "trade",
                        })
                    }, 1000)
                }
            })
        },

        /*買盘档和卖盘档*/
        fnGetMaimai() {
            index_maimai_pandang_api({
                // symbol: this.info_parm_obj.systexId,
                id: this.info_parm_obj.id,
            }).then(res => {
                if (res.code == 200) {
                    if (res.data.jin.length > 0) {
                        this.maimai_obj = res.data;
                    }

                }
            })
        },

    },
  computed:  {
    marketChangeClass() {
      const value = parseFloat(this.info_obj.regularMarketChangePercent);
      if (value > 0) {
        return 'color-green';
      } else if (value < 0) {
        return 'color-red';
      } else {
        return 'color-black';
      }
    }
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

        this.fnGetUserInfo();

        this.fnIfAdd();

        this.fnGetMaimai();

        this.fnGetInfo();
        this.time_interval = setInterval(() => {
            this.fnGetInfo();
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

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.info-label {
  padding: 2px 6px;
  border-radius: 4px;
  text-align: left;
  flex: 1;
}

.info-value {
  font-weight: bold;
  font-size: 14px;
  text-align: center;
  flex: 1;
}

.market-info-name {
  font-size: 15px;
}

.van-col--12 {
  width: 100%;
}
</style>
