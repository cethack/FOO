import {provide, ReflectiveInjector} from 'angular2/core';

import {describe, expect, it} from 'angular2/testing';
import {XHRBackend, HTTP_PROVIDERS, Response, ResponseOptions} from 'angular2/http';
import {MockBackend, MockConnection} from 'angular2/http/testing';

import {LocalStorageService} from './localStorage.service';
import {UserService} from './user.service';
import {HttpService} from './http.service';
import {TokenService} from './token.service';
import {NavigationHistoryService} from './navigationHistory.service';
import {MessageService} from './message.service';
import {APP_CONFIG, CONFIG} from './app.config';
import {MockLocalStorageService} from '../../common/mock-tests/mockLocalStorage.service';
import {PopupService} from './popup.service';

/* tslint:disable:no-empty whitespace */
/**
 * Mock services
 */
class MockService {
  clear(): void {}
  publish(): void {}
  subscribe(): void {}
}

export function main(): void {
  'use strict';

  beforeEach(() => { try { jasmine.clock().install(); } catch(e) { () => {}; } } );

  afterEach(() => jasmine.clock().uninstall());

  describe('UserService', () => {

    let user: UserService;
    let xhrBackend: MockBackend;

    beforeEach(() => {
      //mock providers
      let injector: ReflectiveInjector = ReflectiveInjector.resolveAndCreate([
        HTTP_PROVIDERS,
        UserService,
        HttpService,
        PopupService,
        TokenService,
        provide(NavigationHistoryService, {useClass: MockService}),
        provide(MessageService, {useClass: MockService}),
        provide(XHRBackend, {useClass: MockBackend}),
        provide(LocalStorageService, {useClass: MockLocalStorageService}),
        provide(APP_CONFIG, {useValue: CONFIG})
      ]);

      user = injector.get(UserService);
      xhrBackend = injector.get(XHRBackend);  //mock http backend
    });

    describe('#tokenData', () => {
      it ('should get all token data', () => {
        let data = user.tokenData;
        expect(data.token).toBe('value of cet-token');
        expect(data.refreshToken).toBe('value of cet-refreshToken');
        expect(typeof data.tokenExpiresAt).toBe('object');
        expect(typeof data.tokenRefreshedAt).toBe('object');
        expect(data.tokenInfo).toBe('value of cet-tokenInfo');
      });
    });

    describe('#username', () => {
      it('should get username', () => {
        spyOn(user, 'getTokenData').and.returnValue({
          tokenInfo: {upn: 'foo'}
        });
        expect(user.username).toBe('foo');
      });
    });

    describe('#sessionExpired', () => {
      beforeEach(() => { try { jasmine.clock().install(); } catch(err) {} });
      afterEach(() => jasmine.clock().uninstall());

      it('should get sessionExpired', () => {
        var baseTime = new Date(2013, 9, 23, 13, 0, 0);
        jasmine.clock().mockDate(baseTime);

        var spy = jasmine.createSpy('foo');
        user.getTokenData = spy;

        spy.and.returnValue({});
        expect(user.sessionExpired).toBeFalsy();

        spy.and.returnValue({
          tokenExpiresAt: new Date(2013, 9, 23, 13, 10, 0)
        });
        expect(user.sessionExpired).toEqual(false);

        spy.and.returnValue({
          tokenExpiresAt: new Date(2013, 9, 23, 12, 59, 59)
        });
        expect(user.sessionExpired).toEqual(true);
      });
    });

    describe('#logout', () => {
      it('should logout', () => {
        spyOn(user.localStorageService, 'clear');
        spyOn(user.historyService, 'clear');

        user.logout();
        expect(user.localStorageService.clear).toHaveBeenCalled();
        expect(user.historyService.clear).toHaveBeenCalled();
      });
    });

    describe('#login', () => {
      it('should login with a valid user name and password', () => {
        xhrBackend.connections.subscribe((connection: MockConnection) => {
          // console.log('connection.request', connection.request);
          connection.mockRespond(new Response(
            new ResponseOptions({body: JSON.stringify({
              access_token: 'foo',
              token_info: 'bar',
              refresh_token: true,
              expires_in: true
            })})
          ));
        });

        user.login('vaild', 'valid').then(resp => {
          // console.log('resp', resp);
          expect(resp.access_token).toBe('foo');
        });
      });

      it('should not login with invalid username and password', () => {
        xhrBackend.connections.subscribe((connection: MockConnection) => {
          connection.mockRespond(new Response(
            new ResponseOptions({
              body: JSON.stringify({status: 400, statusText: '400 error'})
            })
          ));
        });
        user.login('invaild', 'invalid')
          .then(
            resp => {},
            err => expect(err.status).toBe(400)
          );
      });
    });

    describe('#restartSessionRestartTimer', () => {
      beforeEach(() => { try { jasmine.clock().install(); } catch(err) {} });
      afterEach(() => jasmine.clock().uninstall());

      it('should restart timer', () => {
        spyOn(user, 'logout');
        user.TOKEN_EXPIRY_MINS = 1;
        user.restartSessionRestartTimer();
        expect(user.sessionExpiredByTimer).toBe(false);

        jasmine.clock().tick(61000);
        expect(user.sessionExpiredByTimer).toBe(true);
        expect(user.logout).toHaveBeenCalled();
      });
    });

    describe('#setLastActivity', () => {
      beforeEach(() => { try { jasmine.clock().install(); } catch(err) {} });
      afterEach(() => jasmine.clock().uninstall());

      it('should refresh token when time is right', () => {
        user.TOKEN_REFRESH_MINS = 1;
        user.TOKEN_EXPIRY_MINS = 2;

        jasmine.clock().mockDate(new Date(2016, 3, 15, 11, 1, 1));

        spyOn(user, 'getTokenData').and.returnValue({
          token: 'something',
          tokenInfo: {upn: 'foo@bar.com'},
          tokenRefreshedAt : new Date(2016, 3, 15, 11, 0, 0)
        });
        spyOn(user, 'refreshToken');
        spyOn(user, 'restartSessionRestartTimer');
        spyOn(user, 'sessionExpired').and.returnValue(false);

        user.setLastActivity('msg');
        expect(user.lastActivityAt).toEqual(new Date(2016, 3, 15, 11, 1, 1));
        expect(user.refreshToken).toHaveBeenCalled();
        expect(user.restartSessionRestartTimer).toHaveBeenCalled();
      });
    });

    describe('#refreshToken', () => {
      beforeEach(() => { try { jasmine.clock().install(); } catch(err) {} });
      afterEach(() => jasmine.clock().uninstall());

      it('shoule refresh token', () => {
        jasmine.clock().mockDate(new Date(2016, 3, 15, 11, 1, 1));

        xhrBackend.connections.subscribe((connection: MockConnection) => {
          connection.mockRespond(new Response(
            new ResponseOptions({body: '{"access_token": "new"}'})
          ));
        });

        spyOn(user.localStorageService, 'set');
        user.refreshToken().then((resp) => {
          expect(resp.token).toBeTruthy();
          expect(resp.refreshToken).toBeTruthy();
          expect(user.localStorageService.set)
            .toHaveBeenCalledWith('cet-token', 'new');
        });
      });

    });

    describe('#getTokenData', () => {
      it('should get token data', () => {
        spyOn(user.localStorageService, 'get').and.returnValue('value');

        user.getTokenData('foo');
        expect(user.localStorageService.get).toHaveBeenCalledWith('foo');

        let resp = user.getTokenData();
        expect(resp.token).toBeTruthy();
        expect(resp.refreshToken).toBeTruthy();
        expect(resp.tokenExpiresAt).toBeTruthy();
        expect(resp.tokenRefreshedAt).toBeTruthy();
        expect(resp.tokenInfo).toBeTruthy();
      });
    });

    describe('#setTokenData', () => {
      it('should set token data', () => {
        spyOn(user.localStorageService, 'set');
        spyOn(user.localStorageService, 'remove');

        user.setTokenData('foo', null);
        expect(user.localStorageService.remove).toHaveBeenCalledWith('foo');

        user.setTokenData('foo', 'value');
        expect(user.localStorageService.set).toHaveBeenCalledWith('foo', 'value');
      });
    });

    describe('#loggedIn', () => {
      it('should return user is logged in or not', () => {
        spyOn(user, 'sessionExpired').and.returnValue(true);
        let spy = spyOn(user, 'getTokenData');

        spy.and.returnValue({token: 'something', tokenInfo: {upn: 'foo@bar.com'}});
        expect(user.loggedIn).toBe(true);

        spy.and.returnValue({token: '', tokenInfo: {upn: 'foo@bar.com'}});
        expect(user.loggedIn).toBe(false);
      });
    });
  });

}
