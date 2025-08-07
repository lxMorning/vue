<template>
  <div class="myOrder">
    <van-list
      v-model="listed_loading"
      :finished="listed_finished"
      finished-text=""
      loading-text="Đang tải……"
      @load="fnLoadListed"
      :immediate-check="false"
      class="listed-van-list"
      v-if="listed_arr.length"
      offset="100"
    >
      <main class="project-ul">
        <div class="project-item th">
          <div class="title">{{ $t('myOrder.text1') }}</div>
          <div class="rate center">{{ $t('myOrder.text2') }}<br />{{ $t('myOrder.text3') }}</div>
          <div class="day center">{{ $t('myOrder.text4') }}</div>
          <div class="date center">{{ $t('myOrder.text5') }}</div>
        </div>
        <div v-for="item in listed_arr" :key="item.id" class="project-item">
          <div class="title">{{ item.product_name }}</div>
          <div class="rate money">
            {{ item.money }}<br />+{{ item.day_inc }}
          </div>
          <div class="day money">+{{ item.total_inc }}</div>
          <div
            v-if="!item.status && item.day > item.fanxian_number"
            class="lable"
          >
            tăng
          </div>
          <div
            v-else-if="!item.status && item.day == item.fanxian_number"
            class="lable shuhui"
            @click="redemption(item.id)"
          >
            chuộc
          </div>
          <div v-else class="lable close">{{ $t('myOrder.text8') }}</div>
        </div>
        <!-- <div v-for="item in listed_arr" :key="item.id" class="myOrder-item">
          <div class="banner" ref="">
            <img
              :src="envUrl + item.product_image"
              alt=""
              srcset=""
            />
          </div>
          <div class="item-inner">
            <p>{{ item.product_name }}</p>
            <div>日利率：{{ item.day_rate }}%</div>
            <div>週期：{{ item.day }}天</div>
            <div>投資金額：{{ item.money }}</div>
            <div>購買時間：{{ item.start_time.split(" ")[0] }}</div>
            <div>結束時間：{{ item.end_time.split(" ")[0] }}</div>
            <div>預計收益：{{ item.predict_price }}</div>
            <div v-if="!item.status && item.day > item.fanxian_number" class="lable">增值中</div>
			<div v-else-if="!item.status && item.day == item.fanxian_number" class="lable shuhui" @click="redemption(item.id)">贖回</div>
            <div v-else class="lable close">已完成</div>
          </div>
        </div> -->
      </main>
    </van-list>
    <div v-else class="text-note">{{ $t('myOrder.text9') }}</div>
  </div>
</template>

<script>
import {
  index_product_order_api,
  Qstockservices_sel_api,
  index_product_redemption_api,
} from "@/assets/js/api";
import Moment from "moment";

export default {
  name: "myOrder",
  components: {},
  props: {
    tabActive: {
      type: Number,
    },
  },
  data() {
    return {
      /** 上市 + 上櫃*/
      listed_loading: false,
      listed_finished: false,
      listed_arr: [],
      listed_obj: {
        page: 1,
        size: 20,
      },
      envUrl: process.env.VUE_APP_SERVER,
    };
  },
  watch: {
    tabActive(val) {
      if (this.listed_arr.length == 0 && val == 2) {
        this.listed_obj.page = 1;
        this.fnLoadListed();
      }
    },
  },
  methods: {
    Moment,
    /*详情页*/
    myOrderInfo(item) {
      this.$router.push("/manageFinances_info?id=" + item.id);
    },
    redemption(id) {
      this.listed_loading = true;
      index_product_redemption_api({
        id: id,
        user_id: localStorage.getItem("userId"),
      }).then((res) => {
        this.$toast(res.msg);
        this.listed_loading = false;

        if (res.code == 200) {
          this.listed_obj.page = 1;
          this.fnLoadListed();
        }
      });
    },
    /* 上市 + 上櫃列表*/
    fnLoadListed() {
      this.listed_loading = true;
      index_product_order_api({
        page: this.listed_obj.page,
        size: this.listed_obj.size,
        user_id: localStorage.getItem("userId"),
        // exchange: 'TAI',
        // sectorId: '',
        // page: this.listed_obj.page,
      }).then((res) => {
        this.listed_loading = false;
        if (res.code == 200) {
          if (this.listed_obj.page == 1) {
            this.listed_arr = res.data;
          } else {
            this.listed_arr = this.listed_arr.concat(res.data);
          }
          this.listed_obj.page++;
          // 加载状态结束
          if (res.data.length < 20) {
            this.listed_finished = true;
            return;
          }
        } else {
          this.listed_finished = true;
        }
      });
    },
  },
  mounted() {
    const tabActive = this.tabActive;
    // console.log(tabActive);
    if (tabActive == 2) {
      this.fnLoadListed();
    }
  },
};
</script>

<style lang="scss" scoped>
.myOrder {
  height: calc(100vh - 50px);
  background: #f6f5f8;
  padding-top: 10px;
  .listed-van-list {
    height: 100%;
  }

  .project-ul {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: start;
    padding: 0 15px 52px;
    .th {
      color: #abaaad !important;
    }
    .project-item {
      width: calc(100%);
      background: #fff;
      border-radius: 10px 10px 0 0;
      overflow: hidden;
      margin: 0 0 15px 0;
      display: flex;
      padding: 10px 5px;

      .center {
        font-size: 14px !important;
        text-align: center;
      }
      .title {
        width: 40%;
      }
      .rate {
        width: 27.5%;
        text-align: center;
      }
      .day {
        width: 22.5%;
        text-align: center;
      }
      .date {
        width: 10%;
      }
      .money {
        color: #ef5963;
      }

      .lable {
        width: 50px;
        height: 25px;
        line-height: 20px;
        background-color: #02a7f0;
        color: #ffffff;
        padding: 2px 3px;
        font-size: 12px;
        text-align: center;
        border-radius: 5px;
      }

      .shuhui {
        background-color: #ef5963;
      }

      .close {
        background-color: gray;
      }
    }
  }

  .myOrder-ul {
    width: 100%;
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    padding: 0 15px 52px;
    .myOrder-item {
      width: calc(50% - 7.5px);
      margin: 0 15px 15px 0;
      background: #fff;
      border-radius: 10px 10px 0 0;
      overflow: hidden;
      height: 359px;
      position: relative;

      .banner {
        margin: 0;
        height: 160px;
        overflow: hidden;
        display: flex;
        justify-content: center;
        // align-items: center;
        img {
          width: 100%;
          // height: 100%;
        }
      }
      .lable {
        height: 25px;
        line-height: 25px;
        border-radius: 6px;
        text-align: center;
        background: #fe9c02;
        margin-top: 10px;
        color: #02a7f0;
      }
      .lable.close {
        background: #abaaad;
        color: #fff;
      }
      .lable.shuhui {
        background-color: #02a7f0;
      }
    }
    .myOrder-item:nth-child(2n) {
      margin-right: 0px;
    }
    .item-inner {
      padding: 10px;
      position: absolute;
      bottom: 0;
      left: 0;
      background: #fff;
      width: 100%;
      p {
        font-size: 15px;
      }
      div {
        font-size: 13px;
      }
    }
  }
}
</style>