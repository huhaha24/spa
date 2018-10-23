import * as d3 from 'd3';
import D3Chart from '../D3Chart';
import * as _ from 'lodash';
import { MultiChartOpts } from './BarOptions';
import ToolTip from '../common/ToolTip'

const BarHeight = 12;
const Margin = 2;

export default class extends D3Chart<MultiChartOpts> {

    __ClassName = '_vc_bar_multi';

    paddingTop = 0;
    itemHeight = 40;
    widthScale = null;

    sort() {
        this.DATA = this.props.data;
        this.DATA.map(item => {
            let sum = 0;
            this.props.valueFields.map(field => {
                sum += parseInt(item[field])
            })
            item.__sum = sum;
        });
        this.DATA = _.orderBy(this.DATA, '__sum', 'desc');
        if (this.DATA.length > this.MAXCOUNT) {
            this.DATA.length = this.MAXCOUNT;
        }
        var [min, max] = this.extent(this.DATA, d => d['__sum']);
        this.itemHeight = this.HEIGHT / this.DATA.length;
        this.paddingTop = (this.itemHeight - (BarHeight + 12)) / 2;
        this.widthScale = d3.scaleLinear()
            .domain([min, max])
            .range([0.4 * this.LAYOUT.w, 0.95 * this.LAYOUT.w]);
    }


    update() {
        var group = this.SVG.selectAll('g._item')
            .data(this.DATA, d => d[this.props.labelField]);

        var enter = group.enter().append('g')
            .attr('class', (d, i) => this.itemClass(d, i))
            .attr('transform', `translate(0,${this.HEIGHT * 1.3})`);

        enter.merge(group)
            .attr('class', (d, i) => this.itemClass(d, i))
            .transition()
            .duration(this.DURATION)
            .attr('transform', (d, i) => `translate(0,${this.itemHeight * i})`);

        enter.append('text')
            .attr('class', '_label')
            .attr('x', this.LAYOUT.x)
            .merge(group.select('text._label'))
            .attr('y', this.paddingTop + 12)
            .text(d => d[this.props.labelField]);

        enter.append('text')
            .attr('class', '_value')
            .merge(group.select('text._value'))
            .attr('x', this.LAYOUT.x + this.LAYOUT.w)
            .attr('y', this.paddingTop + 18)
            .text(d => d['__sum']);

        for (let i = 0; i < this.props.valueFields.length; i++) {
            var rect = enter.append('rect')
                .attr('class', `_compontent_rect _compontent_${i}`)
                .attr('height', BarHeight);
            rect.merge(group.select(`rect._compontent_${i}`))
                .attr('x', d => {
                    let sum = d['__sum'];
                    let w = this.widthScale(sum);
                    let p = 0;
                    for (let j = 0; j < i; j++) {
                        p += d[this.props.valueFields[j]]
                    }
                    return (w * p / sum) + this.LAYOUT.x;
                })
                .attr('y', this.paddingTop + 18)
                .attr('width', 0)
                .transition()
                .duration(this.DURATION)
                .attr('width', d => {
                    let sum = d['__sum'];
                    let w = this.widthScale(sum);
                    return w * d[this.props.valueFields[i]] / sum < Margin ? 0 : ((w * d[this.props.valueFields[i]] / sum) - Margin);
                });
            rect.on('mouseover', d => {
                if (_.has(this.props, 'tip')) {
                    ToolTip.show(this.props.tip(d));
                } else {
                    ToolTip.show(`
                        <h2>${d[this.props.labelField]}</h2>
                        ${this.props.valueFields.map((label, j) => `<p class="${((j + '') == (i + '')) ? 'high' : 'common'}">${this.props.valueTitles[j]}: <span class="vapfont">${d[label]}</span></p>`).join('')}
                    `);
                }
            }).on('mouseout', d => {
                ToolTip.hide();
            });
            if (this.props.onClick) {
                rect.on('click', d => {
                    this.props.onClick(d, this.props.valueFields[i]);
                })
            }
        }

    }
}