import * as React from 'react';
import * as _ from 'lodash';
import { RowPanel, Row, Col, Form, Radio, Button, Input, Checkbox, Select, DatePicker } from 'vap/layouts/display';
import TreeSelect from "../TreeSelect";
import DateRange from "../DateRange";

interface Option {
  label: string;
  value: string | number;
}
interface Field {
  field: string;
  label: string;
  type?: 'checkbox' | 'radio' | 'select' | 'text' | 'number' | 'submit' | 'time' | 'timerange' | 'treeselect';
  options?: Option[];
  width: number;
  formate?: string;
  split?: number;
  clickList?: Array<number>;
  margin?: string;
}

interface FormPanelOpts {
  onQuery: Function,
  height: number,
  rows: Field[][],
  default?: any,
  bordered?: boolean,
}

export default class extends React.PureComponent<FormPanelOpts>{
  query: any = {}

  componentDidMount() {
    _.extend(this.query, this.props.default);
  }

  checkbox = (field: Field) => {
    let def = _.has(this.props.default, field.field) ? this.props.default[field.field] : '';
    def = def.length ? def.split(',') : [];
    return <Checkbox.Group defaultValue={def} options={field.options} onChange={e => this.query[field.field] = e.join(',')} />
  }

  radio = (field: Field) => {
    let def = _.has(this.props.default, field.field) ? this.props.default[field.field] : '';
    return <Radio.Group defaultValue={def} size="small" onChange={e => this.query[field.field] = e.target.value}>
      {field.options.map(item => <Radio value={item.value}>{item.label}</Radio>)}
    </Radio.Group>
  }

  select = (field: Field) => {
    let def = _.has(this.props.default, field.field) ? this.props.default[field.field] : '';
    return <Select size="small" style={{ width: field.width - 80 }} defaultValue={def} onChange={e => this.query[field.field] = e}>
      {field.options.map(item => <Select.Option value={item.value}>{item.label}</Select.Option>)}
    </Select>
  }

  text = (field: Field) => {
    let def = _.has(this.props.default, field.field) ? this.props.default[field.field] : '';
    return <Input size="small" defaultValue={def} placeholder={`请输入${field.label}`} style={{ width: field.width - 80 }} onChange={e => this.query[field.field] = e.target.value} />
  }

  submit = (field: Field) => {
    return <Button size="small" style={field.margin ? { margin: field.margin, borderRadius: 3 } : { marginLeft: 12, borderRadius: 3 }} type="primary" onClick={() => this.props.onQuery(this.query)}>{field.label}</Button>
  }
  number = (field: Field) => {
    let def = _.has(this.props.default, field.field) ? this.props.default[field.field] : '';
    return <Input size="small" defaultValue={def} placeholder={`请输入${field.label}`} style={{ width: field.width - 80 }} onChange={e => this.query[field.field] = e.target.value} />

  }
  time = (field: Field) => {
    let def = _.has(this.props.default, field.field) ? this.props.default[field.field] : '';
    let hasFormat = _.has(field, "formate") ? field.formate : "YYYY-MM-DD HH:mm:ss";
    return <DatePicker defaultValue={def} placeholder={`请输入${field.label}`} showTime format={hasFormat} onChange={e => this.query[field.field] = e["target"].value} allowClear={false} className={"form-panel-time"} />
  }
  timerange = (field: Field) => {
    return <DateRange split={field.split || 7} onChange={(start, end) => {
      let [startField, endField] = field.field.split(',');
      this.query[startField] = start + ' 00:00:00';
      this.query[endField] = end + ' 23:59:59';
    }}
    />
  }
  treeselect = (field: Field) => {
    return <TreeSelect data={field.options} onClick={e => this.query[field.field] = e} width={field.width - 80} clickList={field.clickList} defaultValue={""} />
  }


  renderItem = (field: Field) => {
    switch (field.type) {
      case 'text':
        return this.text(field);
      case 'checkbox':
        return this.checkbox(field);
      case 'radio':
        return this.radio(field);
      case 'select':
        return this.select(field);
      case 'submit':
        return this.submit(field);
      case 'time':
        return this.time(field);
      case 'timerange':
        return this.timerange(field);
      case 'treeselect':
        return this.treeselect(field);
      default:
        return this.text(field);
    }
  }

  renderCol = (field: Field) => {
    return <Col style={{ width: field.width }}><Form.Item label={`${field.type == 'submit' ? '' : field.label + ':'}`}>
      {this.renderItem(field)}
    </Form.Item>
    </Col>
  }

  renderRow = (row: Field[], rowHeight: number) => {
    return <Row height={rowHeight} style={{ width: '100%' }}>
      {row.map(field => this.renderCol(field))}
    </Row>

  }

  render() {
    const rowHeight = Math.floor(this.props.height / this.props.rows.length);
    let param: any = {};
    if (this.props.bordered === false) {
      param.bordered = false;
    }
    return <RowPanel {...param} height={this.props.height} className="from-panel">
      <Form>
        {this.props.rows.map(row => this.renderRow(row, rowHeight))}
      </Form>
    </RowPanel>
  }
}