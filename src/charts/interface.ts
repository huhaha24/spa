/**
 * 展示空间
*/
export interface Layout { x: number, y: number, w: number, h: number };
/**
 * 表格的通用参数
 * 说明：某些选项可能在个别图形内不生效！请参照具体可视化组件的说明
*/
export interface ChartOpts {
    /**
     * 图形显示的边距
    */
    grid?: {
        top?: number,
        left?: number,
        right?: number,
        bottom?: number,
    };
    /**
     * 图形内的数据，需要以数组方式传入,说明：如果想要等到数据显示时才加载，初始状态设置为 null 而不是 []
    */
    data: any[];
    /**
     * 动效时间，默认为2秒
    */
    duration?: number;
    /**
     * 数据的显示模式，默认为'default':不使用转义 可选：数字(number)， 美元数字(usd)，百分数(percent)，汉字(chinese)，带两位小数的(decimal)
    */
    format?: 'default' | 'number' | 'usd' | 'percent' | 'chinese' | 'decimal';
    /**
     * 最多显示的个数
    */
    maxCount?: number;
    /**
     * label格式化
    */
    labelFormat?: Function;
    /**
     * 鼠标移动后的提示内容，需要返回内容。
    */
    tip?: (d: any, i?: any) => string;
    /**
     * 点击事件 
    */
    onClick?: Function;


}



export interface BarConfig {
    top?: number;
    left?: number;
    right?: number;
    bottom?: number;
    max?: number;
    tickNumber?: number;
    labelWidth?: number;
}

export interface BarOpts extends ChartOpts {
    labelField: string;
    valueField: string;
    title?: string;
    onClick?: Function;
    config?: BarConfig;
}

export interface TopBarConfig {

}

export interface TopBarOpts extends ChartOpts {
    list: any[];
    label: string;
    value: string;
    unit?: string;
}


/**
 * Echarts组件属性
*/
export interface EchartCommentProps {
    /**
     * class 属性
    */
    className?: string;
    /**
     * Echart数据
    */
    data: any;
    /**
     * Echartd点击事件
     */
    onClick?: Function;
}