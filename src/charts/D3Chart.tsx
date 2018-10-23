import * as React from 'react';
import * as _ from 'lodash';
import * as d3 from 'd3';
import { ChartOpts, Layout } from './interface';
import { DefUtil, Format } from './common';

const ORGIN: Function = v => v;

export default abstract class <T extends ChartOpts> extends React.PureComponent<T>{

    /**
     * 内部样式，如果需要添加className 可以重写此属性
    */
    __ClassName = '';
    __Grid = {
        top: 12,
        left: 12,
        right: 12,
        bottom: 12,
    }

    /**
     * 是否等到有数据时才build
    */
    _WAIT = false;
    /**
     * 最后更新时年数据
     */
    _last_data = null;
    /**
     * 默认的最大显示条数，默认为10
    */
    MAXCOUNT = 10;
    /**
     * 自增的id
    */
    id = DefUtil.genId();
    /**
     * 是否已经loaded
    */
    loaded = false;
    /**
     * 格式化标签
    */
    FormatLabel = ORGIN;
    /**
     * 格式化值
    */
    FormatValue = Format.buildFormat('number');
    /**
     * 处理后的数据
    */
    DATA:any[] = null;
    /**
     * SVG 根结点对象
    */
    SVG: d3.Selection<any, any, any, any> = null;
    /**
     * 过渡时间
    */
    DURATION = 2000;
    /**
     * 总宽度
     */
    WIDTH = 0;
    /**
     * 总高度
     */
    HEIGHT = 0;
    /**
     * 展示空间
     * */
    LAYOUT: Layout = { x: 0, y: 0, w: 0, h: 0 };

    /**
     * 最最小最大值，可用来替代 d3.extent 方法
    */
    extent(data: any[], fn): [number, number] {
        let [min, max] = d3.extent(data, fn);
        // @ts-ignore
        min = (min === undefined ? 0 : min);
        // @ts-ignore
        max = max === undefined ? 1 : max;
        // @ts-ignore
        return [min, max];
    }

    itemClass(d, i) {
        return `_item _item_${i} ${this.props.onClick ? '_item_hover' : ''}`
    }

    /**
     * build 方法会在图表标签导入时自动调用，必须实现此方法
    */
    build() { this.update() }
    /**
     * update 方法会在数据发生变化时自动调用，必须实现此方法
    */
    abstract update();
    /**
     * resize方法会在宽高发生变化的情况下自动调用,默认重写
    */
    resize() {
        if (this.loaded) {
            this.sort();
            this.update();
        }
    }

    /**
     * init 方法会在build前自动调用
    */
    init() { }
    /**
     * sort方法会在 build前 或 update前 自动调用
    */
    sort() {
        this.DATA = this.props.data;
    }



    /**
     * 是否需要resize
    */
    _needResize(): boolean {
        let root = document.getElementById(this.id);
        if (root == null) {
            return false;
        }
        var [w, h] = [Math.floor(root.offsetWidth), Math.floor(root.offsetHeight)];
        if (this.WIDTH != w || this.HEIGHT != h) {
            [this.WIDTH, this.HEIGHT] = [w, h];
            let def = _.extend({}, this.__Grid, this.props.grid);
            this.LAYOUT = {
                x: def.left,
                y: def.top,
                w: this.WIDTH - def.left - def.right,
                h: this.HEIGHT - def.top - def.bottom,
            }
            this.SVG.attr('width', this.WIDTH)
                .attr('height', this.HEIGHT);
            return true;
        }
        return false;
    }
    /**
     * 是否需要update
    */
    _needUpdate(): boolean {
        if (this._last_data == this.props.data) {
            return false;
        }
        this._last_data = this.props.data;
        return true;
    }

    private __initSVG() {
        this._WAIT = false;
        let root = document.getElementById(this.id);
        this._last_data = this.props.data;
        this.init();
        this.SVG = d3.select(root).append('svg')
            .attr('width', this.WIDTH)
            .attr('height', this.HEIGHT)
            .style('display', 'block')
            ;
        this.loaded = true;
        this.sort();
        this.build();
        window.addEventListener('resize', (ev) => {
            if (this._needResize()) {
                this.resize();
            }
        });
    }


    componentDidMount() {
        let root = document.getElementById(this.id);
        let def = _.extend({}, this.__Grid, this.props.grid);
        [this.WIDTH, this.HEIGHT] = [Math.floor(root.offsetWidth), Math.floor(root.offsetHeight)];
        if (this.props.maxCount) this.MAXCOUNT = this.props.maxCount;
        this.LAYOUT = {
            x: def.left,
            y: def.top,
            w: this.WIDTH - def.left - def.right,
            h: this.HEIGHT - def.top - def.bottom,
        }
        if (_.has(this.props, 'duration')) {
            this.DURATION = this.props.duration;
        }
        if (_.has(this.props, 'format')) {
            this.FormatValue = Format.buildFormat(this.props.format);
        }
        if (_.has(this.props, 'labelFormat')) {
            this.FormatLabel = this.props.labelFormat;
        }
        this._WAIT = this.props.data === null;
        if (this._WAIT) {
            return;
        }
        this.__initSVG();

    }

    componentDidUpdate() {
        if (this._WAIT) {
            if (this.props.data === null) {
                return;
            }
            this.__initSVG();
            return;
        }
        if (this._needUpdate()) {
            // this.DATA = this.props.data;
            this.sort();
            this.update();
        }
    }

    /**
     * 不要实现render方法
    */
    render() {
        return <div id={this.id} className={`vap-chart ${this.__ClassName}`}>{this.props.children}</div>;
    }
}