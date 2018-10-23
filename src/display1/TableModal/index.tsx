import * as React from 'react';
import * as _ from 'lodash';
import { Modal, DataTable } from '../index';
import { TableModalProps } from './interface';
export default class <T> extends React.Component<TableModalProps<T>>{

    lastShow = false;

    componentDidUpdate() {
        if(this.lastShow===false && this.props.show ===true &&_.has(this.refs.table,'query')){
            // @ts-ignore;
            this.refs.table.cleanAndQuery(this.props.param);
        }
    }

    render() {
        let param: any = {};
        param.visible = this.props.show;
        param.footer = null;
        param.className = this.props.className ? 'vap-table-modal ' + this.props.className : 'vap-table-modal';
        return <Modal
            {...this.props}
            {...param}
        >
            <DataTable query={this.props.query} param={this.props.param} columns={this.props.columns} ref="table"></DataTable>
        </Modal>
    }
}