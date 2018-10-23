import { PageUtil } from 'vap/utils';
import * as _ from 'lodash';

const theme = PageUtil.theme() == 'blue' ? 'blue' : 'default';

// 阴影样式
const ShadowMatrix = {
    'blue': `
    0 0 0 .2 0
    0 0 0 .2 0
    0 0 0 .2 0
    0 0 0 .2 0
    `,
    'default': `
    0 0 0 .2 0
    0 0 0 .2 0
    0 0 0 .2 0
    0 0 0 .2 0
    `
}

export default abstract class name {
    /**
     * 生成一个唯一ID
    */
    static genId = () => {
        return '__vap__chart__' + _.now() + '_' + _.random(0, 10000);
    }


    static fixMax = function (max) {
        if (max == 0) { return 1 }
        var splitLevel = [1.5, 2, 2.5, 3, 4, 5, 6, 8, 10, 12];
        var size = (max + '').length;
        var base = Math.pow(10, size - 1);
        var splitCount = Math.ceil(max / base);
        var larger = 0.2 * Math.ceil(splitCount / 3);
        var maxFix = 0;
        for (var i = 0, _i = splitLevel.length; i < _i; i++) {
            maxFix = splitLevel[i] * base;
            if ((maxFix - max) / base >= larger) {
                break;
            }
        }
        return maxFix;
    };

    //制作阴影
    static BuildShadow = () => {
        return `<filter id="_ec_def_shadow">
        <feColorMatrix type="matrix" values="${ShadowMatrix[theme]}"></feColorMatrix>
        <feGaussianBlur stdDeviation="1" result="colorBlur1"></feGaussianBlur>

        <feOffset result="offsetBlur1" in="colorBlur1" dx="1" dy="1" />
        <feOffset result="offsetBlur2" in="colorBlur1" dx="3" dy="3" />
        <feMerge>
            <feMergeNode in="offsetBlur1" />
            <feMergeNode in="offsetBlur2" />
            <feMergeNode in="SourceGraphic" />
        </feMerge>
    </filter>
    <filter id="_ec_def_shadow_hover">
        <feColorMatrix type="matrix" values="${ShadowMatrix[theme]}"></feColorMatrix>
        <feGaussianBlur stdDeviation="1" result="colorBlur1"></feGaussianBlur>

        <feOffset result="offsetBlur0" in="colorBlur1" dx="0" dy="0" />
        <feOffset result="offsetBlur1" in="colorBlur1" dx="1" dy="1" />
        <feOffset result="offsetBlur2" in="colorBlur1" dx="3" dy="3" />
        <feOffset result="offsetBlur3" in="colorBlur1" dx="5" dy="5" />
        <feMerge>
            <feMergeNode in="offsetBlur0" />
            <feMergeNode in="offsetBlur1" />
            <feMergeNode in="offsetBlur2" />
            <feMergeNode in="offsetBlur3" />
            <feMergeNode in="SourceGraphic" />
        </feMerge>
    </filter>
    `
    }


    static BuildBarGrinder = () => {
        return `<linearGradient id="_vc_bar_top_linar" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" style="stop-color:#855699;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#6D8DC2;stop-opacity:1" />
      </linearGradient>`;
    }

    /**
     * 条状图下中间的图案填充
    */
    static BuildMutiBarImage = () => {
        // objectBoundingBox
        return `<pattern id="_vc_bar_top2_image0" patternUnits="userSpaceOnUse" width="38" height="8" x="0" y="0">
                    <image xlink:href="/images/charts/_vc_top_bar_0.png"  x="0" y="0" width="38" height="8"/>
                </pattern>
                <pattern id="_vc_bar_top2_image1" patternUnits="userSpaceOnUse" width="38" height="8" x="0" y="0">
                    <image xlink:href="/images/charts/_vc_top_bar_1.png" x="0" y="0" width="38" height="8" />
                </pattern>
                <pattern id="_vc_bar_top2_image2" patternUnits="userSpaceOnUse" width="38" height="8" x="0" y="0">
                    <image xlink:href="/images/charts/_vc_top_bar_2.png" x="0" y="0" width="38" height="8" />
                </pattern>
                <pattern id="_vc_bar_top2_image3" patternUnits="userSpaceOnUse" width="38" height="8" x="0" y="0">
                    <image xlink:href="/images/charts/_vc_top_bar_3.png" x="0" y="0" width="38" height="8" />
                </pattern>`
    }

    /**
     * 时间区间分布图蹭的柱
     * 
    */
    static BuildLineDistribution = () => {
        return `<linearGradient id="vet_bar" x1="0%" y1="100%" x2="0%" y2="0%">
        <stop offset="0%" stop-color="#02CBFE"></stop>
        <stop offset="100%" stop-color="#0D365D"></stop>
        </linearGradient>
        <linearGradient id="vet_bar_hover" x1="0%" y1="100%" x2="0%" y2="0%">
        <stop offset="0%" stop-color="#C94BC3"></stop>
        <stop offset="100%" stop-color="#0D365D"></stop>
        </linearGradient>`
    }

}

