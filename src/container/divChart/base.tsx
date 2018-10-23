import * as React from 'react'
import { option } from './interface'
import { Ajax } from 'vap/utils'
import * as _ from 'lodash'
import baseurl from '../../config/config'

export default abstract class BaseChart<T extends option> extends React.Component<T>{
    state = {
        legendValue: null,
        dataValue: [],
        data: []
    }

    DATA: any[]
    legend: any[]
    sourceTop: string = this.props.sourceTop
    abstract getLegend(sourceTop)
    abstract update()
    url: string
    handle = (e, className) => {
        const blocks = document.querySelectorAll(className)
        const len = blocks.length;
        //获取按钮的data-flag值
        const filterKey = e.currentTarget.getAttribute('data-flag')
        this.url = filterKey
        for (let i = 0; i < len; i++) {
            const element = blocks[i];
            element.classList.remove("curr");
        }
        e.currentTarget.classList.add("curr");
        //数据筛选
        this.getData()   
    }

    init = () => {
        this.DATA = this.props.data
        this.legend = this.props.legend ? this.props.legend : null
    }
    build = () => {
        this.state.legendValue = this.legend ? this.getLegend(this.props.sourceTop) : null
        this.state.dataValue = this.DATA ? this.update() :null
        this.setState({ legendValue: this.state.legendValue, dataValue: this.state.dataValue })
    }

    getData =()=>{
        Ajax.GET(baseurl + this.url, data => {
            this.DATA = data.array
            this.state.dataValue = this.DATA ? this.update() :null
            this.setState({dataValue: this.state.dataValue})
        })
    }

    componentDidMount() {
        this.url = this.props.url
        this.init()
        this.build()
        this.getData()
    }
    render() {
        return <React.Fragment>
            <div className="title-cn">{this.props.titleCH}</div>
            <div className="title-en">{this.props.titleEN}</div>
            <div className={`main-legend ${this.sourceTop}`} style={{ top: 20, right: 20 }}>
                {this.state.legendValue}
            </div>
            <div className="sub-body">
                {this.state.dataValue}
            </div>
        </React.Fragment>
    }
}