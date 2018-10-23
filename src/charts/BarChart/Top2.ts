import * as d3 from 'd3';
import D3Chart from '../D3Chart';
import { TopOpts } from './BarOptions';
import * as _ from 'lodash';
import { ToolTip, DefUtil } from '../common'

export default class extends D3Chart<TopOpts> {

    __ClassName = '_vc_bar_top2';

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
        this.widthScale = d3.scaleLinear().domain([min, max]).range([0.4 * this.LAYOUT.w, this.LAYOUT.w]);
    }

    build() {
        this.SVG.append('defs').html(
            [
                DefUtil.BuildShadow(),
                DefUtil.BuildMutiBarImage()
            ].join('')
        );
        this.update();
    }

    update() {

        var group = this.SVG.selectAll('g._item')
            .data(this.DATA, d => d[this.props.labelField]);
        var enter = group.enter().append('g')
            .attr('transform', `translate(0,${this.HEIGHT + 100})`);
        enter.merge(group)
            .attr('class', (d, i) => this.itemClass(d, i))
            .transition()
            .duration(this.DURATION)
            .attr('transform', (d, i) => `translate(0,${this.itemHeight * i})`);

        enter.append('text')
            .attr('x', this.LAYOUT.x)
            .merge(group.select('text._index'))
            .attr('class', '_index')
            .text((d, i) => (i + 1) + '.')
            .attr('y', this.itemHeight / 2 - 6);

        enter.append('text')
            .attr('class', '_label')
            .text(d => d[this.props.labelField])
            .attr('x', this.LAYOUT.x + 12)
            .merge(group.select('text._label'))
            .attr('y', this.itemHeight / 2 - 8);

        enter.append('text')
            .attr('class', '_value')
            .merge(group.select('text._value'))
            .text(d => this.FormatValue(d[this.props.valueField]))
            .attr('x', this.LAYOUT.x + this.LAYOUT.w)
            .attr('y', this.itemHeight / 2 - 8);

        enter.append('rect')
            .attr('class', '_bkg')
            .attr('rx', 5)
            .attr('ry', 5)
            .attr('x', this.LAYOUT.x)
            .attr('height', 12)
            .merge(group.select('rect._bkg'))
            .attr('width', this.LAYOUT.w)
            .attr('y', this.itemHeight / 2);

        enter.append('rect')
            .attr('class', (d, i) => `_content _content_${i + 1}`)
            .attr('width', 0)
            .attr('height', 8)
            .attr('rx', 4)
            .attr('ry', 4)
            .attr('x', this.LAYOUT.x)
            .merge(group.select('rect._content'))
            .attr('y', this.itemHeight / 2 + 2)
            .transition()
            .duration(this.DURATION)
            .attr('width', d => this.widthScale(d[this.props.valueField]));

        enter.on('mouseover', d => {
            ToolTip.show(`<h2>${d[this.props.labelField]} : <small class="vapfont">${this.FormatValue(d[this.props.valueField])}</small></h2>`);
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