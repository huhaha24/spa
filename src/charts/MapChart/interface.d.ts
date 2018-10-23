import { ChartOpts } from '../interface';
export interface ExtIcon {
    name: string,
    icon: string,
    pos: [number, number],
    className?: string
}

// interface legend {
//     name?: string;
//     value?: string;
// }

export type ColorData = { name: string, value: number, [propName: string]: any }[];

export interface ColorWidthLegend {
    data: any[];
    areaField?: string; //地名字段默认为 name
    labelFields: string[];
    valueFields: string[];
    pos?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

export interface MapOpts extends ChartOpts {
    /**
     * 地图旋转度数
    */
    rotateX?: number;
    /**
     * 手动调节地图,必须传一个长度为3的数组，分别为经度，纬度，倍数调节
    */
    adjust?: number[];
    /**
     * 地图ID，可通过util地图下钻功能取到全部地图，默认为china
    */
    mapId?: number | string;
    /**
     * 地图颜色数据
    */
    colors?: ColorData | ColorWidthLegend;

    // { name: string, value: number, [propName: string]: any }[];
    /**
     * 地图上的颜色标签
    */
    // colorLegend?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
    /**
     * 地图线条数据
    */
    lines?: { from: string, to: string, value: number, onclick?: Function, [propName: string]: any }[];
    /**
     * 地图柱状图数据
    */
    bars?: { name: string, value?: number, onclick?: Function, [propName: string]: any }[];
    /**
     * 地图柱状图labelField
    */
    barFields?: string[];
    /**
     * 地图柱状图数据Label
    */
    barTexts?: string[];
    /**
     * 地图点数据
    */
    points?: { name: string, value: number, onclick?: Function, [propName: string]: any }[];
    /**
     * 地图选中事件
    */
    onSelected?: Function,
    /**
     * 地图上额外显示的图标。
    */
    extIcons?: ExtIcon[],
    /**
     * 地名format
    */
    nameFormat?: Function,
    /**
     * legend 数据 | 设置
     */
    // legendSetting?: {
    //     position?: 'left' | 'right' | 'top' | 'bottom', 
    //     list?: Array<legend>,
    //     onClick?: Function,
    //     show?: boolean
    // }
}