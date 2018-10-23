import * as d3 from 'd3';
import { Format } from 'vap/utils';
import * as _ from 'lodash';

const marginTop = 12;
const height = 40;

export default class {

    width: number = 200;
    group: d3.Selection<any, any, any, any>;
    pos: 1 | 2 | 3 | 4 = 1;
    duration: number = 1000;
    onSelect: Function = null;
    data: { key: string, label: string, value: number, index: number }[] = [];

    SelectKeys: string[] = null;
    AllKey = [];
    AllKeys = {};


    constructor(group: d3.Selection<any, any, any, any>, pos: 1 | 2 | 3 | 4 = 1, onSelect: Function = null, width: number = 200, duration: number = 1000, ) {
        this.group = group;
        this.width = width;
        this.pos = pos;
        this.duration = duration;
        this.onSelect = onSelect;
    }

    getIndex(key) {
        return _.has(this.AllKeys, key) ? this.AllKeys[key] : 'x';
    }

    //更新Legend
    update(data) {
        var sum = _.sumBy(data, 'value');
        sum = sum === 0 ? 0.1 : sum;
        if (this.SelectKeys === null) {
            this.AllKey = [];
            this.SelectKeys = data.map((item, i) => {
                this.AllKeys[item.key] = i;
                this.AllKey.push(item.key);
                return item.key;
            });
            data.map(item => {
                item.index = _.has(this.AllKeys, item.key) ? this.AllKeys[item.key] : 'x';
            })
        }
        var processWidth = this.width - 72;
        var legends = _.orderBy(data, 'value', 'desc');
        let group = this.group.selectAll('g._legend').data(legends, d => d['key']);

        let groupAdd = group.enter()
            .append('g')
            .attr('class', d => `_legend _legend_${d.index}`)
            .classed('_legend_hover', this.onSelect !== undefined);

        switch (this.pos) {
            case 1:
                groupAdd.attr("transform", (d, i) => `translate(0,-200)`);
                break;
            case 2:
                groupAdd.attr("transform", (d, i) => `translate(${-this.width - 200},${i * (height + marginTop)})`);
                break;
            case 3:
                groupAdd.attr("transform", (d, i) => `translate(0,${data.length * (height + marginTop) + 200})`);
                break;
            case 4:
                groupAdd.attr("transform", (d, i) => `translate(${this.width + 250},${i * (height + marginTop)})`);
                break;
        }

        groupAdd.transition().duration(this.duration)
            .attr("transform", (d, i) => `translate(0,${(height + marginTop) * i})`);

        group.transition().duration(this.duration)
            .attr("transform", (d, i) => `translate(0,${(height + marginTop) * i})`);

        groupAdd.append('rect')
            .attr('class', '_legend_round')
            .attr('x', 0)
            .attr('y', 0)
            .attr('width', this.width)
            .attr('height', height);
        groupAdd.append('rect')
            .attr('class', '_legend_process_bkg')
            .attr('x', 12)
            .attr('y', 28)
            .attr('width', processWidth)
            .attr('height', 8);
        groupAdd.append('text')
            .attr('class', '_legend_status')
            .attr('x', 12)
            .attr('y', 20)
            .html('&#xE6C5');
        groupAdd.append('text')
            .attr('class', '_legend_title')
            .attr('x', 30)
            .attr('y', 18)
            .text(d => d.label);
        let process = groupAdd.append('rect')
            .attr('class', '_legend_process_val')
            .attr('x', 12)
            .attr('y', 28)
            .attr('width', 0)
            .attr('height', 8);
        groupAdd.append('text')
            .attr('class', '_legend_sum')
            .attr('x', this.width - 12)
            .attr('y', 18)
            .text(d => d.value);
        groupAdd.append('text')
            .attr('class', '_legend_percent')
            .attr('x', this.width - 12)
            .attr('y', 36)
            //.text(d => Format.formatDecimal(d.value * 100 / sum) + '%');
            .text('待定')

        if (this.onSelect) {
            groupAdd.on('click', item => {
                let index = _.indexOf(this.SelectKeys, item.key);
                if (index >= 0) {
                    _.remove(this.SelectKeys, i => i == item.key);
                } else {
                    this.SelectKeys.push(item.key);
                }
                this.SelectKeys = _.sortBy(this.SelectKeys, (a, b) => _.indexOf(this.AllKey, a) - _.indexOf(this.AllKey, b))
                var legend = this.group.selectAll('g._legend');
                legend.classed('_legend_discard', d => this.SelectKeys.indexOf(d['key']) < 0);
                legend.select('text._legend_status').html(d => this.SelectKeys.indexOf(d['key']) < 0 ? '&#xE621' : '&#xE6C5');
                this.onSelect(_.concat([], this.SelectKeys));
            })
        }
        process.transition().duration(this.duration).attr('width', d => d.value / sum * processWidth);
        group.select('rect._legend_process_val').transition().duration(this.duration).attr('width', d => d.value / sum * processWidth);
        group.select('text._legend_sum').text(d => d.value);
        group.select('text._legend_percent').text(d => Format.formatDecimal(d.value * 100 / sum) + '%');
        group.exit().remove();

    }
}