import * as React from 'react';
import { Row,Col,Card } from 'antd';
import { VRowProps } from './interface';
import * as _ from 'lodash';

export default class extends React.Component<VRowProps>{

    render() {
        var param:any =_.assign({style:{}},this.props);
        // param.style.height = this.props.height;
        // param.className = param.className?param.className +' vap-row-container':'vap-row-container';
        param.type="flex";
        return <div className="vap-row" style={{height:this.props.height}}>
                <Row {...param}>{this.props.children}</Row>
            </div>
    }

}

