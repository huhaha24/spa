import * as React from 'react';
import { Icon, } from 'vap/layouts/admin';
import { Renders as VRenders, Ajax } from 'vap/utils';
//util
import * as _ from 'lodash';
import Renders from "../../../utils/Renders";
//
import { ObjectRuleModal, ObjectRuleViewModal } from './ObjectRuleModel';
//render
const strRender = VRenders.strRender(60);
const typeRender = Renders.objTypeRender();

/**
 * 对象分析规则
 */
export default class Table extends React.PureComponent<any>{

  state = {
    showEdit: false,
    showView: false,
    editObject: {},
    typeOption: []
  }

  operRender = (text, editObject: any) => [
    <Icon type="edit" title={`编辑规则`} onClick={() => this.setState({
      showEdit: true,
      editObject
    })} />,
    <Icon type="search" title={`查看规则`} onClick={() => this.setState({
      showView: true,
      editObject
    })} />
  ];

  column = [
    { title: '对象类型', dataIndex: 'objecttype', render: typeRender, sorter: true },
    { title: '所属应用', dataIndex: 'sysname', sorter: true },
    { title: '规则', dataIndex: 'rules', render: strRender },
    { title: '描述', dataIndex: 'description' },
    { title: '操作', dataIndex: 'id', className: 'talbe-actions', render: this.operRender }
  ];

  componentDidMount() {
    Ajax.GET("/api-audit/single/all/dict_object_type", resp => {
      var typeOption = [];
      if (resp.code == "0") {
        resp.list.map(d => typeOption.push({
          value: d.id,
          name: d.description
        }));
      }
      this.setState({ typeOption });
    });
  }

  render() {
    return <React.Fragment>
      {/* <TableLayout
                dispatch={this.props.dispatch}
                fetch="objectRule/_query"
                dataSource={this.props.model.list}
                total={this.props.model.total}
                columns={this.column}
                // filters={[{
                //     name: '对象类型',
                //     field: 'objectType',
                //     options: _.concat([{ value: '', name: '全部' }], typeOption)
                // }]}
                searchs={[
                    { name: '规则', field: 'rules' },
                    { name: '描述', field: 'description' }
                ]}
                actions={[{
                    name: "添加",
                    icon: "plus-circle",
                    action: () => this.setState({ showEdit: true })
                }]}
            /> */}
      {/* <Modal
                title="添加对象分析规则"
                visible={this.state.showEdit}
                onCancel={() => this.setState({ showEdit: false })}
            >
                <Form>
                    <Form.Item label={"对象类型"}></Form.Item>
                    <Form.Item label={"所属应用"}></Form.Item>
                    <Form.Item label={"规则"}></Form.Item>
                    <Form.Item label={"描述"}></Form.Item>
                </Form>
            </Modal> */}
      <ObjectRuleModal
        isEdit={false}
        show={this.state.showEdit}
        onCancel={(evt) => this.setState({ showEdit: false })}
        data={this.state.editObject}
        typeOption={this.state.typeOption}
        onOk={e => {
          //alert('暂不支持'); this.setState({ showEdit: false })
        }}
      ></ObjectRuleModal>
      {/* <ObjectRuleViewModal
                show={this.state.showView}
                data={this.state.editObject}
                onCancel={(evt) => this.setState({ showView: false })}
                onOk={e => { this.setState({ showView: false }) }}
                strRender={strRender}
                typeRender={typeRender}
            ></ObjectRuleViewModal> */}
    </React.Fragment>
  }
}