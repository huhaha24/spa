import * as React from "react";
import * as ReactDOM from "react-dom";
//import { HEIGHT,Page,Panel,Row,RowPanel,DataTable,Table} from "vap/layouts/display";
import { HEIGHT, Page, Panel, Row, RowPanel, DataTable, Table, Button} from "./display1";
import {BarChart,PieChart,LabelChart} from  './charts';
import { Events,Cache } from 'vap/utils';
import Ajax from './utils/Ajax'
import App from './week/table/weaknessStatistics'
import * as _ from 'lodash';
import './test.less'
//constant
const areaOption = [];

/**
 * invalid
 */
class Root extends React.PureComponent {
    state={
        data:[]
    }

    param: any = {
        order_: 'importTime',
        by_: 'desc',
    };

    componentWillMount(){
        Ajax.GET('https://easy-mock.com/mock/5bbd8dd5004caf3b6a68db2b/API/list',(data) =>{
            console.log(data)
        })

    }

    componentDidMount(){
        // window.setInterval(()=>{
        //     this.setState({data:[
        //         {name:_.random(222222),value:_.random(231212) },
        //         {name:_.random(222222),value:_.random(231212) },
        //         {name:_.random(222222),value:_.random(231212) },
        //         {name:_.random(222222),value:_.random(231212) },
        //         {name:_.random(222222),value:_.random(231212) },
        //         {name:_.random(222222),value:_.random(231212) },

        //     ]})


        // },2222)
    }

    render() {
        return <Page >
            <Row height='100%'>
                <Panel width={400}>
                    <Row height={250}>
                        <Panel title='人员类别分布 (全国)' icon='idcard'>
                            <LabelChart
                                data={[{label:'11',value:'111'},{label:'11',value:'111'},{label:'11',value:'111'},{label:'11',value:'111'}]}
                                labelField="label"
                                valueField="value"
                                percent={true}
                                //onClick={item => this.queryPerson({ personType: item.id }, item.label)}
                            />
                            {/* <BarChart.Top
                            data={this.state.data}
                            labelField="name"
                            valueField="value"
                            /> */}
                        </Panel>
                    </Row>
                    <Row height={250}>
                        <Panel title='人员年龄分布 (全国)' icon='team'>
                            <BarChart.MultiInline
                                data={[{label:'测试一',man:50,woman:100},{label:'测试二',man:100,woman:50}]}
                                labelWidth={45}
                                valueFields={['man', 'woman']}
                                valueTitles={['男', '女']}
                                labelField="label"
                                maxCount={8}
                                //onClick={(e, l) => this.queryPerson({ age: e.label, sex: l == 'man' ? '男' : '女' }, e.label + ' / ' + (l == 'man' ? '男' : '女'))}
                            />
                        </Panel> 
                    </Row>
                    <Row height={HEIGHT(250,250)}>
                        <Panel title='部门（单位）TOP 5 (全国)' icon='shop'>
                            <BarChart.Top2
                                data={[{orgName:'机构1',count:15},{orgName:'机构2',count:20}]}
                                labelField="orgName"
                                valueField="count"
                                maxCount={5}
                                format="usd"
                                //onClick={e => this.queryPerson({ orgCode: e.orgCode }, e.orgName)}
                            />
                        </Panel>
                    </Row>
                </Panel>
                <Panel>
                    <Row height={HEIGHT(300)}>
                        <Panel title='人员分布情况' icon='solution'>
                            {/* <App /> */}
                            <BarChart.MutiHorzontal
                                data={[{value1:10,value2:30,value3:20,name:'民警'},{value1:20,value2:16,value3:10,name:'辅警'},{value1:10,value2:15,value3:40,name:'外协'}]}
                                labelField={'name'}
                                labels={['民警', '辅警', '外协']}
                                valueFields={['value1', 'value2', 'value3']}
                                //labelFormat={areaRender}
                                doubleCancel={true}
                                // onClick={(d, i) => {
                                //     this.switchArea(d ? d.name : '')
                                // }}
                                legend={{
                                    show: true,
                                    width: 160
                                }}
                            />
                        </Panel>
                    </Row>
                    <Row height={300}> 
                        <Panel title='数据盗取风险TOP5' icon='copy'>
                            <BarChart.Papaw data={[{userName:'zhansan',riskEvaluation:10}]} labelField="userName" valueField="riskEvaluation"></BarChart.Papaw>
                        </Panel>
                        <Panel title='人员行为风险TOP5' icon='exclamation-circle-o'>
                            <BarChart.Papaw data={[{userName:'zhansan',riskEvaluation:10}]} labelField="userName" valueField="riskEvaluation"></BarChart.Papaw>
                        </Panel>
                        <Panel title='人员行为风险TOP5' icon='exclamation-circle-o'>
                            <BarChart.Papaw data={[{userName:'zhansan',riskEvaluation:10}]} labelField="userName" valueField="riskEvaluation"></BarChart.Papaw>
                        </Panel>
                    </Row>
                </Panel>
                <Panel width={400}>
                    <Row height={250}>
                    <Panel title='今日业务违规 (全国)' icon='warning'>
                       
                    </Panel>
                    </Row>
                    <Row height={250}>
                    <Panel title='证书信息有误 (全国)' icon='question-circle-o'></Panel>
                    </Row>
                    <RowPanel height={HEIGHT(250,250)}
                            icon="paper-clip"
                            title='未维护隶属0人 (全国)'
                            tabList={[{ key: 'wxList', tab: '外协',content:'test' }, { key: 'fjList', tab: '辅警',content:'test' }]}
                            //onTabChange={key => this.setState({ relateData:''})}
                            >
                            <Table dataSource={[]}
                                pagination={false}
                                columns={[
                                    { title: '序号', dataIndex: 'index', width: 50 },
                                    { title: '姓名', dataIndex: 'userName' },
                                    { title: '身份证', dataIndex: 'userIdnEx', render: ()=>1 },
                                    { title: '操作', dataIndex: 'userIdnEx', render: ()=>1 }
                                ]}
                            />
                        </RowPanel>
                </Panel>
            </Row>

        </Page>
    }
}
ReactDOM.render(<Root />, document.getElementById("root"));
