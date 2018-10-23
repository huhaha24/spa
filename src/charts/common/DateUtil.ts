import * as moment from 'moment';
import * as _ from 'lodash';

export default class {
    //获取整个月份的数组
    // static monthTrend = (month) => {
    //     var from = new Date(month);
    //     let m = from.getMonth();
    //     let start = from.getTime();
    //     let now = _.now();
    //     var arr = [];
    //     for (let i = 0; i < 32; i++) {
    //         let tmp = start + i * 86400000;
    //         if (tmp > now) {
    //             break;
    //         }
    //         let t = moment(tmp);
    //         if (t.month() > m) {
    //             break;
    //         }
    //         arr.push(t.format('YYYY-MM-DD'));
    //     }
    //     return arr;
    // }


    static toRange = (month: string): [string, string] => {
        let start = month;
        var end = '';
        if (month.length == 7) {
            start = start + '-01'
        }
        end = moment(start).add(1, 'months').date(1).subtract(1, 'days').format('YYYY-MM-DD')
        return [start, end];
    }

    /**
     * 获取时间段的日期数组
    */
    static dateArr = (start: string, end: string = null, format = 'YYYY-MM-DD') => {
        // var _start = moment(start).hour(0)
        var _start = parseInt(moment(start).millisecond(0).second(0).minute(0).hour(0).format('x'));
        var _end = 0;
        if (end) {
            _end = parseInt(moment(end).millisecond(999).second(59).minute(59).hour(23).format('x'));
        } else {
            _end = parseInt(moment(start).add(1, 'months').date(1).subtract(1, 'days').millisecond(999).second(59).minute(59).hour(23).format('x'));
        }
        var arr = [];
        while (_start < _end) {
            arr.push(moment(_start).format(format));
            _start += 86400000;
        }
        return arr;
    }

    /**
     * 以批定日期和日期内数据填满一个默认为0的日期区间内的数据
    */
    static sortDateData = (dateArr: string[], dataArr: any[], field: string, def: string[]) => {
        var defs = {};
        def.map(key => defs[key] = 0);
        let arr = dateArr.map(date => {
            return { [field]: date, ..._.assign({}, defs) }
        })
        arr.map(item => {
            let obj = _.find(dataArr, { [field]: item[field] })
            if (obj) {
                _.assign(item, obj);
            }
        })
        return _.orderBy(arr, field, 'asc');
    }



    // static monthData = (monthTrend: string[] | number[], data: any[], dateLabel, valueLable) => {
    //     let dayData = _.times(monthTrend.length, _.constant(0));
    //     data.map(item => {
    //         let idx = _.indexOf(monthTrend, item[dateLabel]);
    //         if (idx >= 0) {
    //             dayData[idx] = item[valueLable];
    //         }
    //     });
    //     return dayData;
    // }
}
