import {describe, expect, it} from 'angular2/testing';
import {CetExceptionLogger} from './cetExceptionLogger';
import {PopupService} from './popup.service';
import {MessageComponent} from '../components/message.cmp';

export function main(): void {
  'use strict';
  let popup = new PopupService();
  let logger = new CetExceptionLogger(popup);

  describe('CetExceptionLogger', () => {

    describe('#log, #logError, #logGroup', () => {
      it('should should add to messages', () => {
        logger.log('1');
        expect(logger.messages).toEqual(['1']);
        logger.logError('2');
        expect(logger.messages).toEqual(['1', '2']);
        logger.logGroup('3');
        expect(logger.messages).toEqual(['1', '2', '3']);
      });
    });

    xdescribe('#logGroupEnd', () => {
      it('should open popup with feedback', () => {
        spyOn(logger.popup, 'open').and.returnValue(true);
        logger.logGroupEnd();

      });

      it('should open popup with message component', () => {
        logger.messages = ['Exception: Error {"status": 409, "statusText": "OK"}'];
        spyOn(logger.popup, 'open').and.returnValue(true);
        logger.logGroupEnd();
        expect(logger.popup.open).toHaveBeenCalledWith(
          MessageComponent,
          {titleId: 'ERROR', message: 'OK', buttons: {ok: jasmine.any(Function)}}
        );
      });
    });
  });
}