import {bootstrap} from 'angular2/platform/browser';
import {provide, enableProdMode, ExceptionHandler} from 'angular2/core';
import {ROUTER_PROVIDERS} from 'angular2/router';
import {LocationStrategy, HashLocationStrategy} from 'angular2/platform/common';
import {HTTP_PROVIDERS} from 'angular2/http';

import {AppComponent} from './apps/app.cmp';
import {CetExceptionHandlerService} from './apps/common/services/cetExceptionHandler.service';
import {PopupService} from './apps/common/services/popup.service';
//
enableProdMode();

bootstrap(AppComponent, [
  ROUTER_PROVIDERS,
  HTTP_PROVIDERS,
  PopupService,
  provide(LocationStrategy, {useClass: HashLocationStrategy}),
  provide(ExceptionHandler, {useClass: CetExceptionHandlerService, deps: [PopupService]})
]);

/**
 * Disabling browser back button
 */
window.addEventListener('popstate', (event: PopStateEvent) => {
  history.pushState(null, document.title, location.href);
});
