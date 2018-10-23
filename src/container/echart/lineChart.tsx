import * as React from 'react'
import * as _ from 'lodash'
import moment from 'moment';
import { Ajax } from 'vap/utils';
import baseurl from '../../config/config'
import { default as EChart } from './OptChart'

export default class LineChart extends React.Component<any>{
  state = {
    options: {},
    data: [],
    values:[]
  }

  initOptions() {
    const legend = [], xdata = [], series = [];
    this.state.data.forEach((item, i) => {
      const { type, values } = item;
      legend.push({
        name: type,
        icon: "rect",
        textStyle: {
          fontSize: 14,
          color: "#fff"
        }
      });
      
      let data = [];
      this.state.values[i].map(element=>{
          const { name, value } = element;
          xdata.unshift(name);
          data.unshift(value || Math.floor(Math.random() * 100));
        });

      series.push({
        name: type,
        type: 'line',
        smooth: true,
        lineStyle: {
          normal: {
            width: 3
          }
        },
        data
      });
    });

    const xAsixData = _.intersection(xdata);
    const colors = ["#4466F4", "#1ED9C3"];
    this.state.options = {
      color: colors,
      title: {
        text: "数据质量",
        textStyle: {
          color: "#fff",
          fontWeight: "normal",
          fontSize: 20
        }
      },
      legend: {
        data: legend,
        top: 5,
        right: 10,
        itemGap: 60,
        itemWidth: 14,
        textStyle: {
          color: 'rgba(255,255,255,0.5)',
          fontSize: 14
        }
      },
      grid: {
        top: "15%",
        left: '3%',
        right: '4%',
        bottom: '12%',
        containLabel: true
      },
      tooltip: {
        show: "true",
        trigger: 'axis',
        axisPointer: { // 坐标轴指示器，坐标轴触发有效
          type: 'line' // 默认为直线，可选为：'line' | 'shadow'
        }
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: xAsixData,
        axisLabel: {
          color: "#6884C4",
          fontSize: 14,
          fontFamily: "BenderRegular"
        },
        axisTick: {
          show: false
        },
        axisLine: {
          show: false
        }
      },
      yAxis: {
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
          show: false
        },
        splitLine: {
          lineStyle: {
            color: '#1e3150'
          }
        }
      },
      series
    };
  }

  getData(){
    Ajax.GET(baseurl + this.props.url, data => {
      this.state.data = data
      data.map((item, i) => {
        this.state.values[i] = item.value
      })
      this.initOptions()
      this.setState({ data: this.state.data, values: this.state.values, options: this.state.options })
    })
  }

  componentWillMount() {
    this.initOptions()
    this.getData()   
  }
  
  render() {
    return (
      <EChart data={this.state.options}></EChart>
    )
  }
}
