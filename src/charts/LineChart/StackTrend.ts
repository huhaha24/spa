import D3Chart from '../D3Chart';
import { StackTrendOpts } from './LineOptions';
import { DateUtil, ToolTip } from "../common";
import * as d3 from 'd3';
import * as _ from 'lodash';
import * as moment from 'moment';


export default class extends D3Chart<StackTrendOpts>{

    __ClassName = '_vc_line_areastack';

    dateFormat = 'YYYY-MM-DD';
    dates = [];

    marginLeft = 60;        //纵轴宽度
    widthScale = null;
    heightScale = null;
    areaDraw = null;

    init() {
        this.marginLeft = this.props.marginLeft || this.marginLeft;
        this.dateFormat = this.props.dateFormat || this.dateFormat;
    }

    sort() {
        var [start, end] = [this.props.start, this.props.end];
        if (end === undefined) {
            [start, end] = DateUtil.toRange(start);
        }
        var dates = DateUtil.dateArr(start, end, this.dateFormat);
        this.DATA = DateUtil.sortDateData(dates, this.props.data, this.props.labelField, this.props.valueFields)
        this.DATA.map(item => {
            item.__date_str = moment(item[this.props.labelField]).format(this.dateFormat);
            item.__date_obj = new Date(item[this.props.labelField]);
        })
        let totals = this.DATA.map(item => item._total = _.sum(this.props.valueFields.map(key => item[key])));
        this.widthScale = d3.scaleTime().domain(this.extent(this.DATA, d => d.__date_obj)).range([0, this.LAYOUT.w - this.marginLeft]);
        this.heightScale = d3.scaleLinear().domain([0, _.max(totals)]).range([this.LAYOUT.h, 0]);

        this.areaDraw = (t) => d3.area()
            .x((d: any) => this.widthScale(d['data']['__date_obj']))
            .y0((d: any) => this.heightScale(d[0]))
            .y1((d: any) => this.heightScale(d[0] + t * (d[1] - d[0])))
            .curve(d3.curveMonotoneX);
    }


    _mousemove() {
        this.SVG.on('mousemove', () => {
            const x = d3.event.layerX - this.LAYOUT.x - this.marginLeft;
            const y = d3.event.layerY - this.LAYOUT.y;
            if (x < 0) {
                return;
            }
            let param:any = {
                __date_str: moment(this.widthScale.invert(x)).format('YYYY-MM-DD')
            }
            let idx = _.findIndex(this.DATA, param);
            if (idx >= 0) {
                let data = this.DATA[idx];
                this.SVG.selectAll('.dot').classed('active', false);
                this.SVG.selectAll('.dot_' + idx).classed('active', true);
                if (this.props.tip) {
                    ToolTip.show(this.props.tip)
                } else {
                    let html = [`<h2>${moment(data[this.props.labelField]).format('YYYY-MM-DD')}</h2>`];
                    for (let i = 0; i < this.props.valueFields.length; i++) {
                        html.push(`<p>${this.props.valueTexts[i]} : <span class="vapfont">${this.FormatValue(data[this.props.valueFields[i]])}</span></p>`);
                    }
                    ToolTip.show(html.join(''))
                }
            }
            this.SVG.select(`line#${this.id}coord_line_vet`)
                .attr('stroke-opacity', 1)
                .attr('x1', x)
                .attr('x2', x)
                .attr('y1', 0)
                .attr('y2', this.LAYOUT.h);
            this.SVG.select(`line#${this.id}coord_line_hori`)
                .attr('stroke-opacity', 1)
                .attr('x1', 0)
                .attr('x2', this.LAYOUT.w - this.marginLeft)
                .attr('y1', y)
                .attr('y2', y);
        }).on('mouseout', d => {
            this.SVG.select(`line#${this.id}coord_line_hori`).attr('stroke-opacity', 0);
            this.SVG.select(`line#${this.id}coord_line_vet`).attr('stroke-opacity', 0);
            this.SVG.selectAll('.dot').classed('active', false);
            ToolTip.hide();
        });
        if (this.props.onClick) {
            this.SVG.on('click', () => {
                const x = d3.event.clientX - document.getElementById(this.id).getBoundingClientRect().left - this.LAYOUT.x;
                if (x < 0) {
                    return;
                }
                let param:any = {
                    __date_str: moment(this.widthScale.invert(x)).format('YYYY-MM-DD')
                }
                let data = _.find(this.DATA, param);
                if (data) {
                    this.props.onClick(data);
                }
            })
        }
    }


    build() {
        this.SVG.append('g').attr('class', '_group_items')
            .attr('transform', `translate(${this.LAYOUT.x + this.marginLeft},${this.LAYOUT.y})`)
            .classed('chart-hover', this.props.onClick ? true : false)
            .append('rect')
            .attr('id', this.id + 'ho-bkg')
            .attr('x', 0)
            .attr('y', 0)
            .attr('width', this.LAYOUT.w - this.marginLeft)
            .attr('height', this.LAYOUT.h)
            .attr('fill', 'white')
            .attr('fill-opacity', '0.001');

        let x = this.SVG.append("g")
            .attr("class", "_x_axis")
            .attr("transform", `translate(${this.LAYOUT.x + this.marginLeft},${this.LAYOUT.h + this.LAYOUT.y})`);
        if (_.has(this.props, 'xLabel')) {
            x.append('text')
                .attr('class', '_label')
                .text(this.props.xLabel)
                .attr('x', this.WIDTH - 40)
                .attr('y', 24);
        }
        let y = this.SVG.append("g")
            .attr("class", "_y_axis")
            .attr("transform", `translate(${this.LAYOUT.x + this.marginLeft},${this.LAYOUT.y})`);

        if (_.has(this.props, 'yLabel')) {
            y.append('text')
                .attr('class', '_label')
                .text(this.props.yLabel)
                .attr('x', 0)
                .attr('y', -12);
        }
        let coord = this.SVG.append('g').attr('class', '_group_coords')
            .attr('transform', `translate(${this.LAYOUT.x + this.marginLeft},${this.LAYOUT.y})`);
        coord.append('line')
            .attr('id', this.id + 'coord_line_hori')
            .attr('class', 'coord_hori')
            .attr('x0', 0)
            .attr('y0', 0)
            .attr('x1', 0)
            .attr('y1', 0);
        coord.append('line')
            .attr('id', this.id + 'coord_line_vet')
            .attr('class', 'coord_vet')
            .attr('x0', 0)
            .attr('y0', 0)
            .attr('x1', 0)
            .attr('y1', 0)
        this.update();
        this._mousemove();
    }


    update() {
        var stack = d3.stack();
        var data = stack.keys(this.props.valueFields)(this.DATA);
        var group = this.SVG.select('g._group_items').selectAll('g._item').data(data);

        let enter = group.enter()
            .append('g')
            .attr('class', (d, i) => this.itemClass(d, i));
        enter.append("path")
            .merge(group.select('path'))
            .transition()
            .duration(this.DURATION)
            .attrTween('d', (d, i) => (t) => { return this.areaDraw(t)(d) });

        group.selectAll("circle.dot").data(d => d)
            .enter()
            .append("circle")
            
            .attr('class', (d, i) => `dot dot_${i}`)
            .attr("cx", d => this.widthScale(d.data['__date_obj']))
            .attr("cy", d => this.heightScale(d[1]));

        this.SVG.select('g._x_axis').call(d3.axisBottom(this.widthScale).ticks(7).tickSize(1).tickFormat(d3.timeFormat('%m-%d')));
        this.SVG.select('g._y_axis').call(d3.axisLeft(this.heightScale).ticks(4).tickSize(1).tickFormat(e => this.FormatValue(e)));
    }
}

