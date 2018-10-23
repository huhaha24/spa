import * as React from 'react'
import * as _ from 'lodash'
import { Ajax } from 'vap/utils'
import baseurl from '../../config/config'
import { default as EChart } from './OptChart'

export default class LineChart extends React.Component<any>{
  state = {
    options: {}
  }

  initOptions() {
    this.state.options = {
      title: {
        text: "攻击态势Top5",
        textStyle: {
          color: "#fff",
          fontWeight: "normal",
          fontSize: 20
        }
      },
      
      grid: {
        left: '3%',
        right: '4%',
        bottom: '10%',
        containLabel: true
      },

      tooltip: {
        show: "true",
        trigger: 'axis',
        axisPointer: { // 坐标轴指示器，坐标轴触发有效
          type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
        }
      },
      xAxis: {
        type: 'value',
        axisLabel: {
          color: "#6884C4",
          fontSize: 14,
          fontFamily: "BenderRegular"
        },
        axisTick: {
          show: false
        },
        axisLine: {
          show: false,
          lineStyle: {
            color: '#fff',
          }
        },
        splitLine: {
          show: false
        },
      },
      yAxis: [{
        type: 'category',
        axisLabel: {
          color: "#6884C4",
          fontSize: 14,
          fontFamily: "BenderRegular"
        },
        axisTick: {
          show: false
        },
        axisLine: {
          show: false,
          lineStyle: {
            color: '#fff',
          }
        },
        data: null
      },
      {
        type: 'category',
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          show: false
        },
        splitArea: {
          show: false
        },
        splitLine: {
          show: false
        },
        data: null
      }],
      series: [{
        name:'最大值',
        type: 'bar',
        yAxisIndex: 1,
        itemStyle: {
          normal: {
            show: false,
            color: '#12193e',
            barBorderRadius: 50,
            borderWidth: 0,
            borderColor: '#333',
          }
        },
        barGap: '0%',
        barCategoryGap: '75%',
        data:[]
      },
      {
        name: '实际值',
        type: 'bar',
        itemStyle: {
          normal: {
            show: false,
            color: '#5de3e1',
            barBorderRadius: 50,
            borderWidth: 0,
            borderColor: '#333',
          }
        },
        barGap: '0%',
        barCategoryGap: '75%',
        data:null
      }]
    };

    this.setState({
      options: this.state.options
    })
  }

  getData(){
    Ajax.GET(baseurl + this.props.url, data => {
      let valueData = _.map(data, 'value')
      let max = _.max(valueData)
      //@ts-ignore
      this.state.options.yAxis.map(item=>{
        item.data = _.map(data, 'name')
      })
      //@ts-ignore
      this.state.options.series[1].data = valueData
      data.map(item=>{
       //@ts-ignore
        this.state.options.series[0].data.push(max)
      })
      this.setState({ options: this.state.options})
    })
  }

  componentWillMount() {
    this.initOptions()
    this.getData()
  }
  componentDidUpdate(){
    
  }

  render() {
    return (
      <EChart data={this.state.options}></EChart>
    )
  }
}
