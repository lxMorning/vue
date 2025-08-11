<template>
  <div>
    <navBar navTitle="" showRight_content showLeft>
      <div slot="narBarR_content" class="barR-icon flex-center" @click="fnGoSetUp">
        <i class="iconfont icon-shezhi1"></i>
      </div>
      <!-- 语言切换按钮 -->
      <div slot="narBarR_content" class="barR-icon flex-center" @click="showLangList = !showLangList">
        🌐
      </div>
    </navBar>

    <main class="full-width92">
      <div class="my-header">
        <van-image :src="userInfoObj.userHeader ? userInfoObj.userHeader : defaultHeader" />
        <span class="my-phone">{{ userInfoObj.tel }}</span>
      </div>

      <h4 class="my-balance color-theme bgBlock-lightBlue">
        {{ $t('my.totalAssets') }}：{{ userInfoObj.money }}
      </h4>
      <h4 class="my-balance color-theme bgBlock-lightBlue">
        {{ $t('my.usdAssets') }}：{{ userInfoObj.usd_money }}
      </h4>

      <!-- 四大导航 -->
      <van-grid square :border="false" class="nyNav-grid">
        <van-grid-item v-for="(item, index) in navArr" :key="index" :icon="item.icon" :text="$t(item.titleKey)"
          @click="fnGoNav(item)">
          <template #icon>
            <i class="iconfont icon-grid color-theme" :class="item.icon" />
          </template>
        </van-grid-item>
      </van-grid>

      <!-- 导航 -->
      <van-cell-group :border="false" class="my-router">
        <van-cell :title="$t(item.titleKey)" :border="false" @click="fnGoNav(item)" v-for="(item, index) in routerArr"
          :key="index">
          <template #icon>
            <i class="iconfont icon-router" :class="item.icon" />
          </template>
        </van-cell>
      </van-cell-group>

    </main>

    <!-- 语言选择弹窗 -->
    <transition name="fade">
      <div class="lang-popup" v-if="showLangList">
        <div v-for="lang in languages" :key="lang.value" class="lang-item" @click="switchLanguage(lang.value)">
          {{ lang.label }}
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import defaultHeader from '@/assets/images/default_avatar.svg'
import { quser_sel_api, quser_if_username_api, index_xtconfig_api } from "@/assets/js/api";

export default {
  name: "my",
  data() {
    return {
      defaultHeader,
      showLangList: false, // 控制语言选择弹窗的显示与隐藏
      userInfoObj: {
        header: "",
        phone: "",
        url: "mySetup",
      },
      languages: [
        { label: 'Tiếng Việt', value: 'vi' },
        { label: '中文', value: 'zh' },
        { label: 'English', value: 'en' },
      ],
      navArr: [
        { titleKey: "my.deposit", url: "my_deposit", icon: "icon-qiapian" },
        { titleKey: "my.withdraw", url: "my_withdraw", icon: "icon-chongzhi" },
        { titleKey: "my.exchange", url: "my_exchange", icon: "icon-chongzhi" },
        { titleKey: "my.history", url: "my_transaction_record", icon: "icon-jifenmingxi" },
        { titleKey: "my.profile", url: "my_authentication", icon: "icon-qiapian" },
      ],
      routerArr: [
        { titleKey: "my.bankManage", url: "my_cardManage", icon: "icon-qiapian" },
        { titleKey: "my.fundPassword", url: "my_transaction_password", icon: "icon-mima" },
        { titleKey: "my.customerService", url: "my_contact", icon: "icon-kefu1" },
      ]
    };
  },
  computed: {
    currentLangLabel() {
      const langMap = { vi: 'Tiếng Việt', zh: '中文', en: 'English' };
      return langMap[this.$i18n.locale] || 'Language';
    }
  },
  methods: {
    switchLanguage(lang) {
      this.$i18n.locale = lang;
      localStorage.setItem('lang', lang);
      this.showLangList = false; // 关闭语言选择弹窗
    },
    fnGoSetUp() {
      this.$router.push({
        name: 'my_setup',
        query: {
          username: this.userInfoObj.username,
          tel: this.userInfoObj.tel,
        }
      })
    },
    fnGOUrl(item) {
      this.$router.push({ name: item.url });
    },
    fnGoNav(item) {
      if (item.url === "my_contact") {
        index_xtconfig_api().then(res => {
          window.location.href = res.data.value;
        });
        return;
      }

      if (item.url === "my_withdraw") {
        this.$router.push({
          name: item.url,
          query: {
            username: this.userInfoObj.username,
            money: this.userInfoObj.money,
          }
        });
        // if (this.userInfoObj.username) {
        //   this.$router.push({
        //     name: item.url,
        //     query: {
        //       username: this.userInfoObj.username,
        //       money: this.userInfoObj.money,
        //     }
        //   });
        // } else {
        //   this.$router.push({ name: "my_authentication" });
        // }
        return;
      }

      if (item.url === "my_authentication") {
        quser_if_username_api().then(res => {
          if (res.code == "200") {
            if (res.data == 1 || res.data == 4) {
              this.$router.push({
                name: "my_authentication_success",
                query: {
                  username: this.userInfoObj.username,
                  name_id: this.userInfoObj.name_id,
                  status: res.data == 1 ? this.$t('my.statusVerified') : this.$t('my.statusPending')
                }
              });
            } else {
              this.fnGOUrl(item);
            }
          } else {
            this.fnGOUrl(item);
          }
        });
        return;
      }

      if (item.url) {
        this.fnGOUrl(item);
      }
    },
    fnGetUserInfo() {
      quser_sel_api().then(res => {
        if (res.code == 200) {
          this.userInfoObj = res.data;
          localStorage.setItem("userObj", JSON.stringify(res.data));
        }
      });
    },
  },
  created() {
    this.fnGetUserInfo();
    const savedLang = localStorage.getItem('lang');
    if (savedLang) {
      this.$i18n.locale = savedLang;
    }
  }
};
</script>

<style lang="scss" scoped>
.my-header {
  display: flex;
  align-items: center;
  margin: 10px 0;

  .van-image {
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }

  .my-phone {
    font-size: 16px;
    margin-left: 6px;
    font-weight: bold;
  }
}

.nyNav-grid {
  margin: 10px 0;

  .icon-grid {
    margin-bottom: 10px;
    font-size: 24px;
  }
}

.my-balance {
  border-radius: 6px;
}

.my-router {
  .van-cell {
    padding: 10px 0;
  }

  .icon-router {
    align-self: center;
    margin-right: 6px;
  }
}

.barR-icon {
  margin-left: 10px;
  font-size: 18px;
  cursor: pointer;
}

.van-popup {
  padding-bottom: 20px;
}

.lang-popup {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  border-top: 1px solid #ccc;
  padding: 10px 0;
  text-align: center;
  z-index: 999;
}

.lang-item {
  padding: 10px;
  font-size: 16px;
  cursor: pointer;
}

.lang-item:hover {
  background: #f2f2f2;
}

.fade-enter-active, .fade-leave-active {
  transition: all 0.3s ease;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
