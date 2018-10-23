import * as React from 'react';
import * as _ from 'lodash';
import './CACHE';
import { Ajax, Renders } from 'vap/utils';

/**
 * 用于列表，字典等 Render 的 Value，由 name(显示) 和 value(实际取值) 两个字段组成
*/
export interface Value {
  /**
   * 显示在页面上的名称
  */
  name: string,
  /**
   * 实际取值
  */
  value: number | string,
}


/**
 * Render 实体，一般情况下，可以直接用于 antd 框架里面的各种 列render 字段 render 等
 * 另外 ，render 具有一个 update 方法，当数据更新时，可以调用 render.update方法来进行内部更新
 * 每种 render 的内部更新传递的参数可能有所不同
*/
interface Render {
  (value): string;
  /**
   * 内部数据更新函数，
   * listRender ： 传一个数组 any[]
   * statusRender ： 传一个 StatusMap
   * momentRender : 不用传参数，会将Render时间移至当前最新时间
   * htmlRender : 无此方法
  */
  update: (data?: any) => void;
  has: (key: string | number) => boolean;
}

export default class {
  /**
   * 对象类型
   */
  static objTypeRender(def: string | false = '未知', className: string = '', onlyText = false): Render {
    let ObjMap = {};
    Ajax.GET('/api-audit/single/all/dict_object_type', json => {
      if (json.list) json.list.map(item => ObjMap[item.id + ''] = item.object);
    });
    let fn: any = str => {
      let text = _.has(ObjMap, str + '') ? ObjMap[str + ''] : (def ? def : str);
      return onlyText ? text : <span className={className} title={text}>{text}</span>;
    }
    fn.has = str => _.has(ObjMap, str + '');
    return fn;
  }

  /**
   * 警种 Render
  */
  static policeTypeRender(def: string | false = '未知', className: string = '', onlyText = false): Render {
    let PMap = {};
    Ajax.GET('/api-audit/single/all/dict_police_type', json => {
      if (json.list) json.list.map(item => PMap[item.id + ''] = item.policeType);
    });
    let fn: any = str => {
      let text = _.has(PMap, str + '') ? PMap[str + ''] : (def ? def : str);
      return onlyText ? text : <span className={className} title={text}>{text}</span>;
    }
    fn.has = str => _.has(PMap, str + '');
    return fn;
  }
  /**
  * 威胁类型 render
 */
  static threatTypeRender(def: string | false = '未知', className: string = '', onlyText = false): Render {
    let PMap = {};
    Ajax.GET('/api-audit/single/all/dict_threat_type', json => {
      if (json.list) json.list.map(item => PMap[item.id + ''] = item.description);
    });
    let fn: any = str => {
      let text = _.has(PMap, str + '') ? PMap[str + ''] : (def ? def : str);
      return onlyText ? text : <span className={className} title={text}>{text}</span>;
    }
    fn.has = str => _.has(PMap, str + '');
    return fn;
  }
  /**
* 威胁类型 render 转化为id
*/
  static threatIdRender(def: string | false = '未知', className: string = '', onlyText = false): Render {
    let PMap = {};
    Ajax.GET('/api-audit/single/all/dict_threat_type', json => {
      if (json.list) json.list.map(item => PMap[item.description] = item.id);
    });
    let fn: any = str => {
      let text = _.has(PMap, str + '') ? PMap[str + ''] : (def ? def : str);
      return onlyText ? text : <span className={className} title={text}>{text}</span>;
    }
    fn.has = str => _.has(PMap, str + '');
    return fn;
  }
  /**
   * 警种 Render (policeType转化为Id)
  */
  static policeTypeIdRender(def: string | false = '未知', className: string = '', onlyText = false): Render {
    let PMap = {};
    Ajax.GET('/api-audit/single/all/dict_police_type', json => {
      if (json.list) json.list.map(item => PMap[item.policeType] = item.id);
    });
    let fn: any = str => {
      let text = _.has(PMap, str + '') ? PMap[str + ''] : (def ? def : str);
      return onlyText ? text : <span className={className} title={text}>{text}</span>;
    }
    fn.has = str => _.has(PMap, str + '');
    return fn;
  }
  /**
 * 应用分类 appType Render
*/
  static appTypeRender(def: string | false = '未知', className: string = '', onlyText = false): Render {
    let PMap = {};
    Ajax.GET('/api-audit/single/all/dict_app_type', json => {
      if (json.list) json.list.map(item => PMap[item.id + ''] = item.appType);
    });
    let fn: any = str => {
      let text = _.has(PMap, str + '') ? PMap[str + ''] : (def ? def : str);
      return onlyText ? text : <span className={className} title={text}>{text}</span>;
    }
    fn.has = str => _.has(PMap, str + '');
    return fn;
  }
  /**
 * 站点类型分类 siteType Render
*/
  static siteTypeRender(def: string | false = '未知', className: string = '', onlyText = false): Render {
    let PMap = {};
    Ajax.GET('/api-audit/single/all/dict_website_type', json => {
      if (json.list) json.list.map(item => PMap[item.id + ''] = item.siteType);
    });
    let fn: any = str => {
      let text = _.has(PMap, str + '') ? PMap[str + ''] : (def ? def : str);
      return onlyText ? text : <span className={className} title={text}>{text}</span>;
    }
    fn.has = str => _.has(PMap, str + '');
    return fn;
  }

  /**
* 登陆安全级别 Render
*/
  static securityLevelRender(def: string | false = '未知', className: string = '', onlyText = false): Render {
    let PMap = {};
    Ajax.GET('/api-audit/single/all/dict_security_level', json => {
      if (json.list) json.list.map(item => PMap[item.id + ''] = item.securityLevel);
    });
    let fn: any = str => {
      let text = _.has(PMap, str + '') ? PMap[str + ''] : (def ? def : str);
      return onlyText ? text : <span className={className} title={text}>{text}</span>;
    }
    fn.has = str => _.has(PMap, str + '');
    return fn;
  }


  /**
   * 设备类型 Render
  */
  static deviceTypeRender(def: string | false = '未知', className: string = '', onlyText = false): Render {
    let PMap = {};
    Ajax.GET('/api-audit/single/all/dict_device_type', json => {
      if (json.list) json.list.map(item => PMap[item.id + ''] = item.devType);
    });
    let fn: any = str => {
      let text = _.has(PMap, str + '') ? PMap[str + ''] : (def ? def : str);
      return onlyText ? text : <span className={className} title={text}>{text}</span>;
    }
    fn.has = str => _.has(PMap, str + '');
    return fn;
  }
  /**
 * 设备二级类型 Render
*/
  static deviceTypeSecondRender(def: string | false = '未知', className: string = '', onlyText = false): Render {
    let PMap = {};
    Ajax.GET('/api-audit/single/all/dict_device_type', json => {
      if (json.list) json.list.map(item => PMap[item.id + ''] = item.devType + ' / ' + item.devSecondType);
    });
    let fn: any = str => {
      let text = _.has(PMap, str + '') ? PMap[str + ''] : (def ? def : str);
      return onlyText ? text : <span className={className} title={text}>{text}</span>;
    }
    fn.has = str => _.has(PMap, str + '');
    return fn;
  }
  /**
   * 人员类型render
  */
  static personTypeRender(def: string | false = '未知', onlyText = false) {
    if (onlyText) {
      var PMap = {
        '1': '警员',
        '2': '辅警',
        '3': '外协',
      }
      return val => {
        return _.has(PMap, val + '') ? PMap[val + ''] : (def ? def : val);
      }
    }
    return Renders.statusRender({
      success: {
        name: '警员',
        value: '1',
      },
      warning: {
        name: '辅警',
        value: '2',
      },
      default: {
        name: '外协',
        value: '3',
      }
    }, _.isString(def) ? def : '未知')
  }

  /**
   * 异常报警render
  */
  static warnTypeRender(def: string | false = '违规异常', onlyText: boolean = false) {

    return Renders.listRender([
      { label: '证书违规使用', value: '/safer/sec/pkiuse' },
      { label: '违规外联', value: '/safer/acc/outreach' },
      { label: '危险进程', value: '/safer/sec/illegalprocess' },
      { label: '游戏进程', value: '/safer/opr/gameprocess' },
      { label: '红名单', value: '/safer/opr/red' },
      { label: '热点库', value: '/safer/opr/hot' }
    ], 'value', 'label', _.isString(def) ? def : '违规异常', onlyText)
  }
  /**
   * 异常报警render
  */
  static pkiStatusRender(def: string | false = '未知') {
    return Renders.statusRender({
      success: {
        name: '注销',
        value: '6',
      },
      warning: {
        name: '挂起',
        value: '7',
      },
      processing: {
        name: '在用',
        value: '5'
      },
      default: {
        name: '过期',
        value: '999',
      }
    }, _.isString(def) ? def : '未知')
  }


  /**
   * IP探索 Render，
   * 默认只有字符串参数，如果有时间参数需要render对象并
  */
  static ipRender(start = '', end = '') {
    var [startDate, endDate] = [start, end];
    let fn: any = str => {
      return <a className="vapfont" onClick={() => false} target="_blank" href={`/audit/device/profile?ip=${str}${startDate ? ('&start=' + startDate) : ''}${endDate ? ('&end=' + endDate) : ''}`}>{str}</a>
    }
    fn.update = (start, end) => [startDate, endDate] = [start, end];
    return fn;
  }

  /**
   * IP探索 Render，
   * 默认只有字符串参数，如果有时间参数需要render对象并
  */
  static systemRender() {
    let fn: any = app => {
      if (app.systemId) {
        return <a onClick={() => false} target="_blank" href={`/audit/app/profile?sysid=${app.systemId}`}>{app.name}</a>
      }
      return app.name;
    }
    return fn;
  }


  /**
   * IP探索 Render，
   * 默认只有字符串参数，如果有时间参数需要render对象并
  */
  static idcardRender(start = '', end = '') {
    var [startDate, endDate] = [start, end];
    let fn: any = str => {
      return <a className="vapfont" onClick={() => false} target="_blank" href={`/audit/person/profile?idcard=${str}${startDate ? ('&start=' + startDate) : ''}${endDate ? ('&end=' + endDate) : ''}`}>{str}</a>
    }
    fn.update = (start, end) => [startDate, endDate] = [start, end];
    return fn;
  }

  /**
   * 应用名称(system_id)
  */
  static systemIdRender(className = '', def: string | false = '未知', onlyText = false) {
    var PMap = {};
    Ajax.GET('/api-audit/sysinfo', json => {
      if (json.list) json.list.map(item => PMap[item.systemId] = item.name);
    });
    let fn: any = str => {
      let text = _.has(PMap, str + '') ? PMap[str + ''] : (def ? def : str);
      return onlyText ? text : <span className={className} title={text}>{text}</span>;
    }
    return fn;
  }

  /**
   * 应用名称(system_id)
  */
  static stationRender(className = '', def = '未知', onlyText = false) {
    var PMap = {};
    Ajax.GET('/api-audit/single/all/dict_post_type', json => {
      if (json.list) json.list.map(item => PMap[item.id + ''] = item.postType);
    });
    let fn: any = str => {
      let text = _.has(PMap, str + '') ? PMap[str + ''] : def;
      return onlyText ? text : <span className={className} title={text}>{text}</span>;
    }
    return fn;
  }

  /**
   * 应用名称(name) 获取id
  */
  static sysNameRender(className = '', def = '未知', onlyText = false) {
    var PMap = {};
    Ajax.GET('/api-audit/sysinfo', json => {
      if (json.list) json.list.map(item => PMap[item.name] = item.id + '');
    });
    let fn: any = str => {
      let text = _.has(PMap, str + '') ? PMap[str + ''] : def;
      return onlyText ? text : <span className={className} title={text}>{text}</span>;
    }
    return fn;
  }

  /**
   * 应用id 获取 name
  */
  static sysIdRender(className = '', def = '未知', onlyText = false) {
    // 87874165
    var PMap = {};
    Ajax.GET('/api-audit/sysinfo', json => {
      if (json.list) json.list.map(item => PMap[item.id + ''] = item.name);
    });
    let fn: any = str => {
      let text = _.has(PMap, str + '') ? PMap[str + ''] : def;
      return onlyText ? text : <span className={className} title={text}>{text}</span>;
    }
    return fn;
  }

  //将area 转为本身的名称
  static areaOrginNameRender(type: 'code' | 'name' = 'code') {
    var CodeMap = {};
    var NameMap = {};
    var PMap = type == 'code' ? CodeMap : NameMap;
    Ajax.GET('/api-audit/area', json => {
      if (json.list) {
        json.list.map(item => {
          CodeMap[item.areaCode + ''] = item.areaName;
          NameMap[item.description + ''] = item.areaName;
        })
      }
    });
    let fn: any = str => {
      let text = _.has(PMap, str + '') ? PMap[str + ''] : str;
      return text;
    }
    return fn;
  }
  /**
   * 地区render
  */
  static areaRender(type: 'code' | 'name' = 'code', className = '', def: string | boolean = '未知', onlyText = false) {
    // var IdMap = {};
    var CodeMap = {};
    var NameMap = {};
    var IndexMap = {};
    var PMap = type == 'code' ? CodeMap : NameMap;
    Ajax.GET('/api-audit/area', json => {
      if (json.list) {
        json.list.map(item => {
          CodeMap[item.areaCode + ''] = item.description;
          NameMap[item.areaName + ''] = item.description;
        })
      }
    });
    let fn: any = str => {
      let text = _.has(PMap, str + '') ? PMap[str + ''] : (def ? def : str);
      return onlyText ? text : <span className={className} title={text}>{text}</span>;
    }
    return fn;
  }
  static hourRender() {
    var TimeFormat = ['凌晨0点', '凌晨1点', '凌晨2点', '凌晨3点', '凌晨4点', '凌晨5点', '上午6点', '上午7点', '上午8点', '上午9点', '上午10点', '上午11点', '中午12点', '下午1点', '下午2点', '下午3点', '下午4点', '下午5点', '下午6点', '晚上7点', '晚上8点', '晚上9点', '晚上10点', '晚上11点'];
    return num => {
      return TimeFormat[num];
    }
  }

}