/// <reference types="react" />
import * as React from 'react';
import { TableProps } from 'antd/lib/table/interface';


export interface DisplayTableProps<T> extends TableProps<T> {
    /** 
     * 查询接口
    */
    query: string;
    /**
     * 默认查询参数
    */
    param?: any;
    /**
     * 是否加载，默认为 true
    */
    autoLoad?: boolean;
    /**
     * 选中时的回调函数
    */
    onSelect?: (data: any) => any;
    /**
     * 每页记录数量，默认为10
    */
    pageSize?:number;
}