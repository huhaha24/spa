
import * as React from 'react';
import { Ajax } from 'vap/utils';
import { HEIGHT, RowPanel, Icon, DataTable, Button, message, Popconfirm } from "vap/layouts/display";
//componments
import Page from '../AuditPage';
import FromPanel from '../FromPanel';
import TitlePanel from "../TitlePanel";
//util
import * as _ from "lodash";

let getQueryStringByName = (name) => {
    var svalue = decodeURI(location.href).match(new RegExp("[\?\&]" + name + "=([^\&]*)(\&?)", "i"));
    return svalue ? svalue[1] : svalue;
}
const arr = ["信息", "信息", "低风险", "中风险", "高风险", "紧急风险"];
export default class extends React.PureComponent<any> {
    table: DataTable<any> = null;
    param: any = {
        order_: 'id',
        by_: 'desc',
    };
    state = {
        query: {
            vul_name: "",
            riskLevel: "",
            order_: 'id',
            by_: 'desc',
            importType:'',
            descript:'',
            solution:'',
            ignore_value:Boolean,
        }
    }
    componentWillMount(){
        this.setState({
            query: {
                vul_name: this.props.vul_name,
                riskLevel: this.props.riskLevel,
                importType:this.props.importType,
                ignore_value:this.props.ignore_value.toString(),
                order_: 'id',
                by_: 'desc',
            }
        })
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps) {
            this.setState({
                query: {
                    vul_name: nextProps.vul_name,
                    riskLevel: nextProps.riskLevel,
                    importType:nextProps.importType,
                    ignore_value:nextProps.ignore_value.toString(),
                    order_: 'id',
                    by_: 'desc'
                }
            })
        }
    }

    ipClick = (ip) => {
        window.open("/audit/device/profile?ip=" + ip);
    }
    columns = [
        {
            title: '弱点名称',
            dataIndex: 'vulName',
            width: 120
        },
        {
            title: 'IP',
            dataIndex: 'ip',
            width: 120,
            render: (value, editObject) => {
                if (value) {
                    return <a onClick={() => this.props.ipClick(value)}>{value}</a>;
                } else {
                    return <label>{value}</label>;
                }
            }
        },
        {
            title: '漏洞等级',
            dataIndex: 'riskLevel',
            width: 150,
            render: text => arr[parseInt(text)]
        },
        {
            title: '弱点描述',
            dataIndex: 'descript',
            width: 400
        },
        {
            title: '解决办法',
            dataIndex: 'solution',
            width: 280
        },
        {
            title: '白名单漏洞',
            dataIndex: 'ignore_value',
            width: 120,
            render: (value, editObject) => {
                if (value == 1) {
                    return "是";
                } else {
                    return "否";
                }
            }
        }
    ];
    //查询语句，extend和assign都可以用后面对象的值覆盖前面的对象的值，但是前者会把原型的值也附加到上面去，后者则不会
    query = param => {
        _.extend(this.param, param);
        this.table.query(this.param);
    };

    render() {
        //React.Fragment是为了生成子元素列表
        return <React.Fragment>
            <FromPanel
                height={40}
                onQuery={query => this.query(query)}
                rows={[[
                    { width: 256, label: "IP", field: "ip", },
                    { field: "", label: "查询", width: 40, type: "submit" }
                ]]}
            />
            <RowPanel height={HEIGHT(40, 40)}>
                <DataTable
                    columns={this.columns}
                    objName="漏洞列表"
                    query="/api-weak/weakness/Vulanlysis"
                    ref={table => this.table = table}
                    // 这个query是一个对象，里面存放的是这个组件自己需要的内容
                    param={this.state.query}
                    scroll={{ y: 400 }}
                />
            </RowPanel>
        </React.Fragment >
    }
}
