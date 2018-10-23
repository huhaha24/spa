import { ChartOpts } from '../interface';
/**
  * 类型：
  *  line: 条形图（默认）
  *  bar: 柱状图
  *  linebar: 条形图 + 柱状图
  *  histogram: 直方图 (后续支持))
 */
export type TrendType = 'line' | 'bar' | 'area' | 'linebar';


export interface HourTrendOpts extends ChartOpts {
    /**
     * 支持的类型，默认为 Line
    */
    type?: TrendType;
    /**
     * 日期字段
    */
    labelField: string;
    /**
     * 字段Rotate角度
    */
    labelRotate?: number;
    /**
     * 取值字段
    */
    valueField: string;
    /**
     * 是否显示 YLabel 默认不显示 
     * 
    */
    showYAxis?: boolean;
    /**
     * 纵轴的 label
    */
    yLabel?: string;
    /**
     * 左侧留宽
    */
    marginLeft?: number;

}

/**
 * 日期趋势图（可按天，日，月）
*/
export interface DateTrendOpts extends HourTrendOpts {
    /**
     * 开始日期
    */
    start: string;
    /**
     * 结束日期,说明，当结束日期不传时，默认以 设置为 start 的月底。
    */
    end?: string;
    /**
     * 默认选中的项目，默认为最后一项
    */
    defSelect?: string;
    /**
     * 日期格式化（默认为YYYY-MM-DD）
    */
    dateFormat?: string;
}


/**
 * 地区堆叠图
*/
export interface StackTrendOpts extends ChartOpts {
    /**
     * 开始日期
    */
    start: string;
    /**
     * 结束日期,说明，当结束日期不传时，默认以 设置为 start 的月底。
    */
    end?: string;
    /**
     * 日期字段
    */
    labelField: string;
    /**
     * 字段Rotate角度
    */
    labelRotate?: number;
    /**
     * label 字段列表 （堆叠时从下到上）
    */
    valueFields: string[];
    /**
     * label 字段列表 （堆叠时从下到上）
    */
    valueTexts: string[];
    /**
     * 左侧留宽
    */
    marginLeft?: number;
    /**
     * 横轴的 label
    */
    xLabel?: string;
    /**
     * 纵轴的 label
    */
    yLabel?: string;
    /**
     * 日期格式化（默认为YYYY-MM-DD）
    */
    dateFormat?: string;

}