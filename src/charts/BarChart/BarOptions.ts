import { ChartOpts } from '../interface';


/**
 * Top BAR图 定义
*/
export interface TopOpts extends ChartOpts {
    /**
     * Label 字段，显示
    */
    labelField: string,
    /**
     * Value 字段，取值
    */
    valueField: string,
}

/**
 * 横向Bar图定义
 * 
*/
export interface HorizontalOpts extends ChartOpts {
    /**
     * Label 字段（展示）
    */
    labelField: string,
    /**
     * Value 字段（值）
    */
    valueField: string,
    /**
     * y轴 label
    */
    yLabel?: string,
    /**
     * y轴label的宽度（当存在label时）
    */
    labelWidth?: number,
    /**
     * x轴 label
    */
    xLabel?: string,
}

/**
 * 多段Bar图定义
*/
export interface MultiChartOpts extends ChartOpts {
    /**
     * 每个数据的字段
    */
    valueFields: string[];
    /**
     * 每个数据的字段标题，与字段对应
    */
    valueTitles: string[];
    /**
     * 归类大Label Field
    */
    labelField: string;
}

/**
 * 多段Bar图定义: Label与Bar条在一行显示
*/
export interface MultiInlineChartOpts extends MultiChartOpts {
    /**
     * Label的宽度
    */
    labelWidth?: number;
}


export interface CompareOpts extends ChartOpts {
    titles: string[],
    labelField?: string[],
    valueField?: string[],
    maxCount?: number
}