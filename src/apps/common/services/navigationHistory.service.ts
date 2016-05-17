import {Injectable} from 'angular2/core';
import {INavigationHistory} from './FAR.d';

@Injectable()
export class NavigationHistoryService {

  navigationStacks: Array<INavigationHistory> = new Array<INavigationHistory>();

  push = (navigation: INavigationHistory): void => {
    var stackLen = this.navigationStacks.length;

    if (stackLen === 0) {
      // When a user is directed to a specific page via deeplink
      // the first previous should be homepage
      //
      // TODO refactor to get the homepage from config / route definition
      this.navigationStacks.push({urlPath: 'dashboard', data: { isNavigable: true }});
      if (navigation.urlPath !== 'dashboard') {
        this.navigationStacks.push(navigation);
      }
    } else if (this.navigationStacks[stackLen - 1].urlPath !== navigation.urlPath) {
      this.navigationStacks.push(navigation);
    }
  };

  // check navigable history until find the first navigable one
  getNextNavigableHistory = (): any => {
    let next = this.navigationStacks.pop();

    if (next.data.isNavigable) {
      return next;
    } else {
      return this.getNextNavigableHistory();
    }
  };

  // check if it can go back or need to deal with cancel
  canGoBack = (): INavigationHistory => {
    var current = this.navigationStacks.pop();

    if (!current.data.isCancelable) {
      return this.getNextNavigableHistory();
    } else {
      // delegate to the component so that it handles a cancel process
      this.push(current);
      return null;
    }
  };

  isHomePage = (): boolean => {
    return this.navigationStacks.length === 1;
  };

  getPreviousHistory = (): INavigationHistory => {
    if (this.navigationStacks.length > 1) {
      this.navigationStacks.pop(); // current

      return this.getNextNavigableHistory();
    } else {
      // in the browser it should not happen because the back button will be hidden
      // it can be used for test purpose
      return this.navigationStacks.pop();
    }
  };

  clear = (): void => {
    this.navigationStacks = [];
  };

}
