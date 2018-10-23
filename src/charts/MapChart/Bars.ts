import Content from './Content';
import * as _ from 'lodash';
import * as d3 from 'd3';
export default class extends Content {

    list = [];
    labelFields = ['value'];
    labelTexts = ['数量'];

    _append(enter) {
        var group = enter.append('g').attr('class', '_item');

        let count = this.labelFields.length;

        for (let i = 0; i < count; i++) {
            let field = this.labelFields[i];
            var range = d3.extent(this.props.bars, d => d[field]);
            const scale = d3.scaleLinear().domain(range).range([10, 200]);
            let left = i * 8;
            group.append('rect')
                .attr('class',`_rect _rect_${i}`)
                .attr('x', d => {
                    let point = this.PROJECTION(this.BUILDER.getPoint(d.name));
                    return point[0] - 4 + left;
                })
                .attr('y', d => {
                    let height = scale(d[field]);
                    let point = this.PROJECTION(this.BUILDER.getPoint(d.name));
                    return point[1] - 4 - height;
                })
                .attr('width', 8)
                .attr('width', 0)
                .transition()
                .duration(2000)
                .attr('height', d => scale(d[field]));

            // group.append('')
        }


        // this.BUILDER.getPoint('')

        // var scale = d3.scaleLinear().domain([_.minBy(AreaList,'count').count,_.maxBy(AreaList,'count').count]).range([10, 200]);
        // var stacks = group.selectAll('rect.area-counts').data(AreaList,function(d){return d.area;});

        // stacks.attr('fill',function(d,i){
        // 		var index = _.findIndex(AreaList,{area:d.area});
        // 		return COLORS[index];
        // 	})
        // 	.transition()
        // 	.duration(1000)
        // 	.attr('y', function(d) {
        // 		var point = projection(builder.getPoint(d.area));
        // 		var index = _.findIndex(AreaList,{area:d.area});
        // 		return point[1] - 6 - scale(AreaList[index].count) ;
        // 	})
        // 	.attr('height', function(d) {
        // 		return scale(d.count);
        // 	});
        // stacks.enter()
        // 	.append('rect')
        // 	.attr('class', 'area-counts')
        // 	.attr('rx', 1)
        // 	.attr('ry', 1)
        // 	.attr('width', 10)
        // 	.attr('fill',function(d,i){
        // 		var index = _.findIndex(AreaList,{area:d.area});
        // 		return COLORS[index];
        // 	})
        // 	.attr('x', function(d) {
        // 		var point = projection(builder.getPoint(d.area));
        // 		return point[0] - 4 ;
        // 	})
        // 	.attr('y', function(d) {
        // 		var point = projection(builder.getPoint(d.area));
        // 		return point[1] - 6 ;
        // 	})
        // 	.attr('height', 0)
        // 	.transition()
        // 	.duration(1000)
        // 	.attr('y', function(d) {
        // 		var point = projection(builder.getPoint(d.area));
        // 		var index = _.findIndex(AreaList,{area:d.area});
        // 		return point[1] - 6 - scale(AreaList[index].count) ;
        // 	})
        // 	.attr('height', function(d) {
        // 		return scale(d.count);
        // 	});
    }
    _update(group) {

    }
    _delete(group) {
        group.exit().remove();

    }

    setData(group) {

        if (!_.has(this.props, 'bars')) {
            return;
        }
        if (_.has(this.props, 'barFields') && _.has(this.props, 'barTexts')) {
            this.labelFields = this.props.barFields;
            this.labelTexts = this.props.barTexts;
        }
        let container = group.selectAll('g._item').data(this.props.bars, d => d['name']);
        this._append(container.enter());
        this._update(container);
        this._delete(container);




    }
}