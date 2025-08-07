import axios from 'axios';

import { Toast, Notify } from 'vant';
import router from "../../router/index";

//  创建axios
axios.create({
	// A.公共接口
	// baseURL: process.env.BASE_API,

	// B.设置接口请求超时
	timeout: 60 * 1000,
});


// 请求拦截
axios.interceptors.request.use(config => {
	// console.log(config);
	// 设置post请求头
	// if (config.headersType === 'json') {
	// 	config.headers[config.method]['Content-Type'] = 'application/json;charset=UTF-8';
	// } else {
	// 	config.headers[config.method]['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
	// }
	// 在发送请求之前做些什么 验证token之类的
	// const token = localStorage.getItem('accessToken') || '';
	// config.headers['Authorization'] = 'Bearer ' + token // 让每个请求携带自定义token 请根据实际情况自行修改

	Toast.clear();

	/*api 限制*/
	const urlIncludeArr = [
		"index/quser/if_username", /* 判断是否实名认证 */
		"index/quser/if_tpwd", /*判断是否有二级密码或者二级密码是否正确*/
		"index/index/xtconfig", /*联系客服*/
		"index/quser/quser_session", /* session 查询 */
		"index/index/dating", /* session 查询 */
		"index/Qstockservices/sel", /* 上市 */
		"index/Qcategory/sel", /* 上柜 */
		"index/QuserQstockservices/sel", /* 自选 */
		"index/qchicang/sel", /* 交易 -进行中 */
		"index/index/gupiao_details", /* 股票詳情 */
		"index/index/maimai_pandang", /* 买卖盘 */
		"index/QuserQstockservices/sel_gupiao", /* 判斷自選 */
        "index/Gold/getLastGcDetails",
        "index/Gold/getLastGcInfo",
        "index/Gold/sel",
		"index/Gold/sina",
	];
	if (!urlIncludeArr.includes(config.url)) {
		Toast.loading({
			message: 'Yêu cầu dữ liệu...',
			forbidClick: true,
			duration: 0,
		});
	}
	return config;
}, error => {
	// 对请求错误做些什么
	return Promise.error(error);
});

// 响应拦截
axios.interceptors.response.use(res => {
	// console.log(res);

	Toast.clear();
	if (res.data.code == 200) {

	} else if (res.data.code == 10000) {
		setTimeout(() => {
			localStorage.clear();
			sessionStorage.clear();
			router.push({
				path: "/login",
			})
		}, 1000)
	} else {
		const urlIncludeArr = [
			"index/quser/if_username",  /* 判断是否实名认证 */
			"index/quser/if_tpwd",  /*判断是否有二级密码或者二级密码是否正确*/
			"index/qcard/sel", /* 当前用戶銀行卡列表 */
			"index/quser/edit", /* 編輯用戶（資金密碼、身分證、姓名、） */
			"index/quser/sel", /* 查詢当前用戶信息 */
			"index/qrecharge/sel", /* 儲值 查询 */
			"index/Qwithdrawal/sel", /* 提現 查询 */
			"index/quser/quser_session", /* session 查询 */
			"index/QuserQstockservices/sel_gupiao", /* 判断个人股票基金 是否自选 */
			"index/qxingushengou/sel", /* 个人新股列表 */
			"index/qchicang/sel", /* 个人 交易 列表 */
			"index/qxingushengou/sel" , /* 个人新股列表 */
			"index/qchicang/sel" , /* 个人 交易 列表 */

			"index/product/order" , /* 个人 交易 列表 */
            "index/Gold/getLastGcInfo",
            "index/Gold/sel",
			"index/Gold/sina",
		];
		// console.log(res.data.data);
		// if(res.data.data){
		// 	Toast({ type: 'danger', message: res.data.msg });
		// }
		if(!urlIncludeArr.includes(res.config.url)){
            console.log(res.data.msg);
			Toast({ type: 'danger', message: res.data.msg });
		}

	}
	// 对响应数据做点什么
	return res;

}, error => {
	console.log(error);

	Toast.clear();
	// 对响应错误做点什么

	let { message } = error;
	// console.log(error.msg);   //Request failed with status code 401
	const errCode = message.substr(message.length - 3);
	// if (errCode == 1000) {
	//
	// 	setTimeout(() => {
	// 		// const processEnv = process.env.NODE_ENV;
	// 		// window.location = `${window.location.origin}/#/login`;
	//
	// 		router.push({
	// 			path: "/login",
	// 		})
	//
	// 	}, 1500)
	// 	return Promise.reject(error);
	// }

	if (message == "Network Error") {
		message = "Kết nối giao diện hệ thống không bình thường";
	} else if (message.includes("timeout")) {
		message = "Thời gian chờ yêu cầu giao diện hệ thống";
	} else if (message.includes("Request failed with status code")) {
		message = "Giao diện hệ thống" + message.substr(message.length - 3) + "khác thường";
	}

	return Promise.reject(error);

});

/**
 *出处： https://www.cnblogs.com/hs610/p/10842866.html
 * post方法，对应post请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */


/*下载方式1*/
export function downPost(method, url, data, headersType = 'json') {
	return new Promise((resolve, reject) => {
		const apiData = {
			responseType: "blob",
			url,
			method,
			headersType,
		};
		if (method === 'GET' || method === 'get') {
			apiData.params = data;
		} else {
			apiData.data = data;
		}
		axios(apiData).then(res => {
			resolve(res);
		}).catch(err => {
			reject(err.data);
			console.log(url, err);
		})
	});
}

/* 请求 0714*/
export function axiosRequest(method, url, data, headersType = 'json') {
	// console.log(headersType);

	return new Promise((resolve, reject) => {
		if (method === 'delete' && data && typeof (data) != 'object') {
			url = `${url}\/${data}`;
		}
		// console.log(data, url);
		if (method === 'get') {
			axios({
				method: method,
				url: url,
				params: data,
				headersType,
			})
				.then(res => {
					if (res.data.code == 200) {
						resolve(res.data);
					} else {
						// console.log(res.data);
						resolve(res.data);
					}

				}).catch(err => {
					reject(err.data);
					console.log(url, err);

				})
		} else {
			axios({
				method: method,
				url: url,
				data: data,
				headersType,
			})
				.then(res => {
					if (res.data.code == 200) {
						resolve(res.data);
					} else {
						// console.log(res.data);
						resolve(res.data);
					}

				}).catch(err => {
					reject(err.data);
					console.log(url, err);

				})
		}

	});
}

export function getRequest(method, url, params, headersType = 'json') {
	return new Promise((resolve, reject) => {
		axios({
			method: method,
			url: url,
			params: params,
			headersType,
		}).then(res => {
			resolve(res.data);
			if (res.data.code == 200) {
				resolve(res.data);
			} else {
				resolve(res.data);
			}

		}).catch(err => {
			reject(err.data);
			console.log(url, err);
		})
	});
}
