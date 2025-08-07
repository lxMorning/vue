import Axios from "axios";
import Vue from 'vue'

/*引用axios*/
Vue.prototype.$axios = Axios;

if (process.env.NODE_ENV === 'production') {
	Axios.defaults.baseURL = process.env.VUE_APP_SERVER
} else {
	// console.log(' development (默认) dev 开发环境 本地 /api ');
	Axios.defaults.baseURL = '/api';
}

/*引入自己的全局的css*/
import "@/assets/css/global.scss";
import "@/assets/css/page.scss";


/* 6、 引入 moment 時間转换 */
/*凡是用的prototype 使用都要this.继承 console.log(this.$moment().format("YYYY-MM"));*/
import moment from "moment";  //引用moment js
Vue.prototype.$moment = moment;//赋值使用
moment.locale("zh-cn");//需要汉化


/*引用全局js*/
import global from "@/assets/js/global.js";
Vue.prototype.GLOBAL = global;

/*全局引入vant*/
import Vant from "vant";
import "vant/lib/index.css";
Vue.use(Vant);


import '@vant/touch-emulator'

/* 按钮重复点击 <van-Button v-btnReClick /> */
Vue.directive('btnReClick', {
	inserted(el, binding) {
		el.addEventListener('click', () => {
			if (!el.disabled) {
				el.disabled = true
				setTimeout(() => {
					el.disabled = false
				}, binding.value || 1500)
			}
		})
	}
})

/* 全局组件 */
import navBar from '../components/nav-bar/index'
Vue.component("navBar", navBar);

