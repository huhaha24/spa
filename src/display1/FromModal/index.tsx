/**
 * 用于展示页面的 FromModal 用法和管理页面的
 * 
*/
import { Modal, Form, Icon, Input, Button, DatePicker, Checkbox, Switch, Radio, Slider, Select, InputNumber, Cascader, AutoComplete } from 'antd';
//import { ruleMessage } from '../../RuleTip';
import * as React from 'react';
import * as _ from 'lodash';
import * as moment from 'moment';
import { FromModalProps, Column } from './interface';
var icons = ["step-backward", "step-forward", "fast-backward", "fast-forward", "shrink", "arrows-alt", "down", "up", "left", "right", "caret-up", "caret-down", "caret-left", "caret-right", "up-circle", "down-circle", "left-circle", "right-circle", "up-circle-o", "down-circle-o", "right-circle-o", "left-circle-o", "double-right", "double-left", "verticle-left", "verticle-right", "forward", "backward", "rollback", "enter", "retweet", "swap", "swap-left", "swap-right", "arrow-up", "arrow-down", "arrow-left", "arrow-right", "play-circle", "play-circle-o", "up-square", "down-square", "left-square", "right-square", "up-square-o", "down-square-o", "left-square-o", "right-square-o", "login", "logout", "menu-fold", "menu-unfold", "question", "question-circle-o", "question-circle", "plus", "plus-circle-o", "plus-circle", "pause", "pause-circle-o", "pause-circle", "minus", "minus-circle-o", "minus-circle", "plus-square", "plus-square-o", "minus-square", "minus-square-o", "info", "info-circle-o", "info-circle", "exclamation", "exclamation-circle-o", "exclamation-circle", "close", "close-circle", "close-circle-o", "close-square", "close-square-o", "check", "check-circle", "check-circle-o", "check-square", "check-square-o", "clock-circle-o", "clock-circle", "warning", "lock", "unlock", "area-chart", "pie-chart", "bar-chart", "dot-chart", "bars", "book", "calendar", "cloud", "cloud-download", "code", "code-o", "copy", "credit-card", "delete", "desktop", "download", "edit", "ellipsis", "file", "file-text", "file-unknown", "file-pdf", "file-word", "file-excel", "file-jpg", "file-ppt", "file-add", "folder", "folder-open", "folder-add", "hdd", "frown", "frown-o", "meh", "meh-o", "smile", "smile-o", "inbox", "laptop", "appstore-o", "appstore", "line-chart", "link", "mail", "mobile", "notification", "paper-clip", "picture", "poweroff", "reload", "search", "setting", "share-alt", "shopping-cart", "tablet", "tag", "tag-o", "tags", "tags-o", "to-top", "upload", "user", "video-camera", "home", "spin loading", "loading-3-quarters", "cloud-upload-o", "cloud-download-o", "cloud-upload", "cloud-o", "star-o", "star", "heart-o", "heart", "environment", "environment-o", "eye", "eye-o", "camera", "camera-o", "save", "team", "solution", "phone", "filter", "exception", "export", "customer-service", "qrcode", "scan", "like", "like-o", "dislike", "dislike-o", "message", "pay-circle", "pay-circle-o", "calculator", "pushpin", "pushpin-o", "bulb", "select", "switcher", "rocket", "bell", "disconnect", "database", "compass", "barcode", "hourglass", "key", "flag", "layout", "printer", "sound", "usb", "skin", "tool", "sync", "wifi", "car", "schedule", "user-add", "user-delete", "usergroup-add", "usergroup-delete", "man", "woman", "shop", "gift", "idcard", "medicine-box", "red-envelope", "coffee", "copyright", "trademark", "safety", "wallet", "bank", "trophy", "contacts", "global", "shake", "api", "fork", "dashboard", "form", "table", "profile", "android", "android-o", "apple", "apple-o", "windows", "windows-o", "ie", "chrome", "github", "aliwangwang", "aliwangwang-o", "dingding", "dingding-o", "weibo-square", "weibo-circle", "taobao-circle", "html5", "weibo", "twitter", "wechat", "youtube", "alipay-circle", "taobao", "skype", "qq", "medium-workmark", "gitlab", "medium", "linkedin", "google-plus", "dropbox", "facebook", "codepen", "amazon", "google", "codepen-circle", "alipay", "ant-design", "aliyun"];
/**
 * @private
*/
const formItemLayout = {
  labelCol: {
    sm: { span: 6 },
  },
  wrapperCol: {
    sm: { span: 16 },
  },
};



/**
 * @private
 * 
*/
class FromContent extends React.PureComponent<{ show: boolean, form: any, data: any, columns: Column[] }, { columns: Column[] }> {

  linked = {

  }

  state = {
    columns: []
  }

  componentWillMount() {
    this.state.columns = this.props.columns;
  }
  //文本输入框
  buildText(column, params) {
    const { setFieldsValue } = this.props.form;
    if (column.placeholder) {
      params.placeholder = column.placeholder;
    } else {
      params.placeholder = '请输入' + column.title;
    }
    //如果关联到其它字段，则设置联动事件
    if (_.has(column, 'link')) {
      let link = column.link;
      const callBack = (val, replace = true) => {
        const resp = link.callback(val);
        resp.then(json => {
          let newOptions = [];
          if (_.has(json, 'list')) {
            json.list.map(item => {
              newOptions.push({
                name: item[link.name],
                value: item[link.value]
              });
            });
          }
          let tmpArr = _.slice(this.state.columns);
          let find = false;
          for (let i = 0, _i = tmpArr.length; i < _i; i++) {
            if (find) break;
            let group = tmpArr[i];
            for (let j = 0, _j = group.length; j < _j; j++) {
              if (group[j].field == link.field) {
                group[j].options = newOptions;
                if (replace && newOptions.length > 0) {
                  let val = {};
                  val[link.field] = newOptions[0].value + '';
                  setFieldsValue(val);
                }
                find = true;
                break;
              }
            }
          }
          this.setState({ columns: tmpArr });
        });
      }
      if (link.type == 'blur') {
        params.onBlur = e => callBack(e.target.value)
      } else {
        params.onChange = e => callBack(e.target.value)
      }
      if ((!_.has(this.linked, link.field)) && this.props.show && link.onload && this.props.data[column.field]) {
        this.linked[link.field] = true;
        if (_.trim('' + this.props.data[link.field]) !== '') {
          callBack(this.props.data[column.field], false);
        } else {
          callBack(this.props.data[column.field]);
        }
      }
    } else {
      if (_.has(column, 'onChange')) {
        params.onChange = e => column.onChange(e.target.value)
      }
      if (_.has(column, 'onFocus')) {
        params.onFocus = e => column.onFocus(e.target.value)
      }
      if (_.has(column, 'onBlur')) {
        params.onBlur = e => column.onBlur(e.target.value)
      }
    }

    return <Input  {...params} />
  }

  //数字输入框
  private buildNumber(column, params) {
    return <InputNumber {...params} />
  }

  // private buildSelectDynamic(column, params){
  //   return <AutoComplete dataSource={column.options}/>
  // }

  //下拉框
  private buildSelect(column, params) {
    if (column.placeholder) {
      params.placeholder = column.placeholder;
    } else {
      params.placeholder = '请输入' + column.title;
    }
    if (_.has(column, 'onChange')) {
      params.onChange = value => column.onChange(value)
    }
    if (_.has(column, 'onChange')) {
      params.onChange = value => column.onChange(value)
    }
    return <Select {...params}>
      {column.options.map(item => <Select.Option value={item.value}>{item.name}</Select.Option>)}
    </Select>
  }

  //单选框
  private buildRadio(column, params) {
    if (_.has(column, 'onChange')) {
      params.onChange = e => column.onChange(e.target.value)
    }
    return <Radio.Group {...params}>
      {column.options.map(item => <Radio value={item.value + ''}>{item.name}</Radio>)}
    </Radio.Group>
  }

  //多选框
  private buildCheckBox(column, params) {
    if (_.has(column, 'onChange')) {
      params.onChange = value => column.onChange(value)
    }
    return <Checkbox.Group {...params}>
      {column.options.map(item => <Checkbox value={item.value + ''}>{item.name}</Checkbox>)}
    </Checkbox.Group>
  }

  //选择器
  private buildSwitch(column, params) {
    if (_.has(column, 'onChange')) {
      params.onChange = value => column.onChange(value ? column.options[0].value : column.options[1].value);
    }
    let intval = _.has(this.props.data, column.field) ? this.props.data[column.field] + '' : '';
    let checked = intval === '' || column.options[0].value === intval;
    return <Switch {...params} checkedChildren={column.options[0].name} unCheckedChildren={column.options[1].name} defaultChecked={checked} />
  }

  //日期选择器
  private buildDate(column, params) {
    return <DatePicker {...params} showTime={false} showToday={false} format="YYYY-MM-DD" />
  }

  //日期选择器（带时间）
  private buildDateTime(column, params) {
    return <DatePicker {...params} showTime={true} showToday={false} format="YYYY-MM-DD HH:mm:ss" />
  }

  //日期范围选择器
  private buildDateRange(column, params) {
    return <DatePicker.RangePicker {...params} showTime={false}
      ranges={{ Today: [moment(), moment()], '本月': [moment(), moment().endOf('month')] }}
    ></DatePicker.RangePicker>
  }

  //ICON图标选择器
  private buildIcon(column, params) {
    return <Select {...params} dropdownClassName="icon-select">
      {icons.map(icon => <Select.Option value={icon}><Icon type={icon} /></Select.Option>)}
    </Select>
  }


  inputElement = column => {
    var params: any = {};
    if (column.disabled) {
      params.disabled = true;
    }
    switch (column.type) {
      case 'number':
        return this.buildNumber(column, params);
      case 'select':
        return this.buildSelect(column, params);
      case 'radio':
        return this.buildRadio(column, params);
      case 'checkbox':
        return this.buildCheckBox(column, params);
      case 'switch':
        return this.buildSwitch(column, params);
      case 'date':
        return this.buildDate(column, params);
      case 'datetime':
        return this.buildDateTime(column, params);
      case 'daterange':
        return this.buildDateRange(column, params);
      case 'icon':
        return this.buildIcon(column, params);
      default:
        return this.buildText(column, params);
    }
  }


  // 初始化每列的值 
  initValue(column) {
    if (column.type == 'date' || column.type == 'datetime') {
      if (_.has(this.props.data, column.field)) {
        let date = moment(this.props.data[column.field], 'YYYY-MM-DD HH:mm:ss');
        if (date.format() == 'Invalid date') {
          return moment(new Date(), 'YYYY-MM-DD HH:mm:ss');
        }
        return moment(this.props.data[column.field], 'YYYY-MM-DD HH:mm:ss');
      } else {
        return moment(new Date(), 'YYYY-MM-DD HH:mm:ss');
      }
    } else if (column.type == 'daterange') {
      let ptn = column.field.split(',');
      let [start, end] = [moment(new Date(), 'YYYY-MM-DD'), moment(new Date(), 'YYYY-MM-DD')];
      if (ptn.length == 2) {
        if (_.has(this.props.data, ptn[0])) {
          start = moment(this.props.data[ptn[0], 'YYYY-MM-DD']);
        }
        if (_.has(this.props.data, ptn[1])) {
          end = moment(this.props.data[ptn[1], 'YYYY-MM-DD']);
        }
      }
      return [start, end];
    } else if (column.type == 'checkbox') {
      if (_.has(this.props.data, column.field)) {
        return ('' + this.props.data[column.field]).split(',');
      }
      return [];
    }
    return _.has(this.props.data, column.field) ? this.props.data[column.field] + '' : '';
  }

  buildInput(column: Column) {
    const { getFieldDecorator } = this.props.form;
    // var rules = ruleMessage(column);
    return (_.has(column, 'showed') && (column.showed === undefined || column.showed === false)) ? <React.Fragment></React.Fragment> : <Form.Item {...formItemLayout} label={column.title}>
      {getFieldDecorator(column.field, {
        initialValue: this.initValue(column),
        // rules: rules,
      })(this.inputElement(column))}
    </Form.Item>
  }


  buildColumn(columns: any[]) {
    return columns.map(row => {
      return row.map(column => this.buildInput(column));
    })
  }


  render() {
    return <Form>{this.buildColumn(this.state.columns)}</Form>
  }
}

export default class FromModal extends React.Component<FromModalProps> {

  private _warpColumns(columns: Column[]) {
    let columnGroups = [];
    let breaked = false;
    for (let column of columns) {
      let group = [];
      if (!breaked) {
        columnGroups.push(group);
      } else {
        group = columnGroups[columnGroups.length - 1]
      }
      group.push(column);
      if (column.inline) {
        breaked = true;
      } else {
        breaked = false;
      }
    }
    return columnGroups;
  }


  private submit() {
    // @ts-ignore
    var form = this.refs.modalfrom.getForm();
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      form.resetFields();
      this.props.columns.map(column => {
        if (column.type == 'switch') {
          if (_.has(values, column.field)) {
            if (values[column.field] === true) {
              values[column.field] = column.options[0].value;
            } else if (values[column.field] === false) {
              values[column.field] = column.options[1].value;
            }
          }
        } else if (column.type == 'date') {
          values[column.field] = values[column.field].format('YYYY-MM-DD');
        } else if (column.type == 'datetime') {
          values[column.field] = values[column.field].format('YYYY-MM-DD HH:mm:ss');
        } else if (column.type == 'daterange') {
          let [start, end] = values[column.field];
          let fields = column.field.split(',');
          if (fields.length == 2) {
            values[fields[0]] = start.format('YYYY-MM-DD');
            values[fields[1]] = end.format('YYYY-MM-DD');
            _.unset(values, column.field);
          }
        } else if (column.type == 'checkbox') {
          values[column.field] = values[column.field].join(',');
        }
      })
      this.props.onOk(_.assign({}, this.props.data, values));
    });
  }

  /**
   * @private
  */
  render() {
    let data = _.assign({}, this.props.default, this.props.data);
    // @ts-ignore
    const DataFrom = Form.create()(FromContent);
    const columns = this._warpColumns(this.props.columns);
    const onOk = this.props.onOk;
    return (<Modal {...this.props}
      onOk={() => this.submit()}
    >
      <DataFrom data={data} columns={columns} show={this.props.visible} ref="modalfrom" ></DataFrom>
    </Modal>
    );
  }

}