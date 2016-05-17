import {provide, ReflectiveInjector} from 'angular2/core';
import {describe, expect, it} from 'angular2/testing';
import {APP_CONFIG, CONFIG} from './app.config';
import {IConfig} from './FAR.d';

export function main(): void {
  'use strict';

  var injector = ReflectiveInjector.resolveAndCreate([
    provide(APP_CONFIG, {useValue: CONFIG})
  ]);

  var config: IConfig = injector.get(APP_CONFIG);

  describe('App Configuration', () => {

    it ('should be available for DI', () => {
      expect(config).toBeTruthy();
    });

    describe('for external configs', () => {

      it ('apiBaseUrl should have a non empty string', () => {
        expect(config.apiBaseUrl).not.toBe('');
      });

      it ('tokenRefreshMinis should be greater than 0', () => {
        expect(config.tokenRefreshMins).toBeGreaterThan(0);
      });

      it ('tokenExpiryMins should be greater than 0', () => {
        expect(config.tokenExpiryMins).toBeGreaterThan(0);
      });

    });

    describe('for API end points', () => {

      it ('apiEndPoint should not be null', () => {
        expect(config.apiEndPoint).not.toBeNull();
      });

      it ('endpoint path should be merged with apiBaseUrl', () => {
        expect(config.apiEndPoint.lut.indexOf(config.apiBaseUrl)).not.toBeLessThan(0);
      });

    });

  });
}