import {
  beforeEach,
  describe,
  expect,
  it
} from 'angular2/testing';
import {provide, ReflectiveInjector} from 'angular2/core';
import {AppComponent} from './app.cmp';
import {HttpService} from './common/services/http.service';
import {UserService} from './common/services/user.service';
import {MenuService} from './common/services/menu.service';
import {Observable} from 'rxjs/Observable';

class Mock {
  public requestNotifier: any = Observable.of({});
}

export function main(): void {
  'use strict';
  var cmp;

  beforeEach( () => {
    let injector: ReflectiveInjector = ReflectiveInjector.resolveAndCreate([
      provide(UserService, {useClass: Mock}),
      provide(HttpService, {useClass: Mock}),
      provide(MenuService, {useClass: Mock}),
      AppComponent
    ]);

    cmp = injector.get(AppComponent);
  });

  describe('AppComponent', () => {

    xdescribe('#sessionExpiredByTimer', () => {
      it('should see when session is expired by timer', () => {
        expect(cmp.sessionExpirdByTimer).toBeFalsy();

        cmp.user.sessionExpiredUsername = 'foo';
        cmp.user.sessionExpiredByTimer = true;
        expect(cmp.sessionExpiredByTimer).toBe(true);
      });
    });

    xdescribe('#handleHttpmMssages', () => {
      it('should set http in progress accordingly', () => {
        cmp.handleHttpMessages({type: 'start'});
        expect(cmp.httpInProgress).toBe(true);

        cmp.handleHttpMessages({type: 'done'});
        expect(cmp.httpInProgress).toBe(false);

        cmp.handleHttpMessages({type: 'error'});
        expect(cmp.httpInProgress).toBe(false);
      });
    });
  });
}
