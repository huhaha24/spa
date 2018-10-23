import Content from './Content';
import ToolTip from '../common/ToolTip';
import * as d3 from 'd3';
import * as _ from 'lodash';

export default class extends Content {
    CurrentArea = '';


    resize(group) {

        var path = d3.geoPath().projection(this.PROJECTION);

        group.selectAll('g._item path')
            .attr('d', path);
        group.selectAll('g._item text')
            .attr('x', (d: any) => {
                var point = this.PROJECTION(this.BUILDER.getPoint(d.properties.name));
                return point[0];
            })
            .attr('y', (d: any) => {
                var point = this.PROJECTION(this.BUILDER.getPoint(d.properties.name));
                return point[1];
            });
        group.selectAll('g._item circle')
            .attr('cx', (d: any) => this.PROJECTION(this.BUILDER.getPoint(d.properties.name))[0])
            .attr('cy', (d: any) => this.PROJECTION(this.BUILDER.getPoint(d.properties.name))[1] - 12);

        group.selectAll('g._ext')
            .attr('style', d => {
                var tran = this.PROJECTION(d.pos);
                return `transform:translate(${tran[0]}px,${tran[1]}px)`
            });

    }

    setData(group, data) {
        let AREAS = group.selectAll('g._item')
            .data(data)
            .enter()
            .append('g')
            .attr('class', '_item')
            .attr('id', (d: any) => 'area-' + d.properties.id);
        var path = d3.geoPath().projection(this.PROJECTION);
        group.selectAll('g._item_area_selected').classed('_item_area_selected', false).select('circle').remove();
        AREAS.append('path')
            .attr('d', path);
        AREAS.append('text')
            .attr('x', (d: any) => {
                var point = this.PROJECTION(this.BUILDER.getPoint(d.properties.name));
                return point[0];
            })
            .attr('y', (d: any) => {
                var point = this.PROJECTION(this.BUILDER.getPoint(d.properties.name));
                return point[1];
            })
            .text((d: any) => this.props.nameFormat ? this.props.nameFormat(d.properties.name) : d.properties.name);

        if (_.isFunction(this.props.onSelected)) {
            AREAS.on('click', (d: any) => {
                var selected = group.select('#area-' + d.properties.id).classed('_item_area_selected');
                if (selected) {
                    group.selectAll('g._item_area_selected').classed('_item_area_selected', false).select('circle').remove();
                    this.CurrentArea = '';
                } else {
                    group.selectAll('g._item_area_selected').classed('_item_area_selected', false).select('circle').remove();
                    this.CurrentArea = d.properties.name;
                    var areaContainer = group.select('#area-' + d.properties.id).classed('_item_area_selected', true);
                    areaContainer.append('circle')
                        .attr('class', '_area_select_point')
                        .attr('cx', (d: any) => this.PROJECTION(this.BUILDER.getPoint(d.properties.name))[0])
                        .attr('cy', (d: any) => this.PROJECTION(this.BUILDER.getPoint(d.properties.name))[1] - 12)
                        .attr('r', 10)
                        .append('animate')
                        .attr('attributeName', 'r')
                        .attr('attributeType', 'xml')
                        .attr('form', 10)
                        .attr('to', 25)
                        .attr('begin', '0s')
                        .attr('dur', '1s')
                        .attr('repeatCount', 'indefinite');
                }
                this.props.onSelected.call(null, this.CurrentArea);
            });
        }
        if (_.isFunction(this.props.tip)) {
            AREAS.on('mouseover', d => ToolTip.show(this.props.tip(d.properties.name)))
                .on('mouseout', () => ToolTip.hide())
        }




        if (!_.isArray(this.props.extIcons) || this.props.extIcons.length == 0) {
            return;
        }
        let exts = group.selectAll('g._ext')
            .data(this.props.extIcons)
            .enter()
            .append('g')
            .attr('class', (d, i) => `_ext _ext_${i} ${d.className ? d.className : ''}`)
            .attr('style', d => {
                var tran = this.PROJECTION(d.pos);
                return `transform:translate(${tran[0]}px,${tran[1]}px)`
            })
            .attr('id', d => `area-${d.name}`)

        exts.append('path')
            .attr('d', d => d.icon)
        exts.append('text')
            .text(d => this.props.nameFormat ? this.props.nameFormat(d.name) : d.name)
            .attr('x', 12)
            .attr('y', 4)

        if (_.isFunction(this.props.tip)) {
            exts.on('mouseover', d => ToolTip.show(this.props.tip(d.name)))
                .on('mouseout', () => ToolTip.hide())
        }



        if (_.isFunction(this.props.onSelected)) {
            exts.on('click', (d: any) => {
                var selected = group.select('#area-' + d.name).classed('_item_area_selected');
                if (selected) {
                    group.selectAll('g._item_area_selected').classed('_item_area_selected', false).select('circle').remove();
                    this.CurrentArea = '';
                } else {
                    group.selectAll('g._item_area_selected').classed('_item_area_selected', false).select('circle').remove();
                    this.CurrentArea = d.name;
                    var areaContainer = group.select('#area-' + d.name).classed('_item_area_selected', true);
                    areaContainer.append('circle')
                        .attr('class', '_area_select_point')
                        .attr('cx', 0)
                        .attr('cy', 0)
                        .attr('r', 10)
                        .append('animate')
                        .attr('attributeName', 'r')
                        .attr('attributeType', 'xml')
                        .attr('form', 10)
                        .attr('to', 25)
                        .attr('begin', '0s')
                        .attr('dur', '1s')
                        .attr('repeatCount', 'indefinite');
                }
                this.props.onSelected.call(null, this.CurrentArea);
            });

        }

    }
}