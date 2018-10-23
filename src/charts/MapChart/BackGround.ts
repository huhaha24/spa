import Content from './Content';
import * as topojson from 'topojson';
import * as d3 from 'd3';
export default class extends Content{

    ShadowLeft = 5;
    ShadowTop = 5;
    

    resize(group){
        var path = d3.geoPath().projection(this.PROJECTION);
        group.selectAll('path')
            .attr('d', path);
    }

    setData(group,data){
        var topology = topojson.topology({ map: data });
        var path = d3.geoPath().projection(this.PROJECTION);
        
        group.append("path")
            .datum(topojson.merge(topology, []))
            .attr('d', path)
            .style('transform', ` translate(${this.ShadowLeft}px,${this.ShadowTop}px)`);
    }
}