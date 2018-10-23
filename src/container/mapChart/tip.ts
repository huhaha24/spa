import * as d3 from 'd3'
var tooltip = null, PID = null;
var WIDTH = window.innerWidth - 200;
var HEIGHT = window.innerHeight - 80;

window.addEventListener('resize', function () {
    WIDTH = window.innerWidth - 200;
    HEIGHT = window.innerHeight - 80;
});

if (d3.select('#__v_tip').size() == 1) {
    tooltip = d3.select('#__v_tip');
} else {
    tooltip = d3.select('body').append('div').attr('id', '#__v_tip');
}
tooltip.style('position', 'fixed')
.style("opacity", 0)
.style('padding', '5px')
.style('left', '0')
.style('top', '0')
.style('min-height', '90px')
.style('min-width', '150px')
.style('pointer-events', 'none')
.style('display', 'block')
.style('background', 'url("../../../images/title.png") no-repeat left top, rgba(0, 0, 0, 0.5)')
.style('clip-path', 'polygon(7.5% 1%, 95.16% 1%, 100% 4.83%, 100% 95.16%, 95.16% 100%, 4.83% 100%, 0% 94.16%, 0% 14%)')
.style('-webkit-clip-path', 'polygon(7.5% 1%, 95.16% 1%, 100% 4.83%, 100% 95.16%, 95.16% 100%, 4.83% 100%, 0% 94.16%, 0% 14%)');

const showTooltip = (html)=> {
    window.clearTimeout(PID);
    tooltip.html(html);
    tooltip.style('opacity', 1)
    //d3.event 获取当前被点击区域的事件对象  clientx 事件属性返回当事件被触发时鼠标指针向对于浏览器x轴的距离
    let scale = window.innerWidth / 1920
    var left = (d3.event.clientX / scale - 40) + 'px', right = 'auto', top = (d3.event.clientY / scale - 8) + 'px', bottom = 'auto';
    if (d3.event.clientX > WIDTH) {
        left = 'auto';
        right = (WIDTH + 200 - d3.event.clientX + 20) + 'px';
    }
    if (d3.event.clientY > HEIGHT) {
        top = 'auto';
        bottom = (HEIGHT + 80 - d3.event.clientY + 20) + 'px';
    }
    tooltip.style('left', left)
        .style('top', top)
        .style('right', right)
        .style('bottom', bottom);
}

const hideTooltip = (delay)=> {
    delay = delay || 1000;
    window.clearTimeout(PID);
    PID = window.setTimeout(function () {
        tooltip.transition()
            .duration(1000)
            .style('opacity', 0);
    }, delay);
}
export default {showTooltip,hideTooltip}