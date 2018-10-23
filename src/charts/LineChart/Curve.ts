import D3Chart from '../D3Chart';
import { ChartOpts } from '../interface';
import ToolTip from '../common/ToolTip';
import DefUtil from '../common/DefUtil';
import * as d3 from 'd3';
import * as _ from 'lodash';

/**
 * 曲线图
*/

interface paddingOpt {
    top: number;
    left: number;
    right: number;
    bottom: number;
}

export interface CurveOpts extends ChartOpts {
    /**
     * 值
     */
    valueFields: string | Array<String>;
    /**
     * 名
     */
    nameFields: string | Array<String>;
    /**
     * 是否是多条曲线 - 暂不支持
     */
    mutiLine: boolean;
    /**
     * 是否显示Y轴
     */
    showYlabel: boolean;
    /**
     * 是否是堆叠 - 暂不支持
     */
    isArea?: boolean;
    /**
     * 标签 - 暂不支持
     */
    tag?: Array<String>;
    /**
     * 标签 位置 - 暂不支持
     */
    setTag?: "top" | "left" | "right" | "buttom";
    /**
     * 标签 点击 - 暂不支持
     */
    clickTag?: Function;
    /**
     * 设置样式
     */
    padding?: paddingOpt;
}



export default class extends D3Chart<CurveOpts>{

    __ClassName = '_vc_line_curve';

    __Grid = this.props.padding ? this.props.padding : {
        top: 12,
        left: this.props.showYlabel ? 40 : 12,
        right: 12,
        bottom: this.props.setTag ? 80 : 30,
    }

    max = 0;

    showYlabel = false;

    widthScale = null;
    heightScale = null;

    lineGenerator = null;

    init() {
        // if (this.props.setTag) {
        //     let grid = _.extend([], this.__Grid);
        //     grid[this.props.setTag] = grid[this.props.setTag] + 50;
        //     this.__Grid = grid;
        // }
    }

    sort() {
        let data = [];
        let nameField: string;
        let valueField: string;
        if (!_.isArray(this.props.nameFields)) {
            nameField = this.props.nameFields;
        }
        if (!_.isArray(this.props.valueFields)) {
            valueField = this.props.valueFields;
        }
        this.props.data.map(d => data.push({
            name: d[nameField],
            value: d[valueField]
        }));
        this.DATA = data;
        let [min, max] = [0, 1];
        if (this.DATA.length > 0) {
            [min, max] = d3.extent(data, item => item["value"]);
            if (min == max) {
                min = 0;
            }
        }
        this.max = max;
        this.heightScale = d3.scaleLinear()
            .domain([0, max])
            .range([0, this.HEIGHT - this.__Grid.top - this.__Grid.bottom - 10]);
        this.widthScale = d3.scaleLinear()
            .domain([1, data.length])
            .range([this.__Grid.left, this.WIDTH - this.__Grid.left - this.__Grid.right - 10]);

        this.lineGenerator = d3.line()
            .x((d, i) => this.__Grid.left + this.widthScale(i + 1))
            .y((d, i) => this.HEIGHT - this.__Grid.bottom - this.heightScale(d["value"]))
            .curve(d3.curveMonotoneX);


    }

    private _appendLine() {
        this.SVG.append("path")
            .datum(this.DATA)
            .attr("d", this.lineGenerator)
            .attr("stroke", "blue")
            .attr("stroke-width", 0)
            .attr("fill", "none")
            .transition()
            .duration(this.DURATION)
            .attr("stroke-width", 1);
        let group = this.SVG.selectAll("g._point")
            .data(this.DATA)
            .enter();
        group.append("circle")
            .attr("fill", "blue")
            .attr("rx", (d, i) => this.__Grid.left + this.widthScale(i + 1))
            .attr("ry", (d, i) => this.HEIGHT - this.__Grid.bottom - this.heightScale(d["value"]))
            .attr("r", 1);
    }

    private _appendXAxis() {
        this.SVG.append("g")
            .attr("class", "_x_axis")
            .attr("transform", `translate(${this.__Grid.left},${this.HEIGHT - this.__Grid.bottom})`);
    }

    private _appendYAxis() {
        this.SVG.append("g")
            .attr("class", "_y_axis")
            .attr("transform", `translate(${this.__Grid.left * 2},${this.__Grid.top * 2})`);
    }

    private _appendTag() {
        let group = this.SVG.selectAll("g._tag")
            .data(this.props.tag)
            .enter();

        group.append("rect")
            .attr("x", this.WIDTH / 2)
            .attr("y", this.HEIGHT - this.__Grid.bottom + 30)
            .attr("width", 18)
            .attr("height", 16)
            .attr("fill", "blue");

        group.append("text")
            .attr("x", (this.WIDTH / 2) + 25)
            .attr("y", this.HEIGHT - this.__Grid.bottom + 42)
            .attr("text-anchor", "start")
            .attr("fill", "blue")
            .text((d) => {
                return d + "";
            });
    }

    build() {
        this.SVG.append('defs').html(DefUtil.BuildLineDistribution());
        this._appendLine();
        this._appendXAxis();
        if (this.props.showYlabel) {
            this._appendYAxis();
        }
        if (this.props.setTag) {
            this._appendTag();
        }
    }

    private _updateX(circleGroup) {
        var self = this;

        let text = [];
        _.map(this.DATA, d => text.push(d.name));
        let _widthScale = d3.scaleQuantize()
            .domain([0, this.DATA.length])
            .range(text);

        let bottomAxis = d3.axisBottom(_widthScale)
            .tickPadding(5)
            .tickFormat((d, i) => {
                if (i < this.DATA.length) {
                    return "_widthScale(i)";
                }
                return "";
            });
        if (this.DATA.length == 1) {
            let _bottomAxis = d3.axisBottom(_widthScale)
                .ticks(2)
                .tickSize(1)
                .tickFormat((d, i) => i == 1 ? self.DATA[0].name : "");
            bottomAxis = _bottomAxis;
            circleGroup.attr("cx", 0)
                .attr("transform", () => {
                    if (this.DATA.length == 1) {
                        return `translate(${(this.WIDTH + this.__Grid.left + this.__Grid.right) / 2},0)`;
                    }
                    return `translate(0,0)`;
                })
        }
        this.SVG.select("._x_axis").call(bottomAxis);
    }

    private _updateY() {
        var self = this;
        let _heightScale = d3.scaleLinear()
            .domain([this.max, 0])
            .range([0, this.HEIGHT - this.__Grid.top - this.__Grid.bottom - 10]);
        let leftAxis = d3.axisLeft(_heightScale)
            .ticks(3)
            .tickSize(1)
            .tickPadding(5)
            .tickFormat((d, i) => {
                return d + "";
            });
        this.SVG.select("._y_axis").call(leftAxis);
    }

    update() {
        this.SVG.select("path")
            .datum(this.DATA)
            .attr("d", this.lineGenerator)
            .attr("stroke", "blue")
            .attr("stroke-width", 0)
            .attr("fill", "none")
            .transition()
            .duration(this.DURATION)
            .attr("stroke-width", 1);

        let group = this.SVG.selectAll("g._point")
            .data(this.DATA)
            .enter();

        let circleGroup = group.append("circle")
            .attr("fill", "blue")
            .attr("cx", (d, i) => this.__Grid.left + this.widthScale(i + 1))
            .attr("cy", (d, i) => this.HEIGHT - this.__Grid.bottom - this.heightScale(d["value"]))
            .attr("r", 0)
            .attr("style", "cursor: pointer;")
            .on("mouseover", function (d) {
                d3.select(this).attr("fill", "red");
                ToolTip.show(`${d["name"]}:${d["value"]}`);
            })
            .on("mouseout", function () {
                d3.select(this).attr("fill", "blue");
                ToolTip.hide();
            })
            .transition()
            .duration(this.DURATION)
            .attr("r", 2.5);

        this._updateX(circleGroup);
        this._updateY();

    }
}