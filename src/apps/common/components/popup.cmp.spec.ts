/* tslint:disable:typedef no-empty */
import {TestComponentBuilder, describe, expect, inject, it} from 'angular2/testing';
import {Component, provide} from 'angular2/core';

import {PopupComponent} from './popup.cmp';
import {PopupService} from '../services/popup.service';

export function main(): void {
  'use strict';
  var el, cmp;

  class MockPopupService {
    visibleChanges$ = {
      subscribe: () => {}
    };
  }

  @Component({
    template: 'MyPopup(<popup><div #dynCmp></div></popup>)',
    providers: [provide(PopupService, {useClass: MockPopupService})],
    directives: [PopupComponent]
  })
  class TestComponent {}

  describe('popup.tpl.html', () => {

    describe('.page-blocker', () => {
      it('should show and hide popup',
        inject([TestComponentBuilder], tcb => {
          return tcb.createAsync(TestComponent).then( fixture => {
            el = fixture.debugElement.nativeElement.querySelector('popup .page-blocker');
            cmp = fixture.debugElement.children[0].componentInstance;

            expect(el.style.display).toBe('');

            cmp.visible = false;
            fixture.detectChanges();
            expect(el.style.display).toBe('none');
          });
        })
      );
    });


    describe('.material-icons', () => {
      it('should call popup',
        inject([TestComponentBuilder], tcb => {
          return tcb.createAsync(TestComponent).then( fixture => {
            el = fixture.debugElement.nativeElement.querySelector('popup .material-icons');
            cmp = fixture.debugElement.children[0].componentInstance;

            spyOn(cmp, 'closePopup').and.callThrough();
            el.click();
            expect(cmp.closePopup).toHaveBeenCalled();
          });
        })
      );
    });
  });

  describe('PopupComponent', () => {

    @Component({template: '<div>TEST</div>'})
    class MockComponent {}

    describe('#openPopup', () => {
      it('should open popup',
        inject([TestComponentBuilder], tcb => {
          return tcb.createAsync(TestComponent).then( fixture => {
            cmp = fixture.debugElement.children[0].componentInstance;

            cmp.popup.component = MockComponent;
            cmp.popup.componentOptions = {foo: 1};

            fixture.detectChanges();
            cmp.openPopup().then(() => {
              expect(cmp.visible).toBe(true);
            });
          });
        })
      );
    });

    describe('#closePopup', () => {
      it('should close popup',
        inject([TestComponentBuilder], tcb => {
          return tcb.createAsync(TestComponent).then( fixture => {
            cmp = fixture.debugElement.children[0].componentInstance;
            cmp.dynCmp = Promise.resolve({ dispose: function(){} });

            cmp.closePopup();
            expect(cmp.visible).toBe(false);
          });
        })
      );
    });
  });

}
