
import { ChartOpts } from '../interface';


/**
 * 普通PIE加税
*/
export interface PieOpts extends ChartOpts {
    /**
     * 标签label对应的数据字段
    */
    labelField: string;
    /**
     * 值对应的数据字段
    */
    valueField: string;
    /**
     * 圆环大小，如果要是想要纯PIE图，请设置大一点，比如 999
    */
    radius?: number,
    /**
     * 圆环加距
    */
    padding?: number;
    /**
     * 文字说明出现方式， tip 为弹出，其它为直接显示 
    */
    hoverTip?: boolean; //是否HOVER弹框,默认在圆环中心TIP
    /**
     * 如果设置此项，则显示图例
    */
    legend?: 'left' | 'right' | 'top' | 'bottom'; //是否显示icon
}



export interface Layout {
    layout: { x: number, y: number, w: number, h: number };
    nest: { x: number, y: number, w: number, h: number };
    isHorizontal: boolean;
}

export const getLayout = function (legend: 'left' | 'right' | 'top' | 'bottom', width: number, height: number): Layout {
    let isHorizontal = width > height;
    let layout = { x: 0, y: 0, w: width, h: height };
    let nest = { x: 0, y: 0, w: 0, h: 0 };
    // 需要显示标签
    if (legend) {
        if (isHorizontal) {
            if (legend == 'left') {
                layout = { x: width - height, y: 0, w: height, h: height };
                nest = { x: 0, y: 0, w: width - height, h: height }
            } else {
                layout = { x: 0, y: 0, w: height, h: height };
                nest = { x: height, y: 0, w: width - height, h: height }
            }
        } else {
            if (legend == 'top') {
                layout = { x: 0, y: height - width, w: width, h: width };
                nest = { x: 0, y: 0, w: width, h: height - width }
            } else {
                layout = { x: 0, y: 0, w: width, h: width };
                nest = { x: 0, y: width, w: width, h: height - width }
            }
        }
    } else {
        // 不需要显示标签时，取中间小方块
        let diff = Math.abs(width - height) / 2;
        if (isHorizontal) {
            layout = { x: diff, y: 0, w: height, h: height }
        } else {
            layout = { x: 0, y: diff, w: width, h: width }
        }
    }
    return { layout, nest, isHorizontal };
}
