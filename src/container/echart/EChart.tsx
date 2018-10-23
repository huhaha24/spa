import * as React from 'react';
import { DefUtil, Format } from 'vap/layouts/charts/common';
/// <reference types="echarts" />
import { EchartCommentProps } from 'vap/layouts/charts/interface';
import * as _ from "lodash";
/**
 * 定义 echart 的规范
*/
export default abstract class extends React.Component<EchartCommentProps>{

    id = '';
    WIDTH = 0;
    HEIGHT = 0;
    DATA: any = {};
    chart = null;


    abstract build();
    abstract update();


    //是否需要resize
    _needResize(): boolean {
        let root = document.getElementById(this.id);
        var [w, h] = [root.offsetWidth, root.offsetHeight];
        if (this.WIDTH != w || this.HEIGHT != h) {
            [this.WIDTH, this.HEIGHT] = [w, h];
            return true;
        }
        return false;
    }

    /**
     * resize方法会在宽高发生变化的情况下自动调用
    */
    resize() {
        this.chart.resize();
    }

    /**
     * init 方法会在build前自动调用
    */
    init() {
        if (JSON.stringify(this.DATA) != "{}") {
            this.sort();
            this.chart.setOption(this.DATA);
            if (this.props.onClick) {
                this.chart.on("click", (d) => {
                    this.props.onClick(d);
                });
            }
        }
    }
    /**
     * sort方法会在 build前 或 update前 自动调用
    */
    sort() {
        this.DATA = this.props.data;
    }

    componentWillMount() {
        this.id = DefUtil.genId();
    }

    componentDidMount() {
        let root = document.getElementById(this.id);
        [this.WIDTH, this.HEIGHT] = [root.offsetWidth, root.offsetHeight];
        this.chart = echarts.init(document.getElementById(this.id) as HTMLDivElement);
        this.sort();
        this.init();
    }

    componentDidUpdate() {
        this.DATA = this.props.data;
        if (JSON.stringify(this.DATA) != "{}") {
            this.sort();
            this.chart.setOption(this.DATA);
            this.chart.resize();
            if (this.props.onClick) {
                this.chart.on("click", (d) => {
                    this.props.onClick(d);
                });
            }
        } else if (this.chart["_chartsViews"].length > 0) {
            this.chart.clear();
        }
    }


    render() {
        let param: any = {
            className: '_vce_chart',
        };
        if (this.props.className) {
            param.className = param.className + ' ' + this.props.className;
        }
        return <div id={this.id} {...param}></div>
    }

}