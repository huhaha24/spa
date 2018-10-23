
import * as _ from 'lodash';
import * as d3 from 'd3';
import D3Chart from '../D3Chart';
import { Format as f } from 'vap/utils';
import { ToolTip, DefUtil, Format } from '../common';

import { LabelOpts } from './LabelOptions';
import Horizontal from "./Horizontal";

// 目前最多支持6个label，写死，第三个参数以宽度为准，说明：LabelChart 请尽量保证窗口是一个正方形，宽度和高度都差不多为最好
const POS = {
    '1': [
        [0.5, 0.5, 0.3],
    ],
    '2': [
        [0.3, 0.5, 0.2],
        [0.7, 0.5, 0.2],
    ],
    '3': [
        [0.5, 0.3, 0.15],
        [0.3, 0.7, 0.15],
        [0.7, 0.7, 0.15],
    ],
    '4': [
        [0.3, 0.3, 0.15],
        [0.3, 0.7, 0.15],
        [0.7, 0.7, 0.15],
        [0.7, 0.3, 0.15],
    ],
    '5': [
        [0.5, 0.2, 0.12],
        [0.2, 0.45, 0.12],
        [0.3, 0.8, 0.12],
        [0.7, 0.8, 0.12],
        [0.8, 0.45, 0.12],
    ],
    '6': [
        [0.3, 0.2, 0.12],
        [0.7, 0.2, 0.12],
        [0.8, 0.5, 0.12],
        [0.7, 0.8, 0.12],
        [0.3, 0.8, 0.12],
        [0.2, 0.5, 0.12],
    ],
}


const R = 40;   //半径

export default class extends D3Chart<LabelOpts>{

    /**
     * 横向Label图
     */
    static Horizontal: typeof Horizontal = Horizontal;

    __ClassName = '_vc_label';

    formatTransition: any = null;

    lineRnder = d3.scaleLinear().domain([0, 0.5]).range([-0.9 * R, 0.9 * R]);
    lineRnder2 = d3.scaleLinear().domain([0.5, 1.0]).range([0.9 * R, -0.9 * R]);

    init() {
        this.formatTransition = Format.buildTransition(this.props.format);
    }

    build() {
        this.SVG.append('defs').html(DefUtil.BuildShadow());
        this.update();
    }
    // 更新数据
    update() {
        const valueField = this.props.valueField;
        const coord = POS[this.DATA.length + ''];
        const formatTransition = this.formatTransition;

        let sum = _.sumBy(this.DATA, this.props.valueField);
        if (sum == 0) sum += 0.01;    //防止除0

        var group = this.SVG.selectAll('g._item')
            .data(this.DATA, d => d[this.props.labelField]);

        var enter = group.enter().append('g')
            .attr('class', '_item')
            .attr('transform', `translate(${this.WIDTH / 2},${this.HEIGHT / 2})`);
        enter.merge(group)
            .transition()
            .duration(this.DURATION)
            .attr('transform', (d, i) => `translate(${coord[i][0] * this.WIDTH},${coord[i][1] * this.HEIGHT})`);


        enter.classed('_item_hover', _.has(this.props, 'onClick'));
        if (_.has(this.props, 'onClick')) {
            enter.on('click', d => this.props.onClick(d));
        }
        enter.on('mouseover', d => ToolTip.show(this.props.tip ? this.props.tip(d) :
            `<h2>${d[this.props.labelField]}</h2>
            <p class="vapfont">${this.FormatValue(d[this.props.valueField])} &nbsp;&nbsp; ${this.props.percent ?'(<span class="high">' + f.formatDecimal(d[this.props.valueField] / sum * 100) + '%</span>)' : ''}</p>`
        )).on('mouseout', () => ToolTip.hide());

        enter.append('circle')
            .attr('cx', 0)
            .attr('cy', 0)
            .attr('r', R)
            .attr('class', '_bkg');

        enter.append('text')
            .text((d: any) => d[this.props.labelField])
            .attr('x', 0)
            .attr('y', this.props.percent ? -8 : 0)
            .attr('class', '_title');

        enter.append('text')
            .attr('x', 0)
            .attr('y', this.props.percent ? 10 : 18)
            .attr('class', '_value high')
            .attr('last', d => 0)
            .text(d => 0)
            .merge(group.select('text._value'))
            .transition()
            .duration(this.DURATION)
            .on('start', function (d) {
                let from = parseFloat(d3.select(this).attr('last'));
                let to = parseFloat(d[valueField]);
                d3.select(this).attr('last', d[valueField])
                d3.active(this).tween('text', function () {
                    var that = d3.select(this);
                    return function (p) {
                        that.text(formatTransition(from, to, p));
                    };
                });
            });


        if (this.props.percent) {
            enter.append('text')
                .attr('x', 0)
                .attr('y', 24)
                .attr('class', '_percent')
                .html(d =>{ 
                    return `<tspan>10%</tspan>`});

            let arc = d3.arc();
            enter.append('path')
                .attr('class', '_percent2')
                .merge(group.select('path._percent2'))
                .transition()
                .duration(this.DURATION)
                .attrTween("d", function (d) {
                    return function (t) {
                        return arc({
                            innerRadius: R - 5,
                            outerRadius: R,
                            startAngle: 0,
                            endAngle: Math.PI * 2 * t * d[valueField] / sum
                        })
                    };
                });
        }

        group.exit().remove();
    }
}
