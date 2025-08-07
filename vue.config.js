// vue.config.js 配置说明
//官方vue.config.js 参考文档 https://cli.vuejs.org/zh/config/#css-loaderoptions
//https://juejin.im/post/5bd02f98e51d457a944b634f
// 这里只列一部分，具体配置参考文档



const Timestamp = new Date().getTime();  //当前时间为了防止打包缓存不刷新，所以给每个js文件都加一个时间戳
module.exports = {

    //configureWebpack 这部分打包文件添加时间戳，防止缓存不更新


    /*    chainWebpack: config => {
            //路径配置
            config.resolve.alias
                .set('assets', resolve('src/assets'))
                .set('pubImg', resolve('pub/images'));
        },*/
    // 部署生产环境和开发环境下的URL。
    // 默认情况下，Vue CLI 会假设你的应用是被部署在一个域名的根路径上
    //例如 https://www.my-app.com/。如果应用被部署在一个子路径上，你就需要用这个选项指定这个子路径。
    // 例如，如果你的应用被部署在 https://www.my-app.com/my-app/，
    // 则设置 baseUrl 为 /my-app/。
    // publicPath: process.env.NODE_ENV === "production" ? "http://192.168.0.133:20000/" : "/",
    publicPath: '',  //有些地方这里需要 ./

    // 是否使用包含运行时编译器的 Vue 构建版本
    runtimeCompiler: true,

    // outputDir: 在npm run build 或 yarn build 时 ，生成文件的目录名称（要和baseUrl的生产环境路径一致）
    outputDir: 'build',

    //用于放置生成的静态资源 (js、css、img、fonts) 的；（项目打包之后，静态资源会放在这个文件夹下）
    assetsDir: 'app',

    //指定生成的 index.html 的输出路径  (打包之后，改变系统默认的index.html的文件名)
    // indexPath: "myIndex.html",
    //默认情况下，生成的静态资源在它们的文件名中包含了 hash 以便更好的控制缓存。你可以通过将这个选项设为 false 来关闭文件名哈希。
    // (false的时候就是让原来的文件名不改变)
    filenameHashing: false,

    //   lintOnSave：{ type:Boolean default:true } 问你是否使用eslint
    lintOnSave: false,

    //如果你想要在生产构建时禁用 eslint-loader，你可以用如下配置
    // lintOnSave: process.env.NODE_ENV !== 'production',

    //是否使用包含运行时编译器的 Vue 构建版本。设置为 true 后你就可以在 Vue 组件中使用 template 选项了，
    // 但是这会让你的应用额外增加 10kb 左右。(默认false)
    // runtimeCompiler: false,

    /**
     * 如果你不需要生产环境的 source map，可以将其设置为 false 以加速生产环境构建。
     *  打包之后发现map文件过大，项目文件体积很大，设置为false就可以不输出map文件
     *  map文件的作用在于：项目打包后，代码都是经过压缩加密的，如果运行时报错，输出的错误信息无法准确得知是哪里的代码报错。
     *  有了map就可以像未加密的代码一样，准确的输出是哪一行哪一列有错。
     * */
    productionSourceMap: false,

    css: {
        // 是否使用css分离插件 ExtractTextPlugin
        extract: {
            // https://www.cnblogs.com/1rookie/p/11589863.html
            //一种方式，每次打包后的css文件名会变更新。

			  filename: `app/css/[name]_${Timestamp}.css`,
			  chunkFilename: `app/css/[name]_${Timestamp}.css`,

            // filename: `app/css/[name].css`,
            // chunkFilename: `app/css/[name].css`,
        }
    },
    configureWebpack: {
        // externals: {
        //     // 'echarts': 'echarts' // 配置使用CDN
        //     // 修改打包后css文件名
        // },

        output: { // 输出重构  打包编译后的 文件名称  【模块名称.版本号.时间戳】
            // filename: `riches/js/[name].js?v=${Timestamp}`,
            // chunkFilename: `riches/js/[name].js?v=${Timestamp}`,

			  filename: `app/js/[name]_${Timestamp}.js`,
			  chunkFilename: `app/js/[name]_${Timestamp}.js`,

            // filename: `app/js/[name].js`,
            // chunkFilename: `app/js_${Timestamp}/[name].js`,
        },
    },

    // 它支持webPack-dev-server的所有选项
    devServer: {
        // host: "localhost",
        // host: "192.168.137.1",
        port: 8086, // 端口号
        https: false, // https:{type:Boolean}
        open: false, //配置自动启动浏览器
        // proxy: 'http://localhost:4000' // 配置跨域处理,只有一个代理
        // performance: { hints: false },

       // 配置多个代理
        // proxy: {
        //     "/sina": {
        // 		//	target: 'http://154.219.166.84',  /**/
        //         target:'http://hq.sinajs.cn',//process.env.dev.VUE_APP_SERVER,  /**/
        //         ws: true,// 是否启用websockets
        //         changeOrigin: true, //开启代理：在本地会创建一个虚拟服务端，然后发送请求的数据，并同时接收请求的数据，这样服务端和服务端进行数据的交互就不会有跨域问题
        //         pathRewrite: {'^/sina': ''},
        //         headers: {
        //             Referer: 'http://finance.sina.com.cn'  // 显式设置Referer头部
        //         }
        //     },
        // }
    },
};
// VUE_APP_SERVER=http://xm.undress.cn
// VUE_APP_SERVER=http://www.zhenhanziben.com