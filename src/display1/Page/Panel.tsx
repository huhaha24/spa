import * as React from 'react';
import { Col, Card, Icon } from 'antd';
import { PanelProps, RowPanelProps } from './interface';
import * as _ from 'lodash';


// const findContext = (key){}

export class Panel extends React.Component<PanelProps>{
    cardParam: any = {};
    state = {
        tabContext: null,
        activeTabKey: null,
    }

    componentWillMount() {
        if (this.props.tabList) {
            this.setState({
                activeTabKey: this.props.tabList[0].key,
                tabContext: this.props.tabList[0].content
            })
            if (this.props.onTabChange) {
                this.props.onTabChange(this.props.tabList[0].key);
            }
            this.cardParam.onTabChange = key => {
                let tab = _.find(this.props.tabList, { key });
                this.setState({
                    activeTabKey: key,
                    //tabContext: tab.content
                });
                if (this.props.onTabChange) {
                    this.props.onTabChange(key);
                }
            }

        }

    }

    render() {
        var param: any = {};
        if (this.props.width) {
            param.style = {
                width: this.props.width,
                minWidth: this.props.width
            }
        } else if (this.props.span) {
            param.span = this.props.span;
        } else {
            param.style = {
                flex: '1 1'
            }
        }
        let className = ["vap-col"]
        if (_.has(this.props, 'title')) {
            if (_.has(this.props, 'icon')) {
                this.cardParam.title = [<Icon type={this.props.icon} className="title-icon" />, this.props.title];
            }
            className.push("vap-panel-header");
        }

        return <Col className={className.join(" ")} {...param}>
            <Card className="vap-panel"
                {...this.props}
                {...this.cardParam}
                activeTabKey={this.state.activeTabKey}
            >{this.state.tabContext || this.props.children}</Card>
        </Col>
    }
}



export class RowPanel extends React.Component<RowPanelProps>{

    cardParam: any = {};
    state = {
        activeTabKey: null,
        tabContext: null,
    }

    componentWillMount() {
        if (this.props.tabList) {
            this.setState({
                tabContext: this.props.tabList[0].content,
                activeTabKey: this.props.tabList[0].key,
            })
            if (this.props.onTabChange) {
                this.props.onTabChange(this.props.tabList[0].key);
            }
            this.cardParam.onTabChange = key => {
                let tab = _.find(this.props.tabList, { key })
                this.setState({
                    activeTabKey: key,
                    tabContext: tab
                })
                if (this.props.onTabChange) {
                    this.props.onTabChange(key);
                }
            }
        }
    }


    render() {
        let className = ["vap-row", "vap-row-block"]
        if (_.has(this.props, 'title')) {
            if (_.has(this.props, 'icon')) {
                this.cardParam.title = [<Icon type={this.props.icon} className="title-icon" />, this.props.title];
            }
            className.push("vap-panel-header");
        }
        return <div className={className.join(" ")} style={{ height: this.props.height }}>
            <Card className="vap-panel" {...this.props}  {...this.cardParam} activeTabKey={this.state.activeTabKey}>{this.props.children}</Card>
        </div>
    }

}

