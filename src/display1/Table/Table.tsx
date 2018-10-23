import { Table } from 'antd';
import { TableProps } from 'antd/lib/table/interface';
import { Const } from 'vap/utils';
import * as React from 'react';
import * as _ from 'lodash';

export default class <T> extends React.Component<TableProps<T>> {


    render() {
        let param: any = _.assign({}, this.props);
        param.size = param.size || 'small';
        return <Table {...param}></Table >
    }
}