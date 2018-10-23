import * as d3 from 'd3';
import D3Chart from '../D3Chart';
import * as _ from 'lodash';
import { ToolTip, DefUtil } from '../common'
import { TopOpts } from './BarOptions';


const StackWidth = 8;
const CircleRadius = 8;

/**
 * 横向，气泡Bar图
*/

export default class extends D3Chart<TopOpts> {

    __ClassName = '_vc_bar_papaw';

    __Grid = {
        top: 30,
        left: 36,
        right: 24,
        bottom: 30,
    }

    widthScale = null;
    heightScale = null;



    sort() {
        this.DATA = _.orderBy(this.props.data, d => parseFloat(d[this.props.valueField]), 'desc');
        if (this.DATA.length > this.MAXCOUNT) {
            this.DATA.length = this.MAXCOUNT;
        }

        var [min, max] = this.extent(this.DATA, d => d[this.props.valueField]);
        max = DefUtil.fixMax(max);
        this.widthScale = d3.scaleBand().rangeRound([0, this.LAYOUT.w]).domain(this.DATA.map(item => item[this.props.labelField]))
        this.heightScale = d3.scaleLinear().rangeRound([this.LAYOUT.h, 0]).domain([0, max]).nice();
        this.DATA = d3.stack().keys([this.props.valueField])(this.DATA)[0];
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
            .attr("transform", `translate(${this.LAYOUT.x},${this.LAYOUT.y})`)
        this.update();

    }

    update() {
        let band = this.widthScale.bandwidth();
        let diff = (band - StackWidth) / 2;

        let group = this.SVG.select('g._container').selectAll('g._item').data(this.DATA as any[], d => d.data[this.props.labelField]);

        let enter = group.enter().append('g')
            .attr('transform', `translate(-220,0)`);
        enter.merge(group.select('g._item'))
            .attr('class', (d, i) => this.itemClass(d, i))
            .transition()
            .duration(this.DURATION)
            .attr('transform', (d, i) => `translate(${band * i},0)`)

        enter.append("rect")
            .attr('x', diff)
            .attr('y', this.LAYOUT.h)
            .attr('width', StackWidth)
            .attr('height', 0)
            .merge(group.select('rect'))
            .transition()
            .duration(this.DURATION)
            .attr('x', diff)
            .attr('y', d => this.heightScale(d[1]))
            .attr('width', StackWidth)
            .attr('height', d => this.heightScale(d[0]) - this.heightScale(d[1]))

        enter.append('circle')
            .attr('cx', diff + StackWidth / 2)
            .attr('cy', this.LAYOUT.h)
            .attr('r', CircleRadius)
            .merge(group.select('circle'))
            .transition()
            .duration(this.DURATION)
            .attr('cx', diff + StackWidth / 2)
            .attr('cy', d => this.heightScale(d[1]));

        enter.on('mouseover', d => {
            if (_.has(this.props, 'tip')) {
                ToolTip.show(this.props.tip(d.data));
            } else {
                ToolTip.show(`<h2>${this.FormatLabel(d.data[this.props.labelField])} : <small class="vapfont">${this.FormatValue(d.data[this.props.valueField])}</small></h2>`);
            }
        }).on('mouseout', d => {
            ToolTip.hide();
        })
        if (this.props.onClick) {
            enter.on('click', d => { console.log(d); this.props.onClick(d.data) });
        }

        this.SVG.select('g._x_axis').call(d3.axisBottom(this.widthScale).tickSize(1).tickFormat(e => this.FormatLabel(e)));
        this.SVG.select('g._y_axis').call(d3.axisLeft(this.heightScale).ticks(3).tickSize(1).tickFormat(e => this.FormatValue(e)));
        this.SVG.select('g._axis_line').call(d3.axisLeft(this.heightScale).ticks(3).tickSize(-this.LAYOUT.w).tickFormat(() => ''));
        group.exit().remove();
    }

}