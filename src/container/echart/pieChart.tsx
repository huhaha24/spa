import * as React from 'react'
import * as _ from 'lodash'
import { Ajax } from 'vap/utils';
import baseurl from '../../config/config'
import { default as EChart } from './OptChart'

export default class PieChart extends React.Component<any>{
  state = {
    options:{},
    legendData: [],
    seriesData: []
  }
  colors = ["#29f0ce", "#2e4ff8", "#5d78fc", "#1ccc7f", "#2065d7", "#1ea6f1", "#49a5dd", "#1172b5", "#0c60a6", "#0834cf", "#182cb8"]
  placeHolder = {
    normal: {
      color: '#212943',
      label: {
        show: false
      },
      labelLine: {
        show: false
      }
    },
    emphasis: {
      color: '#212943'
    }
  }
   initOptions(){
    this.state.options = {
      title: {
        text: "攻击态势占比图",
        top: 20,
        textStyle: {
          color: "#fff",
          fontWeight: "normal",
          fontSize: 20
        }
      },
      tooltip: {
        show: "true"
      },
      legend: {
        orient: 'vertical',
        left: '80%',
        bottom: '20%',
        itemWidth: 5,
        itemHeight: 5,
        textStyle: {
          color: 'rgba(255,255,255,0.5)',
          fontSize: 14
        },
        data: this.state.legendData
      },
      series: this.state.seriesData
    }
   }

  getData(){
    Ajax.GET(baseurl + this.props.url,data =>{ 
      data.map((item, i) => {
        const { name, value } = item
        const radius = [20 + 5 * i + '%', 23 + 5 * i + '%']
        const otherValue = 100 - value;
        this.state.legendData.push({
          name,
          icon: "circle",
          textStyle: {
            color: "#f0f3f8"
          }
        });
        this.state.seriesData.push({
          type: 'pie',
          clockWise: true,
          startAngle: 270,
          hoverAnimation: false,
          radius: radius,
          center: ['40%', '50%'],
          label: {
            normal: {
              show: false
            }
          },
          labelLine: {
            normal: {
              show: false
            }
          },
          data: [{
            value,
            name,
            type: "show",
            itemStyle: {
              color: this.colors[i % this.colors.length]
            }
          },
          {
            value: otherValue,
            name,
            type: "shadow",
            showValue: value,
            itemStyle: this.placeHolder
          }]
        })
      })
      this.setState({
        options: this.state.options,
        legendData: this.state.legendData,
        seriesData: this.state.options
      })
    })
  }

  componentWillMount(){
    this.getData()
    this.initOptions() 
  }
   
  render(){
    return(
      <EChart data={this.state.options} ></EChart>
    )
  }
}