import { ChartOpts } from '../interface';


/**
 * 普通雷达图的参数
*/
export interface RadarOpts extends ChartOpts {
    /**
     * 数组，取值的filed
    */
    labelFields: string[];
    /**
     * 数组，Label文案
    */
    labelTexts: string[];
    /**
     * 最大值
    */
    maxValue: number;
    /**
     * 环圈数量
    */
    levels?: number;
}


// export function wrap(text) {
//     text.each(function () {
//         var text = d3.select(this),
//             words = text.text().split(/\s+/).reverse(),
//             word,
//             line = [],
//             y = text.attr("y"),
//             x = text.attr("x"),
//             dy = parseFloat(text.attr("dy")),
//             tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");

//         while (word = words.pop()) {
//             line.push(word);
//             tspan.text(line.join(" "));
//         }
//     });
// }//wrap	


export function createNodes(numNodes, radius) {
    var nodes = [];
    let angle = Math.PI * 2 / numNodes;
    for (let i = 0; i < numNodes; i++) {
        let x = (radius * Math.cos(angle * i - Math.PI / 2)); // Calculate the x position of the element.
        let y = (radius * Math.sin(angle * i - Math.PI / 2)); // Calculate the y position of the element.
        nodes.push({ id: i, x, y });
    }
    return nodes;
}
