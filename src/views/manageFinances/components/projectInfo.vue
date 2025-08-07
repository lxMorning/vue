<template>
  <div class="project-info">
    <navBar :navTitle="info ? info.product_name : ''" />
    <!--<van-nav-bar-->
    <!--  :title="info ? info.product_name : ''"-->
    <!--  left-text=""-->
    <!--  left-arrow-->
    <!--  @click-left="onClickLeft"-->
    <!--/>-->
    <div class="inner">
      <div class="banner">
        <img v-if="info" :src="envUrl + info.image" alt="" srcset="" />
      </div>
      <div class="item">
        <div class="item-group">
          <span>{{ $t('projectInfo.text1') }}</span><span>{{ info ? info.start_price : "" }}</span>
        </div>
        <div class="item-group zhij">
          <span>{{ $t('projectInfo.text2') }}</span>
          <span>{{
            info ? (info.max_price == 0 ? "vô hạn" : info.max_price) : ""
          }}</span>
        </div>
        <div class="item-group">
          <span>{{ $t('projectInfo.text3') }}</span><span>{{ info ? info.day : 0 }}Trời</span>
        </div>
        <div class="item-group">
          <span>{{ $t('projectInfo.text4') }}</span
          ><span>{{ info ? info.day_rate.toFixed(2) : 0 }}%</span>
        </div>
        <div class="item-group">
          <span>{{ $t('projectInfo.text5') }}</span
          ><span>{{ info ? info.investment_count : "" }}</span>
        </div>
      </div>
      <div class="item">
        <div class="item-group">
          <span>{{ $t('projectInfo.text6') }}</span
          ><span>{{ userInfoObj ? userInfoObj.money : "" }}</span>
        </div>
        <div class="item-group field">
          <span>{{ $t('projectInfo.text7') }}</span
          ><span><van-field v-model="money" type="number" /></span>
        </div>
        <div class="item-group field">
          <span>{{ $t('projectInfo.text8') }}</span
          ><span
            ><van-field
              placeholder="Vui lòng nhập mật khẩu bảo mật"
              v-model="password"
              type="password"
          /></span>
        </div>
        <div class="item-group">
          <span>{{ $t('projectInfo.text9') }}</span>
          <span class="money" v-if="info && money.length <= 3">
            {{ money || 0 }}+({{ money || 0 }}*{{
              info.day_rate.toFixed(2)
            }}%*{{ info.day }}) ≈ {{ predict_price }}</span
          >
        </div>
        <div class="item-group-money" v-if="money.length > 3">
          <span class="money" v-if="info">
            {{ money || 0 }}+({{ money || 0 }}*{{
              info.day_rate.toFixed(2)
            }}%*{{ info.day }}) ≈ {{ predict_price }}</span
          >
        </div>
      </div>
      <van-button
        block
        type="info"
        native-type="submit"
        v-btn-re-click
        @click="submit"
      >
        xác nhận mua hàng
      </van-button>
    </div>
  </div>
</template>

<script>
import {
  index_product_info_api,
  quser_sel_api,
  quser_if_tpwd_api,
  index_product_buy_api,
} from "@/assets/js/api";
import { Dialog } from "vant";

export default {
  name: "project-info",
  components: {},
  props: {},
  data() {
    return {
      password: null,
      money: "",
      info: null,
      userInfoObj: null,
      envUrl: process.env.VUE_APP_SERVER,
    };
  },
  computed: {
    predict_price() {
      let money = JSON.parse(JSON.stringify(this.money)) || 0;
      if (!this.info) return;
      let { day_rate, day } = JSON.parse(JSON.stringify(this.info));
      if (day_rate && money) {
        let rate = money * (Number(day_rate) / 100) * day;
        let num = Number(money) + rate;
        return num.toFixed(2);
      } else {
        return 0;
      }
    },
  },
  methods: {
    getProjectInfo() {
      let id = this.$route.query.id;
      // console.log(id);
      index_product_info_api({
        product_id: id,
      }).then((res) => {
        if (res.code == 200) {
          this.info = res.data;
        }
      });
      quser_sel_api().then((res) => {
        if (res.code == 200) {
          this.userInfoObj = res.data;
        }
      });
    },
    submit() {
      // console.log(Number(this.info.max_price));
      if (!this.money) {
        this.$toast("Vui lòng nhập số tiền đầu tư");
        return;
      }
      if (!this.password) {
        this.$toast("Vui lòng nhập mật khẩu quỹ");
        return;
      }
      if (Number(this.money) > Number(this.userInfoObj.money)) {
        this.$toast("Số dư tài khoản không đủ");
        return;
      }
      if (Number(this.money) < Number(this.info.start_price)) {
        this.$toast("Số tiền tối thiểu không được nhỏ hơn số tiền đầu tư ban đầu");
        return;
      }
      if (
        Number(this.info.max_price) != 0 &&
        Number(this.money) > Number(this.info.max_price)
      ) {
        this.$toast("Số tiền đầu tư tối đa không được vượt quá");
        return;
      }

      // return;
      quser_if_tpwd_api({
        t_password: this.password,
      }).then((res) => {
        // console.log(res);
        if (res.code == 200) {
          index_product_buy_api({
            user_id: localStorage.getItem("userId"),
            product_id: this.$route.query.id,
            predict_price: this.predict_price,
            money: this.money,
          }).then((buyRes) => {
            // console.log(buyRes);
            if (buyRes.code == 200) {
              this.$toast.success("đầu tư thành công！");
              setTimeout(() => {
                this.$router.push("/manageFinances?form=2");
              }, 2000);
            } else {
              if (buyRes.msg == "Số dư tài khoản không đủ") {
                this.$toast(buyRes.msg);
                // 餘額不足提醒並且刷新頁面
                setTimeout(() => {
                  this.getProjectInfo();
                }, 2000);
              }
              this.$toast(buyRes.msg);
            }
          });
        } else if (res.code == 999) {
          // 沒有設置資金密碼，提示去設置密碼
          Dialog.confirm({
            title: "dấu",
            message: "Mật khẩu quỹ chưa được đặt, vui lòng đặt",
            confirmButtonText: "xác nhận",
            cancelButtonText: "Hủy bỏ",
          })
            .then(() => {
              this.$router.push("/my_transaction_password");
            })
            .catch(() => {});
        } else {
          this.$toast("Mật khẩu quỹ không chính xác！");
        }
      });
    },
    onClickLeft() {
      this.$router.push("/manageFinances");
    },
  },
  mounted() {
    this.getProjectInfo();
  },
};
</script>

<style lang="scss" scoped>
.project-info {
  height: 100vh;
  background: #f6f5f8;
  .inner {
    padding: 10px;
  }
  .banner {
    border-radius: 10px;
    img {
      width: 100%;
      height: 100%;
      border-radius: 10px;
    }
  }
  .item {
    background: #fff;
    border-radius: 10px;
    margin: 15px 0;
    padding: 10px;
    .item-group {
      display: flex;
      justify-content: space-between;
      height: 28px;
      line-height: 28px;
      padding: 0 6px;
      margin: 6px 0;
      span:nth-child(1) {
        text-align: left;
        width: 75px;
      }
      span:nth-child(2) {
        text-align: right;
        white-space: nowrap;
        width: calc(100% - 75px);
      }
      .van-cell {
        background-color: #f6f5f8;
        height: 100%;
        line-height: 28px;
        padding: 0;
        width: 150px;

        ::v-deep .van-field__control {
          text-align: right;
          background-color: #f6f5f8 !important;
          line-height: 28px;
          width: 150px;
        }
      }
      .money {
        white-space: nowrap;
      }
    }
    .item-group.zhij {
      span:nth-child(1) {
        text-align: left;
        width: 90px;
      }
    }
    .item-group-money {
      text-align: right;
    }
    .item-group.field {
      span:nth-child(2) {
        text-align: left;
        width: 150px;
      }
    }
  }
  ::v-deep .van-nav-bar i {
    font-size: 20px;
  }
}
</style>