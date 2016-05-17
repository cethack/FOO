import {it, expect, describe, beforeEachProviders, TestComponentBuilder, inject, ComponentFixture} from 'angular2/testing';

import {BaseComponent} from './base.cmp';
import {MessageService} from '../services/message.service';

export function main(): void {
  'use strict';

  var fixture: any;
  var cmp: BaseComponent;

  describe('BaseComponent', () => {

    beforeEachProviders(() => {
      return [
        MessageService
      ];
    });

    it ('has subscriptions and isAuthenticated properties',
      inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
        return tcb
          .createAsync(BaseComponent)
          .then((componentFixture: ComponentFixture) => {
            fixture = componentFixture;
            cmp = fixture.componentInstance;

            expect(cmp.subscriptions).toBeDefined();
            expect(cmp.isAuthenticated).toBeFalsy();
          });
      })
    );

    describe('#subscribeMessage', () => {
      it ('subscribes topics and listeners',
        inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
          return tcb
            .createAsync(BaseComponent)
            .then((componentFixture: ComponentFixture) => {
              fixture = componentFixture;
              cmp = fixture.componentInstance;

              spyOn(cmp.messageService, 'subscribe').and.returnValue({});
              cmp.subscribeMessage('test', () => 1);

              expect(cmp.subscriptions.length).toBe(1);
            });
        })
      );
    });

    describe('#ngOnDestroy', () => {
      it ('unsubscribes all subscriptions',
        inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
          return tcb
            .createAsync(BaseComponent)
            .then((componentFixture: ComponentFixture) => {
              fixture = componentFixture;
              cmp = fixture.componentInstance;

              var noop = () => 1;

              var mockSubscriptions = [
                {unsubscribe: (): void => { noop(); } },
                {unsubscribe: (): void => { noop(); } }
              ];

              cmp.subscriptions = mockSubscriptions;

              expect(cmp.subscriptions.length).toBe(2);
              cmp.ngOnDestroy();
              expect(cmp.subscriptions.length).toBe(0);
            });
        })
      );
    });

  });
}
