import Content from './Content';
import * as d3 from 'd3';
import * as _ from 'lodash';
import { Format } from 'vap/utils';

const LegendHeight = 52;
const ItemHeight = 40;
const LegendWidth = 248;
const ProcessWidth = LegendWidth - 72;
const PADDING = 12;

/**
 * 地图增色组件
*/

export default class extends Content {
    group = null;
    checked = [];
    data = [];
    legend = false;


    resize() {
        if (this.group) {
            var [width, height] = this.BUILDER.getCoord();
            //@ts-ignore
            let pos = this.props.colors.pos || 'bottom-left';
            //@ts-ignore
            let [labelFields, valueFields] = [this.props.colors.labelFields, this.props.colors.valueFields]
            // var legend
            let start = PADDING;
            if (pos == 'bottom-left' || pos == 'top-left') {
                if (pos == 'bottom-left') {
                    start = height - PADDING - LegendHeight * labelFields.length + (LegendHeight - ItemHeight);
                }
                this.group.attr('transform', (d, i) => `translate(${PADDING},${start + i * LegendHeight})`)
            } else {
                let x = width - LegendWidth - PADDING;

                let start = PADDING;
                if (pos == 'bottom-right') {
                    start = height - PADDING - LegendHeight * labelFields.length + (LegendHeight - ItemHeight);
                }
                this.group.attr('transform', (d, i) => `translate(${x},${start + i * LegendHeight})`)
            }
        }
    }

    updateLegend() {
        // // this.BUILDER
        // let legend = group.append('g').attr('class', '_legends');
        // //@ts-ignore
        // let pos = this.props.colors.pos || 'bottom-left';
        // var [width, height] = this.BUILDER.getCoord();
        //@ts-ignore
        let [labelFields, valueFields] = [this.props.colors.labelFields, this.props.colors.valueFields]
        // //@ts-ignore
        let sum = valueFields.map(field => {
            // @ts-ignore
            return _.sumBy(this.data, field)
        });
        let all = _.sum(sum);
        all = all == 0 ? 0.01 : all;
        this.group.select('text._legend_sum').text((d, i) => {
            return sum[i];
        });
        this.group.select('text._legend_percent').text((d, i) => {
            return Format.formatDecimal(sum[i] * 100 / all) + '%';
        });

        this.group.select('rect._legend_process_val')
            .attr('width', 0)
            .transition()
            .duration(2000)
            .attr('width', (d, i) => {
                return ProcessWidth * sum[i] / all;
            });

    }


    buildLegend(group) {
        this.legend = true;
        let legend = group.append('g').attr('class', '_legends');
        //@ts-ignore
        let pos = this.props.colors.pos || 'bottom-left';
        var [width, height] = this.BUILDER.getCoord();
        //@ts-ignore
        let [labelFields, valueFields] = [this.props.colors.labelFields, this.props.colors.valueFields]
        this.group = legend.selectAll('g._legend').data(labelFields).enter().append('g').attr('class', '_legend _legend_hover');
        // var legend
        if (pos == 'bottom-left' || pos == 'top-left') {
            let start = PADDING;
            if (pos == 'bottom-left') {
                start = height - PADDING - LegendHeight * labelFields.length + (LegendHeight - ItemHeight);
            }
            this.group.attr('transform', (d, i) => `translate(${PADDING},${start + i * LegendHeight})`)
        } else {
            let x = width - LegendWidth - PADDING;
            let start = PADDING;
            if (pos == 'bottom-right') {
                start = height - PADDING - LegendHeight * labelFields.length + (LegendHeight - ItemHeight);
            }
            this.group.attr('transform', (d, i) => `translate(${x},${start + i * LegendHeight})`)
        }

        this.group.append('rect')
            .attr('class', '_legend_round')
            .attr('x', 0)
            .attr('y', 0)
            .attr('width', LegendWidth)
            .attr('height', ItemHeight)
            ;
        this.group.append('rect')
            .attr('class', '_legend_process_bkg')
            .attr('x', 12)
            .attr('y', 28)
            .attr('width', ProcessWidth)
            .attr('height', 8)
            ;
        this.group.append('rect')
            .attr('class', '_legend_process_val')
            .attr('x', 12)
            .attr('y', 28)
            .attr('width', 0)
            .attr('height', 8)
            ;
        this.group.append('text')
            .attr('class', '_legend_status')
            .attr('x', 12)
            .attr('y', 20)
            .html('&#xE6C5');

        this.group.append('text')
            .attr('class', '_legend_title')
            .attr('x', 30)
            .attr('y', 18)
            .text(d => d);
        this.group.append('text')
            .attr('class', '_legend_sum')
            .attr('x', LegendWidth - 12)
            .attr('y', 18)
            .text('0');
        this.group.append('text')
            .attr('class', '_legend_percent')
            .attr('x', LegendWidth - 12)
            .attr('y', 36)
            .text('0%');
        this.updateLegend();
        this.group.on('click', (d, i) => {
            let index = _.indexOf(this.checked, valueFields[i]);
            if (index >= 0) {
                _.remove(this.checked, key => key == valueFields[i]);
            } else {
                this.checked.push(valueFields[i]);
            }
            this.group.classed('_discard', (d, i) => {
                return _.indexOf(this.checked, valueFields[i]) < 0;
            });
            this.group.select('text._legend_status').html((d, i) => {
                return _.indexOf(this.checked, valueFields[i]) < 0 ? '&#xE621' : '&#xE6C5';
            });
            this.data.map(item => {
                let sum = 0;
                this.checked.map(field => sum += item[field]);
                item.__sum = sum;
            })

            this.changeColor(group, '__sum')

        });
    }

    changeColor(group, label) {
        let extent = d3.extent(this.data, item => item[label]);
        extent[0] = extent[0] / 2;
        extent[1] = extent[1] == 0 ? 0.01 : extent[1]
        // @ts-ignore
        var scaleClass = d3.scaleQuantile().domain(extent).range(['_vc_map_c0', '_vc_map_c1', '_vc_map_c2', '_vc_map_c3', '_vc_map_c4']);
        group.selectAll('g._item path').attr('class', d => {
            let tmp = _.find(this.data, { name: d.properties.name });
            if (tmp) {
                let c = scaleClass(tmp[label]);
                return c;
            }
            return ''
        })
    }


    setData(group, data) {
        var areaGroup = group.select('g._group_area');
        if (_.isArray(data)) {
            this.data = data;
            this.changeColor(areaGroup, 'value');
        } else {
            this.data = data.data;
            this.checked = data.valueFields;
            this.data.map(item => {
                let sum = 0;
                this.checked.map(field => sum += item[field]);
                item.__sum = sum;
            })
            if (!this.legend) {
                this.buildLegend(group);
            } else {
                this.updateLegend();
            }
            this.changeColor(group, '__sum')
        }

    }
}