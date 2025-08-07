<template>
  <div class="project">
    <van-list
      v-model="listed_loading"
      :finished="listed_finished"
      finished-text=""
      loading-text="Đang tải……"
      @load="fnLoadListed"
      :immediate-check="false"
      class="listed-van-list"
      v-if="listed_arr.length"
    >
      <main class="project-ul">
        <div class="project-item th">
          <div class="title center">{{ $t('project.text1') }}</div>
          <div class="rate center textcenter">{{ $t('project.text2') }}</div>
          <div class="day center textcenter">{{ $t('project.text3') }}</div>
          <div class="date center textcenter">{{ $t('project.text4') }}</div>
          <div class="status center textcenter">{{ $t('project.text5') }}</div>
        </div>

        <div v-for="item in listed_arr" :key="item.id" class="project-item">
          <div class="title" @click="desc(item)">{{ item.product_name }}</div>
          <div class="rate textcenter top6">{{ item.day_rate }}%</div>
          <div class="day textcenter top6">{{ item.day }}Trời</div>
          <div class="date textcenter">
            {{ item.date ? item.date.substr(0, 4) : "" }}<br />{{
              item.date ? item.date.substr(5, 5) : ""
            }}
          </div>
          <div v-if="item.status == 1" class="buy" @click="projectInfo(item)">
            Mua
          </div>
          <div v-else-if="item.status == -1" class="yus">
            Bán trước
          </div>
          <div v-else class="end" >{{ $t('project.text7') }}</div>
        </div>
      </main>
    </van-list>
    <div v-else class="text-note" style="margin-top: 30px;">{{ $t('project.text8') }}</div>
  </div>
</template>

<script>
import { index_product_sel_api } from "@/assets/js/api";

export default {
  name: "project",
  components: {},
  props: {
    tabActive: {
      type: Number,
    },
  },
  data() {
    return {
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
  methods: {
    /*详情页*/
    projectInfo(item) {
      if (item.status == 0) return false;
      this.$router.push("/manageFinances_info?id=" + item.id);
    },
    desc(item) {
      this.$router.push("/manageFinances_desc?id=" + item.id);
    },
    /* 上市 + 上櫃列表*/
    fnLoadListed() {
      this.listed_loading = true;
      index_product_sel_api({
        page: this.listed_obj.page,
        size: this.listed_obj.size,
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
    if (tabActive == 1) {
      this.fnLoadListed();
    }
  },
};
</script>

<style lang="scss" scoped>
.project {
  height: calc(100vh - 50px);
  background: #f6f5f8;
  .listed-van-list {
    height: 100%;
    padding-top: 10px;
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
      }
      .textcenter {
        text-align: center;
      }
      .title {
        width: 40%;
        font-size: 14px;
      }
      .rate {
        width: 15%;
        font-size: 14px;
      }
      .day {
        width: 15%;
        font-size: 14px;
      }
      .date {
        width: 15%;
        font-size: 14px;
      }
      .status {
        width: 15%;
      }
      .top6 {
        margin-top: 6px;
      }
      .buy {
        width: 50px;
        height: 25px;
        background-color: #ef5963;
        color: #ffffff;
        padding: 2px 5px;
        border-radius: 5px;
        font-size: 14px;
        text-align: center;
        margin-top: 6px;
      }

      .end {
        width: 50px;
        height: 25px;
        background-color: gray;
        color: #ffffff;
        padding: 2px 5px;
        border-radius: 5px;
        font-size: 14px;
        text-align: center;
        margin-top: 6px;
      }
      .yus{
        width: 50px;
        height: 25px;
        background-color: #02a7f0;
        color: #ffffff;
        padding: 2px 5px;
        border-radius: 5px;
        font-size: 14px;
        text-align: center;
        margin-top: 6px;
      }
    }
    .project-item:nth-child(2n) {
      margin-right: 0px;
    }
    .item-inner {
      padding: 10px;
      p {
        font-size: 14px;
      }
      div {
        font-size: 14px;
      }
    }
  }
}
</style>