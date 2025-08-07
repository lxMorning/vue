/*** api接口统一管理 */
import { axiosRequest } from "./axios";


/**
 *
 * @param {string} params
 * 我们定义了一个index方法
 * 这个方法有一个参数params
 * params是我们请求接口时携带的参数对象
 * 而后调用了我们封装的post方法
 * post方法的第一个参数是我们的接口地址
 * 第二个参数是topics的params参数
 * 即请求接口时携带的参数对象
 * 最后通过export导出topics。
 */

/* 用户註冊 */
export const quser_add_api = params => axiosRequest('post', `index/quser/add` , params);
/* 用户登錄 */
export const index_login_api = params => axiosRequest('post', `index/index/login` , params);
/* 判断后台是否登錄 */
export const quser_quser_session_api = params => axiosRequest('post', `index/quser/quser_session` , params);
/* 用户 退出 登錄 */
export const del_login_api = params => axiosRequest('post', `index/index/del_login` , params);
/* 查詢当前用戶信息 */
export const quser_sel_api = params => axiosRequest('post', `index/quser/sel` , params);
/* 判断是否实名认证 */
export const quser_if_username_api = params => axiosRequest('post', `index/quser/if_username` , params);
/* 編輯用戶（資金密碼、身分證、姓名、） */
export const quser_edit_api = params => axiosRequest('post', `index/quser/edit` , params);
/* 判断是否有二级密码或者二级密码是否正确 */
export const quser_if_tpwd_api = params => axiosRequest('post', `index/quser/if_tpwd` , params);
/* (客服地址）系统配置) */
export const index_xtconfig_api = params => axiosRequest('post', `index/index/xtconfig` , params);

/* 通道列表 */
export const qpassageway_sel_api = params => axiosRequest('post', `index/qpassageway/sel` , params);
/* 儲值 */
export const qrecharge_add_api = params => axiosRequest('post', `index/qrecharge/add` , params);
/* 儲值 查询 */
export const qrecharge_sel_api = params => axiosRequest('post', `index/qrecharge/sel` , params);
/* 提現 添加 */
export const Qwithdrawal_add_api = params => axiosRequest('post', `index/Qwithdrawal/add` , params);
/* 提現 查询 */
export const Qwithdrawal_sel_api = params => axiosRequest('post', `index/Qwithdrawal/sel` , params);
/* 我的交易记录 */
export const quser_money_journal_api = params => axiosRequest('post', `index/quser/money_journal` , params);

/* 我的收益记录 */
export const quser_income_list_api = params => axiosRequest('post', `index/quser/income_list` , params);

/* 我的投資明細 */
export const quser_income_info_api = params => axiosRequest('post', `index/quser/income_info` , params);

/* 当前用戶銀行卡列表 */
export const qcard_sel_api = params => axiosRequest('post', `index/qcard/sel` , params);
/* 当前用戶銀行卡 添加 */
export const qcard_add_api = params => axiosRequest('post', `index/qcard/add` , params);
/* 当前用戶銀行卡 删除 */
export const qcard_del_api = params => axiosRequest('post', `index/qcard/del` , params);

/* 大厅上方数据来源(加权指数、柜買指数、台指近月) */
export const index_dating_api = params => axiosRequest('post', `index/index/dating` , params);
/* 股票詳情 */
export const index_gupiao_details_api = params => axiosRequest('post', `index/index/gupiao_details` , params);
/* 文章詳情 */
export const index_article_api = params => axiosRequest('post', `index/index/article` , params);
/* 文章列表 */
export const index_articlelist_api = params => axiosRequest('post', `index/index/articlelist` , params);

/* 指數詳情(加权指数、柜買指数、台指近月) */
export const index_indexk_api = params => axiosRequest('post', `index/index/getIndexK` , params);


/** 基金股票*/
/* （自选) 搜索 个人股票基金列表 */
export const user_QuserQstockservices_sel_api = params => axiosRequest('post', `index/QuserQstockservices/sel` , params);
/* 搜索股票基金列表 */
export const index_Qstockservices_sel_api = params => axiosRequest('post', `index/Qstockservices/sel` , params);

/* 股票基金列表 */
export const Qstockservices_sel_api = params => axiosRequest('post', `index/Qstockservices/sel` , params);
/* (自选)个人股票基金列表 */
export const QuserQstockservices_sel_api = params => axiosRequest('post', `index/QuserQstockservices/sel` , params);
/* (自选)添加个人股票基金 */
export const Qcategory_add_api = params => axiosRequest('post', `index/QuserQstockservices/add` , params);
/*（自选）删除个人股票基金 */
export const QuserQstockservices_del_api = params => axiosRequest('post', `index/QuserQstockservices/del` ,params );
/* 分类列表 */
export const Qcategory_sel_api = params => axiosRequest('post', `index/Qcategory/sel` , params);
/* 新股数据 */
export const index_xingu_api = params => axiosRequest('post', `index/index/xingu` , params);
/* 新股 詳情 数据 */
export const index_xingu_details_api = params => axiosRequest('post', `index/index/xingu_details` , params);
/* 新股 申购 添加 */
export const index_qxingushengou_add_api = params => axiosRequest('post', `index/qxingushengou/add` , params);
/* （个人交易）新股列表 */
export const index_qxingushengou_sel_api = params => axiosRequest('post', `index/qxingushengou/sel` , params);
/* 交易（进行中、已终止）两个页面 */
export const index_qchicang_sel_api = params => axiosRequest('post', `index/qchicang/sel` , params);
/* 上市上柜股票购买 */
export const index_qchicang_add_api = params => axiosRequest('post', `index/qchicang/add` , params);
/* 平仓 */
export const index_qchicang_pingchangzhong_api = params => axiosRequest('post', `index/qchicang/pingchangzhong` , params);
/* 新股 取消 */
export const index_qxingushengou_api = params => axiosRequest('post', `index/qxingushengou/edit` , params);
/*  取消上市上櫃挂單中狀態 */
export const index_qchicang_api = params => axiosRequest('post', `index/qchicang/edit` , params);
/* 个股明细 詳情 */
export const index_qchicang_mingxi_api = params => axiosRequest('post', `index/qchicang/mingxi` , params);

/*  取消上市上櫃挂單中狀態 */
export const index_cancelpingchang_api = params => axiosRequest('post', `index/qchicang/cancelpingchang` , params);

/* 判断个人股票基金 是否自选 */
export const index_sel_gupiao_api = params => axiosRequest('post', `index/QuserQstockservices/sel_gupiao` , params);
/* 股票曲线 */
export const index_xiantiao_api = params => axiosRequest('post', `index/index/xiantiao` , params);
/* 股票曲线 */
export const index_xiantiao1_api = params => axiosRequest('post', `index/index/xiantiao1` , params);
/* 股票详细的 買盘档和卖盘档 */
export const index_maimai_pandang_api = params => axiosRequest('post', `index/index/maimai_pandang` , params);


/* 理財-项目列表 */
export const index_product_sel_api = params => axiosRequest('get', `index/product/sel` , params);
/* 理財-我的订单 */
export const index_product_order_api = params => axiosRequest('get', `index/product/order` , params);

/* 理財-项目列表-詳情 */
export const index_product_info_api = params => axiosRequest('get', `index/product/info` , params);


/* 理財-项目列表-确认投资 */
export const index_product_buy_api = params => axiosRequest('post', `index/product/buy` , params);

/* 投資產品贖回 */
export const index_product_redemption_api = params => axiosRequest('post', `index/product/redemption` , params);


/*黄金期权*/
// 获取黄金期权基本信息 
export const index_gold_market_api = params => axiosRequest('post','index/Gold/getLastGcInfo',params);

// 黄金期权详情
export const index_gold_market_details = params => axiosRequest('post', 'index/Gold/getLastGcDetails', params);

// 出售黄金期权
export const index_gold_market_buy = params => axiosRequest('post','index/Gold/addGoldMarkerOrder',params);
 
// 黄金期权K线数据
export const index_gold_xintiao1_api = params => axiosRequest('post', 'index/Gold/getKLineData1', params);

// 黄金期权K线数据
export const index_gold_xintiao_api = params => axiosRequest('post', 'index/Gold/getKLineDada', params);

// 兑换USD金额
export const index_exchange_save_api=params=>axiosRequest('post','index/Gold/exchangeMoney',params);

// 获取USD黄金
export const apiGoldQchicangSel = params => axiosRequest('post', 'index/Gold/sel', params)

// 获取USD取消
export const apiGoldQchicangEdit = params => axiosRequest('post', 'index/Gold/cancelSchedule', params)

// 平仓
export const apiGoldClosePosition = params => axiosRequest('post', 'index/Gold/closePosition', params)

// 持仓详情
export const indexGoldQchicangMingxiApi = params => axiosRequest('post', 'index/Gold/positionDetails', params)

// 黄金杠杆倍率
export const apiGoldMultiple = params => axiosRequest('get', 'index/Gold/multiple', params)

export const apiGoldPrice = params => axiosRequest('get', 'index/Gold/sina', params)

export const quser_sel_multiple = params => axiosRequest('post', 'index/quser/multiple', params)
