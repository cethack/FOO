import {it, describe, beforeEach} from 'angular2/testing';
import {provide, ViewContainerRef, ReflectiveInjector, DynamicComponentLoader} from 'angular2/core';
import {ComponentInstruction, RouterOutlet, Router} from 'angular2/router';
import {LocalStorageService} from '../../common/services/localStorage.service';
import {MockRouterProvider} from '../../common/mock-tests/mockRoutes';
import {NavigationHistoryService} from '../../common/services/navigationHistory.service';
import {MockNavigationHistoryService} from '../../common/mock-tests/mockNavigationHistory.service';
import {MockLocalStorageService} from '../../common/mock-tests/mockLocalStorage.service';
import {APP_CONFIG, CONFIG} from '../../common/services/app.config';
import {CetAuthRouterOutletDirective} from './cetAuthRouterOutlet.directive';
import {MessageService} from '../../common/services/message.service';

export function main(): void {
  'use strict';

  describe('CetAuthRouterOutletDirective', () => {

    var routerOutlet;
    var instruction;
    var mockRouterProvider: MockRouterProvider;
    var injector: ReflectiveInjector;

    beforeEach(() => {
      mockRouterProvider = new MockRouterProvider();

      injector = ReflectiveInjector.resolveAndCreate([
        ViewContainerRef,
        MessageService,
        DynamicComponentLoader,
        provide(APP_CONFIG, {useValue: CONFIG}),
        provide(NavigationHistoryService, {useClass: MockNavigationHistoryService}),
        provide(LocalStorageService, {useClass: MockLocalStorageService}),
        mockRouterProvider.getProviders()
      ]);

      routerOutlet = new CetAuthRouterOutletDirective(
        injector.get(ViewContainerRef), injector.get(DynamicComponentLoader),
        injector.get(Router), '',
        injector.get(LocalStorageService), injector.get(MessageService),
        injector.get(NavigationHistoryService), injector.get(APP_CONFIG)
      );

      instruction = new ComponentInstruction();

      routerOutlet.config.routeName = {
        login: 'Login',
        dashboard: 'Dashboard'
      };

      spyOn(routerOutlet.parentRouter, 'navigate');
      spyOn(routerOutlet.historyService, 'push');
      spyOn(routerOutlet.messageService, 'publish');
      spyOn(routerOutlet.historyService, 'isHomePage');
      spyOn(RouterOutlet.prototype, 'activate');
    });

    describe('#activate', () => {
      it ('navigates to login page with invalid token ', () => {
        var routeData = {isAuthenticated: false, requireAuth: true};

        instruction.urlPath = 'home';
        instruction.routeData.data = routeData;
        spyOn(routerOutlet.localStorageService, 'get').and.returnValue('');

        routerOutlet.activate(instruction);

        expect(routerOutlet.parentRouter.navigate).toHaveBeenCalledWith (['Login']);
        expect(routerOutlet.messageService.publish).toHaveBeenCalledWith('route-activate', routeData);
        expect(routerOutlet.historyService.push).toHaveBeenCalledWith({urlPath: 'home', data: routeData});
        expect(routerOutlet.localStorageService.get).toHaveBeenCalledWith('cet-token');
      });

      it ('navigates to dashboard page with valid token and urlPath is login', () => {
        instruction.urlPath = 'login';
        spyOn(routerOutlet.localStorageService, 'get').and.returnValue('tokenstring');

        routerOutlet.activate(instruction);

        expect(routerOutlet.parentRouter.navigate).toHaveBeenCalledWith(['Dashboard']);
      });

      it ('does not call "navigate" method with valid token and non-login urlPath', () => {
        instruction.urlPath = 'task';
        spyOn(routerOutlet.localStorageService, 'get').and.returnValue('tokenstring');

        routerOutlet.activate(instruction);

        expect(routerOutlet.parentRouter.navigate).not.toHaveBeenCalled();
      });
    });

  });

}
