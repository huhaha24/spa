import * as _ from 'lodash';
import * as d3 from 'd3';
import D3Chart from '../D3Chart';
import { ChartOpts } from '../interface';
import { ToolTip } from '../common';
import cloud from './cloud';
import Ball from './Ball';

// https://github.com/jasondavies/d3-cloud
export interface CloudOpts extends ChartOpts {
    labelField: string;
    valueField: string;
}

const level = v => v * 2 + _.sample([-1, 0, 1]);


export default class extends D3Chart<CloudOpts>{

    static Ball: typeof Ball = Ball;

    __ClassName = '_vc_wordcloud';

    sizeScale = null;
    levelScale = null;
    textGroup = null;


    sort() {
        this.DATA = this.props.data;
        let [min, max] = d3.extent(this.DATA, d => d[this.props.valueField]);
        this.sizeScale = d3.scaleQuantize().domain([parseInt(min), parseInt(max)]).range([14, 18, 24]);
        this.levelScale = d3.scaleQuantize().domain([parseInt(min), parseInt(max)]).range([1, 2, 3, 4, 5]);
    }

    words(words) {
        this.textGroup.selectAll("text").data([]).exit().remove();

        let txts = this.textGroup
            .selectAll("text")
            .data(words)
            .enter()
            .append("text");

        txts.attr('class', d => `_item _item_${level(this.levelScale(d[this.props.valueField]))} ${_.has(this.props, 'onClick') ? '_item_hover' : ''}`)
            .style("font-size", d => this.sizeScale(d[this.props.valueField]))

            // .style("font-family", "Impact")
            // .attr("text-anchor", "middle")
            // .style("fill", function (d, i) {
            //     if (COLOR[d.index] == null) {
            //         return THEME.lines[5];
            //     }
            //     return THEME.lines[d.index];
            // })
            // .attr("text-anchor", "middle")
            .attr("transform", (d: any) => `translate(${d.x}, ${d.y}) rotate(0)`)
            .text(d => d[this.props.labelField]);

        if (_.has(this.props, 'tip')) {
            txts.on('mouseover', (d, i) => {
                ToolTip.show(this.props.tip(d, i));
                return;
            }).on('mouseout', () => {
                ToolTip.hide();
            });
        }

        if (_.has(this.props, 'onClick')) {
            txts.on('click', d => this.props.onClick(d));
        }
    }


    build() {
        this.textGroup = this.SVG.append("g")
            .attr("transform", "translate(" + this.WIDTH / 2 + "," + this.HEIGHT / 2 + ")");
        var layout = cloud()
            .size([this.WIDTH * 0.9, this.HEIGHT * 0.9])
            .words(this.DATA)
            .padding(5)
            .text(d => d[this.props.labelField])
            .rotate(function () { return ~~(Math.random() * 2) * 90; })
            .fontSize(d => this.sizeScale(d[this.props.valueField]))
            .on("end", words => this.words(words));
        layout.start();
        layout.stop();
    }

    update() {
        var layout = cloud()
            .size([this.WIDTH * 0.9, this.HEIGHT * 0.9])
            .words(this.DATA)
            .padding(5)
            .text(d => d[this.props.labelField])
            .rotate(function () { return ~~(Math.random() * 2) * 90; })
            .fontSize(d => this.sizeScale(d[this.props.valueField]))
            .on("end", words => this.words(words));
        layout.start();
        layout.stop();

    }
}