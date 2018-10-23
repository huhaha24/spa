import { ModalProps } from 'antd/lib/modal/Modal';
import { ColumnProps } from 'antd/lib/table/interface';
import * as React from 'react';

export interface TableModalProps<T> extends ModalProps {
    query: string;
    show: boolean;
    columns?:ColumnProps<T>[];
    /**
     * 基本查询参数
    */
    param?:any;
    export?:string;
}
