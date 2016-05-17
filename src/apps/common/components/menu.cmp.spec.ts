/* tslint:disable:typedef no-empty */
import {
  beforeEachProviders,
  beforeEach,
  TestComponentBuilder,
  describe,
  expect,
  inject,
  it
} from 'angular2/testing';
import {provide} from 'angular2/core';
import {ComponentFixture} from 'angular2/testing';

import {MenuComponent} from './menu.cmp';
import {MenuService} from '../services/menu.service';
import {MockFeedbackService} from '../mock-tests/mockFeedback.service';
import {PopupService} from '../services/popup.service';
import {MockPopupService} from '../mock-tests/mockPopup.service';

class Mock {
  showMenu: boolean = true;
}

export function main(): void {
  'use strict';
  var fixture; //Fixture for debugging and testing a component.
  var el, cmp;

  beforeEachProviders((): any => {
    return [
      provide(MenuService, {useClass: Mock}),
      provide(PopupService, {useClass: MockPopupService})
    ];
  });

  describe('menu.tpl.html', () => {

    beforeEach(inject([TestComponentBuilder], (tcb: TestComponentBuilder): any => {
      return tcb
        .createAsync(MenuComponent)
        .then((componentFixture: ComponentFixture) => {
          fixture = componentFixture;
          cmp = fixture.componentInstance;
        });
    }));

    describe('.page-blocker', () => {
      it('should show and hide popup', () => {
        el = fixture.nativeElement.querySelector('.page-blocker');

        cmp.closed = false;
        fixture.detectChanges();
        expect(el.className).not.toMatch('click-through');

        cmp.closed = true;
        fixture.detectChanges();
        expect(el.className).toMatch('click-through');
      });
    });

    describe('.menu', () => {
      it('should call popup', () => {
        el = fixture.nativeElement.querySelector('.menu');

        cmp.closed = false;
        fixture.detectChanges();
        expect(el.className).toMatch('slideInLeft');

        cmp.closed = true;
        fixture.detectChanges();
        expect(el.className).toMatch('slideOutLeft');
      });
    });

    describe('.menu #feedback', () => {
      it('should call popup', () => {
        el = fixture.nativeElement.querySelector('.menu #feedback');
        spyOn(cmp, 'openFeedbackPopup').and.returnValue(true);

        el.click();
        expect(cmp.openFeedbackPopup).toHaveBeenCalled();
      });
    });
  });

  describe('MenuComponent', () => {

    describe('#openFeedbackPopup', () => {
      it('should open feedback popup', (done) => {
        spyOn(cmp.feedback, 'init');
        spyOn(cmp.popup, 'open');

        cmp.openFeedbackPopup();
        expect(cmp.feedback.init).toHaveBeenCalled();
        expect(cmp.popup.open).toHaveBeenCalled();
        done();
      });
    });

    describe('#closeMenu', () => {
      it('should close menu half second later', (done) => {
        cmp.closeMenu();
        expect(cmp.closed).toBe(true);
        setTimeout(() => {
          expect(cmp.closed).toBe(false);
          expect(cmp.menu.showMenu).toBe(false);
        }, 600);
        done();
      });
    });

  });

}
