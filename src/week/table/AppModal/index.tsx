import * as React from 'react';
//vap
import { Modal, DataTable, Icon, Button, Popconfirm } from "vap/layouts/display";
import { Renders as VRenders, Ajax } from 'vap/utils';
//util
import "../../../utils/CACHE";
import * as _ from "lodash";
import Render from "../../../utils/Renders"
//pro
import EditModal from './EditModal';
//render
const strRender = VRenders.strRender(100);
const descRender = VRenders.strRender(15);
const policeRangeRender = VRenders.strRender(50);
const sysIdRender = Render.systemIdRender('', '未知', false);
const objTypeRender = Render.objTypeRender('', '未知', false);
const policeRender = Render.policeTypeRender('未知', '', true);

interface SetModal {
  show: boolean;
  onCancel: Function;
  type: string;
}
Ajax.SESION('/api-audit/single/all/dict_object_type');

export default class AppModal extends React.PureComponent<SetModal> {
  Table: DataTable<any> = null;

  state: any = {
    showAdd: false,
    isEdit: false,

    editObject: {},

    objType: [],
    policeOption: []
  }

  operRender = (text, editObject) => {
    if (!_.has(editObject, "id")) {
      return "";
    }
    return [
      <Icon type="edit" title={`编辑规则`} onClick={() => this.setState({ showAdd: true, isEdit: true, editObject: editObject })} />,
      <Popconfirm title={`确认要删除该规则？`} onConfirm={() => this.del(text, editObject)}>
        <Icon type="delete" title={`删除规则`} />
      </Popconfirm>
    ]
  };

  policeRender = (text, editObject) => {
    let str = "";
    let list = [];
    if (_.has(editObject, "policeTypeRange")) {
      list = editObject["policeTypeRange"].split(",");
    }
    _.map(list, (d, i) => {
      if (i < list.length - 1) {
        str = str + policeRender(d) + ",";
      } else {
        str = str + policeRender(d);
      }
    });
    return policeRangeRender(str);
  }

  objectColumn = [
    { title: '对象类型', dataIndex: 'objecttype', width: 80, render: objTypeRender },
    { title: '所属应用', dataIndex: 'sysid', width: 80, render: sysIdRender },
    { title: '规则', dataIndex: 'rules', render: strRender },
    { title: '描述', dataIndex: 'description', width: 80, render: descRender },
    { title: '操作', dataIndex: 'id', className: 'table-oper', render: this.operRender, width: 60 }
  ];

  crossColumn = [
    { title: '对象类型', dataIndex: 'businessType', width: 120 },
    { title: '警种范围', dataIndex: 'policeTypeRange', render: this.policeRender },
    { title: '描述', dataIndex: 'description', width: 160, render: descRender },
    { title: '操作', dataIndex: 'id', className: 'table-oper', render: this.operRender, width: 60 }
  ];

  del(text, editObject) {
    this.Table.delete(editObject.id);
  }

  showAdd() {
    this.setState({ showAdd: true, isEdit: false });
  }

  warpTitle = (str) => <div style={{ width: "100%" }}>
    <div style={{ width: 100, float: "left" }}>{str == "crossPolice" ? "业务分析规则" : "对象分析规则"}</div>
    <Button size="small" onClick={() => this.showAdd()}>{"新增规则"}</Button>
  </div>

  componentDidMount() {
    Ajax.GET('/api-audit/single/all/dict_object_type', resp => {
      let list = [];
      if (resp.code == "0") {
        resp.list.map(d => list.push({ name: d.description, value: d.id }));
      }
      this.setState({ objType: list });
    });
    Ajax.GET('/api-audit/single/all/dict_police_type', resp => {
      let PoliceOptions = [];
      if (resp.code == "0") {
        resp.list.map(item => PoliceOptions.push({ label: item.policeType, value: item.id }));
      }
      this.setState({ policeOption: PoliceOptions });
    });
  }

  render() {
    let url = "/api-audit/analytical_rules";
    let url2 = "/api-audit/analyse/cross_police/access_rule";
    return [<Modal
      bodyStyle={{ padding: 0 }}
      width={1000}
      title={this.warpTitle(this.props.type)}
      visible={this.props.show}
      onCancel={(e) => this.props.onCancel()}
      footer={null}>
      <DataTable
        delKey={this.props.type == "objectRule" ? "ids" : "id"}
        query={this.props.type == "objectRule" ? url : url2}
        delete={this.props.type == "objectRule" ? url : url2}
        update={this.props.type == "objectRule" ? url : url2}
        add={this.props.type == "objectRule" ? url : url2}
        objName="规则"
        columns={this.props.type == "objectRule" ? this.objectColumn : this.crossColumn}
        ref={(table) => this.Table = table}
      />
    </Modal>,
    <EditModal
      type={this.props.type}
      show={this.state.showAdd}
      isEdit={this.state.isEdit}
      policeOption={this.state.policeOption}
      objType={this.state.objType}
      param={this.state.editObject}
      onCancel={() => this.setState({ showAdd: false })}
      onOk={(obj) => {
        this.setState({ showAdd: false });
        if (_.has(obj, "id")) {
          this.Table.update(obj);
        } else {
          this.Table.add(obj);
        }
      }}
    />]
  }
}