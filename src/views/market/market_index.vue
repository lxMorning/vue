<template>
    <main>
        <navBar :navTitle="data.name" showRight_content></navBar>
        
        <!--信息-->
        <van-row class="market-info">
            <van-col span="9" class="market-info-left">
                <div class="market-info-name">{{ type }} </div>
                <h4 class="market-info-price" :class="data[56] > 0 ?
                'color-green': 'color-red' ">{{ data[6] }}</h4>
                <div :class="data[56] > 0 ? 'color-green': 'color-red' ">
                    <span>{{ Number(data[11]).toFixed(2) }} </span>
                    <span>  {{ Number(data[56]).toFixed(2) }}%</span>
                </div>
            </van-col>
          <van-col span="15">
              <van-row class="market-info-content tc">
                  <van-col span="10" style="float: right;">
                      <ul>
                          <li class="bg-pink">KLGD</li>
                          <!--<li class="color-red">{{ Math.floor(info_obj.regularMarketVolume/1000) }}k</li>-->
                          <li class="color-red">{{data[90]}}</li>
                      </ul>
                      <ul>
                          <li class="bg-blueLight2">GTGD</li>
                          <!--<li class="color-red">{{ (Math.floor(info_obj.regularMarketVolume/1000) * info_obj.regularMarketPreviousClose).toFixed(2) }}</li>-->
                          <li class="color-red">{{ data[89] }}</li>
                      </ul>
                  </van-col>
              </van-row>
          </van-col>
        </van-row>
        
        <!--图表-->
        <infoChart :symbol="type" />

    </main>
</template>

<script>
import {
    index_dating_api,
} from "@/assets/js/api";
import infoChart from "./components/market_index_chart"

export default {
    name: "market_index.vue",
    components:{
        infoChart,
    },
    data() {
        return {
            time_interval:"",
            navTitle: 'INDEX',
			type:'',
			data:{
				"6": 0,
				"11": 0,
				"56": 0,
				"89" :0,
				"90":0,
				"name": "UPCOM-Index",
			},
        }
    },
    methods: {
        fnGetIndex(){
            index_dating_api({
                page:1,
            }).then(res=>{
                if(res.code == 200){
					
					const data_arr = res.data;
                
                    this.data = this.type == 'VN' ? data_arr.jiaquan : (this.type == 'HNX' ? data_arr.guimai : data_arr.taizhi);
                }
            })
        },
	},
	created() {
		
		this.type = this.$route.query.type;
		console.log('------------------------------');
		console.log(this.type);
		console.log('------------------------------');
	    this.fnGetIndex();
	    
	    this.time_interval = setInterval(()=>{
	        this.fnGetIndex();
	    },5000)
	},
    destroyed(){
        clearInterval(this.time_interval);
    },

}
</script>
<style lang="scss" scoped>
.market-buy {
    &-box {
        padding: 10px;
        
        .van-row {
            margin-bottom: 8px;
        }
        
        ::v-deep .van-stepper {
            border: solid 1px #ddd;
            
            .van-stepper__minus,
            .van-stepper__plus {
                background-color: #fff;
                height: 34px;
                width: 34px;
            }
            
            .van-stepper__plus {
                color: #3365e3;
            }
            
            .van-stepper__input {
                width: calc(100% - 68px);
                background-color: #fff;
                margin: 0;
                border-left: solid 1px #ddd;
                border-right: solid 1px #ddd;
                height: 34px;
            }
        }
        
        .input-gg {
            border: solid 1px #ddd;
            height: 34px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding-right: 0;
            
            ::v-deep .van-field__control {
                color: #abaaad;
            }
        }
        
        .btn-select {
            border: 0;
        }
    }
    
    &-right {
        h4 {
            //margin-bottom: 10px;
        }
        
        &-content {
            //margin-bottom: 10px;
            
            li {
                display: flex;
                justify-content: space-between;
                margin-top: 1px;
                font-size: 12px;
            }
        }
        
        > span {
            font-size: 12px !important;
            margin: 4px 0 2px;
            padding: 0px 8px !important;
        }
    }
}

.btnAdd-marketStar {
    ::v-deep .van-icon {
        font-size: 14px !important;
        margin-right: 6px;
    }
}

.market-info {
    padding: 20px 20px 0;
    
    &-price {
        font-size: 20px;
        margin-top: 4px;
    }
    
    &-content {
        li:nth-child(2) {
            font-size: 14px;
            margin: 4px 0 6px;
            min-height: 21px;
        }
    }
}
.market-info-name{
    font-size: 15px;
}

.van-col--12{
	width:100%;
}

</style>
