import * as React from 'react';
import { Ajax, Cache, Events } from 'vap/utils';
import { Icon, List } from "vap/layouts/display";
import * as _ from 'lodash';

var list = Cache.sessionData('vap-audit-export') || [];
list.map(item => item.interval = 0);

export default class extends React.PureComponent {

  state = {
    downloadList: [],
    cssArr: ["vap-audit-export"]
  };

  //注册监听事件
  componentDidMount() {
    Events.on('download', x => {
      if (x.code == "0") {
        list.push({
          fileName: x.data.firstExcelInfo.filename,
          process: (x.data.process * 100),
          workId: x.data.workId
        });
        Cache.sessionData('vap-audit-export', list);
        this._process();
        this.setState({ cssArr: ["vap-audit-export", "vap-audit-export-show"] });
      }
    });

    if (list.length > 0) {
      this._process();
      this.setState({ cssArr: ["vap-audit-export", "vap-audit-export-show"] });
    }
  }

  _download = (obj: any) => {
    if (obj.process == 100) {
      if (_.has(document, 'downloadFrame')) {
        document["downloadFrame"].location.href = '/api-audit/download/excel/' + obj.workId;
        this._del(obj);
      } else {
        // Firefox 
        //@ts-ignore 
        document.getElementsByName('downloadFrame')[0].src = '/api-audit/download/excel/' + obj.workId;
        this._del(obj);
      }
    }
  };

  _del = (obj: any) => {
    list = _.filter(list, item => item.workId != obj.workId);

    if (list.length == 0) {
      this.setState({ downloadList: _.concat([], list), cssArr: ["vap-audit-export"] });
    } else {
      this.setState({ downloadList: _.concat([], list) });
    }
    Cache.sessionData('vap-audit-export', list);
  };

  _hide = () => {
    list.length = 0;
    Cache.sessionDelete("vap-audit-export");
    this.setState({ downloadList: [], cssArr: ["vap-audit-export"] });
  };

  loopDownLoadList(item: any) {
    return <div className={"item item-" + item.process}>
      <div className="fileExcel">
        <Icon type="file-excel" style={{ fontSize: 32, color: 'black' }}></Icon>
      </div>
      <div className="fileinfo">
        <div>文件：{item.fileName}</div>
        <div>进度：{item.process}%</div>
      </div>
      <div className="operate">
        <a onClick={() => this._download(item)}>下载</a> | <a onClick={() => this._del(item)}>删除</a>
      </div>
    </div>;
  };

  _process() {
    list.map(item => {
      if (item.process == 100) {
        if (item.interval) {
          window.clearInterval(item.interval);
          item.interval = 0;
        }
        return;
      } else if (item.interval && item.interval > 0) {
        return;
      }
      item.interval = window.setInterval(() => {
        Ajax.GET("/api-audit/progress/excel/" + item.workId, resp => {
          item.process = resp.data.process * 100;
          if (item.process == 100) {
            window.clearInterval(item.interval);
            item.interval = 0;
          }
          this.setState({ downloadList: _.concat([], list) });
        });
      }, 1000);
    });
    this.setState({ downloadList: _.concat([], list) });
  }

  render() {
    let count = 0;
    let title = "";
    this.state.downloadList.map(d => {
      if (d.process == 100) {
        count++;
      }
    });
    if (count == this.state.downloadList.length) {
      title = "已为您生成全部文件，请下载";
    } else if (count < this.state.downloadList.length && count > 0) {
      title = "已为您生成部分文件(" + count + "/" + this.state.downloadList.length + ")，请下载";
    } else if (count == this.state.downloadList.length) {
      title = "正在为您生成文件，请稍后";
    }
    return <div className={_.join(this.state.cssArr, " ")} id="_vap_export">
      <div className="header">
        <div className="title"><b>{title}</b></div>
        <div className="close"><Icon type="close" onClick={this._hide}></Icon></div>
      </div>
      <div className="body">
        <List
          bordered={false}
          split={false}
          dataSource={this.state.downloadList}
          renderItem={item => this.loopDownLoadList(item)}
        />
      </div>
      <iframe style={{ display: "none" }} name="downloadFrame"></iframe>
    </div>
  };
}