import * as React from 'react'
import * as _ from 'lodash';
import D3Chart from '../../charts/D3Chart'
import MapBuilder from './mapBuild'
import Area from 'vap/layouts/charts/MapChart/Area'
import BackGround from 'vap/layouts/charts/MapChart/BackGround';
import Config from './config'
import { Ajax } from 'vap/utils';
import * as d3 from 'd3';
import DEFS from './style';
import './index.less'
import Tip from './tip'
export default class extends D3Chart<any>{
    RotateX = 30;
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

    //ROOT = document.getElementById(this.id);

    update() { }
    buildMap = (eventName:string)=>{
        let url = `/mapData/${eventName}.json`
        Ajax.GET(url, json => {
        //根元素，容器元素，根元素宽高，高度比例，容器元素高度 
        let ROOT = document.getElementById(this.id);
        let WIDTH, HEIGHT;
        //自定义配置
        [WIDTH, HEIGHT] = [ROOT.clientWidth, ROOT.clientHeight];
        Config.GLOBAL_BUILDER = new MapBuilder(json, ROOT);
        if(eventName == 'china'){
            this.SVG.append('defs').html(DEFS);
        }  
        this.initData(json,WIDTH, HEIGHT)
       })
       //if(eventName == 'china'){
        this.getLegend(eventName)
       //} 
    }
    
    initData = (json,WIDTH,THEIGHT)=>{
        let self = this
        let center = Config.GLOBAL_BUILDER.getCenter()
        let scale = Config.GLOBAL_BUILDER.getFullScale()
        let number = Config.GLOBAL_SCALE//设置地图的放大尺寸

        if (Config.Shadow) {
                let projectionBkg = d3.geoMercator()
                    .center(center)
                    .scale(scale * number)
                    //.translate([WIDTH / 2 + Config.Shadow.Left, THEIGHT / 2 + Config.Shadow.Top])
                    .translate([WIDTH / 2, THEIGHT / 2 ])
                let pathBkg = d3.geoPath().projection(projectionBkg)
                this.SVG.append('g')
                    .attr('class', 'v-group-background')
                    .attr('id', 'v-group-background')
                    .selectAll('path.v-item-background')
                    .data(json.features)
                    .enter()
                    .append('path')
                    .attr('class', 'v-item-background')
                    .attr('d', pathBkg);
            }
        let groupArea = this.SVG.append('g').attr('class', 'v-group v-item-selected')
            Config.GLOBAL_PROJECTION = d3.geoMercator()
                .center(center)
                .scale(scale * number)
                //.translate([WIDTH / 2+ Config.Shadow.Left, THEIGHT / 2+ Config.Shadow.Top])
                .translate([WIDTH / 2, THEIGHT / 2 ])
            let path = d3.geoPath().projection(Config.GLOBAL_PROJECTION)
            let shapes = groupArea.selectAll('g.v-item')
                .data(json.features)
                .enter()
                .append('g')
                .attr('id', (d:any) => '_area_' + (d.properties.adcode || d.properties.id || d.properties.name))
                .attr('class', 'v-item');

            shapes.append('path')
                .attr('class', 'v-area')
                .attr('d', path);  //运行到这里地图生成
            shapes.append('text')
                .attr('class', 'v-label')
                .attr('x', (d:any) => Config.GLOBAL_PROJECTION(Config.GLOBAL_BUILDER.getPoint(d.properties.name))[0])
                .attr('y', (d:any) => Config.GLOBAL_PROJECTION(Config.GLOBAL_BUILDER.getPoint(d.properties.name))[1] + 10)
                .text((d:any) => d.properties.name)
            shapes.on('mouseenter', function (d:any) {
                d3.select(this).style('cursor', 'hand')
                let value;
                Config.GLOBAL_TIPS.map(item => {
                    if (item.areaName == d.properties.name) {
                        return value = item.value
                    }
                })
                shapes.classed('v-item-selected', false);
                d3.select(this).classed('v-item-selected', true);
                Tip.showTooltip(`
                <div class="map-alarm-title">${d.properties.name}</div>
                `)
            })
            shapes.on('mouseleave', function (d) {
                shapes.classed('v-selected', false);
                Tip.hideTooltip(500)
            })
            shapes.on('click', function (d:any) {
                if (d.properties.code){
                    self.buildMap(d.properties.code)
                    self.clickHandle()        
                } 
            });
    }

    clickHandle() {
        if (document.getElementsByClassName('v-group-background')[0]) {
            let svg = document.getElementById(this.id).childNodes[0]
            svg.removeChild(document.getElementsByClassName('v-group-background')[0])
            svg.removeChild(document.getElementsByClassName('v-group')[0])
        }
    }

    getLegend(name){
        let svg = document.getElementById(this.id).childNodes[0]
        let upBackground = document.getElementsByClassName('v-group-background')[0]
        let upGroup = document.getElementsByClassName('v-group')[0]
        let legendData = [{ text: '高危', color: 'rgba(255,51,51,0.9)' }, { text: '中危', color: 'rgba(255,165,0,0.9)' }, { text: '低危', color: 'rgba(255,255,0,0.9)' }]
        if(name == 'china'){
            let legend = this.SVG.append('g').attr('class', 'legend')
            legend.selectAll('.legend-rect')
                .data(legendData)
                .enter()
                .append('rect')
                .attr('class', 'legend-rect')
                .attr('width', 25)
                .attr('height', 15)
                .attr('transform', `translate(${this.WIDTH / 5 * 4},${this.HEIGHT / 7 * 5})`)
                .attr('x', 20)
                .attr('y', (d, i) => i * 30)
                .attr('fill', d => d.color)
                .attr('rx', 3)
                .attr('ry', 3)
            legend.selectAll('.legend-text')
                .data(legendData)
                .enter()
                .append('text')
                .attr('class', 'legend-text')
                .attr('transform', `translate(${this.WIDTH / 5 * 4},${this.HEIGHT / 7 * 5})`)
                .attr('x', 50)
                .attr('y', (d, i) => i * 30)
                .attr('dy', 14)
                .style('font-size', '15px')
                .attr('fill', '#6884C4')
                .text(d => d.text)
        }
        if(name !== 'china'){
            let tip = this.SVG.append('g').attr('class','click-image')
            tip.append('image')
                .attr('class', 'tip-image')
                .attr('href', '/images/big1.png')
                .attr('transform', `translate(${this.WIDTH / 5 * 4},${this.HEIGHT / 7 * 5})`)
                .attr('x', 20)
                .attr('y', 80)
                .attr('width', 30)
                .attr('height', 30)
                .style('cursor', 'hand')
                .on('click', () => {
                    this.clickHandle()
                    svg.appendChild(upBackground)
                    svg.appendChild(upGroup)
                    svg.removeChild(document.getElementsByClassName('click-image')[0])
                })
            }
    }

    build() {
        // 说明：地图统一延时0.1秒，以便区域能够先行载入
        window.setTimeout(()=>this.buildMap('china'),300);
    }

    
    render(){
        //let refDom;
        return <div id={this.id} style={{
            width: '100%',
            height: '100%',
        }}></div> 
    }
}