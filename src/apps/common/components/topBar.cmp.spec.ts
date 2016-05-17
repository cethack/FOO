/* tslint:disable:typedef no-empty */
import {provide, Component} from 'angular2/core';
import {TestComponentBuilder, describe, expect, inject, it} from 'angular2/testing';

import {TopBarComponent} from './topBar.cmp';
import {MockRouterProvider} from '../../common/mock-tests/mockRoutes';
import {LocalStorageService} from '../services/localStorage.service';
import {MessageService} from '../services/message.service';
import {MenuService} from '../services/menu.service';
import {UserService} from '../services/user.service';
import {APP_CONFIG, CONFIG} from '../../common/services/app.config';

class MockTaskService {
  subscribe() { }
  publish() { }
}

@Component({
  template: '<top-bar></top-bar>',
  providers: [
    provide(LocalStorageService, { useClass: MockTaskService }),
    provide(MessageService, { useClass: MockTaskService }),
    provide(MenuService, { useClass: MockTaskService }),
    provide(UserService, { useClass: MockTaskService }),
    provide(APP_CONFIG, { useValue: CONFIG }),
    (new MockRouterProvider()).getProviders()
  ],
  directives: [TopBarComponent]
})
class TestComponent { }

export function main(): void {
  'use strict';

  var cmp;
  var el;

  describe('top-bar.tpl.html', () => {
    describe('.menu-icon', () => {
      it('should show and hide menu',
        inject([TestComponentBuilder], tcb => {
          return tcb.createAsync(TestComponent).then(fixture => {
            fixture.detectChanges();
            cmp = fixture.debugElement.children[0].componentInstance;
            cmp.routeActivateMessageData.isAuthenticated = true;
            cmp.user.tokenData = { tokenInfo: true };

            fixture.detectChanges();
            el = fixture.nativeElement.querySelector('#topbar-menu');
            el.click();
            expect(cmp.menu.showMenu).toBe(true);
          });
        })
      );
    });

    describe('.title', () => {
      it('should show title',
        inject([TestComponentBuilder], tcb => {
          return tcb.createAsync(TestComponent).then(fixture => {
            fixture.detectChanges();
            cmp = fixture.debugElement.children[0].componentInstance;
            cmp.routeActivateMessageData.isAuthenticated = true;
            cmp.routeActivateMessageData.title = 'Work Order Test';
            cmp.user.tokenData = { tokenInfo: true };

            fixture.detectChanges();
            el = fixture.nativeElement.querySelector('.top-bar .title h3');
            expect(el.innerHTML).toBe('Work Order Test');
          });
        })
      );
    });

    describe('.right-side', () => {
          it('should show reload icon and User given and last name' ,
            inject([TestComponentBuilder], tcb => {
              return tcb.createAsync(TestComponent).then(fixture => {
                fixture.detectChanges();
                cmp = fixture.debugElement.children[0].componentInstance;
                cmp.routeActivateMessageData.isAuthenticated = true;
                cmp.routeActivateMessageData.title = 'Work Order Test';
                cmp.user.tokenData = { tokenInfo: true };
                cmp.routeActivateMessageData.hasReload = true;
                cmp.user.tokenData = {tokenInfo: { givenName: 'John', surname: 'Doe' }};
                fixture.detectChanges();
                el = fixture.nativeElement.querySelector('.right-side i');
                expect(el.style.display).toBe('inline');

                spyOn(cmp, 'reloadPartList');
                el.click();
                expect(cmp.reloadPartList).toHaveBeenCalled();

                el = fixture.nativeElement.querySelector('.right-side span');
                expect(el.innerHTML).toMatch('John Doe');
              });
            })
          );
        });

  });

  describe('TopBarComponent', () => {

   describe('#ngOnInit', () => {
      it('should call subscribeMessage()',
        inject([TestComponentBuilder], tcb => {
          return tcb.createAsync(TestComponent).then(fixture => {
            fixture.detectChanges();
            cmp = fixture.debugElement.children[0].componentInstance;

            spyOn(cmp, 'subscribeMessage');
            cmp.ngOnInit();
            expect(cmp.subscribeMessage).toHaveBeenCalled();
          });
        })
      );
    });

     describe('#ngDoCheck', () => {
      it('should assign value to showReloadIcon ',
        inject([TestComponentBuilder], tcb => {
          return tcb.createAsync(TestComponent).then(fixture => {
            fixture.detectChanges();
            cmp = fixture.debugElement.children[0].componentInstance;
            cmp.routeActivateMessageData.hasReload = true;

            cmp.ngDoCheck();
            expect(cmp.showReloadIcon).toBe(true);
          });
        })
      );
    });

    describe('#reloadPartList', () => {
      it('should reload part list',
        inject([TestComponentBuilder], tcb => {
          return tcb.createAsync(TestComponent).then(fixture => {
            fixture.detectChanges();
            cmp = fixture.debugElement.children[0].componentInstance;

            spyOn(cmp.messageService, 'publish');
            cmp.reloadPartList();
            expect(cmp.messageService.publish).toHaveBeenCalled();
          });
        })
      );
    });
  });

}


