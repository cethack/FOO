import {it, describe} from 'angular2/testing';
import {Utils} from './utils';

export function main(): void {
  'use strict';

  describe('Utils', () => {

    it ('should be used without instantiation', (): void => {
      expect(Utils.formatNumberWith).toBeDefined();
    });

    describe('#formatNumberWith', (): void => {

      it ('should return 123 for 123', () => {
        expect(Utils.formatNumberWith('123')).toBe('123');
      });

      it ('should return 1,234 for 1234', () => {
        expect(Utils.formatNumberWith('1234')).toBe('1,234');
      });

      it ('should return 1,234,567 for 1234567', () => {
        expect(Utils.formatNumberWith('1234567')).toBe('1,234,567');
      });

      it ('should return 12,345,678 for 12345678', () => {
        expect(Utils.formatNumberWith('12345678')).toBe('12,345,678');
      });

      it ('should return 123,456,789 for 123456789', () => {
        expect(Utils.formatNumberWith('123456789')).toBe('123,456,789');
      });

      it ('should return 123.456.789 for 123456789 with "." as a thousand symbol', () => {
        expect(Utils.formatNumberWith('123456789')).toBe('123,456,789');
      });

    });

    describe('#formEncode', () => {

      it ('should return x=1&y=2 for {x:1, y:2}', () => {
        expect(Utils.formEncode({x: 1, y: 2})).toBe('x=1&y=2');
      });

      it ('should return x=1&y=2+3 for {x:1, y:"2 3"}', () => {
        expect(Utils.formEncode({x: 1, y: '2 3'})).toBe('x=1&y=2+3');
      });

      it ('should return x=1&y=http%3A%2F%2F+2 for {x:1, y:"http:// 2"}', () => {
        expect(Utils.formEncode({x: 1, y: 'http:// 2'})).toBe('x=1&y=http%3A%2F%2F+2');
      });

    });

    describe('#getDescriptionByLutCode', () => {
      let mockLuts = [
        {code: '000', description: 'abc'},
        {code: '001', description: 'xyz'},
        {code: '100', description: '123'}
      ];

      xit ('should return a description', () => {
        //expect(Utils.getDescriptionByLutCode('001', mockLuts)).toBe('xyz');
      });

    });

    describe('#replacePathVariables', () => {

      it ('should replace {taskId} with input value', () => {
        var endPontPath = '/wo/tasks/{taskId}/clockon';
        expect(Utils.replacePathVariables(endPontPath, 10)).toBe('/wo/tasks/10/clockon');
      });

      it ('should replace {taskId} and {laborId} with input values', () => {
        var endPontPath = '/wo/tasks/{taskId}/{laborId}/clockon';
        expect(Utils.replacePathVariables(endPontPath, 10, 20)).toBe('/wo/tasks/10/20/clockon');
      });

    });

    describe('#parseJSON', () => {
      it('should parse string to json object convering string of Date to Date instance', () => {
        let jsonStr: string = `{
          "example": {
            "number": 1000000,
            "string": "example glossary",
            "boolean": false,
            "array": ["foo", "bar", 1, false, 1.0, 0.555666],
            "null": null,
            "date": "2009-01-03T18:10:00.7526833-05:00",
            "date2": "2009-01-03T18:10:00.7526833+05:30",
            "date3": "2009-01-03T18:10:00Z"
          }
        }`;

        let obj: any = Utils.parseJSON(jsonStr); // instead of JSON.parse

        expect(obj.example.number).toEqual(1000000);
        expect(obj.example.string).toEqual('example glossary');
        expect(obj.example.boolean).toEqual(false);
        expect(obj.example.array).toEqual(['foo', 'bar', 1, false, 1.0, 0.555666]);
        expect(obj.example.null).toEqual(null);
        expect(obj.example.date.getTime()).toEqual(new Date('2009-01-03T18:10:00.7526833-05:00').getTime());
        expect(obj.example.date2.getTime()).toEqual(new Date('2009-01-03T18:10:00.7526833+05:30').getTime());
        expect(obj.example.date3.getTime()).toEqual(new Date('2009-01-03T18:10:00Z').getTime());
      });

    });


  });
}
