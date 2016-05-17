import {ExceptionHandler, Injectable} from 'angular2/core';
import {CetExceptionLogger} from './cetExceptionLogger';
import {PopupService} from './popup.service';

@Injectable()
export class CetExceptionHandlerService extends ExceptionHandler {
  constructor(public popup: PopupService) {
    super(new CetExceptionLogger(popup), false); //true to re-throw exception. false?
  }

  call(exception: any, stackTrace?: any, reason?: string): void {
    super.call(exception, stackTrace, reason);
  };
}