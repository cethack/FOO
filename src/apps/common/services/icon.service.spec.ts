import {it, describe, beforeEach} from 'angular2/testing';
import {IconService} from './icon.service';
import {CONFIG} from './app.config';

export function main(): void {
  'use strict';

  var iconService: IconService;

  describe('IconService', () => {

    beforeEach(() => {
      iconService = new IconService(CONFIG);
    });

    it ('should have two parameters', () => {
      expect(iconService.getSrcUrl.length).toBe(2);
    });

    it ('should have "lutName" and "code" in the return', () => {
      var url: string;
      url = iconService.getSrcUrl('AssetType', '10');

      expect(url.indexOf('lutName') > 0).toBeTruthy();
      expect(url.indexOf('code') > 0).toBeTruthy();
    });
  });

}
