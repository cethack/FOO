/* tslint:disable:typedef no-empty */
import {TestComponentBuilder, describe, expect, inject, it} from 'angular2/testing';
import {Component} from 'angular2/core';
import {CetTrimDirective} from './cetTrim.directive';

export function main(): void {
  'use strict';
  var el, cmp;

  @Component({
    template: 'MyTest(<input id="ng-model" cet-trim [(ngModel)]="myModel" /> <input id="el-ref" cet-trim #myRef />)',
    directives: [CetTrimDirective]
  })
  class TestComponent {}

  describe('CetTrimDirective', () => {

    describe('#onChange', () => {
      it('should open popup',
        inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
          return tcb
            .createAsync(TestComponent).then(fixture => {
            cmp = fixture.componentInstance;
            cmp.myModel = 'foo';
            el = fixture.nativeElement.querySelector('#ng-model');
            el.value = '  value 1  ';

            el.dispatchEvent(new Event('change'));
            expect(el.value).toBe('value 1');

            el = fixture.nativeElement.querySelector('#el-ref');
            el.value = '  value 2  ';

            el.dispatchEvent(new Event('change'));
            expect(el.value).toBe('value 2');
          });
        })
      );
    });
  });

}
