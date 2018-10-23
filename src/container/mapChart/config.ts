import _ from 'lodash'
//配置项模型，固定一个extend方法，不能覆盖
const Config = {
    //全局设置 SVG，MapBuilder, Projection，各个组件使用
    GLOBAL_SVG: null,
    GLOBAL_BUILDER: null,
    GLOBAL_PROJECTION: null,
    GLOBAL_SCALE:1.15,
    GLOBAL_AREAS:[],
    GLOBAL_TIPS:[],
    RotateX: 0,
    Zoom:false,
    //伪3D设置，如果不想用伪3D，则可以设置 Shadow:false 或 Shadow:null,
    Shadow: {
        Left: 5,
        Top: 10,
        Fill: '',
    },
    Bar: {
        Effect: 2000,
        HeightMin:10,
        HeightMax:60,
        Width:8,
        Radius:2,
    },
    Line: {
        EffectMin: 3000,
        EffectMax: 6000,
        PointRadius: 1.5,
    },
    Point: {
        EffectMin: 2000,
        EffectMax: 4000,
        RadiusMin: 8,
        RadiusMax: 16,
    },
    Fly: {
        EffectMin: 2000,
        EffectMax: 4000,
    },
    OnSelect: null,
    extend:function(data){
        _.merge(Config,data);
    }
};
export default Config