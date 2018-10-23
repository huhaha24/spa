import * as React from 'react';
import * as _ from 'lodash'
import BaseChart from './base'
import { divOption } from './interface'
export default class DivChart extends BaseChart<divOption>{
    getLegend(sourceTop) {
        sourceTop = this.props.sourceTop
        return this.legend.map((item, i) => {
            let { key, value } = item
            let curr = key == 'year' ? 'curr' : ''
            return <div className={`main-legend-block ${curr}`} data-flag={key}
                onClick={(e) => (this.handle(e, '.' + sourceTop + ' .main-legend-block'))}>
                <div className="main-legend-block-box"></div>
                <div className="main-legend-block-title">{value}</div>
            </div>
        })
    }
    update() {
        let max = _.maxBy(this.DATA, o => (o.value))
        return this.DATA.map(item => {
            const { name, value, time } = item;
            const style = {
                width: (max.value > 0 ? Math.floor(value * 100 / max.value) : 0) + "%"
            };
            const title = `${name}：${time}`;
            return <div className="selfBar" title={title}>
                <div className="selfBar-name">{name}</div>
                <div className="selfBar-body"><div className="selfBar-body-inner blue" style={style}></div></div>
            </div>;
        });

    }
}