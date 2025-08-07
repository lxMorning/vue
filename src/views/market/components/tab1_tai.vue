<template>
  <main>
    <div class="listed-box">
      <!-- 表头 -->
      <van-row class="listed-list-first full-width92">
        <van-col span="8">
          <div>{{ $t('tab1_tai.text1') }}</div>
        </van-col>
        <van-col span="8" class="tc">
          <div>{{ $t('tab1_tai.text2') }}</div>
        </van-col>
        <van-col span="8" class="tr">
          <div>{{ $t('tab1_tai.text3') }}</div>
        </van-col>
      </van-row>

      <!-- 列表 -->
      <van-list
          v-model="listed_loading"
          :finished="listed_finished"
          finished-text=""
          loading-text="Đang tải……"
          @load="fnLoadListed"
          :immediate-check="false"
          class="listed-van-list"
      >
        <main class="listed-ul">
          <van-row
              v-for="(item, index) in listed_arr"
              :key="index"
              class="listed-list full-width92"
              @click="fnGoMarketInfo(item)"
          >
            <!-- 左侧 symbolName + symbol，跟随涨幅变色 -->
            <van-col span="8">
              <div
                  class="listed-name"
                  :class="getColorClass(item.regularMarketChangePercent, item.exchange)"
              >
                {{ item.symbolName }}
              </div>
              <div
                  class="listed-symbol"
                  :class="getColorClass(item.regularMarketChangePercent,item.exchange)"
              >
                {{ item.symbol }}
              </div>
            </van-col>

            <!-- 中间价格 -->
            <van-col span="8" class="tc">
              <div
                  class="listed-price"
                  :class="getColorClass(item.regularMarketChangePercent,item.exchange)"
              >
                {{ formatPrice(item.bid) || 0.00 }}
              </div>
            </van-col>

            <!-- 右侧涨幅 -->
            <van-col span="8" class="tr">
              <div
                  class="listed-price"
                  :class="getColorClass(item.regularMarketChangePercent,item.exchange)"
              >
                <span v-if="item.regularMarketChangePercent > 0">+</span>
                {{ Number(item.regularMarketChangePercent).toFixed(2) || 0 }}
              </div>
            </van-col>
          </van-row>
        </main>
      </van-list>
    </div>
  </main>
</template>

<script>
import {Qstockservices_sel_api} from "@/assets/js/api";
import market_type from "./market_type";

export default {
  name: "tab1_tai",
  components: {market_type},
  props: {
    exchange: {type: String}
  },
  data() {
    return {
      time_interval: "",
      listed_loading: false,
      listed_finished: false,
      listed_arr: [],
      listed_obj: {
        exchange: "hose",
        sectorId: "",
        page: 1,
      },
    };
  },
  methods: {
    formatPrice(price) {
      // 如果价格不存在，返回默认值
      if (!price) return '0.00';

      // 转换为字符串处理
      let priceStr = price.toString();

      // 如果包含小数点
      if (priceStr.includes('.')) {
        const parts = priceStr.split('.');
        // 如果小数点后不是两位数，则补足到两位
        if (parts[1].length < 2) {
          parts[1] = parts[1].padEnd(2, '0');
        } else if (parts[1].length > 2) {
          // 如果超过两位，保留两位小数
          parts[1] = parts[1].substring(0, 2);
        }
        return parts.join('.');
      } else {
        // 如果不包含小数点，直接添加 .00
        return priceStr + '.00';
      }
    },
    getColorClass(percent, type) {
      const percentNum = parseFloat(percent);
      switch (type) {
        case "hose":
          console.log(type)
          return this.judgeColor(percentNum, 0.07)
        case "hnx":
          console.log(type)
        return this .judgeColor(percentNum, 0.10)
        case "upcom":
         return this.judgeColor(percentNum, 0.15)
      }

      return 'color-orange';
    },
    judgeColor(percent, rant) {
      console.log(percent, rant)
      if (percent > 0) {
        if (percent > rant) return 'color-purple';
        return 'color-orange';
      } else if (percent < 0) {
        if (percent < -rant) return 'color-blue';
        return 'color-red';
      } else {
        return 'color-yellow';
      }
    },
    fnCheckedType(sectorId) {
      this.listed_obj.page = 1;
      this.listed_obj.sectorId = sectorId;
      this.fnLoadListed();
    },
    fnGoMarketInfo(item) {
      this.$emit("fnGoMarketInfo", item);
    },
    fnLoadListed() {
      this.listed_loading = true;
      Qstockservices_sel_api({
        exchange: this.listed_obj.exchange,
        sectorId: this.listed_obj.sectorId,
        page: this.listed_obj.page,
      }).then((res) => {
        this.listed_loading = false;
        if (res.code == 200) {
          if (this.listed_obj.page === 1) {
            this.listed_arr = res.data;
          } else {
            this.listed_arr = this.listed_arr.concat(res.data);
          }
          this.listed_obj.page++;
          if (res.data.length < 20) {
            this.listed_finished = true;
          }
        } else {
          this.listed_finished = true;
        }
      });
    },
  },
  created() {
    const tabActive = this.$attrs.tabActive;
    let exchange = "hose";
    if (tabActive == 1) exchange = "hose";
    if (tabActive == 2) exchange = "hnx";
    if (tabActive == 5) exchange = "upcom";
    this.listed_obj.exchange = exchange;

    this.fnLoadListed();
    this.time_interval = setInterval(() => {
      this.listed_obj.page--;
      this.fnLoadListed();
    }, 5000);
  },
  destroyed() {
    clearInterval(this.time_interval);
  },
};
</script>

<style scoped>
.listed-price,
.listed-name,
.listed-symbol {
  font-weight: bold;
  font-size: 14px;
}


.color-purple {
  color: purple;
}

.color-orange {
  color: orange;
}

.color-blue {
  color: blue;
}

.color-red {
  color: red;
}

.color-yellow {
  color: yellow;
}

.color-green {
  color: #16c784;
}

.color-red {
  color: #ea3943;
}

.color-orange {
  color: #ff9800;
}
</style>
