<template>
<div>
    <van-nav-bar :title="navTitle" :border="navBorder" :fixed="navFixed" :placeholder ="navPlace"
    :prevPath="prevPath">
        <template #left v-if="!showLeft">
            <van-icon name="arrow-left" @click="fnBtnLeft" />
        </template>
        <template #right >
            <div class="barR-icon flex-center" v-if="showRight">
                <i class="iconfont icon-kefu1" @click="fnGoContact"></i>
            </div>
            <slot name="narBarR_content" v-if="showRight_content"></slot>
        </template>
    </van-nav-bar>
</div>

</template>

<script>
import { index_xtconfig_api } from "@/assets/js/api";
export default {
    name: "nav-bar",
    props:{
        navTitle:{
            type: String,
            default:"",
        },
        navBorder:{ //是否显示下边框
            type: Boolean,
            default:false,
        },
        navFixed:{  //是否固定在顶部
            type: Boolean,
            default: true,
        },
        navPlace:{ //	固定在顶部时，是否在标签位置生成一个等高的占位元素
            type: Boolean,
            default: true,
        },
        leftBack:{  //是否 返回 上一页
            type: Boolean,
            default: true,
        },
        prevPath:{ /* 上一页路径 */
            type: String,
            default: "",
        },
        showLeft:{
            type: Boolean,
            default: false,
        },
        showRight:{
            type: Boolean,
            default: false,
        },
        showRight_content:{
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
			service:null,
			isApple:true,
        }
    },
    methods: {
        fnGoContact(){
			var that = this;
			if(that.service){
				
				var url = that.isApple ? that.service.value : that.service.value1;
				window.location.href = url;
				return false;
			}
			
            index_xtconfig_api().then(res=>{
				that.service = res.data;
				var url = that.isApple ? that.service.value : that.service.value1;
				window.location.href = url;
            })
        },
		appDown() {
		    var u = navigator.userAgent;
		    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
		    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
		    if(isiOS){
		        this.isApple = true
		    }else if(isAndroid){
		        this.isApple = false
		    }
		},
		

        /* 左箭头事件 */
        fnBtnLeft(){
            if(this.leftBack){
                if(this.prevPath){
                    console.log(this.prevPath);
                    this.$router.push({
                        name: this.prevPath,
                    })
                } else {
                    this.$router.go(-1);
                }
            }
            this.$emit('fnBtnLeft');
        },
    },
	mounted(){
		this.appDown();
	},
    created() {
		
    },
}
</script>
<style lang="scss" scoped>
::v-deep .van-nav-bar {
    i{
        color: #353535;
        font-size:20px;
    }
}
</style>