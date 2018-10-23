import * as _ from 'lodash';
import * as d3 from 'd3';
import D3Chart from 'vap/layouts/charts/D3Chart';
import { ChartOpts } from 'vap/layouts/charts/interface';
import { Format } from 'vap/utils';
import ToolTip from 'vap/layouts/charts/common/ToolTip';
/**
 * 双层圆环图
*/
export interface PieOpts extends ChartOpts {
    labelField: string;
    valueField: string;
}

const colorArr = [
    '#ff8300', '#9e2ca7', '#00030b',
    '#3e80ff', '#ccb800', '#547774',
    '#fe95d0', '#57bccd', '#af89af'
];

export default class extends D3Chart<PieOpts>{

    //数据初始化
    init() {
        let pieLen = this.WIDTH < this.HEIGHT - 20 ? this.WIDTH : this.HEIGHT - 20;
        this.WIDTH = pieLen;
        this.HEIGHT = pieLen + 20;
    }

    //数据排序 | 数据转换结构
    sort() {
        var total = _.sumBy(this.props.data, this.props.valueField);
        var newData = {};
        for (var i in this.props.data) {
            let item = this.props.data[i];
            let name = item[this.props.labelField];
            let value = item[this.props.valueField];
            if (_.has(item, "children")) {
                newData[name] = [name, [value, (value * 100 / total).toFixed(2) + "%"]];
                var _list = {};
                item.children.map(d => {
                    let _name = d[this.props.labelField];
                    let _value = d[this.props.valueField];
                    _list[_name] = [_name, [_value, (_value * 100 / total).toFixed(2) + "%", (_value * 100 / value).toFixed(2) + "%"]];
                });
                newData[name].push(_list);
            } else {
                newData[name] = [name, [value, (value * 100 / total).toFixed(2) + "%"]];
            }
        }
        this.DATA = ["全部", [total, "100%"], newData];
    }

    private _warpToArcData(data) {
        var data_slices = [];

        //通过计算得到圆环对应的角度      
        function process_data(data, level, start_deg, stop_deg) {
            var name = data[0];
            var total = data[1][0];
            var children = data[2];
            var current_deg = start_deg;
            if (level > 4) {
                return;
            }
            if (start_deg == stop_deg) {
                return;
            }
            data_slices.push([start_deg, stop_deg, name, level, data[1]]);
            for (var key in children) {
                let child = children[key];
                var inc_deg = (stop_deg - start_deg) / total * child[1][0];
                var child_start_deg = current_deg;
                current_deg += inc_deg;
                var child_stop_deg = current_deg;
                process_data(child, level + 1, child_start_deg, child_stop_deg);
            }
        }
        process_data(data, 0, 0, 360. / 180.0 * Math.PI);
        return data_slices
    }

    //绘图
    build() {
        var self = this;

        var data_slices = this._warpToArcData(self.DATA);
        var ref = data_slices[0];
        var last_refs = [];
        var thickness = self.WIDTH / 2.0 / (4 + 2) * 1.1;

        function setText(d) {
            return `<tspan style='font-family:cursive'>地区</tspan>：${d[2]}&nbsp;&nbsp;&nbsp;<tspan style='font-family:cursive'
            >数量</tspan>：${d[4][0]}&nbsp;&nbsp;&nbsp;<tspan style='font-family:cursive'>占比</tspan>：${d[4][1]}`;
        }

        //添加text
        this.SVG.append("text")
            .attr("class", "text")
            .attr("x", self.WIDTH / 2)
            .attr('y', 35)
            .attr("text-anchor", "middle")
            .html(setText(ref));

        //绘制圆环
        var arc = d3.arc()
            .startAngle(d => d[3] == 0 ? d[0] : d[0] + 0.01)
            .endAngle(d => d[3] == 0 ? d[1] : d[1] - 0.01)
            .innerRadius(d => 1.2 * d[3] * thickness)
            .outerRadius(d => (1.2 * d[3] + 1) * thickness);

        var slices = self.SVG.selectAll(".form")
            .data(data_slices).enter().append("g");

        slices.append("path").attr("d", arc).attr("class", "form")
            .style("fill", d => d[3] == 0 ? "white" : colorArr[Math.floor(Math.random() * 10)])
            .attr("transform", `translate(${self.WIDTH / 2},${(self.HEIGHT / 2) + 20})`);

        slices.on("click", animate);

        slices.on("mouseover", function (d) {
            self.SVG.select(".text").html(setText(d));
        });

        function get_start_angle(d, ref) {//获取初始角度
            return ref ? (d[0] - ref[0]) / (ref[1] - ref[0]) * Math.PI * 2.0 : d[0];
        }

        function get_stop_angle(d, ref) {//获取结束角度
            return ref ? (d[1] - ref[0]) / (ref[1] - ref[0]) * Math.PI * 2.0 : d[0];
        }

        function get_level(d, ref) {
            return ref ? (d[3] - ref[3]) : d[3];
        }

        function rebaseTween(new_ref) {
            return function (d) {
                var level = d3.interpolate(get_level(d, ref), get_level(d, new_ref));
                var start_deg = d3.interpolate(get_start_angle(d, ref), get_start_angle(d, new_ref));
                var stop_deg = d3.interpolate(get_stop_angle(d, ref), get_stop_angle(d, new_ref));
                return function (t) {
                    //@ts-ignore
                    return arc([start_deg(t), stop_deg(t), d[2], level(t)]);
                }
            }
        }

        var animating = false;

        function animate(d) {
            if (animating) {
                return;
            }
            animating = true;
            var revert = false;
            var new_ref;
            var last_ref;
            if (d == ref && last_refs.length > 0) {
                revert = true;
                last_ref = last_refs.pop();
            }

            if (revert) {
                d = last_ref;
                new_ref = ref;
                self.SVG.selectAll(".form")
                    .filter(b => b[0] >= last_ref[0] && b[1] <= last_ref[1] && b[3] >= last_ref[3] ? true : false)
                    .transition().duration(1000).style("opacity", "1").attr("pointer-events", "all");
            } else {
                new_ref = d;
                self.SVG.selectAll(".form")
                    .filter(b => b[0] < d[0] || b[1] > d[1] || b[3] < d[3] ? true : false)
                    .transition().duration(1000).style("opacity", "0").attr("pointer-events", "none");
            }

            self.SVG.selectAll(".form")
                .filter(b => b[0] >= new_ref[0] && b[1] <= new_ref[1] && b[3] >= new_ref[3] ? true : false)
                .transition().duration(1000).attrTween("d", rebaseTween(d));

            setTimeout(function () {
                animating = false;
                if (!revert) {
                    last_refs.push(ref);
                    ref = d;
                } else {
                    ref = d;
                }
            }, 1000);
        };
    }

    // 更新数据
    update() {
    }
}