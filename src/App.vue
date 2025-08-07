<template>
  <div id="app" class="app .ignore">
    <router-view v-if="isRouterAlive" />
    <van-tabbar
      v-if="showTabbar"
      v-model="tabbarActive"
      active-color="#3365e3"
      inactive-color="gray"
      class="tabber-fixed"
    >
      <van-tabbar-item
        replace
        :to="value.path"
        v-for="(value, index) in tabbarListArr"
        :key="index"
      >
        <span>{{ $t(`tabbar.${value.title}`) }}</span>
        <template #icon="props">
          <i class="iconfont" :class="value.icon"></i>
        </template>
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {
  name: "Home",
  provide() {
    return {
      reLoad: this.reLoad
    };
  },
  data() {
    return {
      isRouterAlive: true,
      showTabbar: false,
      tabbarActive: 0,
      tabbarListArr: [
        {
          path: "/index",
          name: "index",
          title: "home", // 改为字段 key
          icon: "icon-warehouse-delivery"
        },
        {
          path: "/market",
          name: "market",
          title: "market",
          icon: "icon-bingzhuangtucopy"
        },
        {
          path: "/trade",
          name: "trade",
          title: "trade",
          icon: "icon-jiaoyishuju"
        },
        {
          path: "/my",
          name: "my",
          title: "me",
          icon: "icon-shezhi1"
        }
      ]
    };
  },
  watch: {
    $route(to) {
      this.fnActiveIndex(to.name);
    }
  },
  methods: {
    reLoad() {
      this.isRouterAlive = false;
      this.$nextTick(() => {
        this.isRouterAlive = true;
      });
    },
    fnActiveIndex(pathName) {
      this.showTabbar = false;
      this.tabbarListArr.forEach((item, index) => {
        if (item.name == pathName) {
          this.tabbarActive = index;
          this.showTabbar = true;
        }
      });
    }
  },
  created() {
    const pathName = this.$route.name;
    this.fnActiveIndex(pathName);
    this.GLOBAL.getSession();
  }
};
</script>
