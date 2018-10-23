import { Table } from 'antd';
import * as React from 'react';
import {DisplayTableProps} from './interface';

export default class<T> extends React.PureComponent<DisplayTableProps<T>> {

    state = {
        list:[],
        total:0,
    }

    
    

    render() {
        return <Table></Table>
    }

}

