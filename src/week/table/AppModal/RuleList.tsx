import * as React from 'react';
import { Renders as VRenders, Ajax } from 'vap/utils';
import DownLoadPanel from '../DownLoadPanel';
import { TableModal, Modal, DataTable, Icon, Button, Form, Input, Select, List } from "vap/layouts/display";
import "../../../utils/CACHE";
import * as _ from "lodash";
import Render from "../../../utils/Renders"
import Table from '../../../admin/views/ObjectRule/index';

interface RuleListProps {
  list: any;
  onAdd: Function;
  onDel: Function;
  onChange?: Function;
}

interface RuleProps {
  type: "befor" | "regular" | "type";
  value?: any;
  onChange?: Function;
}

const ruleType = [
  { id: "befor", code: "前缀后缀" },
  { id: "regular", code: "正则表达式" },
  { id: "type", code: "业务类型" }
];


class RulerRender extends React.PureComponent<RuleProps> {
  render() {
    let type = this.props.type;
    let value = _.has(this.props, "value") ? this.props.value : ["", ""];
    if (type == "regular") {
      return <Input size="small"
        placeholder="请输入正则表达式"
        defaultValue={value[0]}
        onBlur={(e) => this.props.onChange(e.target.value, 0)}
      />;
    } else if (type == "type") {
      return [
        <div style={{ width: "50%", paddingRight: 5, float: "left" }}>
          <Select
            size={"small"}
            defaultValue={value[0]}
          >
            {ruleType.map(d => <Select.Option value={d.id}>{d.code}</Select.Option>)}
          </Select>
        </div>,
        <div style={{ width: "50%", float: "left", paddingLeft: 5 }}>
          <Input
            size="small"
            placeholder="请输入业务类型对应值"
            onBlur={(e) => this.props.onChange(e.target.value, 1)}
            defaultValue={value[1]}
          />
        </div>
      ];
    } else {
      return [
        <div style={{ width: "50%", paddingRight: 5, float: "left" }}>
          <Input
            size="small"
            placeholder="请输入前缀"
            defaultValue={value[0]}
            onBlur={(e) => this.props.onChange(e.target.value, 0)}
          />
        </div>,
        <div style={{ width: "50%", float: "left", paddingLeft: 5 }}>
          <Input
            size="small"
            placeholder="请输入后缀"
            defaultValue={value[1]}
            onBlur={(e) => this.props.onChange(e.target.value, 1)}
          />
        </div>
      ];
    }
  }
}

export default class RuleList extends React.PureComponent<RuleListProps> {

  renderItem() {
    var self = this;
    return (item, index) => {
      let type = _.has(item, "type") ? item.type : "befor";
      let param = _.has(item, "value") ? { value: item.value } : {};
      return <div style={{ width: "100%", height: 30 }}>
        <div style={{ width: "30%", float: "left", paddingLeft: 10 }}>
          <Select size={"small"} defaultValue={type} onChange={(val) => this.props.onChange(index, { type: val })}>
            {ruleType.map(d => <Select.Option value={d.id}>{d.code}</Select.Option>)}
          </Select>
        </div>
        <div style={{ width: "65%", float: "left", paddingLeft: 15 }}>
          <RulerRender
            {...param}
            type={type}
            onChange={(val, sort) => {
              let _value = _.has(item, "value") ? item.value : ["", ""];
              _value[sort] = val;
              this.props.onChange(index, { type: type, value: _value });
            }}
          />
        </div>
        <div style={{ width: "5%", float: "left", paddingLeft: 5, paddingTop: 2 }}>
          <Icon type="minus" style={{ cursor: "pointer" }} onClick={() => self.props.onDel(index)} title={"删去规则"} />
        </div>
      </div>
    }
  }

  render() {
    return <List
      dataSource={this.props.list}
      renderItem={this.renderItem()}
      bordered={false}
      size={"small"}
      footer={<Icon type="plus" onClick={() => this.props.onAdd()} style={{ cursor: "pointer", padding: "0 50% 0 50%" }} title={"添加规则"} />}
    />;
  }
}