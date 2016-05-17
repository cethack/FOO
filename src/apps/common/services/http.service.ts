import {Injectable, Inject} from 'angular2/core';
import {Headers, Http, RequestOptionsArgs, Response} from 'angular2/http';
import {Observable} from 'rxjs/Observable';
import {ReplaySubject} from 'rxjs/ReplaySubject';
//import 'rxjs/add/operator/map';
import 'rxjs/Rx';

import {INotification, IConfig, IJSONObject} from './FAR.d';
import {LocalStorageService} from '../services/localStorage.service';
import {APP_CONFIG} from './app.config';
import {Utils} from './utils';

@Injectable()
export class HttpService {

  // should use for login page otherwise it will be failed
  static OPTS_POST_FORM: any = {
    headers: new Headers({
      'Content-Type': 'application/x-www-form-urlencoded'
    })
  };

  requestNotifier: ReplaySubject<INotification> = new ReplaySubject<INotification>(1);

  constructor(
    private http: Http,
    public localStorageService: LocalStorageService,
    @Inject(APP_CONFIG) private config: IConfig
  ) {}

  get(url: string, options?: RequestOptionsArgs): Observable<Response> {
    return this._request('get', url, options);
  }

  post(url: string, body?: string | IJSONObject, options?: RequestOptionsArgs): Observable<Response> {
   return this._request('post', url, body || '', options);
  }

  put(url: string, body: string | IJSONObject, options?: RequestOptionsArgs): Observable<Response> {
    return this._request('put', url, body, options);
  }

  delete(url: string, options?: RequestOptionsArgs): Observable<Response> {
    return this._request('delete', url, options);
  }

  patch(url: string, body: string | IJSONObject, options?: RequestOptionsArgs): Observable<Response> {
    return this._request('patch', url, body, options);
  }

  head(url: string, options?: RequestOptionsArgs): Observable<Response> {
    return this._request('head', url, options);
  }

  private _request(method: string, ...httpParams: any[]): Observable<Response> {
    this._notify({ type: 'start' });

    let paramIndex: number = ['get', 'delete', 'head'].indexOf(method) !== -1 ? 1 : 2;
    let isCreateUpdate = ['post', 'put', 'patch'].indexOf(method) >= 0;

    httpParams[paramIndex] = this.setAuthorizationHeader(httpParams[paramIndex]);

    if (isCreateUpdate && typeof httpParams[1] !== 'string') {
      // options: httpParams[2], body: httpParams[1]
      httpParams[2].headers['Content-Type'] = 'application/json;charset=UTF-8';
      httpParams[1] = JSON.stringify(httpParams[1]);
    }

    return this.http[method].apply(this.http, httpParams)
      .map((res: Response) => {
        let ret: any;

        try {
          ret = Utils.parseJSON(res.text());
        } catch (e) {
          ret = res.text();
        }

        return ret;
      })
      .do(
        (res: any) => {
         this._notify({ type: 'done' });
        },
        (err: any) => {
          this._notify({ type: 'error', data: err });
        },
        () => {
          this._notify({ type: 'complete' });
        }
      )
      .catch(e => {
        /**
         * Big rules apply here, please read with full atttention
         * 1. when user is not logged in, all errors are NOT caught, and return as a good response
         * 2. when user is logged in and error is 409, show status text to user
         * 3. For any other errors, throw exception, so that a generic exception handler can catch it and show feedback popup
         */
        const token = this.localStorageService.get(this.config.storageKey.token);
        if (!token) {
          return Observable.of(e);
        } else {
          throw new Error(JSON.stringify(e));
        }
      });

  }

  private _notify(notification: INotification): void {
    this.requestNotifier.next(notification);
  }

  private setAuthorizationHeader(customOptions: RequestOptionsArgs): RequestOptionsArgs {
    const options: RequestOptionsArgs = customOptions == null ? {} : customOptions;
    options.headers = options.headers || <Headers>{};

    //@TODO check if it needs to check expiry date
    const token = this.localStorageService.get(this.config.storageKey.token);
    if (token && !options.headers['Authorization']) {
      options.headers['Authorization'] = 'Bearer ' + token;
    }

    return options;
  };

}
