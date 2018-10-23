/**
 * 直接设置data为 option的echart
*/
import EChart from './EChart';

export default class extends EChart{

    build(){
        this.chart.setOption(this.props.data);
    }
    update(){
        this.chart.setOption(this.props.data);
    }
}