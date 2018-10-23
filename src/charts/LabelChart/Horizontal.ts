import * as _ from 'lodash';
import * as d3 from 'd3';
import D3Chart from '../D3Chart';
import { LabelOpts } from './LabelOptions';
import { Format as f } from 'vap/utils';
import { DefUtil, Format,ToolTip } from '../common';

const Margin = 15;
const R = 45;

export default class extends D3Chart<LabelOpts>{

    __ClassName = '_vc_label _vc_label_horizontal';

    formatTransition: any = null;

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
        const formatTransition = this.formatTransition;
        const itemWidth = Margin + R * 2;
        var maxWidth = this.DATA.length * itemWidth + Margin;
        var left = 0;
        const y = (this.HEIGHT - R * 2) / 2 + R;
        if (maxWidth < this.WIDTH) {
            left = (this.WIDTH - maxWidth) / 2;
            maxWidth = this.WIDTH;
        }
        this.SVG.attr('width', maxWidth);
        let sum = _.sumBy(this.DATA, this.props.valueField);
        if (sum == 0) sum += 0.01;    //防止除0

        var group = this.SVG.selectAll('g._item')
            .data(this.DATA, d => d[this.props.labelField]);

        var enter = group.enter().append('g')
            .attr('class', '_item')
            .attr('transform', `translate(-100,${y})`);
        enter.merge(group)
            .transition()
            .duration(this.DURATION)
            .attr('transform', (d, i) => `translate(${left + itemWidth * i + Margin + R},${y})`);

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

        enter.classed('_item_hover', _.has(this.props, 'onClick'));
        if (_.has(this.props, 'onClick')) {
            enter.on('click', d => this.props.onClick(d));
        }
        enter.on('mouseover', d => ToolTip.show(this.props.tip ? this.props.tip(d) :
            `<h2>${d[this.props.labelField]}</h2>
                <p class="vapfont">${this.FormatValue(d[this.props.valueField])} &nbsp;&nbsp; ${this.props.percent ? '(<span class="high">' + f.formatDecimal(d[this.props.valueField] / sum * 100) + '%</span>)' : ''}</p>`
        )).on('mouseout', () => ToolTip.hide());

        if (this.props.percent) {
            enter.append('text')
                .attr('x', 0)
                .attr('y', 24)
                .attr('class', '_percent')
                .html(d => `<tspan>${f.formatDecimal(d[this.props.valueField] / sum * 100, 1)}%</tspan>`);

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
