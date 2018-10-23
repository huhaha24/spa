import { Format } from 'vap/utils'
import * as _ from 'lodash';

const Formats = {
    default: val => val,
    number: val => Math.floor(val),
    usd: val => Format.formatUSD(Math.floor(val)),
    chinese: val => Format.formatNumber(val),
    decimal: val => Format.formatDecimal(val),
    percent: val => Format.formatDecimal(val) + '%',
}
const Transition = {
    number: (from, to, p) => Math.floor(from + p * (to - from)),
    usd: (from, to, p) => Format.formatUSD(Math.floor(from + p * (to - from))),
    chinese: (from, to, p) => Format.formatNumber(from + p * (to - from)),
    decimal: (from, to, p) => Format.formatDecimal(from + p * (to - from)),
    percent: (from, to, p) => Format.formatDecimal((from + p * (to - from)) * 100) + '%',
}

export default abstract class {

    static buildFormat(format: 'default' | 'number' | 'usd' | 'percent' | 'chinese' | 'decimal' = 'number') {
        if (_.has(Formats, format)) {
            return Formats[format];
        }
        return Formats.number;
    }

    static buildTransition(format: 'default' | 'number' | 'usd' | 'percent' | 'chinese' | 'decimal' = 'number') {
        if (_.has(Transition, format)) {
            return Transition[format];
        }
        return Transition.number;
    }
}