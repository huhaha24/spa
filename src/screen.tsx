import { Page, Comment } from "vap/layouts/screen";
// import { PieChart } from 'vap/layouts/charts'
import * as React from "react";
import * as ReactDOM from "react-dom";
import {DivChart} from './container/divchart';
import { Ajax, Events, Cache } from 'vap/utils';
import ScrollTable from './container/scrollTable';
import MapChart from './container/mapChart';
import * as _ from 'lodash';
import { LineChart, LineChart1, TopChart, PieChart } from './container/echart'
import baseurl from './config/config'


class Root extends React.Component {

    state={
        data:[],
    }     
 
    render() {      
        //大屏展示默认大小 1920*1080  2行3列  width 1:2:1  480   height 540
        return <Page>
            <Comment left={30} top={30} width={480} height={540}>
                <DivChart 
                    titleCH={'攻击源地区TOP5'} titleEN={'ATTACK SOURCE AREA TOP5'}
                    legend={[{ key: 'year', value: '年' }, { key: 'month', value: '月' }, { key: 'day', value: '日' }]} 
                    sourceTop={'top' + _.now() + _.random(0, 10000)} url='year'>
                </DivChart>
            </Comment>
            <Comment left={30} top={540} width={480} height={540}>
                <LineChart url='lineChart'></LineChart>
            </Comment>
            <Comment left={480} top={0} width={960} height={720}>
                <MapChart></MapChart>
            </Comment>
            <Comment left={550} top={720} width={850} height={360}>
                <ScrollTable header={["地区名称", "总体态势", "用户数(万人)", "设备数(万台)", "总报警数(万条/天)"]}
                    field={['test', 'test2', 'test3', 'test4', 'test5']} defaultWidth={['10%', '20%', '20%', '20%','30%']}
                    url='scroll-table'></ScrollTable>
            </Comment>
            <Comment left={1440} top={0} width={480} height={540}>
                <PieChart url='pieChart'></PieChart>
            </Comment>
            <Comment left={1440} top={540} width={480} height={540}>
                <TopChart url='topChart'></TopChart>
            </Comment>
        </Page>
    }
}
ReactDOM.render(<Root />, document.getElementById("root"));
