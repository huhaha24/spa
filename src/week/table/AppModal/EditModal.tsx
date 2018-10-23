import * as React from 'react';
//vap
import { Renders as VRenders } from "vap/utils";
import { Modal, Form, Input, Select, TreeSelect, ListModal } from "vap/layouts/display";
//utils
import "../../../utils/CACHE";
import * as _ from "lodash";
import Renders from '../../../utils/Renders';
//componment
import RuleList from "./RuleList";

//interface
interface option { name?: string; value?: string; }
interface EditProps {
  show: boolean; isEdit: boolean; policeOption?: any;
  title?: string; objType?: Array<option>; param?: any;
  onCancel?: Function; onOk?: Function; type?: string;
}
//constant
const formItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 16 }
};
const typeOption = [
  { label: '全部', value: '' },
  { label: '系统', value: '1' },
  { label: '网站', value: '2' }
];
//render
const webTypeRender = VRenders.listRender(typeOption, "value", "label");
const ipRender = Renders.ipRender();

/**
 * 编辑
 */
export default class EditModal extends React.PureComponent<EditProps> {

  state: any = {
    showSys: false,

    id: 0,

    list: [{}],
    objecttype: 1,
    sysid: "",
    sysname: "",
    description: "",

    businessType: "",
    policeRange: []
  }

  columns = [
    { title: "应用名称", dataIndex: "name" },
    { title: "应用类型", dataIndex: "webType", render: webTypeRender, width: 65 },
    { title: "IP", dataIndex: "ip", render: ipRender, width: 128 },
    { title: "应用域名", dataIndex: "domain", className: 'vapfont' },
    { title: "负责人", dataIndex: "userName" }
  ];

  updateList(sortIndex?: number, obj?: any) {
    let _list = _.extend([], this.state.list);
    if (sortIndex == -1) {
      _list.push({});
    } else if (!obj) {
      _list = _.filter(_list, (d, i) => parseFloat(i) != sortIndex);
    } else if (obj) {
      _.map(_list, (d, i) => {
        if (parseFloat(i) == sortIndex) {
          _list[i] = obj;
        }
      });
    }
    this.setState({ list: _list });
  }

  warpToRules(list) {
    let str = { "regs": [], "subs": [], "keys": [] };
    if (_.isArray(list) && list.length > 0) {
      list.map(d => {
        let isEmpty = _.has(d, "type");
        if (isEmpty && d.type == "befor") {
          str["subs"].push({ "start": d.value[0], "end": d.value[1] });
        } else if (isEmpty && d.type == "regular") {
          str["regs"].push({ "exp": d.value[0] });
        } else if (isEmpty && d.type == "type") {
          str["keys"].push({ "key": d.value[1], "result": d.value[0] });
        }
      });
    }
    return JSON.stringify(str);
  }

  warpToList(rules) {
    let list = [];
    for (var i in rules) {
      if (rules[i].length > 0 && i == "regs") {
        _.map(rules[i], d => list.push({
          type: "regular",
          value: [d["exp"], ""]
        }));
      } else if (rules[i].length > 0 && i == "subs") {
        _.map(rules[i], d => list.push({
          type: "befor",
          value: [d["start"] ? d["start"] : "", d["end"] ? d["end"] : ""]
        }));
      } else if (rules[i].length > 0 && i == "keys") {
        _.map(rules[i], d => list.push({
          type: "type",
          value: [d["result"] ? d["result"] : "", d["key"] ? d["result"] : ""]
        }));
      }
    }
    return list;
  }

  componentWillReceiveProps(props) {
    if (props.isEdit) {
      let obj = props.param;
      for (var i in obj) {
        if (!obj[i]) {
          obj[i] = "";
        }
      }
      let list = [{}];
      let police = [];
      if (props.type == "objectRule") {
        list = this.warpToList(JSON.parse(obj.rules));
      } else {
        police = obj.policeTypeRange.split(",");
      }
      this.setState({
        id: obj.id,
        list: list,
        objecttype: obj.objecttype,
        sysid: obj.sysid,
        sysname: obj.sysname,
        policeRange: police,
        description: obj.description,
        businessType: obj.businessType
      });
    }
  }

  renderForm(isCross?: string) {
    if (isCross == "objectRule") {
      return <Form>
        <Form.Item
          {...formItemLayout}
          label="对象类型">
          <Select size={"small"} defaultValue={this.props.isEdit ? this.state.objecttype : this.props.objType[0].value} onChange={(val) => this.setState({ objecttype: val })}>
            {this.props.objType.map(item => <Select.Option value={item.value}>{item.name}</Select.Option>)}
          </Select>
        </Form.Item>
        <Form.Item {...formItemLayout} label="所属系统">
          <Input
            size={"small"}
            defaultValue={this.props.isEdit ? this.state.sysname : ""}
            onClick={() => this.setState({ showSys: true })}
          />
        </Form.Item>
        <Form.Item {...formItemLayout} label="匹配规则">
          <RuleList
            list={this.props.isEdit ? this.state.list : [{}]}
            onAdd={() => this.updateList(-1)}
            onDel={(sortIndex) => this.updateList(sortIndex)}
            onChange={(sortIndex, item) => this.updateList(sortIndex, item)}
          />
        </Form.Item>
        <Form.Item {...formItemLayout} label="描述">
          <Input
            size={"small"}
            defaultValue={this.props.isEdit ? this.state.description : ""}
            onBlur={(e) => this.setState({ description: e.target.value })}
          />
        </Form.Item>
      </Form>;
    } else {
      return <Form>
        <Form.Item
          {...formItemLayout}
          required={true}
          label="业务类型">
          <Input
            size={"small"}
            defaultValue={this.props.isEdit ? this.state.businessType : ""}
            onBlur={(e) => this.setState({ businessType: e.target.value })}
          />
        </Form.Item>
        <Form.Item {...formItemLayout} label="警种范围">
          <TreeSelect
            defaultValue={this.props.isEdit ? this.state.policeRange : []}
            size={"small"}
            dropdownClassName="task-select-tree task-select-tree-police"
            treeData={this.props.policeOption}
            treeCheckable={true}
            searchPlaceholder='请选择警种'
            onChange={(val) => this.setState({ policeRange: val })} />
        </Form.Item>
        <Form.Item {...formItemLayout} label="描述">
          <Input
            size={"small"}
            defaultValue={this.props.isEdit ? this.state.description : ""}
            onBlur={(e) => this.setState({ description: e.target.value })}
          />
        </Form.Item>
      </Form>;
    }
  }

  render() {
    let param = {
      mutiSelect: false,
      select: (d) => {
        this.setState({ showSys: false, sysid: d[0].systemId ? d[0].systemId + "" : "", sysname: d[0].name + "" })
      },
      search: [{ title: "应用名称", field: "name" }, { title: "负责人", field: "userName" }],
      show: this.state.showSys,
      width: 800,
      title: ``,
      columns: this.columns,
      query: "/api-audit/sysinfo",
      param: {},
      onCancel: (e) => this.setState({ showSys: false })
    }
    return [<Modal
      bodyStyle={{ padding: 0 }}
      width={600}
      visible={this.props.show}
      onOk={() => {
        let _param;
        if (this.props.type == "objectRule") {
          _param = _.extend({ rules: "" }, this.state);
          _param.rules = this.warpToRules(_param.list);
          delete _param.showSys;
          delete _param.list;
          delete _param.businessType;
          delete _param.policeRange;
        } else {
          _param = _.extend({ policeTypeRange: "" }, this.state);
          _param.policeTypeRange = _param.policeRange.join(",");
          delete _param.showSys;
          delete _param.list;
          delete _param.objecttype;
          delete _param.sysid;
          delete _param.sysname;
          delete _param.rules;
          delete _param.policeRange;
        }
        if (!this.props.isEdit) {
          delete _param.id;
        }
        this.props.onOk(_param);
      }}
      onCancel={() => this.props.onCancel()}
      title={this.props.isEdit ? "修改规则" : "新增规则"}>
      {this.props.type == "objectRule" ? <Form>
        <Form.Item
          {...formItemLayout}
          label="对象类型">
          <Select size={"small"} defaultValue={this.props.isEdit ? this.state.objecttype : this.props.objType[0].value} onChange={(val) => this.setState({ objecttype: val })}>
            {this.props.objType.map(item => <Select.Option value={item.value}>{item.name}</Select.Option>)}
          </Select>
        </Form.Item>
        <Form.Item {...formItemLayout} label="所属系统">
          <Input
            size={"small"}
            value={this.state.sysname}
            onClick={() => this.setState({ showSys: true })}
          />
        </Form.Item>
        <Form.Item {...formItemLayout} label="匹配规则">
          <RuleList
            list={this.props.isEdit ? this.state.list : [{}]}
            onAdd={() => this.updateList(-1)}
            onDel={(sortIndex) => this.updateList(sortIndex)}
            onChange={(sortIndex, item) => this.updateList(sortIndex, item)}
          />
        </Form.Item>
        <Form.Item {...formItemLayout} label="描述">
          <Input
            size={"small"}
            defaultValue={this.props.isEdit ? this.state.description : ""}
            onBlur={(e) => this.setState({ description: e.target.value })}
          />
        </Form.Item>
      </Form> : <Form>
          <Form.Item
            {...formItemLayout}
            required={true}
            label="业务类型">
            <Input
              size={"small"}
              defaultValue={this.props.isEdit ? this.state.businessType : ""}
              onBlur={(e) => this.setState({ businessType: e.target.value })}
            />
          </Form.Item>
          <Form.Item {...formItemLayout} label="警种范围">
            <TreeSelect
              defaultValue={this.props.isEdit ? this.state.policeRange : []}
              size={"small"}
              dropdownClassName="task-select-tree task-select-tree-police"
              treeData={this.props.policeOption}
              treeCheckable={true}
              searchPlaceholder='请选择警种'
              onChange={(val) => this.setState({ policeRange: val })} />
          </Form.Item>
          <Form.Item {...formItemLayout} label="描述">
            <Input
              size={"small"}
              defaultValue={this.props.isEdit ? this.state.description : ""}
              onBlur={(e) => this.setState({ description: e.target.value })}
            />
          </Form.Item>
        </Form>
      }
    </Modal>, <ListModal {...param} />];
  }
}