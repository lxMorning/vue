<template>
    <div>
		<div class="times">
			<span :class="type == 1 ? 'check':''" @click="selectType(1)">{{ $t('market_info_chart.text1') }}</span>
			<span :class="type == 2 ? 'check':''" @click="selectType(2)">{{ $t('market_info_chart.text2') }}</span>
			<span :class="type == 3 ? 'check':''" @click="selectType(3)">{{ $t('market_info_chart.text3') }}</span>
			<span :class="type == 4 ? 'check':''" @click="selectType(4)">{{ $t('market_info_chart.text4') }}</span>
			<span :class="type == 5 ? 'check':''" @click="selectType(5)">{{ $t('market_info_chart.text5') }}</span>
			<span :class="type == 6 ? 'check':''" @click="selectType(6)">{{ $t('market_info_chart.text6') }}</span>
			<span :class="type == 7 ? 'check':''" @click="selectType(7)">{{ $t('market_info_chart.text7') }}</span>
		</div>
		<div id="main1" class="chart-box" :class="type==1?'':'hide'" style="height: 450px;"></div>
        <div id="main" class="chart-box" :class="type==1?'hide':''" style="height: 450px;width: 100vw;"></div>
		
        <!--<div class="chart-box" id="chart_box"></div>-->
    </div>
</template>

<script>
import * as echarts from 'echarts';
import {index_xiantiao_api,index_xiantiao1_api} from "@/assets/js/api";

export default {
    name: "chart",
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
		
		selectType(type){
			
			this.type = type;
			
			var num = 0;
			
			switch(type){
				case 1:
					this.drawAreaLine(this.calculateMADay(1,this.ldata.data));
					break;
				case 2:
					this.fnGetDemoChart(this.calculateMADay(5,this.ldata.data));
					break;
				case 3:
					this.fnGetDemoChart(this.calculateMADay(15,this.ldata.data));
					break;
				case 4:
					this.fnGetDemoChart(this.calculateMADay(30,this.ldata.data));
					break;
				case 5:
					this.fnGetDemoChart(this.calculateMADay(1,this.data.data));
					break;
				case 6:
					this.fnGetDemoChart(this.calculateMADay(7,this.data.data));
					break;
				case 7:
					this.fnGetDemoChart(this.calculateMADay(30,this.data.data));
					break;
			}
			
			
		},
        
        fnGetChart() {
           index_xiantiao1_api({
                symbol: this.symbol,
            }).then(res => {
                if (res.code == 200) {
					this.ldata = res;
                    this.drawAreaLine(this.calculateMADay(1,this.ldata.data));
                }
            })
			
			//this.drawAreaLine(this.calculateMADay(1,this.ldata.data));

			index_xiantiao_api({
			    symbol: this.symbol,
			}).then(res => {
			    if (res.code == 200) {
					this.data = res;
			    }
			})
        },
        
        splitData(rawData) {
            let categoryData = [];
            let values = [];
            let volumes = [];
            for (let i = 0; i < rawData.length; i++) {
                categoryData.push(rawData[i].splice(0, 1)[0]);
                values.push(rawData[i]);
                volumes.push([i, rawData[i][4], rawData[i][0] > rawData[i][1] ? 1 : -1]);
            }
            return {
                categoryData: categoryData,
                values: values,
                volumes: volumes
            };
        },
		splitData1(rawData) {
		    let categoryData = [];
		    let values = [];
		    let volumes = [];
		    for (let i = 0; i < rawData.length; i++) {
		        categoryData.push(rawData[i].splice(0, 1)[0]);
		        values.push(rawData[i][1]);
		        volumes.push([i, rawData[i][4], rawData[i][0] > rawData[i][1] ? 1 : -1]);
		    }
		    return {
		        categoryData: categoryData,
		        values: values,
		        volumes: volumes
		    };
		},
        calculateMA(dayCount, data) {
            var result = [];
            for (var i = 0, len = data.values.length; i < len; i++) {
                if (i < dayCount) {
                    result.push('-');
                    continue;
                }
                var sum = 0;
                for (var j = 0; j < dayCount; j++) {
                    sum += data.values[i - j][1];
                }
                result.push(+(sum / dayCount).toFixed(3));
            }
            return result;
        },
		
		calculateMADay(dayCount, data) {
			//console.log(data,length);
		    var result = [];
			var j = 0;
			var t = [0,0,0,0,0];
		    for (var i = data.length-1; i >= 0; i--) {

			   if(j % dayCount == 0 && j > 0){
					let arr = [data[i][0],(t[0]/dayCount).toFixed(2),(t[1]/dayCount).toFixed(2),(t[2]/dayCount).toFixed(2),(t[3]/dayCount).toFixed(2),(t[4]/dayCount).toFixed(2)];
					result.push(arr);	
					t = [0,0,0,0,0];
			   }
			   
			   t[0] += data[i][1];
			   t[1] += data[i][2];
			   t[2] += data[i][3];
			   t[3] += data[i][4];
			   t[4] += data[i][5];
			   j++;
		    }
		    return result.reverse();
		},
        
        fnGetDemoChart(resData) {
            
            var option;
            
            const upColor = '#ec0000';
            const downColor = '#00da3c';
            
            var data = this.splitData(resData);

            this.myChart.setOption(
                (option = {
                    animation: true,
					
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'cross'
                        },
                        position: function (pos, params, el, elRect, size) {
                            const obj = {
                                top: 10
                            };
                            obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 30;
                            return obj;
                        },
                        formatter: function (param) {
                            // console.log(param);
                            
                            let res = `
                               <div>${ param[0].name } <hr size=1 style="margin: 3px 0"></div>
                               <div>Khai mạc: ${ param[0].data[1] }</div>
                               <div>Hôm qua: ${ param[0].data[2] }</div>
                               <div>Thấp nhất: ${ param[0].data[3] }</div>
                               <div>Cao nhất: ${ param[0].data[4] }</div>
                            `
                            return res
                        }
                    },
   
                    axisPointer: {
                        link: [
                            {
                                xAxisIndex: 'all'
                            }
                        ],
                        label: {
                            backgroundColor: '#777'
                        }
                    },
                    /* brush: {
                        xAxisIndex: 'all',
                        brushLink: 'all',
                        outOfBrush: {
                            colorAlpha: 0.1
                        }
                    }, */
                    visualMap: {
                        show: false,
                        seriesIndex: 5,
                        dimension: 2,
                        pieces: [
                            {
                                value: 1,
                                color: downColor
                            },
                            {
                                value: -1,
                                color: upColor
                            }
                        ]
                    },
                    grid: [
                        {
							top:'2%',
                            left: '10%',
                            right: '8%',
                            height: '70%',
							radius:'100%',
                        },
                        {
                            left: '10%',
                            right: '8%',
                            top: '75%',
                            height: '10%'
                        }
                    ],
                    xAxis: [
                        {
                            type: 'category',
                            data: data.categoryData,
                            boundaryGap: false,
                            axisLine: {onZero: false},
                            splitLine: {show: false},
                            min: 'dataMin',
                            max: 'dataMax',
                            axisPointer: {
                                z: 100
                            }
                        },
                        {
                            type: 'category',
                            gridIndex: 1,
                            data: data.categoryData,
                            boundaryGap: false,
                            axisLine: {onZero: false},
                            axisTick: {show: false},
                            splitLine: {show: false},
                            axisLabel: {show: false},
                            min: 'dataMin',
                            max: 'dataMax'
                        }
                    ],
                    yAxis: [
                        {
                            scale: true,
                            splitArea: {
                                show: true
                            }
                        },
                        {
                            scale: true,
                            gridIndex: 1,
                            splitNumber: 2,
                            axisLabel: {show: false},
                            axisLine: {show: false},
                            axisTick: {show: false},
                            splitLine: {show: false}
                        }
                    ],
                    dataZoom: [
                        {
                            type: 'inside',
                            xAxisIndex: [0, 1],
                            start: 85,
                            end: 100
                        },
                    ],
                    series: [
                        {
                            name: '',
                            type: 'candlestick',
                            data: data.values,
							dimensions: ['date', 'open', 'close', 'highest', 'lowest'],
                            itemStyle: {
                                color: upColor,
                                color0: downColor,
                                borderColor: undefined,
                                borderColor0: undefined
                            },
                        },
                       
                        {
                            name: 'Volume',
                            type: 'bar',
                            xAxisIndex: 1,
                            yAxisIndex: 1,
                            data: data.volumes,
                        }
                    ]
                }),
                true
            );
            
        },
        
		drawAreaLine( resData ){
			
			var chartDom = document.getElementById('main1');
			this.myChart1 = echarts.init(chartDom);
			
			var data = this.splitData1(resData);
			
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
		       position: function (pt) {
		         return [pt[0], '10%'];
		       }
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
		
		var chartDom = document.getElementById('main');
		this.myChart = echarts.init(chartDom);
		
        this.fnGetChart();
        
        window.onresize = () => {
            this.fnGetChart();
        };
        
        // this.time_interval = setInterval(()=>{
        //     // console.log("fnGetIndex");
        //     this.fnGetDemoChart();
        // },5000)
    },
    destroyed() {
        clearInterval(this.time_interval);
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
