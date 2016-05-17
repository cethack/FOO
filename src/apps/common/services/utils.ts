// import {ILutItem, ILutItem2} from './core.dto.d';
// import * as _ from 'lodash';

export class Utils {

  static formEncode(data: any): any {
    var pairs: any = [];
    for (var name in data) {
      if (data.hasOwnProperty(name)) {
        pairs.push(encodeURIComponent(name) + '=' + encodeURIComponent(data[name]));
      }
    }
    return pairs.join('&').replace(/%20/g, '+');
  };

  // by default thousand is "," but can be "." depends on countries
  static formatNumberWith = (value: string, thousand = ','): string => {
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, thousand);
  };

  // static getDescriptionByLutCode(code: string, luts: Array<ILutItem|ILutItem2>): string {
  //   var desc: string;
  //   var lutItem: ILutItem;

  //   if (!!code && luts) {
  //     lutItem = _.find(luts, ['code', code]);
  //     desc = (lutItem && lutItem.description) || code;
  //   }

  //   return desc;
  // }

  // replace path variables in API end points like wo/tasks/{taskId}/{laborId}/cancelclockon
  // {taskId} and {laborId} will be replaced with passed parameters
  static replacePathVariables = (apiEndPoint: string, ...pathVars: Array<number|string>): string => {
    // TODO change with RegExp?
    pathVars.forEach((value) => {
      let sPos = apiEndPoint.indexOf('{');
      let ePos = apiEndPoint.indexOf('}', sPos);
      let varName = apiEndPoint.substring(sPos, ePos + 1);

      sPos > 0 && (apiEndPoint = apiEndPoint.replace(varName, <string>value));
    });

    return apiEndPoint;
  };

  /**
   * A JSON class substibute of the original JSON object
   *
   * It provides the following additional feature;
   *
   *  1. parse date string to date object. e.g. "2009-01-03T18:10:00Z" to Date object
   *     https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse
   *
   *   Usage: Utils.parseJSON('{"a":1, "b": "2009-01-03T18:10:00Z", "c": "2009-01-03T18:10:00-05:00"}');
   */
  static parseJSON(json: string): any {
    let RE_ISO = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d*)?Z?(?:[-\+]\d{2}:\d{2})?$/;
    //             year  month  day   hour minute sec  millisec     time difference

    return JSON.parse(
      json, (key: string, value: any) => {
        return (typeof value === 'string' && value.match(RE_ISO)) ? new Date(value) : value;
      }
    );
  }

}

