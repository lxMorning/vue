
/** 字体 */
// fnResize();
window.onresize = function() {
  // fnResize();
};

function fnResize() {
  let deviceWidth = document.documentElement.clientWidth || window.innerWidth;
  // console.log(deviceWidth);
  if (deviceWidth >= 750) {
    deviceWidth = 750;
  }
  if (deviceWidth <= 320) {
    deviceWidth = 320;
  }
  document.documentElement.style.fontSize = (deviceWidth / 7.5 * 2) + "px";
  // console.log(document.documentElement.style.fontSize);
}

import { quser_quser_session_api} from "./api";
import {Toast, Notify} from 'vant';
import router from "../../router/index";
function getSession(){
	if(localStorage.getItem('userId')){
		quser_quser_session_api().then( res=> {
			// console.log(res);
			if(res.code != 200){
				sessionStorage.clear();
				localStorage.clear();
				Toast.clear();
				Toast({ type: 'danger', message: 'Đăng nhập của bạn đã hết hạn, vui lòng đăng nhập lại！' });
				setTimeout(()=>{
					router.push({
						name:'login',
					})
				},1500)
			}
		})
	}
}

/*存储*/
class fnStorage {

	constructor(name) {
		this.name = "storage";
	}

	//设置缓存
	setItem(params) {
		let obj = {
			name: "",
			value: "",
			expires: "",
			startTime: new Date().getTime()//记录何时将值存入缓存，毫秒级
		};
		let options = {};
		//将obj和传进来的params合并
		Object.assign(options, obj, params);
		if (options.expires) {
			//如果options.expires设置了的话
			//以options.name为key，options为值放进去
			localStorage.setItem(options.name, JSON.stringify(options));
		} else {
			//如果options.expires没有设置，就判断一下value的类型
			let type = Object.prototype.toString.call(options.value);
			//如果value是对象或者数组对象的类型，就先用JSON.stringify转一下，再存进去
			if (Object.prototype.toString.call(options.value) == "[object Object]") {
				options.value = JSON.stringify(options.value);
			}
			if (Object.prototype.toString.call(options.value) == "[object Array]") {
				options.value = JSON.stringify(options.value);
			}
			localStorage.setItem(options.name, options.value);
		}
	}

	//拿到缓存
	getItem(name) {
		let item = localStorage.getItem(name);

		//先将拿到的试着进行json转为对象的形式
		try {
			item = JSON.parse(item);
		} catch (error) {
			//如果不行就不是json的字符串，就直接返回
			item = item;
		}

		//如果有startTime的值，说明设置了失效時間
		if (item) {
			if (item.startTime) {
				let date = new Date().getTime();
				//何时将值取出减去刚存入的時間，与item.expires比较，如果大于就是过期了，如果小于或等于就还没过期
				if (date - item.startTime > item.expires) {
					//缓存过期，清除缓存，返回false
					localStorage.removeItem(name);
					return false;
				} else {
					//缓存未过期，返回值
					return item.value;
				}
			} else {
				//如果没有设置失效時間，直接返回值
				return item;
			}

			console.log(item);
		}

	}

	//移出缓存
	removeItem(name) {
		localStorage.removeItem(name);
	}

	//移出全部缓存
	clear() {
		localStorage.clear();
	}
}

export default {
	fnStorage: fnStorage,
	getSession: getSession,
};