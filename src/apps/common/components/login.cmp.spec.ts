import {
  beforeEachProviders,
  beforeEach,
  TestComponentBuilder,
  describe,
  expect,
  inject,
  it
} from 'angular2/testing';
import {Component, provide } from 'angular2/core';
import {ComponentFixture} from 'angular2/testing';

import {Router, RouteRegistry, ROUTER_PRIMARY_COMPONENT, ROUTER_DIRECTIVES} from 'angular2/router';
import {Location} from 'angular2/platform/common';
import {SpyLocation} from 'angular2/src/mock/location_mock';
import {RootRouter} from 'angular2/src/router/router';

import {LoginComponent} from './login.cmp';
import {UserService} from '../services/user.service';
import {APP_CONFIG} from '../services/app.config';

/* tslint:disable:typedef no-empty */

@Component({ selector: 'my-comp', template: '', directives: [ROUTER_DIRECTIVES] })
class MyComp { }

class Mock {
  login() { }
  trackPromise() { }
}

interface IMockConfig {
}

const mockConfig: IMockConfig = {
};

export function main(): void {
  'use strict';
  var fixture; //Fixture for debugging and testing a component.
  var el, cmp;

  beforeEachProviders((): any => {
    return [
      RouteRegistry,
      provide(Location, {useClass: SpyLocation}),
      provide(ROUTER_PRIMARY_COMPONENT, {useValue: MyComp}),
      provide(Router, {useClass: RootRouter}),
      provide(UserService, {useClass: Mock}),
      provide(APP_CONFIG, {useValue: mockConfig})
    ];
  });

  describe('login.tpl.html', () => {

    beforeEach(inject([TestComponentBuilder], (tcb: TestComponentBuilder): any => {
      return tcb
        .createAsync(LoginComponent)
        .then((componentFixture: ComponentFixture) => {
          fixture = componentFixture;
          cmp = fixture.componentInstance;
        });
    }));

    describe('#errorMessage', () => {
      it('should bind to message', () => {
        el = fixture.nativeElement.querySelector('#errorMessage');
        cmp.message = 'My Message';
        fixture.detectChanges();
        expect(el.innerHTML).toMatch('My Message');
      });
    });

    describe('#username', () => {
      var keydownEvent;

      beforeEach(() => {
        el = fixture.nativeElement.querySelector('#username');
        keydownEvent = new KeyboardEvent('keydown', { bubbles: true, cancelable: true, shiftKey: true });
      });

      it('should respond to keydown event', () => {
        //keydown
        spyOn(cmp, 'ignoreSpace').and.callThrough();
        Object.defineProperty(keydownEvent, 'keyCode', { value: 32 });
        el.dispatchEvent(keydownEvent);
        expect(cmp.ignoreSpace).toHaveBeenCalled();
      });

      it('should have username and disabled when session is expired', () => {
        //value / disabled
        cmp.user.sessionExpiredByTimer = true;
        cmp.user.sessionExpiredUsername = 'session@expired.username';
        fixture.detectChanges();
        expect(el.value).toMatch('session@expired.username');
        expect(el.disabled).toBe(true);
      });
    });

    describe('#login-button', () => {
      beforeEach(() => {
        el = fixture.nativeElement.querySelector('#login-button');
      });

      it('shuold login when clicked', () => {
        spyOn(cmp, 'doLogin').and.returnValue(true);
        el.click();
        expect(cmp.doLogin).toHaveBeenCalled();
      });

      it('shuold be disabled', () => {
        cmp.loginFormDisabled = true;
        fixture.detectChanges();
        expect(el.disabled).toBe(true);
      });
    });
  });

  describe('LoginComponent', () => {

    beforeEach(() => {
      try { jasmine.clock().install(); } catch (e) { void (0); }
    });

    afterEach(() => {
      jasmine.clock().uninstall();
    });

    describe('#ignoreSpace', () => {
      it('should ignore space', () => {
        expect(cmp.ignoreSpace({ keyCode: 32 })).toBe(false);
        expect(cmp.ignoreSpace({ keyCode: 33 })).toBe(true);
      });
    });

    describe('#doLogin', () => {

      it('should login', () => {
        spyOn(cmp.user, 'login').and.returnValue(
          new Promise((resolve) => { resolve(); })
        );

        cmp.router.parent = true;
        cmp.config.routeName = { dashboard : 'foo'};
        spyOn(cmp.router, 'navigate').and.returnValue(true);

        cmp.doLogin('user', 'pass').then(() => {
          fixture.detectChanges();

          expect(cmp.message).toBeFalsy();
          expect(cmp.router.navigate).toHaveBeenCalled();
          expect(cmp.user.sessionExpiredByTimer).toBe(false);
        });
      });

      it('should not login', (done) => {
        let spy = spyOn(cmp.user, 'login');

        spy.and.returnValue(
          new Promise((_, reject) => { reject({ status: 400 }); })
        );
        cmp.attempts = 2;
        cmp.doLogin('user', 'pass').then(() => {
          expect(cmp.attempts).toBe(3);
          expect(cmp.loginFormDisabled).toBe(true);

          jasmine.clock().tick(30001);
          expect(cmp.loginFormDisabled).toBe(false);
          expect(cmp.attempts).toBe(0);
          expect(cmp.message).toBeNull();
          done();
        });

        spy.and.returnValue(
          new Promise((_, reject) => { reject('{"status": 500, "error_description": "my error"}'); })
        );
        cmp.doLogin('user', 'pass').then(() => {
          expect(cmp.message).not.toBe('my error');
        });
      });

    });
  });

}
