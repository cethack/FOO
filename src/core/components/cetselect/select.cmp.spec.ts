import {
  it,
  expect,
  describe,
  beforeEach,
  beforeEachProviders,
  TestComponentBuilder,
  inject,
  ComponentFixture
} from 'angular2/testing';
import {ElementRef, provide, EventEmitter} from 'angular2/core';
import {Select} from './select.cmp';
import {SelectItem} from './selectItem.service';
import {HighlightPipe} from './highlight.pipe';

class MockHighlightPipe {
  transform(value: string, args: any[]): any {

    return value.replace(args[0], '<string>$&</strong>');
  }
}

export function main(): void {
  'use strict';

  var fixture;
  var cmp;
  var el;

  beforeEachProviders((): any => {
    return [
      ElementRef,
      provide(HighlightPipe, {useClass: MockHighlightPipe})
    ];
  });

  describe('Select Component', () => {

    beforeEach(inject([TestComponentBuilder], (tcb: TestComponentBuilder): any => {
      return tcb.createAsync(Select)
        .then((compfixture: ComponentFixture) => {
          fixture = compfixture;
          cmp = fixture.componentInstance;
          el = fixture.debugElement.nativeElement;
        });
    }));

    describe('template', () => {

      it ('has 1 input tag', () => {
        expect(el.querySelector('input')).toBeDefined();
      });

      it ('initially does not have a list of select items', () => {
        expect(el.querySelector('ul.cet-select-items')).toBeNull();
      });

      it ('autocomplete attribute should be set to off', () => {
        expect(el.querySelector('input[autocomplete="off"]')).toBeDefined();
      });

      it ('has placeholder attribute', () => {
        expect(el.querySelector('input[placeholder]')).toBeDefined();
      });

    });

    describe('Component', () => {
      var inputEl;
      var keydownEvent;
      var keyupEvent;

      beforeEach(() => {
        try { jasmine.clock().install(); } catch (e) { void (0); }

        inputEl = el.querySelector('input');
        keydownEvent = new KeyboardEvent('keydown', {bubbles: true, cancelable: true, shiftKey: true});
        keyupEvent = new KeyboardEvent('keyup', {bubbles: true, cancelable: true, shiftKey: true});
      });

      afterEach(() => {
        jasmine.clock().uninstall();
      });

      describe('has input properties', () => {
        it ('minLength', () => {
          expect(typeof cmp.minLength).toBe('number');
        });

        it ('idPropertyName', () => {
          expect(typeof cmp.idPropertyName).toBe('string');
        });

        it ('textPropertyName', () => {
          expect(typeof cmp.textPropertyName).toBe('string');
        });

        it ('placeholder', () => {
          expect(typeof cmp.placeholder).toBe('string');
        });

        it ('isRequired', () => {
          expect(typeof cmp.isRequired).toBe('boolean');
        });

        it ('allItems', () => {
          expect(cmp.allItems).toBeDefined();
        });

        it ('initItem', () => {
          expect(cmp.initItem).toBeDefined();
        });

        it ('disabled', () => {
          expect(cmp.disabled).toBeDefined();
        });
      });

      describe ('has output properties', () => {
        it ('clicked', () => {
          expect(cmp.clicked instanceof EventEmitter).toBeTruthy();
        });

        it ('selected', () => {
          expect(cmp.selected instanceof EventEmitter).toBeTruthy();
        });

        it ('typed', () => {
          expect(cmp.typed instanceof EventEmitter).toBeTruthy();
        });

        it ('nomatched', () => {
          expect(cmp.nomatched instanceof EventEmitter).toBeTruthy();
        });
      });

      describe('#ngOnInit', () => {
        it ('should hide select items when a user click outside of the items', () => {
          cmp.ngOnInit();
          spyOn(cmp, 'hideItems').and.callThrough();

          cmp.selectedItem = {};
          cmp.selectedItem.displayText = '000 mock item';

          cmp.itemsOpened = true;
          cmp.currentClickedEl = inputEl;
          cmp.currentClickedEl.value = 'wrong item';

          document.body.click();

          expect(cmp.hideItems).toHaveBeenCalled();
          expect(cmp.currentClickedEl.value).toBe(cmp.selectedItem.displayText);
        });
      });

      describe('#processKeyup', () => {
        it ('should not show select items until less than minLength', () => {
          cmp.minLength = 3;
          spyOn(cmp, 'processUserInput').and.returnValue(true);
          Object.defineProperty(keyupEvent, 'keyCode', {value: 66}); // character 'b'
          Object.defineProperty(keyupEvent, 'target', {value: {value: 'ab'}});
          inputEl.dispatchEvent(keyupEvent);

          expect(cmp.processUserInput).not.toHaveBeenCalled();
        });

        it ('should ignore tab, up and down arrow key on keyup event', () => {
          spyOn(cmp, 'processUserInput').and.returnValue(true);
          Object.defineProperty(keyupEvent, 'keyCode', {value: 9}); // tab
          inputEl.dispatchEvent(keyupEvent);
          expect(cmp.processUserInput).not.toHaveBeenCalled();

          Object.defineProperty(keyupEvent, 'keyCode', {value: 38}); // up
          inputEl.dispatchEvent(keyupEvent);
          expect(cmp.processUserInput).not.toHaveBeenCalled();

          Object.defineProperty(keyupEvent, 'keyCode', {value: 40}); // down
          inputEl.dispatchEvent(keyupEvent);
          expect(cmp.processUserInput).not.toHaveBeenCalled();
        });
      });

      describe('#processKeydown', () => {
        it ('should ignore any other than tab, up and down key', () => {
          spyOn(cmp, 'processUserInput').and.returnValue(true);
          Object.defineProperty(keydownEvent, 'keyCode', {value: 65}); // character 'a'
          inputEl.dispatchEvent(keydownEvent);
          expect(cmp.processUserInput).not.toHaveBeenCalled();
        });
      });

      describe('#processFocusIn', () => {
        it ('shows select items on click over input tag', (done) => {
          cmp.disabled = false;
          inputEl.click();

          jasmine.clock().tick(5);
          expect(cmp.itemsOpened).toBeTruthy();
          done();
        });
      });

      describe('item selection', () => {
        var mockAllItems;
        var mockInitItem;

        beforeEach(() => {
          cmp.idPropertyName = 'code';
          cmp.textPropertyName = 'description';

          mockAllItems = [
            {code: '000', description: 'Air'},
            {code: '100', description: 'Brakes'},
            {code: '202', description: 'Tires'},
            {code: '333', description: 'Engine'},
            {code: '010', description: 'Air Condition'},
            {code: '110', description: 'Brakes2'},
            {code: '212', description: 'Tires2'},
            {code: '433', description: 'Engine2'},
            {code: '111', description: 'Air3'},
            {code: '101', description: 'Brakes3'},
            {code: '282', description: 'Tires3'},
            {code: '303', description: 'Engine3'}
          ];

          mockInitItem = {code: '100', description: 'Brakes'};
        });

        it ('creates an array of SelectItem instance and set an activeItem', () => {
          cmp.allItems = mockAllItems;

          expect(cmp.allItems[0] instanceof SelectItem).toBeTruthy();
          expect(cmp.activeItem).toBeDefined();
        });

        it ('should set an activeItem with initItem', () => {
          cmp.initItem = mockInitItem;

          expect(cmp.selectedItem.displayText).toBe('100 Brakes');
        });

        // it doesn't work with other specs
        xit ('should show top 10 items at click on input for more than 10 items ', (done) => {
          cmp.allItems = mockAllItems;
          cmp.disabled = false;
          inputEl.click();
          jasmine.clock().tick(5);
          fixture.detectChanges();

          expect(el.querySelectorAll('.cet-select-items-row').length).toBe(10);
          done();
        });

        it ('should set a selectedItem on enter key with some filteredItems', () => {
          cmp.allItems = mockAllItems;
          cmp.activeItem = cmp.filteredItems[2];

          spyOn(cmp, 'processUserInput').and.callThrough();
          spyOn(cmp.selected, 'emit').and.callThrough();

          Object.defineProperty(keyupEvent, 'keyCode', {value: 13}); // enter
          Object.defineProperty(keyupEvent, 'target', {value: {value: 'abc'}});
          inputEl.dispatchEvent(keyupEvent);

          expect(cmp.processUserInput).toHaveBeenCalled();
          expect(cmp.selected.emit).toHaveBeenCalled();
          expect(cmp.selectedItem.id).toBe(cmp.activeItem.id);
        });

        it ('should restore the previous selectedItem on enter key in the case of no matched', () => {
          cmp.allItems = mockAllItems;
          cmp.selectedItem = mockAllItems[0];
          cmp.filteredItems = [];

          spyOn(cmp, 'handleNoMatched').and.callThrough();

          Object.defineProperty(keyupEvent, 'keyCode', {value: 13});
          Object.defineProperty(keyupEvent, 'target', {value: {value: 'abc'}});
          inputEl.dispatchEvent(keyupEvent);

          expect(cmp.handleNoMatched).toHaveBeenCalled();
        });

        it ('should set a selectedItem on tab key only for one filteredItems', () => {
          cmp.allItems = mockAllItems;
          cmp.filteredItems = cmp.allItems.slice(0, 3);

          spyOn(cmp, 'setSelectedItem').and.callThrough();
          Object.defineProperty(keydownEvent, 'keyCode', {value: 9});
          inputEl.dispatchEvent(keydownEvent);

          expect(cmp.setSelectedItem).not.toHaveBeenCalled();

          cmp.filteredItems = cmp.allItems.slice(0, 1);

          Object.defineProperty(keydownEvent, 'keyCode', {value: 9});
          inputEl.dispatchEvent(keydownEvent);

          expect(cmp.setSelectedItem).toHaveBeenCalled();
          expect(cmp.selectedItem.id).toBe(cmp.allItems[0].id);
        });

      });

    });
  });

}