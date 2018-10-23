import * as d3 from 'd3';
import * as _ from 'lodash';

import Multi from './Multi';
import MultiInline from './MultiInline';
import Top from './Top';
import Top2 from './Top2';
import CompareTop from './CompareTop';
import Papaw from './Papaw';
import MutiHorzontal from './MutliHorzontal';

import D3Chart from '../D3Chart';
import { ToolTip, DefUtil } from '../common'
import { HorizontalOpts } from './BarOptions';


const BarWidth = 20;
/**
 * 标准条形图(横向)
*/
export default class extends D3Chart<HorizontalOpts> {
    /**
     * 纵向条形图，样式一：两行展示
    */
   static Multi: typeof Multi = Multi;
   /**
    * 纵向条形图，样式二：Label 与条形图在一行展示 
   */
   static MultiInline: typeof MultiInline = MultiInline;
   /**
    * Top排行榜：纯色
   */
   static Top: typeof Top = Top;
   /**
    * Top排行榜：条纹
   */
   static Top2: typeof Top2 = Top2;
   /**
    * 两侧条形图
   */
   static CompareTop: typeof CompareTop = CompareTop;
   /**
    * 横向条形图：样式二：类似汽泡
    */
   static Papaw: typeof Papaw = Papaw;
   /**
    * 横向条形图：样式三：多断
    */
   static MutiHorzontal: typeof MutiHorzontal = MutiHorzontal;


    __ClassName = '_vc_bar';

    __Grid = {
        left: 0,
        right: 12,
        top: 32,
        bottom: 12,
    }

    labelWidth = 60;

    xAixs = null;
    yAixs = null;
    widthScale = null;
    heightScale = null;


    init() {
        if (_.has(this.props, 'labelWidth')) this.labelWidth = this.props.labelWidth;
    }


    sort() {
        this.DATA = _.orderBy(this.props.data, d => parseFloat(d[this.props.valueField]), 'desc');
        if (this.DATA.length > this.MAXCOUNT) {
            this.DATA.length = this.MAXCOUNT;
        }
        var [min, max] = this.extent(this.DATA, d => d[this.props.valueField]);
        this.widthScale = d3.scaleBand().rangeRound([0, this.LAYOUT.w - this.labelWidth]);
        this.heightScale = d3.scaleLinear().rangeRound([this.LAYOUT.h, 0]);

        this.widthScale.domain(this.DATA.map(item => item[this.props.labelField]));
        this.heightScale.domain([0, max]).nice();
        this.DATA = d3.stack().keys([this.props.valueField])(this.DATA)[0];
    }

    build() {
        this.SVG.append('defs').html(DefUtil.BuildBarGrinder());
        this.SVG.append('g').attr('class', '_container');
        let x = this.SVG.append("g").attr("class", "_x_axis").attr("transform", `translate(${this.LAYOUT.x + this.labelWidth},${this.LAYOUT.h + this.LAYOUT.y})`);
        if (_.has(this.props, 'xLabel')) {
            x.append('text')
                .attr('class', '_label')
                .text(this.props.xLabel)
                .attr('x', this.labelWidth + this.LAYOUT.x + this.LAYOUT.w - 40)
                .attr('y', 24);
        }

        let y = this.SVG.append("g").attr("class", "_y_axis").attr("transform", `translate(${this.LAYOUT.x + this.labelWidth},${this.LAYOUT.y})`);
        if (_.has(this.props, 'yLabel')) {
            y.append('text')
                .attr('class', '_label')
                .text(this.props.yLabel)
                .attr('x', 0)
                .attr('y', -12);
        }
        this.update();
    }


    update() {
        let band = this.widthScale.bandwidth();
        let width = band > BarWidth ? BarWidth : band;
        let diff = band > width ? (band - width) / 2 : 0;

        let group = this.SVG.select('g._container')
            .selectAll('g._item').data(this.DATA, d => d['data'][this.props.labelField]);
        var enter = group.enter().append('g')
            .attr('class', (d, i) => this.itemClass(d, i))
            .attr('transform', `translate(-220,${this.LAYOUT.y})`)
        enter.merge(group)
            .transition()
            .duration(this.DURATION)
            .attr('transform', (d, i) => `translate(${this.labelWidth + band * i},${this.LAYOUT.y})`)


        group.on('mouseover', (d: any) => {
            if (_.has(this.props, 'tip')) {
                ToolTip.show(this.props.tip(d.data));
            } else {
                ToolTip.show(`<h2>${this.FormatLabel(d.data[this.props.labelField])} : <small class="vapfont">${this.FormatValue(d.data[this.props.valueField])}</small></h2>`);
            }
        }).on('mouseout', d => {
            ToolTip.hide();
        })

        if (this.props.onClick) {
            group.on('click', (d: any) => { console.log(d); this.props.onClick(d.data) });
        }

        enter.append('rect')
            .attr("y", this.LAYOUT.h)
            .attr("height", 0)
            .merge(group.select('rect'))
            .attr("width", width)
            .attr("x", diff)
            .transition()
            .duration(this.DURATION)
            .attr('y', d => this.heightScale(d[1]))
            .attr('height', d => this.heightScale(d[0]) - this.heightScale(d[1]))

        this.SVG.select('g._x_axis').call(d3.axisBottom(this.widthScale).tickSize(1).tickFormat(e => this.FormatLabel(e)));
        this.SVG.select('g._y_axis').call(d3.axisLeft(this.heightScale).ticks(4).tickSize(1).tickFormat(e => this.FormatValue(e)));
        group.exit().remove();


    }

}