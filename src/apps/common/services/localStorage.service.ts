import {Injectable} from 'angular2/core';

var memoryStorage: any = {};

/**
 * It frist reads from the memory and save it into the localStorage if it is available.
 * Safari, in Private Browsing Mode, looks like it supports localStorage but all calls to get/setItem
 * throw QuotaExceededError so need to have try... catch
 */
@Injectable()
export class LocalStorageService {

  // TODO only for unit test purpose. If need, BaseDataService can be refactored to have DI with constructor rather than Injector
  _getMemoryStorage(): any {
    return memoryStorage;
  }

  _isValidJSONString(str: string): boolean {
    return /^[\],:{}\s]*$/.test(str.replace(/\\["\\\/bfnrtu]/g, '@').
      replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
      replace(/(?:^|:|,)(?:\s*\[)+/g, ''));
  }

  get(key: string): any {
    try {
      // not to return undefined because JSON.parse doesn't work it

      var itemValue = localStorage.getItem(key) || '';
      var value = (this._isValidJSONString(itemValue) && (itemValue || memoryStorage[key])) || null;

      return JSON.parse(value);
    } catch (e) {
      return JSON.parse(memoryStorage[key]);
    }
  }

  set(key: string, value: any): void {
    var _value = JSON.stringify(value);

    try {
      localStorage.setItem(key, _value);
    } catch (e) {
      memoryStorage[key] = _value;
    }
  }

  // there is no exception on clear and removeItem calls in private mode
  clear(): void {
    var i: number;
    var keys: Array<string> = Object.keys(memoryStorage);

    for (i = 0; i < keys.length; i++) {
      delete memoryStorage[keys[i]];
    }

    localStorage.clear();
  }

  remove(key: string): void {
    delete memoryStorage[key];
    localStorage.removeItem(key);
  }

}
