import {it, describe} from 'angular2/testing';

import {SelectItem} from './selectItem.service';

export function main(): void {
  'use strict';

  describe('SelectItemService', () => {
    let selectItem;
    let mockSourceObject = {
      code: '000',
      description: 'Air condition'
    };
    let mockSourceString = 'Brakes';

    let idPropertyName = 'code';
    let textPropertyName = 'description';

    it ('should be able to set custom property names', () => {
      SelectItem.idPropertyName = idPropertyName;
      SelectItem.textPropertyName = textPropertyName;

      expect(SelectItem.idPropertyName).toBe(idPropertyName);
      expect(SelectItem.textPropertyName).toBe(textPropertyName);
    });

    describe('String of source', () => {
      beforeEach(() => {
        selectItem = new SelectItem(mockSourceString);
      });

      it ('id, text and displayText should have the same value as the source', () => {
        expect(selectItem.id).toBe(selectItem.text);
        expect(selectItem.id).toBe(selectItem.displayText);
      });
    });

    describe('Object of source', () => {
      beforeEach(() => {
        SelectItem.idPropertyName = idPropertyName;
        SelectItem.textPropertyName = textPropertyName;

        selectItem = new SelectItem(mockSourceObject);
      });

      it ('id and text should be different', () => {
        expect(selectItem.id).not.toBe(selectItem.text);
      });

      it ('displayText is composite of id and text', () => {
        expect(selectItem.displayText).toBe(selectItem.id + ' ' + selectItem.text);
      });
    });

  });
}