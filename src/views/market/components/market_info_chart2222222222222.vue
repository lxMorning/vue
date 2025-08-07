<template>
    <div>
        <div id="main" class="chart-box"></div>
        <!--<div class="chart-box" id="chart_box"></div>-->
    </div>
</template>

<script>
import * as echarts from 'echarts';
import {index_xiantiao_api} from "@/assets/js/api";

export default {
    name: "chart",
    data() {
        return {
            time_interval: "",
        }
    },
    props: {
        symbol: {
            type: String,
        }
    },

    methods:{
    
        fnGetChart(){
            index_xiantiao_api({
                symbol: this.symbol,
            }).then(res => {
                if (res.code == 200) {
                    this.fnGetDemoChart(res.data);
                }
            })
        },
        
        fnGetDemoChart(resData){
            var chartDom = document.getElementById('main');
            var myChart = echarts.init(chartDom);
            var option;
    
            const upColor = '#ec0000';
            const upBorderColor = '#8A0000';
            const downColor = '#00da3c';
            const downBorderColor = '#008F28';
    
            function splitData(rawData) {
                const categoryData = [];
                const values = [];
                const volumes = [];
                for (var i = 0; i < rawData.length; i++) {
                    // console.log(rawData[i].splice(1, 4))
                    // categoryData.push(rawData[i].splice(0, 1)[0]);
                    // values.push(rawData[i].splice(0, 3));
    
                    categoryData.push(rawData[i].splice(0, 1)[0]);
                    values.push(rawData[i]);
                    volumes.push([i, rawData[i][4], rawData[i][0] > rawData[i][1] ? 1 : -1]);
    
                }
                return {
                    categoryData: categoryData,
                    values: values,
                    volumes: volumes
                };
            }
            function calculateMA(dayCount) {
                var result = [];
                for (var i = 0, len = data0.values.length; i < len; i++) {
                    if (i < dayCount) {
                        result.push('-');
                        continue;
                    }
                    var sum = 0;
                    for (var j = 0; j < dayCount; j++) {
                        sum += +data0.values[i - j][1];
                    }
                    result.push(sum / dayCount);
                }
                return result;
            }
            const data0 = splitData(resData);
            console.log(data0);
            option = {
                // title: {
                //     text: '上证指数',
                //     left: 0
                // },
                tooltip: {
                    trigger: 'false',
                },
                // legend: {
                //     data: ['日K', 'MA5', 'MA10', 'MA20', 'MA30']
                // },
    
                grid: {
                    top:"10%",
                    left: '15%',
                    right: '10%',
                    bottom: '15%'
                },
                
                // grid: {
                //     left: "20px",
                //     right: "20px",
                //     bottom: "140px",
                //     top: "0px",
                //     width: "100%",
                //     height: "300px",
                //     containLabel: true
                // },
                xAxis: {
                    type: 'category',
                    data: data0.categoryData,
                    boundaryGap: false,
                    axisLine: { onZero: false },
                    splitLine: { show: false },
                    min: 'dataMin',
                    max: 'dataMax'
                },
                yAxis: {
                    scale: true,
                    splitArea: {
                        show: true
                    }
                },
                dataZoom: [
                    {
                        type: 'inside',
                        start: 50,
                        end: 100
                    },
                    {
                        show: true,
                        type: 'slider',
                        bottom: '2px',
                        start: 50,
                        end: 100
                    }
                ],
                series: [
                    {
                        name: '日K',
                        type: 'candlestick',
                        data: data0.values,
                        itemStyle: {
                            color: upColor,
                            color0: downColor,
                            borderColor: upBorderColor,
                            borderColor0: downBorderColor
                        },
                        markPoint: {
                            label: {
                                formatter: function (param) {
                                    return param != null ? Math.round(param.value) + '' : '';
                                }
                            },
                            data: [
                                {
                                    name: 'Mark',
                                    coord: ['2013/5/31', 2300],
                                    value: 2300,
                                    itemStyle: {
                                        color: 'rgb(41,60,85)'
                                    }
                                },
                                {
                                    name: 'highest value',
                                    type: 'max',
                                    valueDim: 'highest'
                                },
                                {
                                    name: 'lowest value',
                                    type: 'min',
                                    valueDim: 'lowest'
                                },
                                {
                                    name: 'average value on close',
                                    type: 'average',
                                    valueDim: 'close'
                                }
                            ],
                            tooltip: {
                                formatter: function (param) {
                                    return param.name + '<br>' + (param.data.coord || '');
                                }
                            }
                        },
                        markLine: {
                            symbol: ['none', 'none'],
                            data: [
                                [
                                    {
                                        name: 'from lowest to highest',
                                        type: 'min',
                                        valueDim: 'lowest',
                                        symbol: 'circle',
                                        symbolSize: 10,
                                        label: {
                                            show: false
                                        },
                                        emphasis: {
                                            label: {
                                                show: false
                                            }
                                        }
                                    },
                                    {
                                        type: 'max',
                                        valueDim: 'highest',
                                        symbol: 'circle',
                                        symbolSize: 10,
                                        label: {
                                            show: false
                                        },
                                        emphasis: {
                                            label: {
                                                show: false
                                            }
                                        }
                                    }
                                ],
                                {
                                    name: 'min line on close',
                                    type: 'min',
                                    valueDim: 'close'
                                },
                                {
                                    name: 'max line on close',
                                    type: 'max',
                                    valueDim: 'close'
                                }
                            ]
                        }
                    },
                    {
                        name: 'MA5',
                        type: 'line',
                        data: calculateMA(5),
                        smooth: true,
                        lineStyle: {
                            opacity: 0.5
                        }
                    },
                    {
                        name: 'MA10',
                        type: 'line',
                        data: calculateMA(10),
                        smooth: true,
                        lineStyle: {
                            opacity: 0.5
                        }
                    },
                    {
                        name: 'MA20',
                        type: 'line',
                        data: calculateMA(20),
                        smooth: true,
                        lineStyle: {
                            opacity: 0.5
                        }
                    },
                    {
                        name: 'MA30',
                        type: 'line',
                        data: calculateMA(30),
                        smooth: true,
                        lineStyle: {
                            opacity: 0.5
                        }
                    },
                    {
                        name: 'Volume',
                        type: 'bar',
                        xAxisIndex: 1,
                        yAxisIndex: 1,
                        data: data.volumes
                    }
                    
                ]
            };
    
            option && myChart.setOption(option);
        }
        
    },
    
    mounted() {
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


<!--https://echarts.apache.org/examples/zh/editor.html?c=candlestick-sh-->
