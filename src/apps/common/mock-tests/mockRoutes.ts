import {Component, provide} from 'angular2/core';
import {
  RouteConfig,
  Router,
  RouteParams,
  RouteData,
  RouteRegistry,
  ROUTER_DIRECTIVES,
  ROUTER_PRIMARY_COMPONENT
} from 'angular2/router';

import {
  Location,
  LocationStrategy
} from 'angular2/platform/common';

import {RootRouter} from 'angular2/src/router/router';
import {SpyLocation} from 'angular2/src/mock/location_mock';
import {SpyObject} from 'angular2/testing_internal';
import {MockLocationStrategy} from 'angular2/src/mock/mock_location_strategy';

@Component({})
class MockAppCmp {}

@Component({
  directives: [ROUTER_DIRECTIVES]
})
@RouteConfig([
  { path: '/login', name: 'Login', component: MockAppCmp},
  { path: '/dashboard', name: 'Dashboard', component: MockAppCmp},
  { path: '/wo', name: 'WoTaskList', component: MockAppCmp},
  { path: '/wo/:id', name: 'WoPartList', component: MockAppCmp},
  { path: '/wo/:id/clock-on-early', name: 'WoClickOnEarly', component: MockAppCmp }

])
class MockRootCmp {}

export class MockRouteParams extends SpyObject {
  private ROUTE_PARAMS = {};

  constructor() { super(RouteParams); }

  set(key: string, value: string): void {
    this.ROUTE_PARAMS[key] = value;
  }

  get(key: string): any {
    return this.ROUTE_PARAMS[key];
  }
}

export class MockRouteData {
    private values: any = {};

    public get(key: string): any {
        return this.values[key];
    }

    public set(key: string, value: any): void {
        this.values[key] = value;
    }
}

export class MockRouterProvider {
  mockRouteParams: MockRouteParams = new MockRouteParams();
  mockRouteData: MockRouteData = new MockRouteData();
  // mockLocationStrategy: MockLocationStrategy = new MockLocationStrategy();
  // mockLocation: MockLocation = new MockLocation();

  setRouteParam(key: string, value: any): void {
    this.mockRouteParams.set(key, value);
  }

  setRouteData(key: string, value: any): void {
    this.mockRouteData.set(key, value);
  }

  getProviders(): Array<any> {
    return [
      // provide(Router, {useValue: this.mockRouter}),
      RouteRegistry,
      provide(Router, {useClass: RootRouter}),
      provide(ROUTER_PRIMARY_COMPONENT, {useValue: MockRootCmp}),
      provide(RouteData, {useValue: this.mockRouteData}),
      provide(RouteParams, {useValue: this.mockRouteParams}),
      provide(Location, {useClass: SpyLocation}),
      provide(LocationStrategy, {useClass: MockLocationStrategy})
    ];
  }
}
