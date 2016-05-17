import {it, describe} from 'angular2/testing';
import {NavigationHistoryService} from './navigationHistory.service';
import {INavigationHistory} from './FAR.d';

export function main(): void {
  'use strict';

  describe('NavigationHistoryService', () => {

    var historyService: NavigationHistoryService;
    var homepageHistory: INavigationHistory = {
      urlPath: 'dashboard',
      data: { isNavigable: true }
    };
    var firstHistory: INavigationHistory = {
      urlPath: 'first',
      data: { isNavigable: true }
    };
    var secondHistory: INavigationHistory = {
      urlPath: 'second',
      data: { isNavigable: false }
    };
    var thirdHistory: INavigationHistory = {
      urlPath: 'third',
      data: { isNavigable: true, isCancelable: true }
    };
    var fourthHistory: INavigationHistory = {
      urlPath: 'fourth',
      data: { }
    };

    beforeEach(() => {
      historyService = new NavigationHistoryService();
    });

    describe('#getPreviousHistory', () => {
      it ('adds a homepage history if the stack is empty', () => {
        historyService.push(homepageHistory);

        expect(historyService.getPreviousHistory().urlPath).toBe('dashboard');
        expect(historyService.getPreviousHistory()).toBeFalsy();
      });

      it ('goes back to the first history from the second history', () => {
        historyService.push(firstHistory);
        historyService.push(thirdHistory);

        expect(historyService.getPreviousHistory().urlPath).toBe('first');
      });

      it ('returns next navigable history skipping non-navigable one', () => {
        historyService.push(firstHistory);  // navigable
        historyService.push(thirdHistory);  // navigable
        historyService.push(fourthHistory); // non-navigable
        historyService.push(secondHistory); // non-navigable

        expect(historyService.getPreviousHistory().urlPath).toBe('third');
      });

      it ('should not add the same history as the previous one', () => {
        historyService.push(firstHistory);
        historyService.push(thirdHistory);
        historyService.push(thirdHistory);

        // because by default homepage is added length should be 3 instead of 2
        expect(historyService.navigationStacks.length).toBe(3);
      });
    });

    describe('#canGoBack', () => {
      it ('checks if the current page requires to deal with cancel', () => {
        historyService.push(firstHistory);
        historyService.push(thirdHistory);

        expect(historyService.canGoBack()).toBeNull();
      });
    });

    describe('#isHomePage', () => {
      it ('should check if the current page is homepage after moving back', () => {
        historyService.push(homepageHistory);
        historyService.push(firstHistory);

        historyService.getPreviousHistory();

        // after moving back if it is empty the homepage is added automatically
        historyService.push(homepageHistory);

        expect(historyService.isHomePage()).toBeTruthy();
      });
    });

    describe('#clear', () => {
      it ('should clear all history', () => {
        historyService.push(homepageHistory);
        historyService.push(firstHistory);

        historyService.clear();

        expect(historyService.getPreviousHistory()).toBeFalsy();
      });
    });
  });

}
