import {it, describe} from 'angular2/testing';
import {Control} from 'angular2/common';
// import {Observable} from 'rxjs/Observable';

import {ListFilterService} from './listFilter.service';

export function main(): void {
  'use strict';

  var mockTaskList = [
    {taskId: '1234', woNumber: '1111', woLine: 1},
    {taskId: '1235', woNumber: '2222', woLine: 1},
    {taskId: '1236', woNumber: '3333', woLine: 1},
    {taskId: '3237', woNumber: '4444', woLine: 1},
    {taskId: '4238', woNumber: '1235', woLine: 1}
  ];

  describe('ListFilterService', () => {
    var filterService: any;

    beforeEach(() => {
      filterService = new ListFilterService();
    });

    describe('#deactivate', () => {
      it ('calls clear method', () => {
        spyOn(filterService, 'clear');
        filterService.searchTerm = new Control('123');
        filterService.deactivate();

        expect(filterService.clear).toHaveBeenCalled();
      });
    });

    describe('#isFiltered', () => {
      it ('returns if there is filteredList', () => {
        filterService.filteredList = [{}, {}];
        filterService.originalListGetter = () => mockTaskList;

        expect(filterService.isFiltered).toBeTruthy();
      });
    });

    describe('#update', () => {
      it ('changes filteredList', () => {
        filterService.searchTerm = new Control('123');

        filterService.searchFields = ['taskId', 'woNumber'];
        filterService.originalListGetter = () => mockTaskList;
        filterService.minCharsForSearch = 2;

        filterService.update();

        expect(filterService.filteredList.length).toBe(4);
      });
    });

    describe('#getHlText', () => {
      it ('#getHlText add html code for highlight text', () => {
        filterService.searchTerm = new Control('123');

        filterService.searchFields = ['taskId', 'woNumber'];
        filterService.originalListGetter = () => mockTaskList;
        filterService.minCharsForSearch = 2;

        var hlText = filterService.getHlText(mockTaskList[0], 'taskId');

        expect(hlText).toBe('<span class="cet-hl-field"><span class="cet-hl-match">123</span><span>4</span></span>');
      });
    });

  });
}