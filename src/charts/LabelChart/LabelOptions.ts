import { ChartOpts } from '../interface';

/**
 * Label Chart 定义
*/
export interface LabelOpts extends ChartOpts {
    /**
     * Label 字段
    */
    labelField: string;
    /**
     * value 字段
    */
    valueField: string;
    /**
     * 是否显示百分比
    */
    percent?: boolean;
}
