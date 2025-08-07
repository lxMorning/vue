import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);


const routes = [
    {
        path: "/",
        redirect: "/login"
    },

    /* 1、首页 + 登錄 */
    {
        path: "/index",
        name: "index",
        component: () => import(/* webpackChunkName: "home" */ "../views/home/index.vue"),
        meta: {
            title: '',
        },
    },
    {
        path: "/login",
        name: "login",
        component: () => import(/* webpackChunkName: "login" */ "../views/home/login.vue"),
        meta: {
            title: '',
        },
    },
    {
        path: "/index_newsInfo",
        name: "index_newsInfo",
        component: () => import(/* webpackChunkName: "index_newsInfo" */ "../views/home/index_newsInfo.vue"),
        meta: {
            title: 'Chiến Thắng - Trang chi tiết',
        },
    },

    /*2、市场行情*/
    {
        path: "/market",
        name: "market",
        component: () => import(/* webpackChunkName: "market" */ "../views/market/market.vue"),
        meta: {
            title: 'Chiến Thắng - Thị trường',
        },
    }, {
        path: "/market_info",
        name: "market_info",
        component: () => import(/* webpackChunkName: "market_info" */ "../views/market/market_info.vue"),
        meta: {
            title: 'Chiến Thắng - Chi tiết thị trường',
        },
    },
    {
        path: "/gold_market_info",
        name: "gold_market_info",
        component: () => import(/* webpackChunkName: "market_info" */ "../views/market/gold_market_info.vue"),
        meta: {
            title: 'Chiến Thắng - Chi tiết thị trường',
        },
    },
    {
        path: "/market_purchaseInfo",
        name: "market_purchaseInfo",
        component: () => import(/* webpackChunkName: "market_purchaseInfo" */ "../views/market/market_purchaseInfo.vue"),
        meta: {
            title: 'Chiến Thắng - Chi tiết đăng ký',
        },
    },
    {
        path: "/market_addStock",
        name: "market_addStock",
        component: () => import(/* webpackChunkName: "market_addStock" */ "../views/market/market_addStock.vue"),
        meta: {
            title: 'Chiến Thắng - Thêm kho',
        },
    },
	{
	    path: "/market_index",
	    name: "market_index",
	    component: () => import(/* webpackChunkName: "market_index" */ "../views/market/market_index.vue"),
	    meta: {
	        title: 'Chiến Thắng - mục lục',
	    },
	},


    /* 3、交易 */
    {
        path: "/trade",
        name: "trade",
        component: () => import(/* webpackChunkName: "trade" */ "../views/trade/trade.vue"),
        meta: {
            title: 'Chiến Thắng - Buôn bán',
        },
    },
    {
        path: "/trade_info",
        name: "trade_info",
        component: () => import(/* webpackChunkName: "trade" */ "../views/trade/trade_info.vue"),
        meta: {
            title: 'Chiến Thắng - Chi tiết kho hàng',
        },
    },

    /*4、我的*/
    {
        path: "/my",
        name: "my",
        component: () => import(/* webpackChunkName: "my" */ "../views/my/my.vue"),
        meta: {
            title: 'Chiến Thắng - của tôi',
        },
    },
    {
        path: "/my_setup",
        name: "my_setup",
        component: () => import(/* webpackChunkName: "my_setup" */ "../views/my/my_setup.vue"),
        meta: {
            title: 'Chiến Thắng - cài đặt',
        },
    },

    /*存款 + 儲值通道*/
    {
        path: "/my_deposit", /* 資金转入 */
        name: "my_deposit",
        component: () => import(/* webpackChunkName: "my_deposit" */ "../views/my/my_deposit.vue"),
        meta: {
            title: 'Chiến Thắng - đặt cọc',
        },
    }, {
        path: "/my_deposit_passageway", /*  */
        name: "my_deposit_passageway",
        component: () => import(/* webpackChunkName: "my_deposit_passageway" */ "../views/my/my_deposit_passageway.vue"),
        meta: {
            title: 'Chiến Thắng - Kênh giá trị được lưu trữ',
        },
    },
    {
        path: "/my_exchange", /* 兑换 */
        name: "my_exchange",
        component: () => import(/* webpackChunkName: "my_withdraw" */ "../views/my/my_exchange.vue"),
        meta: {
            title: 'Chuyển đổi',
        },
    },
    {
        path: "/my_withdraw", /* 取款 */
        name: "my_withdraw",
        component: () => import(/* webpackChunkName: "my_withdraw" */ "../views/my/my_withdraw.vue"),
        meta: {
            title: 'Chiến Thắng - rút tiền',
        },
    }, {
        path: "/my_transaction_record", /* 交易记录 */
        name: "my_transaction_record",
        component: () => import(/* webpackChunkName: "my_transaction_record" */ "../views/my/my_transaction_record.vue"),
        meta: {
            title: 'Chiến Thắng - dòng tiền',
        },
    }, {
        path: "/my_transaction_password", /* 交易记录 */
        name: "my_transaction_password",
        component: () => import(/* webpackChunkName: "my_transaction_password" */ "../views/my/my_transaction_password.vue"),
        meta: {
            title: 'Chiến Thắng - Mật khẩu quỹ',
        },
    },

    /*绑定身分证 + 輸入密码 + 已认证*/
    {
        path: "/my_authentication", /* 绑定身分证 */
        name: "my_authentication",
        component: () => import(/* webpackChunkName: "my_authentication" */ "../views/my/my_authentication.vue"),
        meta: {
            title: 'Chiến Thắng - Đã xác minh',
        },
    }, {
        path: "/my_authentication_password", /* 資金密码 */
        name: "my_authentication_password",
        component: () => import(/* webpackChunkName: "my_authentication_password" */ "../views/my/my_authentication_password.vue"),
        meta: {
            title: 'Chiến Thắng - đổi mật khẩu',
        },
    }, {
        path: "/my_authentication_success", /* 確認绑定 */
        name: "my_authentication_success",
        component: () => import(/* webpackChunkName: "my_authentication_success" */ "../views/my/my_authentication_success.vue"),
        meta: {
            title: 'Chiến Thắng - Liên kết tài khoản',
        },
    },

    /*金融卡管理 + 绑定金融卡*/
    {
        path: "/my_cardManage", /*  */
        name: "my_cardManage",
        component: () => import(/* webpackChunkName: "my_cardManage" */ "../views/my/my_cardManage.vue"),
        meta: {
            title: 'Chiến Thắng - Quản lý thẻ ghi nợ',
        },
    }, {
        path: "/my_cardManage_Bind", /*  */
        name: "my_cardManage_Bind",
        component: () => import(/* webpackChunkName: "my_cardManage_Bind" */ "../views/my/my_cardManage_Bind.vue"),
        meta: {
            title: 'Chiến Thắng - Ràng buộc thẻ tài chính',
        },
    },

    {
        path: "/my_password", /*  */
        name: "my_password",
        component: () => import(/* webpackChunkName: "my_password" */ "../views/my/my_password.vue"),
        meta: {
            title: 'Chiến Thắng - Mật khẩu quỹ',

        },
    },

	{
		path: "/manageFinances", /*  */
		name: "manageFinances",
		component: () => import(/* webpackChunkName: "my_password" */ "../views/manageFinances/manageFinances.vue"),
      meta: {
         title: 'Chiến Thắng - quản lý tài chính',
		},
	},
	{
		path: "/manageFinances_info", /*  */
		name: "manageFinances_info",
		component: () => import(/* webpackChunkName: "my_password" */ "../views/manageFinances/components/projectInfo.vue"),
      meta: {
         title: 'Chiến Thắng - quản lý tài chính - Thông tin chi tiết',
		},
	},
	{
		path: "/manageFinances_desc", /*  */
		name: "manageFinances_desc",
		component: () => import(/* webpackChunkName: "my_password" */ "../views/manageFinances/components/projectDesc.vue"),
	  meta: {
	     title: 'Chiến Thắng - quản lý tài chính - Giới thiệu',
		},
	},
    {
        path: "/gold_trade_info", /*  */
        name: "gold_trade_info",
        component: () => import(/* webpackChunkName: "my_password" */ "../views/trade/gold_trade_info.vue"),
        meta: {
            title: 'Chiến Thắng - quản lý tài chính - Giới thiệu',
        },
    },

];

const router = new VueRouter({
    mode: "hash",
    // base: process.env.BASE_URL,
    routes
});

import global from "../assets/js/global";
import {Toast, Notify} from 'vant';
/*路由跳转前验证*/
router.beforeEach((to, from, next) => {
    Toast.clear();
    // Notify.clear();

    // next();
    // return;

    if (to.meta.title) {
        document.title = to.meta.title;
    }
    const userId = localStorage.getItem('userId');
    console.log(userId);
    if (to.path === '/login') {
        if (userId) {
            next({name: 'index'});
            return;
        }
        next();
    } else {
        global.getSession();
        if (!userId) {
            next({name: 'login'});
            return;
        }
        if (to.path === '/') {
            next({name: 'index'});
            return;
        }
        next();
    }

});

export default router;
