/// <reference types="react" />
import { ModalProps } from 'antd/lib/modal/Modal';

export interface Column {

    /**
     * 列名称
    */
    title: string;
    /**
     * 列字段 
    */
    field: string;
    /**
     * 输入提示
    */
    placeholder?: string;
    /**
     * 是否显示，默认显示，不显示可以设置为showed:false
    */
    showed?: boolean;
    /**
     * 是否禁用，默认不禁用，禁用可以设置为 disabled:true
    */
    disabled?: boolean;
    // 默认为 : "text"
    type?: string;//('text' | 'number' | 'select' | 'radio' | 'checkbox' | 'date' | 'switch' | 'daterange' | 'icon' );
    // type?: ('text' | 'number' | 'select' | 'radio' | 'checkbox' | 'date' | 'switch' | 'daterange' | 'icon' );
    options?: any[];
    inline?: boolean;
    // rule 用法： https://github.com/yiminghe/async-validator
    rule?: any[];
    link?: {
        field:string,
        type?: "change"|"blur",
        onload?:boolean,
        callback:{Function(txt: string):any[]},
        name:string,
        value:string,
    };

    //说明：目前onChange,onFocus,onBlur 仅在 type 为 "text" 时有效
    onChange?: { Function(txt: string): void };
    onFocus?: { Function(txt: string): void };
    onBlur?: { Function(txt: string): void };
}

export interface FromModalProps extends ModalProps {
    isEdit?: boolean;
    data?: any;
    default:any;
    columns: Column[];
}