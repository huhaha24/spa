import * as React from 'react';
import * as _ from 'lodash';
import * as d3 from 'd3';
import D3Chart from '../D3Chart';
import { Ajax } from 'vap/utils';
import MapBuilder from './__MapBuilder';
import Area from './Area';
import BackGround from './BackGround';
import Bars from './Bars';
import Lines from './Lines';
import Colors from './Colors';
import Points from './Points';
import { MapOpts } from './interface';
import DEFS from './MapDEF';


/**
 * 目前支持度：
 * resize：支持
 * update: 支持
 * tip提示: 支持
 * click交互: 支持
 * 
 * 其它说明：
 * 基于D3JS的地图，引入前主确认已经引用了 d3.js
*/



export default class extends D3Chart<MapOpts> {

    RotateX = 30;
    THEIGHT = 0;
    PHEIGHT = Math.cos(Math.PI * 2 * this.RotateX / 360);
    ADJUST = [0, 0, 0];   //地图调节
    AreaGroup;
    BkgGroup;
    BarGroup;
    WIDTH;
    HEIGHT;

    Builder = null;
    Projection = null;

    areas: Area = null;
    bkgs: BackGround = null;
    bars: Bars = null;
    colors: Colors = null;
    lines: Lines = null;
    points: Points = null;

    constructor(props) {
        super(props);
        if (_.has(this.props, 'rotateX')) {
            this.RotateX = this.props.rotateX;
            this.PHEIGHT = Math.cos(Math.PI * 2 * this.RotateX / 360);
        }
        if (this.props.adjust) {
            this.ADJUST = this.props.adjust;
        }
    }

    _needResize() {
        let root = document.getElementById(this.id + "_container");
        var [w, h] = [root.offsetWidth, root.offsetHeight];
        if (this.WIDTH != w || this.HEIGHT != h) {
            [this.WIDTH, this.HEIGHT] = [w, h];
            return true;
        }
        return false;
    }

    resize() {
        this.THEIGHT = this.HEIGHT / this.PHEIGHT;
        d3.select('#' + this.id)
            .style('width', '100%')
            .style('height', this.THEIGHT + 'px')
            .style('margin-top', (this.HEIGHT - this.THEIGHT) / 2 + 'px');
        this.SVG.style('height', this.THEIGHT)
            .attr('height', this.THEIGHT)
            .attr('width', this.WIDTH);
        this.Builder.resize(this.WIDTH, this.THEIGHT);
        let center = this.Builder.getCenter();
        center[0] = center[0] + this.ADJUST[0];
        center[1] = center[1] + this.ADJUST[1];
        let scale = this.Builder.getFullScale();
        scale += this.ADJUST[2];
        this.Projection = d3.geoMercator()
            .center(center)
            .scale(scale)
            .translate([this.WIDTH / 2, this.THEIGHT / 2]);
        this.colors.reset(this.Builder, this.Projection, this.AreaGroup);
        this.areas.reset(this.Builder, this.Projection, this.AreaGroup);
        this.bkgs.reset(this.Builder, this.Projection, this.BkgGroup);
    }


    buildMap() {
        let url = '/images/china.json';
        if (this.props.mapId) {
            let tmp = this.props.mapId + '';
            if (tmp == 'chinafull') {
                url = '/images/chinafull.json';
            } else if (tmp.length == 2) {
                url = `/images/province/${tmp}.json`
            } else if (tmp.length == 6) {
                url = `/images/city/${tmp}.json`
            }
        }
        Ajax.SESION(url);
        Ajax.GET(url, json => {
            this.THEIGHT = this.HEIGHT / this.PHEIGHT;
            this.SVG.append('defs').html(DEFS);
            d3.select('#' + this.id)
                .style('width', '100%')
                .style('height', this.THEIGHT + 'px')
                .style('margin-top', (this.HEIGHT - this.THEIGHT) / 2 + 'px')
                .style('overflow', 'hidden')
                .style('transform', ` rotateX(${this.RotateX}deg)`);
            this.SVG.attr('height', this.THEIGHT)
                .attr('class', '_vc_map')
                .attr('width', this.WIDTH)
                .style('position', 'absolute')
                .style('height', this.THEIGHT);
            this.Builder = new MapBuilder(json, this.WIDTH, this.THEIGHT);
            let center = this.Builder.getCenter();
            center[0] = center[0] + this.ADJUST[0];
            center[1] = center[1] + this.ADJUST[1];
            let scale = this.Builder.getFullScale();
            scale += this.ADJUST[2];
            this.Projection = d3.geoMercator()
                .center(center)
                .scale(scale)
                .translate([this.WIDTH / 2, this.THEIGHT / 2]);
            this.BkgGroup = this.SVG.append('g').attr('class', '_group_bkg');
            this.AreaGroup = this.SVG.append('g').attr('id', this.id + "_group_area").attr('class', `_group_area ${_.has(this.props, 'onSelected') ? '_group_area_selected' : ''}`);
            this.areas = new Area(this.Builder, this.Projection, this.props);
            this.bkgs = new BackGround(this.Builder, this.Projection, this.props);

            this.areas.setData(this.AreaGroup, json.features);
            this.bkgs.setData(this.BkgGroup, json);
            if (_.has(this.props, 'bars')) {
                this.BarGroup = this.SVG.append('g').attr('class', '_group_bars');
                this.bars = new Bars(this.Builder, this.Projection, this.props);
                this.bars.setData(this.BarGroup);
            }
            if (_.has(this.props, 'colors')) {
                this.colors = new Colors(this.Builder, this.Projection, this.props);
                this.colors.setData(this.SVG, this.props.colors);
            }
            if (_.has(this.props, 'points')) {
                this.points = new Points(this.Builder, this.Projection, this.props);
            }
            if (_.has(this.props, 'lines')) {
                this.lines = new Lines(this.Builder, this.Projection, this.props);
            }
        })


    }


    build() {
        // 说明：地图统一延时0.1秒，以便区域能够先行载入
        window.setTimeout(()=>this.buildMap(),100);
    }


    rotate = d => {
        var orgin = '0';
        orgin = d3.select('#' + this.id).style('transform').replace('rotateX(', '').replace('deg)', '');
        d3.select('#' + this.id)
            // @ts-ignore
            .transition()
            .duration(3000)
            .styleTween("transform", () => d3.interpolateString(`rotateX(${orgin}deg)`, `rotateX(${d}deg)`));
    }


    /**
     * 是否需要update,这里重写每个方法
    */
    _needUpdate(): boolean {
        // 是否需要更新颜色区域
        if (this.colors && !_.isEqual(this._last_data.colors, this.props.colors)) {
            this.colors.setData(this.SVG, this.props.colors);
        }
        this._last_data = this.props;
        return false;
    }

    update() { }

    render() {
        return <div id={this.id + '_container'} className="vap-chart" style={{ overflow: 'hidden' }}>
            <div id={this.id} style={{
                width: '100%',
                height: '100%',
            }}></div>
            {/* {this.props.children ?
                <div style={{width:'100%'}}>{this.props.children}</div>
                : ''} */}
        </div>;
    }


}
