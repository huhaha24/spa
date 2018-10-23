import * as React from 'react'
import * as _ from 'lodash'
import {tableOption} from './interface'
import { ScrollList } from 'vap/layouts/screen'
import { Ajax } from 'vap/utils';
import baseurl from '../../config/config'
export default class ScrollTable extends React.Component<tableOption>{
    state = {
        list: []
    }
    //width = (1/this.props.header.length)*100+'%'
    width = this.props.defaultWidth
    componentWillMount(){
        Ajax.GET(baseurl + this.props.url, data => {
            this.setState({ list: data.array })
        })
    }
    componentDidMount() {}
    
    getHeader = (column)=>column.map((name ,i)=> <div className="grid-sub-header" style={{width :this.width[i]}}>{name}</div>)
    getBody = () => this.state.list.map(item => {
    let fields = this.props.field.map((f,i) =>(<div className="grid-li-body" style={{width :this.width[i]}}>{item[f]}</div>))
        return <li className="grid-li">
            {fields}
        </li>
    });
    render(){
        return <React.Fragment>
            <div className="grid-header">{this.getHeader(this.props.header)}</div>
            <div className="grid-body">
                {this.state.list.length > 0 ? <ScrollList className="grid-ul"
                    list={this.getBody()}
                    render={item => item}
                    alwaysScroll={false}
                ></ScrollList> : <span className="nodata">暂无数据</span>}
            </div>
        </React.Fragment>
    }
}