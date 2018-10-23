import DoubleRing from './DoubleRing';
import D3Chart from '../D3Chart';
import * as _ from 'lodash';
import * as d3 from 'd3';
import { PieOpts, Layout, getLayout } from './PieOptions';
import { Format } from 'vap/utils';
import ToolTip from '../common/ToolTip';


var arc = d3.arc();

export default class extends D3Chart<PieOpts>{
    /**
     * 双层相关环圈图
    */
    static DoubleRing: typeof DoubleRing = DoubleRing;
    __ClassName = '_vc_pie';

    innerRadius = 0;
    outerRadius = 0;
    radius = 18;
    padding = 18;
    layout: Layout = null;
    


    init() {
        if (_.has(this.props, 'radius')) {
            this.radius = this.props.radius;
        }
        if (_.has(this.props, 'padding')) {
            this.padding = this.props.padding;
        }
    }

    sort() {
        this.layout = getLayout(this.props.legend, this.WIDTH, this.HEIGHT);
        this.outerRadius = (this.layout.layout.w - this.padding) / 2;
        this.innerRadius = this.outerRadius - this.radius;
        this.innerRadius = this.innerRadius < 0 ? 0 : this.innerRadius;
        let list = _.orderBy(_.filter(this.props.data, d => d[this.props.valueField] > 0), this.props.valueField, 'desc');
        this.DATA = d3.pie().value(d => d[this.props.valueField])(list);
        if (this.DATA.length == 0) {
            this.DATA = [{
                __EMPTY: true, index: 0, value: 0, startAngle: 0, endAngle: Math.PI * 2, data: { [this.props.labelField]: '无数据', [this.props.valueField]: 0 }
            }];
        }
        if (_.sumBy(this.DATA, 'value') == 0 && this.DATA.length > 0) {
            let size = this.DATA.length;
            let angle = Math.PI / size * 2;
            this.DATA.map((item, i) => {
                item.startAngle = i * angle;
                item.endAngle = (i + 1) * angle;
            })
        }
    }


    build() {
        this.SVG.append('g').attr('class', '_group_pies');
        this.SVG.append('g').attr('class', '_group_legend');
        this.SVG.append('g').attr('class', '_group_tip');
        if (!this.props.hoverTip) {
            let txtGroup = this.SVG.select('g._group_tip')
            let layout = this.layout.layout;
            txtGroup.append('text')
                .attr('class', '_title')
                .attr('x', layout.x + layout.w / 2)
                .attr('y', layout.y + layout.h / 2 - 8)
                .text(this.DATA[0].data[this.props.labelField]);
            txtGroup.append('text')
                .attr('class', '_value high')
                .attr('x', layout.x + layout.w / 2)
                .attr('y', layout.y + layout.h / 2 + 20)
                .text(this.FormatValue(this.DATA[0].data[this.props.valueField]));
            txtGroup.append('text')
                .attr('class', '_percent')
                .attr('x', layout.x + layout.w / 2)
                .attr('y', layout.y + layout.h / 2 + 40)
                .text((this.DATA[0].endAngle - this.DATA[0].startAngle) * 100 / Math.PI / 2 + '%');
            this.SVG.selectAll('g._item').classed('active', false);
            this.SVG.selectAll('g._item_0').classed('active', true);
        }
        this.update();
    }


    // 更新数据
    update() {
        var pieGroup = this.SVG.select('g._group_pies');
        var legendGroup = this.SVG.select('g._group_legend');
        var layout = this.layout.layout;
        var nest = this.layout.nest;
        var isHorizontal = this.layout.isHorizontal;
        var group = pieGroup.selectAll('g._item').data(this.DATA, d => d.data[this.props.labelField]);

        let enter = group.enter()
            .append('g')
            .attr('class', (d, i) => this.itemClass(d, i));
        enter.merge(group)
            .attr('transform', `translate(${layout.x + layout.w / 2},${layout.y + layout.h / 2})`);
        enter.append('path')
            .merge(group.select('path'))
            .transition()
            .duration(this.DURATION)
            .attrTween("d", (d: any) => {
                return t => {
                    return arc({
                        startAngle: d.startAngle,
                        endAngle: d.startAngle + (d.endAngle - d.startAngle) * t,
                        innerRadius: this.innerRadius,
                        outerRadius: this.outerRadius
                    });
                }
            });



        var legGroup = legendGroup
            .selectAll('g._item')
            .data(this.DATA, d => d.data[this.props.labelField]);
        var legendEnter = legGroup.enter()
            .append('g')
            .attr('class', (d, i) => this.itemClass(d, i));

        legendEnter.merge(legGroup.select('g._item'))
            .attr('class', (d, i) => this.itemClass(d, i))
            .attr("transform", (d, i) => {
                if (isHorizontal) {
                    let x = nest.x == 0 ? 12 : nest.x;
                    return `translate(${x},${nest.y + 6 + 24 * i})`
                }
            });
        legendEnter.append("rect")
            .merge(legGroup.select('rect'))
            .attr("x", 6)
            .attr("y", 6)
            .attr("rx", 5)
            .attr("width", 20)
            .attr("height", 12);
        legendEnter.append("text")
            .merge(legGroup.select('text'))
            .attr("x", 30)
            .attr("y", 16)
            .text(d => d.data[this.props.labelField]);

        this.SVG.select('._group_tip ._title').text(this.DATA[0].data[this.props.labelField]);
        this.SVG.select('._group_tip ._value').text(this.FormatLabel(this.DATA[0].data[this.props.valueField]));
        this.SVG.select('._group_tip ._percent').text((this.DATA[0].endAngle - this.DATA[0].startAngle) * 100 / Math.PI / 2 + '%');

        enter.on('mouseover', (d, i) => {
            this.SVG.selectAll('g._item').classed('active', false);
            this.SVG.selectAll('g._item_' + i).classed('active', true);
            this._showTip(d);
        }).on('mouseout', () => {
            ToolTip.hide();
        })
        legendEnter.on('mouseover', (d, i) => {
            this.SVG.selectAll('g._item').classed('active', false);
            this.SVG.selectAll('g._item_' + i).classed('active', true);
            this._showTip(d);
        }).on('mouseout', () => {
            ToolTip.hide();
        })

        if (this.props.onClick) {
            enter.on('click', (d: any) => {
                if (!_.has(d, '__EMPTY')) {
                    this.props.onClick(d.data)
                }
            });
            legendEnter.on('click', (d: any) => {
                if (!_.has(d, '__EMPTY')) {
                    this.props.onClick(d.data)
                }
            });
        }
        group.exit().remove();
        legGroup.exit().remove();

    }

    _showTip(d) {
        if (this.props.hoverTip) {
            if (this.props.tip) {
                ToolTip.show(this.props.tip(d.data));
            } else {
                ToolTip.show(`<h2>${this.FormatLabel(d.data[this.props.labelField])}</h2><p class="vapfont">${this.FormatValue(d.data[this.props.valueField])}</p>`);
            }
        } else {
            this.SVG.select('._group_tip ._title').text(d.data[this.props.labelField]);
            this.SVG.select('._group_tip ._value').text(this.FormatLabel(d.data[this.props.valueField]));
            this.SVG.select('._group_tip ._percent').text(Format.formatDecimal((d.endAngle - d.startAngle) * 100 / Math.PI / 2) + '%');
        }
    }
}