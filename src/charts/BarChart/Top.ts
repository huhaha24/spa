import * as d3 from 'd3';
import D3Chart from '../D3Chart';
import { ToolTip } from '../common';
import { TopOpts } from './BarOptions';
import * as _ from 'lodash';

const BarHeight = 12;

export default class extends D3Chart<TopOpts> {
    __ClassName = '_vc_bar_top';

    __Grid = {
        left: 12,
        right: 12,
        top: 0,
        bottom: 0,
    }

    itemHeight = 40;
    widthScale = null;

    sort() {
        this.DATA = _.orderBy(this.props.data, d => parseFloat(d[this.props.valueField]), 'desc');
        if (this.DATA.length > this.MAXCOUNT) this.DATA.length = this.MAXCOUNT;
        var [min, max] = this.extent(this.DATA, d => d[this.props.valueField]);
        this.itemHeight = this.HEIGHT / this.DATA.length;
        this.widthScale = d3.scaleLinear().domain([min, max]).range([0.4 * this.LAYOUT.w, 0.95 * this.LAYOUT.w - (max + '').length * 14]);
    }

    update() {
        var group = this.SVG.selectAll('g._item')
            .data(this.DATA, d => d[this.props.labelField]);
        var enter = group.enter().append('g')
            .attr('transform',  `translate(0,${this.HEIGHT + 100})`);
        enter.merge(group)
            .attr('class', (d, i) => this.itemClass(d, i))
            .transition()
            .duration(this.DURATION)
            .attr('transform', (d, i) => `translate(0,${this.itemHeight * i})`)

        enter.append('text')
            .attr('class', '_index')
            .attr('x', this.LAYOUT.x)
            .merge(group.select('text._index'))
            .attr('y', this.itemHeight / 2 - 6)
            .text((d, i) => (i + 1) + '.')
        enter.append('text')
            .attr('class', '_label')
            .text(d => d[this.props.labelField])
            .attr('x', 24)
            .merge(group.select('text._label'))
            .attr('y', this.itemHeight / 2 - 8);

        enter.append('text')
            .attr('class', '_value')
            .merge(group.select('text._value'))
            .attr('x', 2 + this.LAYOUT.w)
            .text(d => this.FormatValue(d[this.props.valueField]))
            .attr('y', this.itemHeight / 2 + 11);

        enter.append('rect')
            .attr('class', '_content')
            .attr('width', 0)
            .attr('height', BarHeight)
            .attr('x', 24)
            .merge(group.select('rect._content'))
            .attr('y', this.itemHeight / 2)
            .transition()
            .duration(this.DURATION)
            .attr('width', (d, i) => this.widthScale(d[this.props.valueField]));

        enter.on('mouseover', d => {
            if (_.has(this.props, 'tip')) {
                ToolTip.show(this.props.tip(d));
            } else {
                ToolTip.show(`<h2>${d[this.props.labelField]} : <small class="vapfont">${this.FormatValue(d[this.props.valueField])}</small></h2>`);
            }
        }).on('mouseout', d => {
            ToolTip.hide();
        })
        if (this.props.onClick) {
            enter.on('click', d => this.props.onClick(d));
        }

        group.exit()
            .transition()
            .duration(this.DURATION)
            .attr('transform', `translate(0,-150)`)
            .remove();
    }
}