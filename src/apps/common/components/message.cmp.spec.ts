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
import {ComponentFixture} from 'angular2/testing';

import {MessageComponent} from './message.cmp';

export function main(): void {
  'use strict';
  var fixture; //Fixture for debugging and testing a component.
  var el, cmp;

  beforeEachProviders((): any => {
    return [];
  });

  describe('message.tpl.html', () => {

    beforeEach(inject([TestComponentBuilder], (tcb: TestComponentBuilder): any => {
      return tcb
        .createAsync(MessageComponent)
        .then((componentFixture: ComponentFixture) => {
          fixture = componentFixture;
          cmp = fixture.componentInstance;
        });
    }));

    describe('.header', () => {
      it('should show and hide header', () => {
        fixture.detectChanges();
        el = fixture.nativeElement.querySelector('.header');
        expect(el).toBeNull();

        cmp.titleId = 'ERROR';

        fixture.detectChanges();
        el = fixture.nativeElement.querySelector('.header');
        expect(el).not.toBeNull();

      });

      it('should show translated message', () => {
        fixture.detectChanges();
        cmp.titleId = 'ERROR';

        fixture.detectChanges();
        el = fixture.nativeElement.querySelector('.header .title');
        expect(el.innerHTML).toMatch(/Error/);
      });
    });

    describe('.message', () => {
      it('should show hide by messageId', () => {
        fixture.detectChanges();
        el = fixture.nativeElement.querySelector('.message');
        expect(el).toBeNull();

        cmp.messageId = 'ERROR';
        fixture.detectChanges();
        el = fixture.nativeElement.querySelector('.message');
        expect(el).not.toBeNull();
      });

      it('should show translated message', () => {
        fixture.detectChanges();
        el = fixture.nativeElement.querySelector('.message');

        cmp.messageId = 'TEST-MSG';
        fixture.detectChanges();
        el = fixture.nativeElement.querySelector('.message');
        expect(el.innerHTML).toMatch(/Test Message/);
      });
    });

    describe('.footer', () => {
      it('should show hide by buttons', () => {
        fixture.detectChanges();

        el = fixture.nativeElement.querySelector('.footer');
        let cancelButton = fixture.nativeElement.querySelector('.footer .cancel');
        let okButton = fixture.nativeElement.querySelector('.footer .ok');
        expect(el).toBeNull();
        expect(cancelButton).toBeNull();
        expect(okButton).toBeNull();

        cmp.buttons = {
          ok: () => {},
          cancel: () => {}
        };

        fixture.detectChanges();
        el = fixture.nativeElement.querySelector('.footer');
        cancelButton = fixture.nativeElement.querySelector('.footer .cancel');
        okButton = fixture.nativeElement.querySelector('.footer .ok');

        expect(el).not.toBeNull();
        expect(cancelButton).not.toBeNull();
        expect(okButton).not.toBeNull();
      });

      it('should execute ok/cancel functions', () => {
        fixture.detectChanges();
        cmp.buttons = { ok: function(){}, cancel: function() {}};
        spyOn(cmp.buttons, 'ok').and.returnValue(true);
        spyOn(cmp.buttons, 'cancel').and.returnValue(true);

        fixture.detectChanges();
        let cancelButton = fixture.nativeElement.querySelector('.footer .cancel');
        let okButton = fixture.nativeElement.querySelector('.footer .ok');

        okButton.click();
        expect(cmp.buttons.ok).toHaveBeenCalled();

        cancelButton.click();
        expect(cmp.buttons.cancel).toHaveBeenCalled();
      });

    });
  });

  describe('MessageComponent', () => {

    describe('#ngOnInit', () => {
      it('should set property from given options', (done) => {
        cmp.popupOptions = {
          titleId: 'A', messageId: 'B', buttons: 'C'
        };

        cmp.ngOnInit();
        expect(cmp.titleId).toEqual('A');
        expect(cmp.messageId).toEqual('B');
        expect(cmp.buttons).toBe('C');
        done();
      });
    });

    describe('#getTranslated', () => {
      it('should get translated message from message id', (done) => {
        spyOn(cmp.elementRef.nativeElement, 'querySelector').and.returnValue({
          innerHTML: 'translated message'
        });

        let msg = cmp.getTranslated('SOME-ID');
        expect(msg).toBe('translated message');

        done();
      });
    });

    describe('#cancel', () => {
      it('should call registered cancel method', (done) => {
        cmp.buttons = { cancel: function() {}};
        spyOn(cmp.buttons, 'cancel').and.returnValue(true);

        cmp.cancel();
        expect(cmp.buttons.cancel).toHaveBeenCalled();
        done();
      });
    });

    describe('#ok', () => {
      it('should call registered ok method', (done) => {
        cmp.buttons = { ok: function() {}};
        spyOn(cmp.buttons, 'ok').and.returnValue(true);

        cmp.ok();
        expect(cmp.buttons.ok).toHaveBeenCalled();
        done();
      });
    });
  });
}
