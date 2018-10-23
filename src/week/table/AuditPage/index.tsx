import * as React from 'react';
import { LocaleProvider } from 'antd';
import { Events } from 'vap/utils';
import DownLoadPanel from '../DownLoadPanel';
import { Icon } from "vap/layouts/display";
import "../../../utils/CACHE";
import AppModal from "../AppModal";
// @ts-ignore
const zh_ch: Locale = antd.locales.zh_CN;

class SettingButton extends React.PureComponent {
  render() {
    return [<li>
      <a href="javascript:void(0);" onClick={() => Events.call('_ext_icon_click', "crossPolice")}>
        <Icon type={"table"} title="跨警种访问规则" />
      </a>
    </li>,
    <li>
      <a href="javascript:void(0);" onClick={() => Events.call('_ext_icon_click', "objectRule")}>
        <Icon type={"profile"} title="对象分析规则" />
      </a>
    </li>]
  }
}

export default class extends React.PureComponent {

  state: any = {
    showModal: false,
    param: {},
    current: ""
  }

  componentWillMount() {
    if (window.location.pathname.slice(0, 10) == "/audit/app") {
      Events.call('_ext_icon', SettingButton);
      Events.on('_ext_icon_click', (str) => this.setState({ showModal: true, current: str }));
    }
  }

  render() {
    //LocaleProvider用来控制语言
    return <LocaleProvider locale={zh_ch}>
      <div className="vap-container">
        {this.props.children}
        <AppModal
          show={this.state.showModal}
          onCancel={(e) => this.setState({ showModal: false })}
          type={this.state.current} />
        {/* <DownLoadPanel></DownLoadPanel> */}
      </div>
    </LocaleProvider>;
  }
}