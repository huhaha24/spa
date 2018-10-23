/**
 * 弱点统计
 */
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { Modal, Tooltip } from 'antd';
import { Format } from 'vap/utils';
import { HEIGHT, RowPanel, Icon, DataTable, Button, message, Popconfirm } from "vap/layouts/display";
//componments
import AuditPage from '../AuditPage';
import FromPanel from '../FromPanel';
import TitlePanel from "../TitlePanel";
//util
import * as _ from "lodash";

//查看详情
import VuleList from './vulList';

export default class App extends React.PureComponent<any>{

    param: any = {
        order_: 'id',
        by_: 'desc',
        count_:'20'
    };
    state = {
        showAdd: false,
        showEdit: false,
        ids: [],
        editObject: {},
        query: {
            order_: 'id',
            by_: 'desc'
        },
        vulListshow :false,
        vul_name: '',
        riskLevel: '',
        importType:'',
        descript:'',
        solution:'',
        ignore_value:Boolean
    };

    events = {
        download: () => {
            Modal.confirm({
                title: "确定导出漏洞列表？",
                okText: "确定",
                cancelText: "取消",
                onOk: () => {
                    window.open("/api-weak/weakness/exportVulInfoList");
                }
            });
        }
    }

    ipClick = (ip) => {
        window.open("/audit/device/profile?ip=" + ip);
    }

    hostClick = (record) => {
        this.setState({
            vul_name:record.vul_name,
            riskLevel:record.risk_level,
            solution : record.solution,
            descript : record.descript,
            ignore_value :record.ignore_value,
            importType : record.import_type,
            vulListshow :true
        })
        console.info(record)
    }
    columns = [
        {
            title: '弱点名称',
            dataIndex: 'vul_name',
            render: text => <Tooltip title={text}>{Format.formatString(text, 24)}</Tooltip>
        },
        {
            title: '漏洞等级',
            dataIndex: 'risk_level',
            render: text => {
                var temp = ["", "信息", "低风险", "中风险", "高风险", "紧急风险"];
                return <span>{temp[parseInt(text)]}</span>;
            }
        },
        {
            title: '漏洞类型',
            dataIndex: 'import_type',
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
        // {
        //     title: '弱点描述',
        //     dataIndex: 'descript',
        //     render: text => <Tooltip title={text}>{Format.formatString(text, 50)}</Tooltip>
        // },
        // {
        //     title: '解决办法',
        //     dataIndex: 'solution',
        //     render: text => <Tooltip title={text}>{Format.formatString(text, 50)}</Tooltip>
        // },
        {
            title: '弱点主机',
            dataIndex: 'ip',
            render: ( value,record ) => {
                console.info(record.ignore_value)
                return <a onClick={() => this.hostClick(record)}>查看详情</a>;
                
            }
        },
        {
            title: '白名单漏洞',
            dataIndex: 'ignore_value',
            render: text => <span>{text ? "是" : "否"}</span>
        }
    ];

    table: DataTable<any> = null;
    query = param => {
        _.extend(this.param, param);
        this.table.query(this.param);
    };
    render() {
        const { weaknessMaintain, dispatch } = this.props;
        return <AuditPage>
            <TitlePanel title="弱点维护">
                
            </TitlePanel>
            <FromPanel
                height={82}
                onQuery={query => this.query(query)}
                rows={[[
                    { label: "弱点名称", field: "vul_name", width: 256 },
                ], [
                    {
                        label: "漏洞等级", field: "levels", type: "checkbox", width: 500,
                        options: [{
                            label: '信息',
                            value: "1"
                        }, {
                            label: '低风险',
                            value: "2"
                        }, {
                            label: '中风险',
                            value: "3"
                        }, {
                            label: '高风险',
                            value: "4"
                        }, {
                            label: '紧急风险',
                            value: "5"
                        }]
                    },
                    { field: "", label: "查询", width: 40, type: "submit" }
                ]]}
            />
            {/* Modal用来控制弹出框的整体格式 */}
            <Modal
                title={"弱点详情"}
                onCancel={() => {
                    this.setState({
                        vulListshow: false
                    })
                }}
                visible={this.state.vulListshow}
                footer={[]}
                width={1300}
            >
                {/* VuleList用来控制弹出框的内容 */}
                <VuleList
                     ipClick={this.ipClick}//点击ip就切换到那个页面
                    //riskLevelName={this.state.riskLevelName}
                    vul_name={this.state.vul_name} 
                    riskLevel={this.state.riskLevel}
                    importType={this.state.importType}
                    ignore_value={this.state.ignore_value}
                    />
            </Modal>

            <RowPanel height={HEIGHT(40, 82)}>
                <DataTable
                    columns={this.columns}
                    objName="弱点列表"
                    query="/api-weak/weakness/getVulGroupStatistics"
                    ref={table => this.table = table}
                    pageSize={20}
                    param={this.state.query}
                />
            </RowPanel>
        </AuditPage>;
    }
}
