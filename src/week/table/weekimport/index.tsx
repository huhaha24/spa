/**
 * 弱点导入
 */
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { HEIGHT, RowPanel, Icon, DataTable, Button } from "vap/layouts/display";//componments
import AuditPage from '../AuditPage';
import FromPanel from '../FromPanel';
import TitlePanel from "../TitlePanel";
//util
import * as _ from "lodash";

import moment from 'moment';
import ImportModal from './importModal';
import RelatedAssets from './relatedAssets';
import { Tooltip } from 'antd';
import { Format } from 'vap/utils';

export default class App extends React.PureComponent<any>{
  table: DataTable<any> = null;
  param: any = {
    order_: 'importTime',
    by_: 'desc',
  };
  state = {
    showImport: false,
    showAsset: false,
    editObject: {},
    visible: false,
    query: {
      order_: 'importTime',
      by_: 'desc'
    }
  };

  events = {
    // 刷新列表方法
    refresh: () => {
      // @ts-ignore
      this.refs.table.reflush();
    },
    /**
     * 导入
     */
    import: () => {
      this.setState({
        showImport: true
      });
    },
    /**
     * 关闭
     */
    onCancel: () => {
      this.setState({
        showImport: false,
        showAsset: false
      });
    },
    onOk: () => {
      // @ts-ignore
      this.table.reflush();
      this.events.onCancel();
    }
  }

  columns = [
    {
      title: '上传时间',
      dataIndex: 'importTime',
      render: (text) => {
        return moment(text).format("YYYY-MM-DD HH:mm:ss");
      }
    },
    {
      title: '漏洞类型',
      dataIndex: 'importType',
      render: (text, editObject) => {
        let result = "";
        switch (text) {
          case "DB":
            result = "DB漏洞";
            break;
          case "WEB":
            result = "Web漏洞";
            break;
          case "OS":
            result = "OS漏洞";
            break;
        }
        return result;
      }
    },
    {
      title: '文件名称',
      dataIndex: 'fileName',
      render: text => <Tooltip title={text}>{Format.formatString(text, 30)}</Tooltip>
    },
    {
      title: '操作',
      dataIndex: 'id',
      render: (text, editObject) => {
        return <a onClick={() => {
          this.setState({
            showAsset: true,
            editObject
          });
        }}>查看受影响设备</a>
      }
    }
  ];
  query = param => {
    _.extend(this.param, param);
    this.table.query(this.param);
  };

  render() {
    const { weakNessImport, dispatch } = this.props;
    return (
      <AuditPage>
       {/*  <TitlePanel title="弱点导入">
          <Button icon="to-top" onClick={() => this.events.import()} >导入</Button>
        </TitlePanel> */}
        <FromPanel
          height={100}
          onQuery={query => this.query(query)}
          rows={[[
            {
              label: "扫描器类型", field: "importType", width: 450, type: "radio", options: [{
                label: "全部",
                value: ""
              },
              {
                label: 'DB漏洞',
                value: "DB"
              }, {
                label: 'Web漏洞',
                value: "WEB"
              }, {
                label: 'OS漏洞',
                value: "OS"
              }
              ]
            },
            { field: 'beginTime|endTime', label: '上传时间', width: 445, type: "timerange" },
            { field: 'fileName', label: '文件名称', width: 256 },
            { field: "", label: "查询", width: 40, type: "submit" }
          ]]}
        />
        <RowPanel height={HEIGHT(40, 40)}>
          <DataTable
            columns={this.columns}
            objName="弱点列表"
            query="/api-weak/weakness/getVulImportInfoList"
            ref={table => this.table = table}
            pageSize={20}
            param={this.state.query}
          />
        </RowPanel>
        {/* <ImportModal
          onCancel={this.events.onCancel}
          show={this.state.showImport}
        ></ImportModal>
        <RelatedAssets
          onCancel={this.events.onCancel}
          visible={this.state.showAsset}
        >
        </RelatedAssets> */}
      </AuditPage>
    );
  }
}

