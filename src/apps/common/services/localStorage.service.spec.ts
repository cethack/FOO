import {it, describe} from 'angular2/testing';

import {LocalStorageService} from './localStorage.service';

export function main(): void {
  'use strict';

  var localStorageService: LocalStorageService;
  var tokenName: string = 'test-token';
  var tokenValue: string = '12345';
  var inValidValue: any = undefined;
  var tokenInfoName: string =  'tokenInfo';
  var tokenInfoValue: Object = {'name': 'Cetaris', 'team': 'far'};

  describe('LocalStorageService', () => {

    beforeEach(() => {
      localStorageService = new LocalStorageService();
    });

    // non private mode
    it ('should save a value to the memory and the localStorage in JSON string', () => {
      localStorageService.set(tokenName, tokenValue);

      expect(localStorage.getItem(tokenName)).toBe(JSON.stringify(tokenValue));
    });

    it ('should get a value', () => {
      localStorageService.set(tokenName, tokenValue);

      // when it returns via get method it is converted to a normal string
      expect(localStorageService.get(tokenName)).toBe(tokenValue);

      localStorageService.set(tokenName, inValidValue);
      expect(localStorageService.get(tokenName)).toBeNull();
    });

    it ('should remove an item from the localStorage and the memory storage', () => {
      localStorageService.set(tokenName, tokenValue);

      expect(localStorageService.get(tokenName)).toBeTruthy();

      localStorageService.remove(tokenName);

      expect(localStorageService.get(tokenName)).toBeFalsy();
    });

    it ('should clear all items from the localStorage and the memeory storage', () => {
      localStorageService.set(tokenName, tokenValue);
      localStorageService.set(tokenInfoName, tokenInfoValue);

      expect(localStorage.getItem(tokenName)).toBe(JSON.stringify(tokenValue));

      localStorageService.clear();

      expect(localStorage.getItem(tokenName)).toBeFalsy();
    });

    describe('in Private mode', () => {

      it ('should save a value without an error', () => {
        localStorageService._getMemoryStorage()[tokenName] = JSON.stringify(tokenValue);

        expect(localStorageService._getMemoryStorage()[tokenName]).toBe(JSON.stringify(tokenValue));
      });

      it ('should get a value without an error', () => {
        localStorageService.set(tokenName, tokenValue);

        expect(localStorageService.get(tokenName)).toBe(tokenValue);
      });

      it ('should remove an item from the memory storage', () => {
        localStorageService.set(tokenName, tokenValue);

        expect(localStorageService.get(tokenName)).toBeTruthy();

        localStorageService.remove(tokenName);

        expect(localStorageService.get(tokenName)).toBeFalsy();
      });

      it ('should clear all items from the memeory storage', () => {
        localStorageService._getMemoryStorage()[tokenName] = JSON.stringify(tokenValue);
        localStorageService._getMemoryStorage()[tokenInfoName] = JSON.stringify(tokenInfoValue);

        expect(localStorageService._getMemoryStorage()[tokenName]).toBe(JSON.stringify(tokenValue));

        localStorageService.clear();

        expect(localStorageService._getMemoryStorage()[tokenName]).toBeFalsy();
      });

    });

  });
}
