import * as d3 from 'd3';
import D3Chart from '../D3Chart';
import * as _ from 'lodash';
import {  createNodes, RadarOpts } from './RadarOptions';
import { ToolTip } from '../common'



export default class extends D3Chart<RadarOpts>{

    __ClassName = '_vc_radar';



    levels = 4;
    margin = 36;
    radius = 0;

    init() {
        if (_.has(this.props, 'levels')) this.levels = this.props.levels;
    }


    build() {
        var group = this.SVG.append('g').attr('class', '_container');
        group.selectAll("._levels")
            .data(d3.range(1, this.levels + 1).reverse())
            .enter()
            .append("circle")
            .attr("class", "_levels");

        //背景上的指示线
        group.selectAll("line._ticks")
            .data(this.props.labelFields)
            .enter()
            .append('line')
            .attr('class', '_ticks')
            .attr('x1', 0)
            .attr('y1', 0)
            .attr('x2', 0)
            .attr('y2', 0);


        //Label
        var axis = this.SVG.selectAll("._label_group")
            .data(this.props.labelTexts)
            .enter()
            .append("g")
            .attr("class", '_label_group')
            .attr("transform", "translate(" + (this.WIDTH / 2) + "," + (this.HEIGHT / 2) + ")");
        axis.append("text")
            .attr("class", "_label")
            // .attr("dy", "0.35em")
            .attr("x", 0)
            .attr("y", 0)
            .text(d => d)
        // .call(wrap);


        this.update();
    }

    update() {

        var group = this.SVG.select('g._container').attr("transform", "translate(" + (this.WIDTH / 2) + "," + (this.HEIGHT / 2) + ")");
        // 半径及角度
        var angleSlice = Math.PI * 2 / this.props.labelFields.length;
        let radius = Math.min(this.WIDTH / 2, this.HEIGHT / 2) - this.margin;
        let nodes = createNodes(this.props.labelFields.length, radius);

        //Scale for the radius
        var rScale = d3.scaleLinear()
            .domain([0, this.props.maxValue])
            .range([0, radius])

        group.selectAll('circle._levels')
            .transition()
            .duration(this.DURATION)
            .attr("r", (d: number) => radius / this.levels * d);
        //背景上的指示线
        group.selectAll("line._ticks")
            .data(nodes)
            .transition()
            .duration(this.DURATION)
            .attr('x2', d => d.x)
            .attr('y2', d => d.y)
        //Label
        this.SVG.selectAll("._label_group")
            .attr("transform", "translate(" + (this.WIDTH / 2) + "," + (this.HEIGHT / 2) + ")")
            .select('text._label')
            .transition()
            .duration(this.DURATION)
            .attr("x", (d, i) => { return rScale(this.props.maxValue * 1) * Math.cos(angleSlice * i - Math.PI / 2); })
            .attr("y", (d, i) => { return rScale(this.props.maxValue * 1) * Math.sin(angleSlice * i - Math.PI / 2); });


        //区域连线
        var radarLine = d3.lineRadial()
            .curve(d3.curveLinearClosed)
            // @ts-ignore
            .radius((d, i) => { return rScale(d) })
            .angle((d, i) => { return i * angleSlice; });
        group.selectAll("._item").remove();
        var blobWrapper = group.selectAll("._item")
            .data(this.DATA)
            .enter()
            .append("g")
            .attr("class", (d, i) => this.itemClass(d, i));


        blobWrapper
            .append("path")
            .attr("class", "radarArea")
            .attr("d", d => { let p = radarLine(this.props.labelFields.map(key => d[key])); return p; })
            .attr("transform", "scale(0)")
            .transition()
            .duration(this.DURATION)
            .attr("transform", "scale(1)")

        let circleGroup = blobWrapper.append('g');

        circleGroup.selectAll('circle._point')
            .data(d => this.props.labelFields.map(key => { return { key, value: d[key] } }))
            .enter()
            .append('circle')
            .attr('class', '_point')
            .attr("cx", 0)
            .attr("cy", 0)
            .transition()
            .duration(this.DURATION)
            .attr("cx", (d: any, i) => rScale(d.value) * Math.cos(angleSlice * i - Math.PI / 2))
            .attr("cy", (d: any, i) => rScale(d.value) * Math.sin(angleSlice * i - Math.PI / 2));

        blobWrapper.on('mouseover', (d, i) => {
            if (this.props.tip) {
                ToolTip.show(this.props.tip(d, i));
                return;
            }
            let html = [];
            for (let i = 0; i < this.props.labelFields.length; i++) {
                html.push(`<p>${this.props.labelTexts[i]} : ${d[this.props.labelFields[i]]}</p>`);
            }
            ToolTip.show(html.join(''));
        }).on('mouseout', () => {
            ToolTip.hide();
        });
    }
}

