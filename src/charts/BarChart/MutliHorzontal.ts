import * as d3 from 'd3';
import D3Chart from '../D3Chart';
import { ChartOpts } from '../interface';
import * as _ from 'lodash';

import { ToolTip, DefUtil, Legend } from '../common';

export interface MutiHorzontalOptions extends ChartOpts {
    labelField: string,         //x轴标签
    valueFields: string[],      //标签字段
    labels: string[],           //标签文本
    doubleCancel?: boolean,    //点击第二次取消选择，默认为false
    maxCount?: number,          //最大数量，默认为15
    legend?: {
        show: boolean,          //是否显示图例
        width?: number,         //图例宽度
    },

}

const StackWidth = 16;

export default class extends D3Chart<MutiHorzontalOptions> {
    
    __ClassName='_vc_bar_multi_hori';

    __Grid = {
        top: 12,
        left: 80,
        right: 24,
        bottom: 30,
    }

    min = 0;
    max = 0;

    maxCount = 15;
    widthScale = null;
    heightScale = null;
    legend: Legend = null;
    SelectedKeys: string[] = null;


    currentIndex = -1;

    sort() {
        if (this.SelectedKeys === null) {
            this.SelectedKeys = _.concat([], this.props.valueFields);
        }
        var data = this.props.data.map(item => {
            item.__sum = 0;
            item.__total = 0;
            this.props.valueFields.map(field => {
                item.__sum += item[field];
            });
            this.SelectedKeys.map(field => {
                item.__total += item[field];
            });
            return item;
        });
        this.DATA = _.orderBy(data, d => d.__total, 'desc');
        if (this.DATA.length > this.maxCount) {
            this.DATA.length = this.maxCount;
        }
        [this.min, this.max] = this.extent(this.DATA, d => d.__total);
        this.max = DefUtil.fixMax(this.max);
        this.widthScale = d3.scaleBand().rangeRound([0, this.LAYOUT.w])
            .domain(this.DATA.map(item => item[this.props.labelField]));
        this.heightScale = d3.scaleLinear().rangeRound([this.LAYOUT.h, 0])
            .domain([0, this.max]).nice();
        this.DATA = d3.stack().keys(this.SelectedKeys)(this.DATA);
    }

    resize() {
        this.SVG.select("g._x_axis")
            .transition().duration(this.DURATION)
            .attr("transform", `translate(${this.LAYOUT.x},${this.LAYOUT.y + this.LAYOUT.h})`);
        this.SVG.select("g._y_axis")
            .attr("transform", `translate(${this.LAYOUT.x},${this.LAYOUT.y})`);
        this.SVG.select("g._axis_line")
            .transition().duration(this.DURATION)
            .attr("transform", `translate(${this.LAYOUT.x},${this.LAYOUT.y})`);
        if (this.props.legend && this.props.legend.show) {
            let legWidth = this.props.legend.width || 200;
            this.SVG.select('g._legends')
                .transition().duration(this.DURATION)
                .attr("transform", `translate(${this.LAYOUT.x + this.LAYOUT.w - legWidth},${this.LAYOUT.y})`);
        }
        this.widthScale.rangeRound([0, this.LAYOUT.w]);
        this.heightScale.rangeRound([this.LAYOUT.h, 0]);
        this.update();

    }



    build() {

        this.SVG.append("g")
            .attr("class", "_x_axis")
            .attr("transform", `translate(${this.LAYOUT.x},${this.LAYOUT.y + this.LAYOUT.h})`);

        this.SVG.append("g")
            .attr("class", "_y_axis")
            .attr("transform", `translate(${this.LAYOUT.x},${this.LAYOUT.y})`);
        this.SVG.append("g")
            .attr("class", "_axis_line")
            .attr("transform", `translate(${this.LAYOUT.x},${this.LAYOUT.y})`);

        this.SVG.append('g').attr('class', '_container')
            .attr("transform", `translate(${this.LAYOUT.x},${this.LAYOUT.y})`);

        if (this.props.legend && this.props.legend.show) {
            let legWidth = this.props.legend.width || 200;
            var group = this.SVG.append('g')
                .attr("class", "_legends")
                .attr("transform", `translate(${this.LAYOUT.x + this.LAYOUT.w - legWidth},${this.LAYOUT.y})`);
            this.legend = new Legend(group, 1, (SelectedKeys) => {
                this.SelectedKeys = SelectedKeys;
                this.sort();
                this.update();
            }, legWidth, this.DURATION);
        }
        this.update();

    }

    updateLegend() {
        var legendMap = {};
        this.props.valueFields.map((field, i) => legendMap[field] = { value: _.sumBy(this.props.data, field), label: this.props.labels[i] });
        let legends = [];
        _.keys(legendMap).map(key => {
            legends.push({
                key,
                label: legendMap[key].label,
                value: legendMap[key].value,
            })
        });
        legends = _.orderBy(legends, 'value', 'desc');
        this.legend.update(legends);
    }

    update() {
        let container = this.SVG.select('g._container');

        let band = this.widthScale.bandwidth();
        let diff = (band - StackWidth) / 2

        var series = container.selectAll("g._series").data(this.DATA, d => d['key']);
        series.attr("class", d => `_series _series_${this.legend.getIndex(d['key'])}`)
            .classed('_item_hover', this.props.onClick != undefined);
        var seriesAdd = series
            .enter().append("g")
            .attr("class", d => `_series _series_${this.legend.getIndex(d['key'])}`)
            .classed('_item_hover', this.props.onClick != undefined)
        //这段代码有问题，后续要使用merge简化
        var newRects = seriesAdd.selectAll("rect")
            .data( (d) => d, d => d['key'] ).enter()
            ///.data( d => d).enter()
            .append("rect")
            .attr('class', (d, i) => `_item_rect _item_rect_${i}`)
            .attr("x", (d, i) => band * i + diff)
            .attr("y", d => this.heightScale(d[0]))
            .attr("width", StackWidth)
            .attr("height", 0);
        var rects = series.selectAll("rect")
            //.data((d: any) => d, d => d['key'])
            .data( d => d).enter()
            .attr('class', (d, i) => `_item_rect _item_rect_${i}`)

        var rectAdd = rects.enter()
            .append("rect")
            .attr('class', (d, i) => `_item_rect _item_rect_${i}`)
            .attr("x", (d, i) => band * i + diff)
            .attr("y", d => this.heightScale(d[0]))
            .attr("width", StackWidth)
            .attr("height", 0);

        rectAdd.transition()
            .duration(this.DURATION)
            .attr('y', d => this.heightScale(d[1]))
            .attr('height', d => this.heightScale(d[0]) - this.heightScale(d[1]));
        newRects.transition()
            .duration(this.DURATION)
            .attr('y', d => this.heightScale(d[1]))
            .attr('height', d => this.heightScale(d[0]) - this.heightScale(d[1]));
        rects.transition()
            .duration(this.DURATION)
            .attr("x", (d, i) => band * i + diff)
            .attr('y', d => this.heightScale(d[1]))
            .attr('height', d => this.heightScale(d[0]) - this.heightScale(d[1]));
        rects.exit().remove();
        series.exit().remove();
        rectAdd.on('mouseover', (d: any, i) => {
            container.selectAll('rect._item_rect').classed('active', false);
            container.selectAll('rect._item_rect_' + i).classed('active', true);
            // @ts-ignore
            let valField = this.props.valueFields[this.legend.getIndex(d3.select(d3.select(d3.event.srcElement).node().parentNode).data()[0].key)];

            if (_.has(this.props, 'tip')) {
                ToolTip.show(this.props.tip(d.data, valField));
            } else {
                ToolTip.show(`<h2>${this.FormatLabel(d.data[this.props.labelField])}
                    ${this.props.valueFields.map((key, i) =>
                        `<p class="${key == valField ? 'high' : ''}">${this.props.labels[i]}:<span class="vapfont">${d.data[key] || 0}</span></p>`).join('')}
                </h2>`);
            }
        }).on('mouseout', () => {
            container.selectAll('rect._item_rect').classed('active', false);
            if (this.currentIndex >= 0) {
                container.selectAll('rect._item_rect_' + this.currentIndex).classed('active', true);
            }
            ToolTip.hide();
        });

        newRects.on('mouseover', (d: any, i) => {
            container.selectAll('rect._item_rect').classed('active', false);
            container.selectAll('rect._item_rect_' + i).classed('active', true);
            // @ts-ignore
            let valField = this.props.valueFields[this.legend.getIndex(d3.select(d3.select(d3.event.srcElement).node().parentNode).data()[0].key)];
            if (_.has(this.props, 'tip')) {
                ToolTip.show(this.props.tip(d.data, valField));
            } else {
                ToolTip.show(`<h2>${this.FormatLabel(d.data[this.props.labelField])}
                    ${this.props.valueFields.map((key, i) =>
                        `<p class="${key == valField ? 'high' : ''}">${this.props.labels[i]}:<span class="vapfont">${d.data[key] || 0}</span></p>`).join('')}
                </h2>`);
            }
        }).on('mouseout', () => {
            container.selectAll('rect._item_rect').classed('active', false);
            if (this.currentIndex >= 0) {
                container.selectAll('rect._item_rect_' + this.currentIndex).classed('active', true);
            }
            ToolTip.hide();
        });

        if (this.props.onClick) {
            newRects.on('click', (d: any, i) => {
                if (this.props.doubleCancel && this.currentIndex == i) {
                    this.currentIndex = -1;
                    this.props.onClick(null);
                    container.selectAll('rect._item_rect_' + this.currentIndex).classed('active', false);
                    return;
                }
                this.currentIndex = i;
                // @ts-ignore
                let valField = this.props.valueFields[this.legend.getIndex(d3.select(d3.select(d3.event.srcElement).node().parentNode).data()[0].key)];
                this.props.onClick(d.data, valField);
                container.selectAll('rect._item_rect_' + this.currentIndex).classed('active', true);

            })
            rectAdd.on('click', (d: any, i) => {
                if (this.props.doubleCancel && this.currentIndex == i) {
                    this.currentIndex = -1;
                    this.props.onClick(null);
                    container.selectAll('rect._item_rect_' + this.currentIndex).classed('active', false);
                    return;

                }
                this.currentIndex = i;
                // @ts-ignore
                let valField = this.props.valueFields[this.legend.getIndex(d3.select(d3.select(d3.event.srcElement).node().parentNode).data()[0].key)];
                this.props.onClick(d.data, valField);
                container.selectAll('rect._item_rect_' + this.currentIndex).classed('active', true);
            })
        }
        if (this.props.legend && this.props.legend.show) {
            this.updateLegend();
        }

        series.exit().remove();

        this.SVG.select('g._x_axis').call(d3.axisBottom(this.widthScale).tickSize(1).tickFormat(e => this.FormatLabel(e)));
        this.SVG.select('g._y_axis').call(d3.axisLeft(this.heightScale).ticks(3).tickSize(0).tickFormat(e => this.FormatValue(e)));
        this.SVG.select('g._axis_line').call(d3.axisLeft(this.heightScale).ticks(3).tickSize(-this.LAYOUT.w).tickFormat(() => ''));



    }

}