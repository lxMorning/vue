<template>
    <div>
		<div id="main" class="chart-box" style="height: 450px;"></div>
    </div>
</template>

<script>
import * as echarts from 'echarts';
import {index_indexk_api} from "@/assets/js/api";

export default {
    name: "ichart",
    data() {
        return {
            time_interval: "",
			myChart:'',
			myChart1:'',
			type:1,
			ldata:[],
			data:[],
        }
    },
    props: {
        symbol: {
            type: String,
        }
    },
    
    methods: {
        
        fnGetChart() {
           index_indexk_api({
                type: this.symbol,
            }).then(res => {
                if (res.code == 200) {
					this.ldata = res;
                    this.drawAreaLine(this.ldata.list);
                }
            })
			
		},
        
		drawAreaLine( resData ){
			
			var chartDom = document.getElementById('main');
			this.myChart1 = echarts.init(chartDom);
			
			//var data = this.splitData1(resData);
			var data = resData;
			
			var max = 0,min = 0;
			
			for(var i=0;i<data.values.length;i++){
				
				if(max < data.values[i]){
					max = data.values[i];
				}
				
				if(min == 0 || min > data.values[i]){
					min = data.values[i];
				}
			}
			
			var option;
		   option = {
		     tooltip: {
		       trigger: 'axis',
		      /* position: function (pt) {
		         return [pt[0], '10%'];
		       } */
		     },
		     xAxis: {
		       type: 'category',
		       boundaryGap: false,
		       data: data.categoryData
		     },
		     yAxis: {
		       type: 'value',
		       boundaryGap: [0, '100%'],
			   max: max,
			   min: min,
		     },
		     dataZoom: [
		       {
		         type: 'inside',
		         start: 50,
		         end: 100
		       },
		       {
		         start: 0,
		         end: 10
		       }
		     ],
		     series: [
		       {
		         name: 'Price',
		         type: 'line',
		         symbol: 'none',
		         sampling: 'lttb',
		         itemStyle: {
		           color: 'rgb(255, 70, 131)'
		         },
		         areaStyle: {
		           color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
		             {
		               offset: 0,
		               color: 'rgb(255, 158, 68)'
		             },
		             {
		               offset: 1,
		               color: 'rgb(255, 70, 131)'
		             }
		           ])
		         },
		         data: data.values
		       }
		     ]
		   };
		   
		   this.myChart1.setOption(option);
		
		
		}
    },
    
    mounted() {
		
        this.fnGetChart();
        
        window.onresize = () => {
            this.fnGetChart();
        };
    },
    destroyed() {
        //clearInterval(this.time_interval);
    },
    
}
</script>
<style lang="scss" scoped>
	.times{
		width: 96%;
		margin: 0 auto;
		margin-bottom: 10px;
		display: flex;
		span{
			padding-left: 10px;
			font-size: 14px;
		}
		span.check{
			color: #ef5963;
		}
	}
	.hide{
		display:none;
	}
</style>

<!--https://echarts.apache.org/examples/zh/editor.html?c=candlestick-sh-->
