import {provide, ReflectiveInjector} from 'angular2/core';
import {HTTP_PROVIDERS} from 'angular2/http';
import {it, describe, expect} from 'angular2/testing';
import {HttpService} from './http.service';
import {TokenService} from './token.service';
import {LocalStorageService} from './localStorage.service';
import {APP_CONFIG, CONFIG} from './app.config';
//import {Utils} from './utils';
import {IConfig} from './FAR.d';
import {PopupService} from './popup.service';

export function main(): void {
  'use strict';

  describe('Token Service', () => {
    var tokenService;
    var config: IConfig;

    beforeEach(() => {
      let injector: ReflectiveInjector = ReflectiveInjector.resolveAndCreate([
        HTTP_PROVIDERS,
        HttpService,
        TokenService,
        LocalStorageService,
        PopupService,
        provide(APP_CONFIG, {useValue: CONFIG})
      ]);

      tokenService = injector.get(TokenService);
      config = injector.get(APP_CONFIG);
    });

    it ('#getToken is called with post ', () => {
      spyOn(tokenService, 'getToken').and.callThrough();
      spyOn(tokenService.httpService, 'post');

      tokenService.getToken('username', 'password');

      expect(tokenService.httpService.post).toHaveBeenCalled();
    });

    it ('#getRefreshToken is called with post', () => {
      spyOn(tokenService, 'getRefreshToken').and.callThrough();
      spyOn(tokenService.httpService, 'post');

      tokenService.getRefreshToken();

      expect(tokenService.httpService.post).toHaveBeenCalled();
    });

    it ('#getTokenInfo is called with get', () => {
      spyOn(tokenService, 'getTokenInfo').and.callThrough();
      spyOn(tokenService.httpService, 'get');

      tokenService.getTokenInfo();

      expect(tokenService.httpService.get).toHaveBeenCalled();
    });

  });
}