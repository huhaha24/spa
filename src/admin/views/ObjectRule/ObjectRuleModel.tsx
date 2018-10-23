import * as React from 'react';
import { BaseModal, FormModal, InfoModal } from 'vap/layouts/admin';

export class ObjectRuleModal extends BaseModal {

  column = [
    { title: '对象类型', field: 'objecttype', type: 'select', options: [] },
    { title: '所属应用', field: 'sysname' },
    { title: '规则', field: 'rules' },
    { title: '描述', field: 'description' }
  ];

  render() {
    /* if (this.column[0].options.length == 0 && this.props.typeOption.length > 0) {
      this.column[0].options = this.props.typeOption;
    } */
    return <FormModal
      {...this.props}
      columns={this.column}
      visible={this.props.show}
      title={this.props.isEdit ? '修改对象规则' : '添加对象规则'}
    />;
  }
}

export class ObjectRuleViewModal extends BaseModal {

  column = [
    { title: '对象类型', field: 'objectType', render: this.props.typeRender },
    { title: '所属应用', field: 'sysId' },
    { title: '规则', field: 'rules', render: this.props.strRender },
    { title: '描述', field: 'description' }
  ];

  render() {
    return <InfoModal
      columns={this.column}
      {...this.props}
      data={this.props.data}
      visible={this.props.show}
    />;
  }
}