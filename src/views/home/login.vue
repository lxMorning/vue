<template>
    <div>
        <!-- 右上角语言切换按钮 -->
        <div class="lang-toggle" @click="showLangList = !showLangList">
            🌐
        </div>

        <!-- 底部弹出语言列表 -->
        <transition name="fade">
            <div class="lang-popup" v-if="showLangList">
                <div v-for="lang in languages" :key="lang.value" class="lang-item"
                    @click="switchLanguage(lang.value)">
                    {{ lang.label }}
                </div>
            </div>
        </transition>

        <navBar :navTitle="$t(loginType === 'login' ? 'login.titleLogin' : 'login.titleRegister')" 
                v-if="loginType === 'login'" showRight :showLeft="true" />
        <navBar :navTitle="$t('login.titleRegister')" v-else @fnBtnLeft="fnBtnLeft" :leftBack="false"/>

        <div class="full-width">
            <van-image class="login-header" :src="logoUrl"/>

            <!--登录-->
            <van-form ref="refFormLogin" v-show="loginType === 'login'" class="public-form">
                <div>
                  <div>
                  </div>
                  <van-field
                    v-model.trim="formLogin.tel"
                    clearable
                    :placeholder="$t('login.placeholder1')"
                    :rules="[{ required: true, message: $t('login.rule1') }]"
                  />
                </div>
                <div>
                  <div>
                  </div>
                  <van-field
                    v-model.trim="formLogin.password"
                    clearable
                    type="password"
                    :placeholder="$t('login.placeholderPassword')"
                    :rules="[{ required: true, message: $t('login.rulePassword') }]"
                  />
                </div>

                <van-button block type="info" native-type="submit" class="btn-login" @click="fnLogin"
                            v-btn-re-click>{{ $t('login.text3') }}</van-button>
                <van-button block type="text" native-type="button" class="btn-text" @click=" fnGoRegister ">{{ $t('login.text4') }}</van-button>

            </van-form>

            <!--注册-->
            <van-form  ref="refFormRegister" v-show="loginType === 'register'" class="public-form">
                <div>
                    <div><i class="iconfont icon-shouji color-theme"></i><span>{{ $t('login.text1') }}</span></div>
                    <van-field v-model.trim="formRegister.tel" clearable :placeholder="$t('login.placeholder1')" autocomplete="off"
                               :rules="[{ required: true, message: $t('login.rule1') },
                                { validator: taiwanPass, message: $t('login.rulePhone') }]" />
                </div>
                <div>
                    <div><i class="iconfont icon-mima1 color-theme"></i><span>{{ $t('login.text2') }}</span></div>
                    <van-field v-model.trim="formRegister.password"  clearable type="password" :placeholder="$t('login.placeholderPassword')"
                               :rules="[{ required: true, message: $t('login.rulePassword') }]" />
                </div>
                <div>
                    <div><i class="iconfont icon-mima1 color-theme"></i><span>{{ $t('login.text7') }}</span></div>
                    <van-field v-model.trim="formRegister.sure_password" clearable type="password" :placeholder="$t('login.placeholderConfirm')"
                               :rules="[{ required: true, message: $t('login.ruleConfirm') },
                               { validator: checkPass, message: $t('login.ruleNotMatch') } ]" />
                </div>
                <div>
                    <div><i class="iconfont icon-yaoqingma color-theme"></i><span>{{ $t('login.text8') }}</span></div>
                    <van-field v-model.trim="formRegister.code_str" clearable :placeholder="$t('login.placeholderCode')"/>
                </div>

                <van-button block type="info" native-type="submit" class="btn-login" @click="fnRegisterMember"
                v-btn-re-click>{{ $t('login.text9') }}</van-button>
            </van-form >
        </div>
    </div>
</template>

<script>
import {index_login_api, quser_add_api} from "@/assets/js/api"
import logoUrl from "@/assets/images/logo.png"

export default {
    name: "login",
    data() {
        return {
            showLangList: false,
            languages: [
                { label: 'Tiếng Việt', value: 'vi' },
                { label: '中文', value: 'zh' },
                { label: 'English', value: 'en' }
            ],
            logoUrl,
            loginType: "login",

            formLogin: {
                tel: "",
                password: "",
            },

            formRegister: {
                tel: "",
                password: "",
                sure_password: "",
                code_str: "",
            }
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
            this.showLangList = false;
        },
        checkPass(newPass) {
            return newPass === this.formRegister.password;
        },
        taiwanPass(val){
            return val.length > 8 && val.length < 12
        },
        fnFormResetValidation(){
            this.$refs["refFormRegister"].resetValidation();
            this.$refs["refFormLogin"].resetValidation();
        },
        fnLogin() {
            this.$refs.refFormLogin.validate().then(()=>{
                index_login_api({
                    tel: this.formLogin.tel,
                    password: this.formLogin.password,
                }).then(res => {
                    if(res.code == 200){
                        this.$toast(res.msg || this.$t("login.success"));
                        this.fnFormResetValidation();
                        localStorage.setItem("userId", res.data.id);
                        localStorage.setItem("tel", this.formLogin.tel);
                        setTimeout(()=>{
                            this.$router.push({ path:"/index" })
                        },1500)
                    }
                })
            }).catch(res=>{})
        },
        fnGoRegister(){
            Object.assign(this.$data.formLogin, this.$options.data().formLogin);
            this.loginType = 'register';
            this.fnFormResetValidation();
        },
        fnRegisterMember() {
            this.$refs.refFormRegister.validate().then(()=>{
                quser_add_api({
                    tel: this.formRegister.tel,
                    password: this.formRegister.password,
                    code_str: this.formRegister.code_str,
                }).then(res => {
                    if(res.code == 200){
                        this.$toast(res.msg || this.$t("login.registerSuccess"));
                        setTimeout(()=>{
                            this.loginType = "login";
                            Object.assign(this.$data.formRegister, this.$options.data().formRegister);
                            this.fnFormResetValidation();
                        },500)
                    }
                })
            }).catch(res=>{})
        },
        fnBtnLeft(){
            Object.assign(this.$data.formRegister, this.$options.data().formRegister);
            this.loginType = 'login';
            this.fnFormResetValidation();
        },
    },
    created() {
        const savedLang = localStorage.getItem('lang');
        if (savedLang) this.$i18n.locale = savedLang;
    }
};
</script>

<style lang="scss" scoped>
.login-header {
    text-align: center;
    width: 100%;
    margin: 30px 0;
    ::v-deep .van-image__img {
        width: 80px;
        height: 80px;
        margin: 0 auto;
    }
}

.btn-login {
    margin-top: 20px;
    border-radius: 6px;
}

.lang-toggle {
  position: absolute;
  top: 12px;
  right: 50px;
  font-weight: bold;
  font-size: 14px;
  z-index: 10;
  cursor: pointer;
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
