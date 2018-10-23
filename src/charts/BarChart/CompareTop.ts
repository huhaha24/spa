import * as d3 from 'd3';
import D3Chart from '../D3Chart';
import { CompareOpts } from './BarOptions';
import { ToolTip, DefUtil, Format } from '../common'

import * as _ from 'lodash';
var CONFIG = {
    left: 10,
    right: 10
}


export default class extends D3Chart<CompareOpts> {
    __ClassName = '_vc_bar_top3';
    min = 0;
    max = 0;
    maxCount = 5;
    itemHeight = 40;
    formatTransition = null;
    widthScale = null;
    W = 0;

    init() {
        if (_.has(this.props, 'maxCount')) this.maxCount = this.props.maxCount;
        this.formatTransition = Format.buildTransition(this.props.format);
    }

    //获取极值
    private _getPeak() {
        let data = this.props.data;
        let lab = this.props.valueField;
        function getValue(list, label) {
            if (!list) {
                return 0;
            }
            return list[label];
        }
        var max = [getValue(_.maxBy(data[0], lab[0]), lab[0]), getValue(_.maxBy(data[1], lab[1]), lab[1])];
        var min = [getValue(_.minBy(data[0], lab[0]), lab[0]), getValue(_.minBy(data[1], lab[1]), lab[1])];
        return [_.min(min), _.max(max)];
    }

    sort() {
        this.W = this.WIDTH - CONFIG.left - CONFIG.right - 12;
        if (_.isArray(this.props.data) && this.props.data.length > 0) {
            // @ts-ignore
            [this.min, this.max] = this._getPeak();
            if ([this.min, this.max] != [0, 0]) {
                this.widthScale = d3.scaleLinear().domain([this.min, this.max]).range([0.15 * this.W, 0.45 * this.W]);
            } else {
                this.widthScale = null;
            }
            this.DATA = _.zip(this.props.data[0].slice(0, this.maxCount), this.props.data[1].slice(0, this.maxCount));
        }
    }

    // resize() {
    //     var group = this.SVG.selectAll('g._item');
    //     // @ts-ignore
    //     [this.min, this.max] = d3.extent(this.DATA, d => d[this.props.valueField]);
    //     this.itemHeight = this.HEIGHT / this.DATA.length;
    //     this.W = this.WIDTH - CONFIG.left - CONFIG.right - 12;
    //     this.widthScale = d3.scaleLinear().domain([this.min, this.max]).range([0.4 * this.W, 0.95 * this.W]);
    //     this.SVG.attr('height', this.HEIGHT);
    //     group.attr('transform', (d, i) => `translate(0,${this.itemHeight * i})`)
    //     group.select('text._index').attr('y', this.itemHeight / 2 - 2);
    //     group.select('rect._bkg').attr('y', this.itemHeight / 2);
    //     group.select('rect._content').attr('y', this.itemHeight / 2 + 2);
    //     group.select('text._label').attr('y', this.itemHeight / 2 - 8);
    //     group.select('text._value').attr('y', this.itemHeight / 2 - 8)
    //         .attr('x', 20 + this.W);
    // }

    private _append(enter) {
        var group = enter.append('g')
            .attr('class', (d, i) => this.itemClass(d, i));

        group.attr('transform', (d, i) => `translate(0,${this.HEIGHT * 1.2})`)
            .transition()
            .duration(this.DURATION)
            .attr('transform', (d, i) => `translate(0,${this.itemHeight * (i + 1)})`);

        group.append('text')
            .attr('class', '_label1')
            .text(d => d[1][this.props.labelField[1]])
            .attr('text-anchor', "start")
            .attr('x', (this.WIDTH / 2) + 5)
            .attr('y', this.itemHeight / 2 - 8);

        group.append('text')
            .attr('class', '_label2')
            .text(d => d[0][this.props.labelField[0]])
            .attr('text-anchor', "end")
            .attr('x', (this.WIDTH / 2) - 5)
            .attr('y', this.itemHeight / 2 - 8);

        let groupText = group.append('text')
            .attr('class', '_value')
            .text(d => this.FormatValue(d[1][this.props.valueField[1]]))
            .attr('x', this.WIDTH / 2)
            .attr('y', this.itemHeight / 2 - 8);

        let groupText2 = group.append('text')
            .attr('class', '_value')
            .text(d => this.FormatValue(d[0][this.props.valueField[0]]))
            .attr('x', this.WIDTH / 2)
            .attr('y', this.itemHeight / 2 - 8);

        groupText.transition()
            .duration(this.DURATION)
            .attr('x', this.W);

        groupText2.transition()
            .duration(this.DURATION)
            .attr('x', CONFIG.right + 60);

        let groupRect = group.append('rect')
            .attr('class', (d, i) => `_content _content_${i + 1}`)
            .attr('width', 0)
            .attr('height', 8)
            .attr('rx', 4)
            .attr('ry', 4)
            .attr('x', this.WIDTH / 2)
            .attr('y', this.itemHeight / 2 + 2);

        let groupRect2 = group.append('rect')
            .attr('class', (d, i) => `_content _content_${i + 1}`)
            .attr('width', 0)
            .attr('height', 8)
            .attr('rx', 4)
            .attr('ry', 4)
            .attr('x', this.WIDTH / 2)
            .attr('y', this.itemHeight / 2 + 2);

        groupRect.transition()
            .duration(this.DURATION)
            .attr('width', d => this.widthScale ? this.widthScale(d[1][this.props.valueField[1]]) : 0);

        groupRect2.transition()
            .duration(this.DURATION)
            .attr('x', d => (this.WIDTH / 2) - this.widthScale(d[1][this.props.valueField[1]]))
            .attr('width', d => this.widthScale ? this.widthScale(d[1][this.props.valueField[1]]) : 0);

        group.on('mouseover', d => {
            ToolTip.show(this.props.tip(d));
        }).on('mouseout', d => {
            ToolTip.hide();
        })
        if (this.props.onClick) {
            group.on('click', d => this.props.onClick(d));
        }
    }

    build() {
        this.SVG.append('defs').html(
            [
                DefUtil.BuildShadow(),
                DefUtil.BuildMutiBarImage()
            ].join('')
        );
        this.SVG.append("text")
            .attr("class", "_title")
            .attr("x", this.WIDTH / 4)
            .attr("y", this.itemHeight / 2)
            .attr("text-anchor", "middle")
            .attr("fill", "#df7390")
            .text(this.props.titles[0]);
        this.SVG.append("text")
            .attr("class", "_title")
            .attr("x", this.WIDTH * 3 / 4)
            .attr("y", this.itemHeight / 2)
            .attr("text-anchor", "middle")
            .attr("fill", "#df7390")
            .text(this.props.titles[1]);

        var group = this.SVG.selectAll('g._item')
            .data(this.DATA ? this.DATA : [])
            .enter();

        this._append(group);
    }

    _update(group) {
        // group.transition().duration(this.DURATION)
        //     .attr('transform', (d, i) => `translate(0,${this.itemHeight * i})`)
        // group.select('._index')
        //     .text((d, i) => (i + 1) + '.')
        // group.select('._value')
        //     .text(d => this.FormatValue(d[this.props.valueField]))
        // // 改变中条颜色
        // group.select('._content')
        //     .classed('_content_1', (d, i) => i == 0)
        //     .classed('_content_2', (d, i) => i == 1)
        //     .classed('_content_3', (d, i) => i == 2)
        //     .transition()
        //     .duration(this.DURATION)
        //     .attr('width', d => this.widthScale(d[this.props.valueField]));

        // group.select('text._index').attr('y', this.itemHeight / 2 - 2);
        // group.select('rect._bkg').attr('y', this.itemHeight / 2);
        // group.select('rect._content').attr('y', this.itemHeight / 2 + 2);
        // group.select('text._label').attr('y', this.itemHeight / 2 - 8);
        // group.select('text._value').attr('y', this.itemHeight / 2 - 8)
    }

    update() {
        this.itemHeight = this.HEIGHT / this.DATA.length;
        var group = this.SVG.selectAll('g._item')
            .data(this.DATA);
        let enter = group.enter();
        this._append(enter);
        this._update(group);
        group.exit().transition().duration(this.DURATION)
            .attr('transform', 'translate(20,-100)')
            .remove();
    }

}