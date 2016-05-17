import {describe, expect, it} from 'angular2/testing';
import {HighlightPipe} from './highlight.pipe';

export function main(): void {
  'use strict';

  describe('HighlightPipe', () => {
    let hlPipe: HighlightPipe = new HighlightPipe;

    it('should return a string with <strong> tag', () => {
      let itemText = '000 Air Condition: air filter';
      let searchTerm = 'air';
      let transformedText = hlPipe.transform(itemText, searchTerm);

      expect(transformedText).toEqual('000 <strong>Air</strong> Condition: <strong>air</strong> filter');
    });

  });

}
