import D3Chart from '../D3Chart';
import * as d3 from 'd3';
import * as _ from 'lodash';
import * as moment from 'moment';
import { DateUtil,DefUtil,ToolTip } from "../common";
import { DateTrendOpts, TrendType } from './LineOptions';

/**
 * 日期趋势
*/
export default class extends D3Chart<DateTrendOpts>{

    __ClassName = '_vc_line_datetrend';
    __Grid = { left: 30, right: 30, top: 12, bottom: 16 };

    type: TrendType = 'line';
    marginLeft = 0;        //左Label宽度
    showYAxis = false;
    dateFormat = 'YYYY-MM-DD';
    dates = [];
    dataMap = new Map<String, { value: number, data?: any }>();
    labelRotate = 0;

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
            this.marginLeft = this.props.marginLeft || 30;
        }
        this.dateFormat = this.props.dateFormat || 'YYYY-MM-DD';
        this.labelRotate = this.props.labelRotate || 0;
    }

    sort() {
        var [start, end] = [this.props.start, this.props.end];
        if (end === undefined) {
            [start, end] = DateUtil.toRange(start);
        }
        this.dates = DateUtil.dateArr(start, end, this.dateFormat);
        this.dataMap.clear();
        this.dates.map(item => this.dataMap.set(item, { value: 0 }));
        this.props.data.map(item => {
            let key = moment(item[this.props.labelField]).format(this.dateFormat);
            if (this.dataMap.has(key)) {
                let obj = this.dataMap.get(key);
                obj.value = item[this.props.valueField];
                obj.data = item;
                this.dataMap.set(key, obj);
            }
        });
        this.DATA = [...this.dataMap.keys()].map(key => { return { label: key, value: this.dataMap.get(key).value, data: this.dataMap.get(key).data || {} } })
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

        if (this.props.defSelect) {
            enter.classed('_item_selected', d => d['label'] == this.props.defSelect);
        }
        enter.on('mouseover', d => {
            if (d['data']) {
                if (this.props.tip) {
                    ToolTip.show(this.props.tip(d['data']));
                } else {
                    ToolTip.show(`<h2 class="vapfont">${d['label']} : ${d['value']}</h2>`);
                }
            }
        }).on('mouseout',()=>ToolTip.hide());
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

        this.SVG.select('g._x_axis').call(d3.axisBottom(this.widthScale).ticks(this.DATA.length > 7 ? 7 : this.DATA.length).tickSize(1).tickFormat(
            (d: number) => {
                if (this.DATA.length <= d) {
                    return '';
                }
                return this.DATA[d]['label'];
            }
        ));
        if (this.showYAxis) {
            this.SVG.select('g._y_axis').call(d3.axisLeft(this.heightScale).ticks(4).tickSize(1).tickFormat(e => this.FormatValue(e)));
        }

    }
}