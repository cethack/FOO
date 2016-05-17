import {ComponentInstruction} from 'angular2/router';

// TODO remove if BaseDataService is not used
export interface IBaseDto {
  _id?: any;
  createdBy?: any;
  createdAt?: number;
  updatedAt?: number;
}

export interface IUser {
  name: string;
}

export interface ITokenInfo {
  email: string;
  givenName: string;
  nameIdentifier: string;
  surname: string;
  upn: string;
  isCetarisUser?: boolean;
  username: string;
}

export interface INotification {
  type: string;
  data?: any;
}

export interface ILoginResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

export interface INavigationHistory {
  urlPath: string;
  instruction?: ComponentInstruction;
  data?: any;
}

/** App config typings */
export interface IRouteName {
  root: string;
  login: string;
  dashboard: string;
  taskList: string;
  notFound: string;
}

export interface IStorageKey {
  token: string;
  refreshToken: string;
  tokenExpiry: string;
  tokenExpiresAt: string;
  tokenInfo: string;
  tokenRefreshedAt: string;
}

export interface ITopicName {
  routeActivate: string;
  reloadPartList: string;
  delegateGoBack: string;
}

export interface IAPIEndPoint {
  lut: string;
  image: string;
  token: string;
  tokenInfo: string;
  woTask: string;
  clockOn: string;
  clockOff: string;
  cancelClockOn: string;
  updateLut: string;
  feedback: string;
}

export interface IConfig {
  // These items are configured based on config.json
  apiBaseUrl: string;
  tokenRefreshMins: number;
  tokenExpiryMins: number;
  // -----------------------------------------------
  lutName: string;
  parentCode: string;
  systemLutName: string;
  assemblyLutName: string;
  waLutName: string;
  apiEndPoint: IAPIEndPoint;
  routeName: IRouteName;
  storageKey: IStorageKey;
  topicName: ITopicName;
}
// ------------------------

export interface IJSONObject {
  [name: string]: any;
}

export interface IMessageOptions {
  titleId?: string;
  messageId?: string;
  message?: string;
  buttons?: {
    ok?: (arg: any) => void;
    cancel?: (arg: any) => void
  };
}

export interface IFeedbackPopupOptions {
  caller: any;
  data?: any;
}
