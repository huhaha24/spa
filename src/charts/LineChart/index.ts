import StackTrend from './StackTrend';
import DateTrend from './DateTrend';
import HourTrend from './HourTrend';
// import Curve from './Curve';

export default class {
    static StackTrend: typeof StackTrend = StackTrend;
    static DateTrend: typeof DateTrend = DateTrend;
    static HourTrend: typeof HourTrend = HourTrend;
    // static Curve: typeof Curve = Curve; // 曲线图
}