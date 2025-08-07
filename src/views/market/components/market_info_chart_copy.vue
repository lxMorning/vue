<template>
    <div>
        <div id="main" class="chart-box"></div>
        <!--<div class="chart-box" id="chart_box"></div>-->
    </div>
</template>

<script>
import * as echarts from 'echarts';
// import chartData from "./chart.json"
import {index_xiantiao_api} from "@/assets/js/api";

export default {
    name: "chart",
    data() {
        return {
            // chartData: chartData,
            
            time_interval: "",
        }
    },
    props: {
        symbol: {
            type: String,
        }
    },
    methods: {
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
        
        calculateMA(dayCount, data) {
            let result = [];
            for (let i = 0, len = data.values.length; i < len; i++) {
                if (i < dayCount) {
                    result.push('-');
                    continue;
                }
                let sum = 0;
                for (let j = 0; j < dayCount; j++) {
                    sum += data.values[i - j][1];
                }
                result.push(+(sum / dayCount).toFixed(3));
            }
            return result;
        },
        /*例子*/
        fnGetDemoChart() {
            let chartDom = document.getElementById('main');
            let myChart = echarts.init(chartDom);
            let option;
            
            const upColor = '#00da3c';
            const downColor = '#ec0000';
            index_xiantiao_api({
                symbol: this.symbol,
            }).then(res => {
                if (res.code == 200) {
                    let data = this.splitData(res.data);
                    myChart.setOption(
                        (option = {
                            animation: false,
                            legend: {
                                show: false,
                                // bottom: 10,
                                // left: 'center',
                                // data: ['Dow-Jones index', 'MA5', 'MA10', 'MA20', 'MA30']
                            },
                            tooltip: {
                                trigger: 'false',
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
                            brush: {
                                xAxisIndex: 'all',
                                brushLink: 'all',
                                outOfBrush: {
                                    colorAlpha: 0.1
                                }
                            },
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
                                    left: "2%",
                                    right: "3%",
                                    bottom: "10%",
                                    top: "10%",
                                    width: "100%",
                                    height: "200px",
                                    containLabel: true
                                },
                                {
                                    left: "2%",
                                    right: "3%",
                                    bottom: "3%",
                                    top: "3%",
                                    width: "100%",
                                    height: "200px",
                                    containLabel: true
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
                                    start: 98,
                                    end: 100
                                },
                                {
                                    show: true,
                                    xAxisIndex: [0, 1],
                                    type: 'slider',
                                    top: '85%',
                                    start: 98,
                                    end: 100
                                }
                            ],
                            series: [
                                {
                                    name: 'Dow-Jones index',
                                    type: 'candlestick',
                                    data: data.values,
                                    itemStyle: {
                                        color: upColor,
                                        color0: downColor,
                                        borderColor: undefined,
                                        borderColor0: undefined
                                    },
                                    tooltip: {
                                        formatter: function (param) {
                                            param = param[0];
                                            return [
                                                'Date: ' + param.name + '<hr size=1 style="margin: 3px 0">',
                                                'Open: ' + param.data[0] + '<br/>',
                                                'Close: ' + param.data[1] + '<br/>',
                                                'Lowest: ' + param.data[2] + '<br/>',
                                                'Highest: ' + param.data[3] + '<br/>'
                                            ].join('');
                                        }
                                    }
                                },
                                {
                                    name: 'MA5',
                                    type: 'line',
                                    data: this.calculateMA(5, data),
                                    smooth: true,
                                    lineStyle: {
                                        opacity: 0.5
                                    }
                                },
                                {
                                    name: 'MA10',
                                    type: 'line',
                                    data: this.calculateMA(10, data),
                                    smooth: true,
                                    lineStyle: {
                                        opacity: 0.5
                                    }
                                },
                                {
                                    name: 'MA20',
                                    type: 'line',
                                    data: this.calculateMA(20, data),
                                    smooth: true,
                                    lineStyle: {
                                        opacity: 0.5
                                    }
                                },
                                {
                                    name: 'MA30',
                                    type: 'line',
                                    data: this.calculateMA(30, data),
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
                        }),
                        true
                    );
                    myChart.dispatchAction({
                        type: 'brush',
                        areas: [
                            {
                                brushType: 'lineX',
                                coordRange: ['2016-06-02', '2016-06-20'],
                                xAxisIndex: 0
                            }
                        ]
                    });
                    
                    option && myChart.setOption(option);
                }
            })
        },
        
    },
    mounted() {
        this.fnGetDemoChart();
        
        window.onresize = () => {
            this.fnGetDemoChart();
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


