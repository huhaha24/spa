/**
 * D3 图提示说明：
 * 只能是在D3的 MouseEvent触发时使用！
*/
import * as d3 from 'd3';
var tooltip = null, PID = null;

const MINWIDTH = 200;

var WIDTH = window.innerWidth - MINWIDTH;
var HEIGHT = window.innerHeight - 80;
window.addEventListener('resize',function () {
    WIDTH = window.innerWidth - MINWIDTH;
    HEIGHT = window.innerHeight - 80;
})

if (d3.select('#__vc_tip').size() == 1) {
    tooltip = d3.select('#__vc_tip');
} else {
    tooltip = d3.select('body').append('div').attr('id', '__vc_tip');
}


function show(html) {
    window.clearTimeout(PID);
    tooltip.html(html);
    tooltip.style('opacity', 1)
    var left = (d3.event.clientX - 48) + 'px', right = 'auto', top = (d3.event.clientY + 16) + 'px', bottom = 'auto';
    if (d3.event.clientX > WIDTH) {
        left = 'auto';
        right = (WIDTH + MINWIDTH - d3.event.clientX + 20) + 'px';
    }
    if (d3.event.clientY > HEIGHT) {
        top = 'auto';
        bottom = (HEIGHT + 80 - d3.event.clientY + 20) + 'px';
    }

    tooltip.style('left', left)
        .style('top', top)
        .style('right', right)
        .style('bottom', bottom);
};

function hide(delay:number=1000) {
    window.clearTimeout(PID);
    PID = window.setTimeout(function () {
        tooltip.transition()
            .duration(1000)
            .style('opacity', 0);
    }, delay);
};

export default abstract class {
    static show = show;
    static hide = hide;
}
