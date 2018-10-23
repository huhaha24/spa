/**
 * 关联资产页面
 */
import * as React from 'react';
import { Modal, Table } from 'antd';
import { Ajax } from 'vap/utils';

const arr = ["信息", "信息", "低风险", "中风险", "高风险", "紧急风险"];
const params = {
  start_: 0,
  count_: 10,
  order_: "guid",
  by_: 'desc',
};

class App extends React.PureComponent<any> {

  state = {
    data: [],
    current: 1,
    pageSize: 10,
    total: 0
  }

  columns = [
    {
      title: '资产IP',
      dataIndex: 'assetIp',
      width: 150
    },
    {
      title: '计算结果',
      dataIndex: 'result',
      width: 100,
      render: text => arr[parseInt(text)]
    },
    {
      title: '计算时间',
      dataIndex: 'time',
      width: 100
    },
    {
      title: '相关漏洞数',
      dataIndex: 'leakcount',
      width: 120
    },
    {
      title: '紧急（个）',
      dataIndex: 'urgentcount',
      width: 100
    },
    {
      title: '高风险（个）',
      dataIndex: 'highriskcount',
      width: 100
    },
    {
      title: '中风险（个）',
      dataIndex: 'mediumriskcount',
      width: 100
    },
    {
      title: '低风险（个）',
      dataIndex: 'lowriskcount',
      width: 100
    },
    {
      title: '信息（个）',
      dataIndex: 'information',
      width: 100
    },
    {
      title: '漏洞总数（个）',
      dataIndex: 'risktotal',
      width: 100
    }
  ];

  componentDidMount() {
    this.query(params);
  }

  search = (pagination) => {
    const { pageSize, current } = pagination;
    this.setState({ pageSize, current });
    let query = {
      ...params,
      start_: (current - 1) * pageSize,
      count_: pageSize,
    }
    this.query(query);
  }

  query = (query) => {

  }

  render() {
    return <Modal
      title='导入弱点'
      width={1000}
      onOk={this.props.onCancel}
      onCancel={this.props.onCancel}
      visible={this.props.visible}
    >
      <Table
        columns={this.columns}
        dataSource={this.state.data}
        onChange={(pagination) => this.search(pagination)}
        pagination={{
          current: this.state.current,
          total: this.state.total,
          showQuickJumper: true,
          showSizeChanger: true,
          hideOnSinglePage: false,
          pageSize: this.state.pageSize,
          pageSizeOptions: ["10", "15", "50", "100"]
        }}
      >
      </Table>
    </Modal>
  }
}

export default App;