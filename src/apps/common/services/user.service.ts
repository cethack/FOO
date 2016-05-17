import {Injectable, Inject} from 'angular2/core';
import {HttpService} from './http.service';
import {NavigationHistoryService} from './navigationHistory.service';
import {LocalStorageService} from './localStorage.service';
import {TokenService} from './token.service';
import {MessageService} from './message.service';
import {APP_CONFIG} from './app.config';
import {IConfig} from './FAR.d';

@Injectable()
export class UserService {

  public lastActivityAt: Date;
  private sessionExpiryTimer: NodeJS.Timer = null;  // timer to expire session
  public sessionExpiredByTimer: boolean;
  public sessionExpiredUsername: string;

  /* tslint:disable */
  public TOKEN_REFRESH_MINS: number;
  public TOKEN_EXPIRY_MINS: number;
  public TOKEN_ENDPOINT: string;
  public TOKEN_INFO_ENDPOINT: string;
  /* tslint:enable */

  constructor(
    private httpService: HttpService,
    public historyService: NavigationHistoryService,
    public localStorageService: LocalStorageService,
    private tokenService: TokenService,
    private messageService: MessageService,
    @Inject(APP_CONFIG) private config: IConfig
  ) {
    //every route change, set last activity, so that we can refresh or restart timer
    //messageService.subscribe(this.config.topicName.routeActivate, this.setLastActivity);

    /* if session is already expired, force to logout */
    this.sessionExpired && this.logout(true);

    this.TOKEN_REFRESH_MINS = config.tokenRefreshMins;
    this.TOKEN_EXPIRY_MINS = config.tokenExpiryMins;
    this.TOKEN_ENDPOINT = config.apiEndPoint.token;
    this.TOKEN_INFO_ENDPOINT = config.apiEndPoint.tokenInfo;
  }

  /**
   * checks token, username, and token expiry time
   * @returns {boolean}
   */
  get loggedIn(): boolean {
    return !!(this.tokenData.token && !this.sessionExpired && this.username);
  }

  get tokenData(): any {
    return this.getTokenData();
  }

  get username(): string {
    return this.getTokenData().tokenInfo ? this.getTokenData().tokenInfo.upn : '';
  }

  /* with no token, session is not expired. There is another property sessionExpiredByTimer */
  get sessionExpired(): boolean {
    return !!(
      this.getTokenData().tokenExpiresAt &&
      new Date().getTime() > this.getTokenData().tokenExpiresAt.getTime()
    );
  }

  logout(donotClearHistory?: boolean): void {
    //console.log('logout is called. Clearing localstorage and history');
    this.localStorageService.clear();
    // in the case of session timeout, history should be kept to support for going back
    !donotClearHistory && this.historyService.clear();
  }

  login(username: string, password: string): Promise<any> {
    return new Promise((resolve: any, reject: any) => {
      let loginResult: any;

      this.tokenService.getToken(username, password)
        .toPromise()
        .then((response: any) => {
          if (response.status && response.status >= 400) { // errored response
            reject(response);
            return;
          } else {
            this.setTokenData(this.config.storageKey.token, response.access_token);
            loginResult = response;  //store the login response
            return this.tokenService.getTokenInfo().toPromise();
          }
        })
        .then((response: any) => {
          loginResult.token_info = response;
          loginResult.token_info.username = username;
          this.setTokenDataFromResponse(loginResult);
          resolve(loginResult);
        })
        .catch((error: any) => {
          //console.error('login failed', JSON.stringify(error));
          reject(error);
        });
    });
  }

  restartSessionRestartTimer(): void {
    //console.log('session expiry timer started', new Date());
    this.sessionExpiredByTimer = false;
    this.sessionExpiredUsername = undefined;
    clearTimeout(this.sessionExpiryTimer);
    this.sessionExpiryTimer = setTimeout(() => {
      this.sessionExpiredByTimer = true;
      this.sessionExpiredUsername = this.username;
      this.logout(true);
    }, this.TOKEN_EXPIRY_MINS * 60 * 1000);
  }

  /**
   * For every activity, refresh token or restart timer conditionally if logged in
   * Note: every successful login will restart relogin timer
   */
  setLastActivity = (message: string): void => {
    if (this.loggedIn) {
      //console.log('setLastActivity is called', message);
      let intTokenRefreshTime: number = this.TOKEN_REFRESH_MINS * 60 * 1000;
      let intTokenExpiryTime: number = this.TOKEN_EXPIRY_MINS * 60 * 1000;
      let tokenData = this.getTokenData();

      let intLastActivityAt = new Date().getTime();
      let intTokenRefreshedAt: number =
        tokenData.tokenRefreshedAt ? tokenData.tokenRefreshedAt.getTime() : 0;

      let intTimeSinceTokenRefreshed = intLastActivityAt - intTokenRefreshedAt;

      if (
        intTimeSinceTokenRefreshed > intTokenRefreshTime &&  //token-refreshable status
        intTimeSinceTokenRefreshed < intTokenExpiryTime      //less than logout time
      ) {
        this.refreshToken();
      }

      this.restartSessionRestartTimer();
      this.lastActivityAt = new Date(intLastActivityAt);
    }
  };

  /**
   * called by setLastActivity
   * if user is active for 2 mins,
   *   get a new token from server.
   *   and extend session expiry time
   */
  refreshToken(): Promise<any> {
    return new Promise((resolve: any, reject: any) => {
      this.tokenService.getRefreshToken()
        .toPromise()
        .then((response: any) => {
          //console.log('security token is refreshed', response);
          resolve(this.setTokenDataFromResponse(response));
        });
    });
  }

  getTokenData(key?: string): any {
    var STORAGE_KEY = this.config.storageKey;

    if (key) {
      return this.localStorageService.get(key);
    } else {
      return {
        token:  this.getTokenData(STORAGE_KEY.token),
        refreshToken: this.getTokenData(STORAGE_KEY.refreshToken),
        tokenExpiresAt:
          this.getTokenData(STORAGE_KEY.tokenExpiresAt) ?
            new Date(this.getTokenData(STORAGE_KEY.tokenExpiresAt)) : null,
        tokenRefreshedAt:
          this.getTokenData(STORAGE_KEY.tokenRefreshedAt) ?
            new Date(this.getTokenData(STORAGE_KEY.tokenRefreshedAt)) : null,
        tokenInfo: this.getTokenData(STORAGE_KEY.tokenInfo)
      };
    }
  }

  setTokenData(key: string, value?: any): void {
    if (value === null) {
      this.localStorageService.remove(key);
    } else {
      this.localStorageService.set(key, value);
    }
  }

  private setTokenDataFromResponse(response: any): any {
    var STORAGE_KEY = this.config.storageKey;

    if (response.access_token) {
      this.setTokenData(STORAGE_KEY.token, response.access_token);
    }
    if (response.refresh_token) {
      this.setTokenData(STORAGE_KEY.refreshToken, response.refresh_token);
    }
    if (response.expires_in) {
      this.setTokenData(STORAGE_KEY.tokenExpiry, response.expires_in);
      this.setTokenData(STORAGE_KEY.tokenExpiresAt,
        new Date(new Date().getTime() + this.TOKEN_EXPIRY_MINS * 60 * 1000)
      );
    }
    if (response.token_info) {
      this.setTokenData(STORAGE_KEY.tokenInfo, response.token_info);
    }
    this.setTokenData(STORAGE_KEY.tokenRefreshedAt, new Date());
    return this.getTokenData();
  }
}

