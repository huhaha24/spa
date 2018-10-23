import * as React from 'react';
//vap
import { TreeSelect } from 'vap/layouts/display';

const TreeNode = TreeSelect.TreeNode;

interface treeProps {
  data: any; //数据 ，对格式有要求
  onClick: Function; //点击事件
  clickList?: Array<number>; // 可点击的层级, default: []
  defaultValue?: string; // 默认值
  placeholder?: string;  // 默认显示语句
  width?: number;      // 框样式
  expandAll?: boolean;  // 默认是否展开全部， default: true
  labelField?: string;  // default: name 
  valueField?: string;  // default: value
  childField?: string;  // default: children
}

/**
 * 组件 - 下拉框 - 树选择
 */
export default class extends React.PureComponent<treeProps> {

  nodeList = [];

  state = {
    value: "",
    nodeList: []
  }

  onSelect = (val) => {
    this.setState({ value: val });
  }

  renderTreeNodes(list, key?: string) {
    let valueField = this.props.valueField ? this.props.valueField : "value";
    let labelField = this.props.labelField ? this.props.labelField : "name";
    let childField = this.props.childField ? this.props.childField : "children";
    return list.map((d, i) => {
      let _key = (key ? key : "0") + "-" + i;
      let disabled = false;
      let isLeaf = false;
      if (this.props.clickList) {
        disabled = this.props.clickList.indexOf(_key.split("-").length - 1) == -1 ? true : false;
      }
      if (!d[childField]) {
        isLeaf = true;
      }

      return <TreeNode key={_key} value={d[valueField]} title={d[labelField]} disabled={disabled} isLeaf={isLeaf}>
        {(d[childField] && d[childField].length > 0) ? this.renderTreeNodes(d[childField], _key) : null}
      </TreeNode>
    });
  }

  render() {
    return (
      <TreeSelect
        onSelect={(value) => this.onSelect(value)}
        showSearch={false}
        defaultValue={this.props.defaultValue}
        style={{ width: this.props.width, height: 22 }}
        value={this.state.value}
        dropdownStyle={{ maxHeight: 200, overflowX: 'hidden', overflowY: 'auto' }}
        placeholder={this.props.placeholder}
        allowClear={false}
        treeDefaultExpandAll={false}
      >
        {this.renderTreeNodes(this.props.data)}
      </TreeSelect>
    );
  }
}
