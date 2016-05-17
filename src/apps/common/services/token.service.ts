import {Injectable, Inject} from 'angular2/core';
import {APP_CONFIG} from './app.config';
import {IConfig} from './FAR.d';
import {HttpService} from './http.service';
import {Utils} from './utils';
import {Observable} from 'rxjs/Observable';
import {Response} from 'angular2/http';
import {LocalStorageService} from './localStorage.service';

@Injectable()
export class TokenService {

  constructor(
    private httpService: HttpService,
    private localStorageService: LocalStorageService,
    @Inject(APP_CONFIG) private config: IConfig
  ) {
  }

  _getToken(data: any): Observable<Response> {
    return this.httpService.post(this.config.apiEndPoint.token, data, HttpService.OPTS_POST_FORM);
  }

  getToken(username: string, password: string): Observable<Response> {
    let data = Utils.formEncode({
      username: username,
      password: password,
      grant_type: 'password'
    });

    return this._getToken(data);
  }

  getRefreshToken(): Observable<Response> {
    let data = Utils.formEncode({
      refresh_token: this.localStorageService.get(this.config.storageKey.refreshToken),
      grant_type: 'refresh_token'
    });

    return this._getToken(data);
  }

  getTokenInfo(): Observable<any> {
    return this.httpService.get(this.config.apiEndPoint.tokenInfo);
  }

}