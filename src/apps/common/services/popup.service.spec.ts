import {ReflectiveInjector, Component} from 'angular2/core';
import {describe, expect, it} from 'angular2/testing';
import {Observable} from 'rxjs/Observable';

import {PopupService} from './popup.service';

@Component({template: ''})
class MockComponent {}

export function main(): void {
  'use strict';

  describe('PopupService', () => {

    let popup: PopupService;

    beforeEach(() => {
      //mock providers
      let injector: ReflectiveInjector = ReflectiveInjector.resolveAndCreate([
        PopupService
      ]);

      popup  = injector.get(PopupService);
    });

    it ('should init a observable', () => {
      expect(popup.visibleChanges$ instanceof Observable).toBe(true);
    });

    describe('#open', () => {
      it('should open', () => {
        popup.open(MockComponent); //this line does not work because of racing condition
        expect(popup.component).toEqual(MockComponent);
        popup.visibleChanges$.subscribe(resp => {
          expect(resp).toBe(true);
        });
      });
    });

    describe('#close', () => {
      it('should close', () => {
        popup.close(); //this line does not work because of racing condition
        popup.visibleChanges$.subscribe(resp => {
          expect(resp).toBe(false);
        });
      });
    });

  });

}
