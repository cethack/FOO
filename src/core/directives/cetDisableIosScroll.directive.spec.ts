import {describe, expect, it} from 'angular2/testing';
import {SpyObject} from 'angular2/testing_internal';

import {CetDisableIOSScrollDirective} from './cetDisableIosScroll.directive';
import {ElementRef} from 'angular2/core';

class SpyElementRef extends SpyObject {
  constructor() { super(ElementRef); }
}

export function main(): void {
  'use strict';
  var directive;

  beforeEach( () => {
    var elRef = <any>new SpyElementRef();
    elRef.nativeElement = {};
    directive = new CetDisableIOSScrollDirective(elRef);
  });

  describe('#onTouchStart', () => {
    it('should set touch start', () => {
      spyOn(directive, 'isIOS').and.returnValue(true);
      directive.onTouchStart({touches: [{clientY: 100}]});
      expect(directive.touchStartY).toBe(100);
    });
  });

  describe('#onTouchMove', () => {
    it('should disable scroll when reaches to the bottom', () => {

      spyOn(directive, 'isIOS').and.returnValue(true);
      var evt = {
        stopPropagation: (): any => true,
        changedTouches: []
      };

      directive.el = { scrollHeight: 100, scrollTop: 10, offsetHeight: 90 };
      directive.touchStartY = 20;
      evt.changedTouches[0] = {clientY: 10};  //scrolling down
      expect(directive.onTouchMove(evt)).toBe(false);
    });

    it('should disable scroll when reaches to the top', () => {
      spyOn(directive, 'isIOS').and.returnValue(true);
      var evt = {
        stopPropagation: (): any => true,
        changedTouches: []
      };

      directive.el = { scrollHeight: 100, scrollTop: 0, offsetHeight: 90 };
      directive.touchStartY = 0;
      evt.changedTouches[0] = {clientY: 10};  //scrolling up
      expect(directive.onTouchMove(evt)).toBe(false);
    });

    it('should enable scroll when NOT reaches to the top or not IOS', () => {
      var evt = {
        stopPropagation: (): any => true,
        changedTouches: []
      };
      evt.changedTouches[0] = {clientY: 10};  //scrolling up
      expect(directive.onTouchMove(evt)).toBe(true);

      //not an IOS
      spyOn(directive, 'isIOS').and.returnValue(false);
      expect(directive.onTouchMove(evt)).toBe(true);
    });

  });

}

