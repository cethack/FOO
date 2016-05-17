import {OpaqueToken} from 'angular2/core';
import {IConfig} from './FAR.d';

export var APP_CONFIG = new OpaqueToken('cet.app.config');

export const CONFIG: IConfig = {
  apiBaseUrl: '',
  tokenRefreshMins: 0,
  tokenExpiryMins: 0,

  lutName: 'lutName',
  parentCode: 'parentCode',
  systemLutName: 'system',
  assemblyLutName: 'systemAssembly',
  waLutName: 'repairWorkAccomplished',

  apiEndPoint: null,

  routeName: {
    root: 'Root',
    login: 'Login',
    dashboard: 'Dashboard',
    taskList: 'TaskList',
    notFound: 'NotFound'
  },

  storageKey: {
    token: 'cet-token',
    refreshToken: 'cet-refreshToken',
    tokenExpiry: 'cet-tokenExpiry',
    tokenExpiresAt: 'cet-tokenExpiresAt',
    tokenInfo: 'cet-tokenInfo',
    tokenRefreshedAt: 'cet-tokenRefreshedAt'
  },

  topicName: {
    routeActivate: 'route-activate',
    reloadPartList: 'reload-part-list',
    delegateGoBack: 'delegate-go-back'
  }
};

var concatBaseUrl = endPoint => `${CONFIG.apiBaseUrl}/${endPoint}`;

CONFIG.apiEndPoint = {
  lut: 'core/lut',
  image: 'core/image',
  token: 'security/token',
  tokenInfo: 'security/tokenInfo',
  feedback: 'core/feedback',
  // WO Task
  woTask: 'wo/tasks',
  clockOn: 'wo/tasks/{taskId}/clockon',
  clockOff: 'wo/tasks/{taskId}/clockoff',
  cancelClockOn: 'wo/tasks/{taskId}/{laborId}/cancelclockon',
  updateLut: 'wo/tasks/{taskId}/{laborId}'
};

// merge base url to each end point
(() => {
  var keys = Object.keys(CONFIG.apiEndPoint);

  CONFIG.apiBaseUrl = (<any>window).Cetaris.configData.apiBaseUrl;
  CONFIG.tokenRefreshMins = (<any>window).Cetaris.configData.TOKEN_REFRESH_MINS || 2;
  CONFIG.tokenExpiryMins = (<any>window).Cetaris.configData.TOKEN_EXPIRY_MINS || 20;

  keys.forEach(endPoint => CONFIG.apiEndPoint[endPoint] = concatBaseUrl(CONFIG.apiEndPoint[endPoint]));
})();
