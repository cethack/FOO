import {describe, expect, it} from 'angular2/testing';
import {CetCommaPipe} from './cetComma.pipe';

export function main(): void {
  'use strict';

  describe('CetCommaPipe', () => {
    let commaPipe: CetCommaPipe = new CetCommaPipe;
    let bigNumber: number = 12345678900;
    let smallNumber: number = 123;
    let fluidTrue: boolean = true;
    let fluidFalse: boolean = false;

    describe('For Fluid is true', () => {
      it('should return 12,345,678,900.000 for 12345678900', () => {
        let transformBigNumber = commaPipe.transform(bigNumber, fluidTrue);
        expect(transformBigNumber).toEqual('12,345,678,900.000');
      });

      it('should return 123.000 for 123', () => {
        let transformSmallNumber = commaPipe.transform(smallNumber, fluidTrue);
        expect(transformSmallNumber).toEqual('123.000');
      });
    });

    describe('For Fluid is false', () => {
      it('should return 12,345,678,900 for 12345678900', () => {
        let transformBigNumber = commaPipe.transform(bigNumber, fluidFalse);
        expect(transformBigNumber).toEqual('12,345,678,900');
      });

      it('should return 123 for 123', () => {
        let transformSmallNumber = commaPipe.transform(smallNumber, fluidFalse);
        expect(transformSmallNumber).toEqual('123');
      });
    });
  });
}
