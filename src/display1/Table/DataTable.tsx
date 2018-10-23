import Table from './Table';
import * as React from 'react';
import * as _ from 'lodash';
import { Const, Ajax } from 'vap/utils';
import { DisplayTableProps } from './interface';

export default class <T> extends React.PureComponent<DisplayTableProps<T>> {

    references: {
        cleanAndQuery: (param:any)=>void,
        query: (param:any)=>void,
    } = {
        cleanAndQuery:null,
        query:null
    }

    sorter = {}
    param = {
        start_: 0,
        count_: 10,
    }
    state = {
        list: [],
        total: 0,
        current: 1,
        loading:false,
    }
    
    private _query(){
        this.setState({loading:true});
        Ajax.POST(this.props.query, this.param, json => {
            let state:any= {};
            state.current = this.param.start_===0?1:state.current,
            state.list = json.list;
            state.total = json.total;
            state.loading = false;
            this.setState(state);
        })
    }

    cleanAndQuery = (param:any)=>{
        this.param = _.assign({start_:0,count_:10},param);
        this._query();
    }
    query=(param:any)=>{
        _.assign(this.param,{start_:0,count_:10},param);
        this._query();
    }

    componentDidMount() {
        _.assign(this.param, this.props.param);
        if (this.props.autoLoad === false) {
            return;
        }
        this._query();
    }


    search(pagination, filters, sorter) {
        this.setState({loading:true});
        let param: any = {
            ...this.param,
            start_: (pagination.current - 1) * pagination.pageSize,
            count_: pagination.pageSize,
        };
        let state: any = {}
        if (!_.isEqual(this.sorter, sorter)) {
            param.start_ = 0;
            state.current = 1;
            this.sorter = sorter;
        } else {
            state.pageSize = pagination.pageSize;
            state.current = pagination.current;
        }
        if (_.has(sorter, 'field')) {
            param.order_ = sorter.field;
            param.by_ = sorter.order_ == 'ascend' ? 'asc' : 'desc';
        } else {
            param.order_ = null;
            param.by_ = null;
        }

        Ajax.POST(this.props.query, param, json => {
            state.list = json.list;
            state.total = json.total;
            state.loading = false;
            this.setState(state);
        });
    }

    render() {
        let pageSize = this.props.pageSize === undefined ? 10 : this.props.pageSize;
        let param: any = {
            dataSource: this.state.list,
            onChange: (pagination, filters, sorter) => this.search(pagination, filters, sorter)
        };

        if (pageSize) {
            param.pagination = {
                current: this.state.current,
                total: this.state.total,
                showQuickJumper: true,
                showSizeChanger: false,
                pageSize: pageSize,
                pageSizeOptions: Const.PAGE_OPTIONS,
            }
        }
        return <Table {...this.props} {...param} loading={this.state.loading}></Table>
    }

}

