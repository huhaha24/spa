import D3Chart from '../D3Chart';
import * as _ from 'lodash';
import * as React from 'react';
import * as d3 from 'd3';
import { ChartOpts } from '../interface';

interface WordOpts extends ChartOpts {
    labelField: string;
    valueField?: string;
}

const FaltLength = 800;

class Tag {
    el; x; y; z; r; CX; CY;
    constructor(el, x, y, z, r, CX, CY) {
        this.el = el;
        this.r = r;
        this.x = x;
        this.y = y;
        this.z = z;
        this.CX = CX;
        this.CY = CY;
    }
    move() {
        var scale = FaltLength / (FaltLength - this.z);
        var alpha = (this.z + this.r) / (2 * this.r);
        this.el.style.fontSize = 15 * scale + "px";
        this.el.style.opacity = alpha + 0.5;
        this.el.style.filter = "alpha(opacity = " + (alpha + 0.5) * 100 + ")";
        this.el.style.zIndex = scale * 100;
        this.el.style.left = this.x + this.CX - this.el.offsetWidth / 2 + "px";
        this.el.style.top = this.y + this.CY - this.el.offsetHeight / 2 + "px";
    }
}


export default class extends D3Chart<WordOpts> {

    tags: Tag[] = [];
    pid = 0;
    EX = 0;
    EY = 0;
    CX = 0;
    CY = 0;
    angleX = Math.PI / FaltLength;
    angleY = Math.PI / FaltLength;

    colorScale = txt => "rgb(" + (Math.random() * 255) + "," + (Math.random() * 255) + "," + (Math.random() * 255) + ")";


    build() {
        this.SVG.remove();
        var tagBall = document.getElementById(this.id);
        tagBall.addEventListener("mousemove", evt => {
            var x = evt.clientX - this.EX - this.CX;
            var y = evt.clientY - this.EY - this.CY;
            this.angleY = x * 0.0001;
            this.angleX = y * 0.0001;
        });
        this.update();
    }

    rotateX() {
        var cos = Math.cos(this.angleX);
        var sin = Math.sin(this.angleX);
        this.tags.map(tag => {
            var y1 = tag.y * cos - tag.z * sin;
            var z1 = tag.z * cos + tag.y * sin;
            tag.y = y1;
            tag.z = z1;
        })
    }

    rotateY() {
        var cos = Math.cos(this.angleY);
        var sin = Math.sin(this.angleY);
        this.tags.map(tag => {
            var x1 = tag.x * cos - tag.z * sin;
            var z1 = tag.z * cos + tag.x * sin;
            tag.x = x1;
            tag.z = z1;
        })
    }

    _loop() {
        window.clearInterval(this.pid);
        this.pid = window.setInterval(() => {
            this.rotateX();
            this.rotateY();
            this.tags.forEach(tag => tag.move())
        }, 50);
    }

    _update() {
        var tagBall = document.getElementById(this.id);
        var tagEls = document.getElementsByClassName('_item');
        if (this.props.valueField) {
            var [min, max] = this.extent(this.props.data, item => item[this.props.valueField]);
            // @ts-ignore
            this.colorScale = d3.scaleQuantize().domain([min, max]).range(['#66E064', '#64C1DE', '#6497DE', '#7864DE', '#B564DE', '#E567B1', '#FA7071', '#FBA670']);
        }
        this.CX = tagBall.offsetWidth / 2;
        this.CY = tagBall.offsetHeight / 2;
        this.EX = tagBall.offsetLeft + document.body.scrollLeft + document.documentElement.scrollLeft;
        this.EY = tagBall.offsetTop + document.body.scrollTop + document.documentElement.scrollTop;
        var RADIUS = _.min([this.CX, this.CY]) - 24;
        for (var i = 0; i < tagEls.length; i++) {
            var k = -1 + (2 * (i + 1) - 1) / tagEls.length;
            var a = Math.acos(k);
            var b = a * Math.sqrt(this.tags.length * Math.PI);
            var x = RADIUS * Math.sin(a) * Math.cos(b);
            var y = RADIUS * Math.sin(a) * Math.sin(b);
            var z = RADIUS * Math.cos(a);

            var t = new Tag(tagEls[i], x, y, z, RADIUS, this.CX, this.CY);
            // @ts-ignore
            tagEls[i].style.color = this.colorScale(parseFloat(tagEls[i].getAttribute('data')));
            // @ts-ignore
            tagEls[i].style.display = "block";
            this.tags.push(t);
            t.move();
        }
        this._loop();
    }

    update() {
        this.tags = [];
        window.setTimeout(() => {
            this._update();
        }, 100);
    }

    onClick(item) {
        if (this.props.onClick) {
            this.props.onClick(item);
        }
    }

    render() {
        return <div className="_vc_word_ball" id={this.id} style={{ width: '100%', height: '100%', display: 'block' }}>
            {this.props.data.map(item => <a
                className="_item"
                style={{ display: 'none' }}
                //@ts-ignore
                data={item[this.props.valueField] || 0}
                title={item[this.props.labelField]}
                onClick={e => this.onClick(item)}>
                {item[this.props.labelField]}
            </a>)}
        </div>
    }
}


