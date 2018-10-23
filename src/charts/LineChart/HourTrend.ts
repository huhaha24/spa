import D3Chart from '../D3Chart';
import ToolTip from '../common/ToolTip';
import DefUtil from '../common/DefUtil';
import * as d3 from 'd3';
import * as _ from 'lodash';
import { HourTrendOpts, TrendType } from './LineOptions';


const HOURS = _.range(24);
const TimeFormat = ['凌晨0点', '凌晨1点', '凌晨2点', '凌晨3点', '凌晨4点', '凌晨5点', '上午6点', '上午7点', '上午8点', '上午9点', '上午10点', '上午11点', '中午12点', '下午1点', '下午2点', '下午3点', '下午4点', '下午5点', '下午6点', '晚上7点', '晚上8点', '晚上9点', '晚上10点', '晚上11点'];
const hourRender = (num) => TimeFormat[parseInt(num)];

/**
 * 日期趋势
*/
export default class extends D3Chart<HourTrendOpts>{

    __ClassName = '_vc_line_datetrend';
    __Grid = { left: 12, right: 30, top: 12, bottom: 45 };

    type: TrendType = 'line';
    marginLeft = 0;        //左Label宽度
    showYAxis = false;
    HourMap = new Map<number, { value: number, data?: any }>();
    labelRotate = -300;
 
    itemWidth = 0;          // 一格的大小
    barWidth = 12;          // 一列的大小，最大为12
    diff = 0;


    widthScale = null;
    heightScale = null;
    lineTween = null;

    init() {
        this.type = this.props.type || 'line';
        if (this.props.showYAxis) {
            this.showYAxis = true;
            this.marginLeft = this.props.marginLeft || this.marginLeft;
        }
        this.labelRotate = this.props.labelRotate || this.labelRotate;
    }

    sort() {
        this.HourMap.clear();
        HOURS.map(item => this.HourMap.set(item, { value: 0 }));
        this.props.data.map(item => {
            let key = parseInt(item[this.props.labelField]);
            if (this.HourMap.has(key)) {
                let obj = this.HourMap.get(key);
                obj.value = item[this.props.valueField];
                obj.data = item;
                this.HourMap.set(key, obj);
            }
        });
        this.DATA = [...this.HourMap.keys()].map(key => { return { label: key, value: this.HourMap.get(key).value, data: this.HourMap.get(key).data || {} } })
        this.DATA = _.orderBy(this.DATA, 'label', 'asc');
        let [min, max] = [0, 1];
        if (this.props.data.length > 0) {
            [min, max] = d3.extent(this.props.data, item => item[this.props.valueField]);
            if (min == max) {
                min = 0;
            }
        }
        this.widthScale = d3.scaleLinear().domain([0, this.DATA.length]).range([0, this.LAYOUT.w]);
        this.heightScale = d3.scaleLinear().domain([max, 0]).range([this.LAYOUT.h, 0]);
        this.itemWidth = this.LAYOUT.w / this.DATA.length;
        this.barWidth = this.itemWidth > this.barWidth ? this.barWidth : this.itemWidth;
        this.diff = (this.itemWidth - this.barWidth) / 2;
    }


    build() {
        this.SVG.append('defs').html(DefUtil.BuildLineDistribution())
        this.SVG.append('g').attr('class', '_line')
            .attr('transform', `translate(${this.LAYOUT.x + this.marginLeft},${this.LAYOUT.y})`)
            .append('path');
        this.SVG.append('g').attr('class', '_items')
            .attr('transform', `translate(${this.LAYOUT.x + this.marginLeft},${this.LAYOUT.y})`)
            .classed('_group_hover', this.props.onClick ? true : false);
        this.SVG.append("g")
            .attr("class", "_x_axis")
            .attr("transform", `translate(${this.LAYOUT.x + this.marginLeft},${this.LAYOUT.h + this.LAYOUT.y})`);
        this.SVG.append("g")
            .attr("class", "_y_axis")
            .attr("transform", `translate(${this.LAYOUT.x + this.marginLeft},${this.LAYOUT.y})`);
        this.update();
    }


    updateLine() {
        var lineTween = t => d3.line()
            .curve(d3.curveMonotoneX)
            .x((d, i) => this.itemWidth * i + this.itemWidth / 2)
            .y((d, i) => this.LAYOUT.h - (this.heightScale(d['value'])) * t);
        this.SVG.select('g._line path').datum(this.DATA)
            .transition()
            .duration(this.DURATION)
            .attrTween('d', (d) => (t) => { return lineTween(t)(d) });
    }

    updateArea() {

    }

    updateBar() {

        var group = this.SVG.select('g._items').selectAll('g._item').data(this.DATA, d => d['label']);
        var enter = group.enter().append('g').attr('class', '_item');

        enter.append('rect')
            .merge(group.select('rect'))
            .attr('x', (d, i) => this.diff + this.itemWidth * i)
            .transition()
            .duration(this.DURATION)
            .attr('width', this.barWidth)
            // @ts-ignore
            .attrTween('y', d => (t: number) => this.LAYOUT.h - t * this.heightScale(d['value']))
            // @ts-ignore
            .attrTween('height', d => (t: number) => t * this.heightScale(d['value']));
        if (this.props.onClick) {
            enter.on('click', (d, i, u) => {
                if (d['data']) {
                    enter.classed('_item_selected', false);
                    d3.select(u[i]).classed('_item_selected', true);
                    this.props.onClick(d['label'], d['data'])
                }
            })
        }
        enter.on('mouseover', d => {
            if (d['data']) {
                if (this.props.tip) {
                    ToolTip.show(this.props.tip(d['data']));
                } else {
                    ToolTip.show(`<h2 class="vapfont">${hourRender(d['label'])} : ${d['value']}</h2>`);
                }
            }
        }).on('mouseout', () => ToolTip.hide());
        group.exit().remove();
    }


    update() {
        switch (this.type) {
            case 'line':
                this.updateLine();
                break;
            case 'area':
                this.updateArea();
                break;
            case 'bar':
                this.updateBar();
                break;
            case 'linebar':
                this.updateLine();
                this.updateBar();
                break;
        }

        let xAxis = this.SVG.select('g._x_axis').call(d3.axisBottom(this.widthScale).ticks(23).tickSize(1).tickFormat(hourRender));
        xAxis.selectAll("text")
            .style("text-anchor", "start")
            .attr("dx", "8")
            .attr("dy", "-6")
            .attr("transform", `rotate(${this.labelRotate})`);
        if (this.showYAxis) {
            this.SVG.select('g._y_axis').call(d3.axisLeft(this.heightScale).ticks(4).tickSize(1).tickFormat(e => this.FormatValue(e)));
        }

    }
}