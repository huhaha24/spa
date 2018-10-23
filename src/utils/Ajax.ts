import { notification } from 'antd';
import {Cache} from 'vap/utils';
import * as _ from 'lodash';
import *  as NProgress from 'nprogress';

var ignoreEmptyString = false;
/**
 * @private
 */
const cleanParam = (obj = {}) => {
  var keys = Object.keys(obj);
  for (var i = 0, _i = keys.length; i < _i; i++) {
    if (obj[keys[i]] === null || (ignoreEmptyString && obj[keys[i]] === '')) {
      delete obj[keys[i]];
    } else {
      //过滤百分号
      if (_.isString(obj[keys[i]])) obj[keys[i]] = obj[keys[i]].replace(/\%/g, '\\%');
    }
  }
  return obj;
}



/**
 * @private
 */
const codeMessage = {
  200: '服务器成功返回请求的数据',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据,的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器',
  502: '网关错误',
  503: '服务不可用，服务器暂时过载或维护',
  504: '网关超时',
};

/**
 * @private
 */
function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  const errortext = codeMessage[response.status] || response.statusText;
  notification.error({
    message: `请求错误 ${response.status}: ${response.url}`,
    description: errortext,
  });
  const error = new Error(errortext);
  error.name = response.status;
  NProgress.done();
  // error.response = response;
  throw error;
}

/**
 * @private
 */
var CACHE_URL = new Set<string>();



/**
 * @private
 */
function request(url, options: { method?: string, headers?: any, body?: any } = { method: 'GET', headers: {}, body: null }) {
  const defaultOptions = {
    credentials: 'include',
  };
  const newOptions = { ...defaultOptions, ...options };
  if (newOptions.method === 'POST' || newOptions.method === 'PUT' || newOptions.method === 'DELETE' || newOptions.method === 'PATCH') {
    newOptions.headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json; charset=utf-8',
      ...newOptions.headers,
    };
    newOptions.body = JSON.stringify(cleanParam(newOptions.body));
  }

  NProgress.start();
  // @ts-ignore
  return fetch(url, newOptions)
    .then(checkStatus)
    .then((response) => {
      NProgress.done();
      return response.json();
    })
    // .then( ()=> NProgress.done())
    ;
}
/**
 * Ajax 工具类
*/
export default abstract class {
  static ignoreEmptyString() {
    ignoreEmptyString = true;
  }
  /**
   * 发送 HTTP GET 请求，支持 **回调函数** 与 **异步队列** 方式进行请求
   * 按 RESTFUL 规范说明 ： GET 通常用来获取特定不变的数据
   * 
   * @param url 请求接口链接地址
   * @param callback 回调函数，如果没有设置，则返回一个 Promise对象
   * @returns 如果没有指定回调函数，则返回一个 Promise对象
   * 
   * 额外说明 ： GET 方法支持浏览器前端缓存，可以预先将需要缓存的地址通过 Ajax.SESSION() 方法传入，对于已经缓存的地址不会发出实际的网络请求
   * 
   * 代码示例：
   * ```javascript
   * // 通过 回调函数 使用
   * import {Ajax} from 'utils'
   * Ajax.GET('/api-url',json=>console.log(json));
   * 
   * // 通过 异步队列 使用
   * const all = yield Ajax.GET('/api-url');
   * console.log(all);
   * ```
  */
  static async  GET(url: string, callback?: Function) {
    if (callback) {
      if (!CACHE_URL.has(url)) {
        //没有设为缓存时，发送 request请求
        let json = await request(url);
        callback.call(null, json);
        return;
      }
      //设置为缓存时，先从缓存里面获取，没有则发送Ajax请求并将结果设置到缓存里面
      let data = Cache.sessionData(url);
      if (data) {
        callback.call(null, data);
        return;
      }
      let json = await request(url);
      if (json.code == '0' || json.code === undefined) {
        Cache.sessionData(url, json);
      }
      callback.call(null, json);
    } else {
      if (!CACHE_URL.has(url)) {
        return request(url);
      }

      let data = Cache.sessionData(url);
      if (data) {
        return new Promise(function (resolve) {
          resolve(data);
        })
      }
      let resp = request(url);
      resp.then(json => {
        if (json.code == '0' || json.code === undefined) {
          Cache.sessionData(url, json);
        }
      });
      return resp;
    }
  }

  /**
   * 发送 HTTP POST 请求，支持 **回调函数** 与 **异步队列** 方式进行请求
   * 按 RESTFUL 规范说明 ： POST 通常用来做复杂的条件查询
   * 
   * @param url 请求接口链接地址
   * @param param 请求参数，调用时会参数的 `json格式` 传给接口
   * @param callback 回调函数，如果没有设置，则返回一个 Promise对象
   * @returns 如果没有指定回调函数，则返回一个 Promise对象
   * 
   * 代码示例：
   * ```javascript
   * // 通过 回调函数 使用
   * import {Ajax} from 'utils'
   * Ajax.POST('/api-url',{status:0,find:'name'},json=>console.log(json));
   * 
   * // 通过 异步队列 使用
   * const resp = yield Ajax.POST('/api-url',{status:0,find:'name'});
   * console.log(resp);
   * ```
  */
  static async  POST(url, param, callback?: Function) {
    if (callback) {
      let json = await request(url, {
        method: 'POST',
        body: param
      });
      callback.call(null, json);
    } else {
      return request(url, {
        method: 'POST',
        body: param
      });
    }
  }


  /**
   * 发送 HTTP PUT 请求，支持 **回调函数** 与 **异步队列** 方式进行请求
   * 按 RESTFUL 规范说明 ： PUT 通常用来做对象的新增
   * 
   * @param url 请求接口链接地址
   * @param param 请求参数，调用时会参数的 `json格式` 传给接口
   * @param callback 回调函数，如果没有设置，则返回一个 Promise对象
   * @returns 如果没有指定回调函数，则返回一个 Promise对象
   * 
   * 代码示例：
   * ```javascript
   * // 通过 回调函数 使用
   * import {Ajax} from 'utils'
   * Ajax.PUT('/api-url',{status:0,find:'name'},json=>console.log(json));
   * 
   * // 通过 异步队列 使用
   * const resp = yield Ajax.PUT('/api-url',{status:0,find:'name'});
   * console.log(resp);
   * ```
  */
  static async  PUT(url, param, callback?: Function) {
    if (callback) {
      let json = await request(url, {
        method: 'PUT',
        body: param
      });
      callback.call(null, json);
    } else {
      return request(url, {
        method: 'PUT',
        body: param
      });
    }
  }


  /**
   * 发送 HTTP PATCH 请求，支持 **回调函数** 与 **异步队列** 方式进行请求
   * 按 RESTFUL 规范说明 ： PATCH 通常用来做对象的修改
   * 
   * @param url 请求接口链接地址
   * @param param 请求参数，调用时会参数的 `json格式` 传给接口
   * @param callback 回调函数，如果没有设置，则返回一个 Promise对象
   * @returns 如果没有指定回调函数，则返回一个 Promise对象
   * 
   * 代码示例：
   * ```javascript
   * // 通过 回调函数 使用
   * import {Ajax} from 'utils'
   * Ajax.PATCH('/api-url',{status:0,find:'name'},json=>console.log(json));
   * 
   * // 通过 异步队列 使用
   * const resp = yield Ajax.PATCH('/api-url',{status:0,find:'name'});
   * console.log(resp);
   * ```
  */
  static async  PATCH(url, param, callback?: Function) {
    if (callback) {
      let json = await request(url, {
        method: 'PATCH',
        body: param
      });
      callback.call(null, json);
    } else {
      return request(url, {
        method: 'PATCH',
        body: param
      });
    }
  }

  /**
   * 发送 HTTP DELETE 请求，支持 **回调函数** 与 **异步队列** 方式进行请求
   * 按 RESTFUL 规范说明 ： DELETE 通常用来做对象的删除
   * 
   * @param url 请求接口链接地址
   * @param param 请求参数，调用时会参数的 `json格式` 传给接口
   * @param callback 回调函数，如果没有设置，则返回一个 Promise对象
   * @returns 如果没有指定回调函数，则返回一个 Promise对象
   * 
   * 代码示例：
   * ```javascript
   * // 通过 回调函数 使用
   * import {Ajax} from 'utils'
   * Ajax.DELETE('/api-url',{status:0,find:'name'},json=>console.log(json));
   * 
   * // 通过 异步队列 使用
   * const resp = yield Ajax.DELETE('/api-url',{status:0,find:'name'});
   * console.log(resp);
   * ```
  */
  static async  DELETE(url, param, callback?: Function) {
    if (callback) {
      let json = await request(url, {
        method: 'DELETE',
        body: param
      });
      callback.call(null, json);
    } else {
      return request(url, {
        method: 'DELETE',
        body: param
      });
    }
  }

  /**
   * 请多个请求一起返回了再处理，两个以上请求时，可以使用
   * @param  异步请求列表
   * 示例
   * ```
    Ajax.WHEN(
        Ajax.GET('/api-common/user'),
        Ajax.GET('/api-common/user/ip'),
        Ajax.POST('/api-common/user',{})
    ).then(function(resp){
        console.log(resp[0],resp[1],resp[2]);
    });
   * ```
  */
  static async  WHEN(...pos: Promise<void>[]): Promise<void[]> {
    return Promise.all(pos);
  }

  /**
   * 注册需要缓存的链接地址
   * 此URL 在一次打开的过程中只会请求一次，
   * @param urls 接口地址列表，只支持 GET 接口
   * 如果需要清除，可以调用 Ajax.CLEAR(url) 来清除
   * 示例
   * ```
   * Ajax.SESSION('/url1','/url2','/url3');
   * Ajax.GET('/url1');
   * Ajax.GET('/url1');
   * Ajax.GET('/url1');
   * Ajax.CLEAR('/url1','/url2');
   * ```
   * 
  */
  static SESION(...urls: string[]) {
    urls.map(url => {
      if (!CACHE_URL.has(url)) {
        CACHE_URL.add(url);
      }
    });
  };
  /**
   * 清除接口本地缓存
   * @param urls 接口地址列表，只支持 GET 接口
   * 如果需要清除，可以调用 Ajax.CLEAR(url) 来清除
   * 示例
   * ```
   * Ajax.SESSION('/url1','/url2','/url3');
   * Ajax.GET('/url1');
   * Ajax.GET('/url1');
   * Ajax.GET('/url1');
   * Ajax.CLEAR('/url1','/url2');
   * ```
   * 
  */
  static CLEAR(...urls: string[]) {
    urls.map(url => {
      Cache.sessionDelete(url);
    });
  }

  // static TESTDATA(url: string, columns, method = 'GET', param = {}) {

  // }
  // static TESTLIST(url: string, columns: { name: string, type: 'string' | 'number' | 'date' }[], method = 'GET', param = {}) {
  //   return new Promise(function (resolve, reject) {
  //     var success = _.random(1, 10) > 1;
  //     var timeOut = _.random(100, 3000);
  //     console.info(`模仿Ajax向 ${url} 发出了 ${method}请求,请求参数：${JSON.stringify(param)}`)
  //     setTimeout(function () {
  //       if (success) {
  //         console.info(`模拟请求成功`)
  //         resolve({ code: '0', message: '', total: _.random(5, 5000) ,list:[]});
  //       }
  //       else {
  //         console.error(`模拟请求失败`)
  //         reject({ code: '9999', message: '模拟失败了' });
  //       }
  //     }, timeOut);
  //   });
  // }


  static UPLOAD(file, callback: { success: Function, progress?: Function, error?: Function, }, param?: { namespace?: string, userName?: string, userId?: string }, url = '/api-fileup/fileup/uploadFile') {
    NProgress.start();

    const xhr = new XMLHttpRequest();
    var data = new FormData();
    data.append('file', file);
    // data.append('namespace', namespace);
    if (param) {
      if (param.namespace) data.append('namespace', param.namespace);
      if (param.userId) data.append('userId', param.userId);
      if (param.userName) data.append('userName', param.userName);
    }

    const successFn = (response) => {
      // 假设服务端直接返回文件上传后的地址
      // 上传成功后调用param.success并传入上传后的文件地址
      NProgress.done();
      callback.success(JSON.parse(xhr.responseText))
    }

    const progressFn = (event) => {
      // console.log(event.loaded / event.total * 100);
      if (callback.progress) callback.progress(event.loaded / event.total * 100);
      // 上传进度发生变化时调用param.progress
      // callback.progress(event.loaded / event.total * 100)
    }

    const errorFn = (response) => {
      NProgress.done();
      if (callback.error) callback.error(response);
      // 上传发生错误时调用param.error
      // callback.error({
      //   msg: 'unable to upload.'
      // })
    }

    xhr.upload.addEventListener("progress", progressFn, false)
    xhr.addEventListener("load", successFn, false)
    xhr.addEventListener("error", errorFn, false)
    xhr.addEventListener("abort", errorFn, false)
    xhr.open('POST', url, true)
    xhr.send(data)


  }

}

// export default { GET, POST, PUT, PATCH, DELETE, WHEN,SESION,CLEAR }