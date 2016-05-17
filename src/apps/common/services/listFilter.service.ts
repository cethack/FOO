import {Injectable} from 'angular2/core';
import {Control} from 'angular2/common';

/**
 * Searches for the given searchTerm in each of the given searchFields,
 * and returns the filtered list containing only items that have at least one match.
 * Also provides highlightMatch function that returns HTML highlighting the matching fragment of the given field.
 */
@Injectable()
export class ListFilterService {

  constructor() {
    //
  }

  init(): void {
    this.searchTerm = new Control('');
    this.searchTerm.valueChanges
      .debounceTime(this.debounceTime)
      .distinctUntilChanged() // only do something if the term changed from previous value
      .subscribe((term: any) => {
        this.update();
      });
  }

  filteredList: any[];

 /**
  * Delegate (function) that returns the original (not filtered) list
  */
  originalListGetter: () => any[];

 /**
  * Number of milliseconds to wait before commencing the search after the searchTerm change.
  * Default is 200.
  */
  debounceTime: number = 200;

 /**
  * Search term (text) to search and filter by. ngFormControl.
  */
  searchTerm: Control;

 /**
  * List of field names to check for matches
  */
  searchFields: string[];

 /**
  * Minimum characters in the SearchTerm required for the search to commence.
  * Default is 3.
  */
  minCharsForSearch: number = 3;

 /**
  * Number of items that match the current search filter.
  * initial value -1 means "not filtered yet"
  */
  get filteredCount(): number {
    return this.filteredList ? this.filteredList.length : 0;
  }

  /**
   * True if the number of items matching the current search filter is less than the total number of items.
   */
  get isFiltered(): boolean {
    // at least one item was filtered out
    return this.filteredCount >= 0 && this.originalListGetter && this.filteredCount < this.originalListGetter().length;
  }

 /** TODO need it???
  * True if the search box is currently visible, i.e. the search is active. False otherwise
  */
  isActive: boolean;

 /**
  * Updates the filteredList property to contain only items that have at least one match: searchTerm present in any of the searchFields.
  */
  update(): void {

    var originalList = this.originalListGetter();
    var searchFor = this.searchTerm.value.trim().toLocaleLowerCase();
    var noFilter = searchFor.length < this.minCharsForSearch;

    this.filteredList = originalList.filter((item: any) => {
      return this.checkFilterMatch(item, noFilter, searchFor);
    });
  };

 /**
  * Deactivates the search and clears the search filter
  */
  deactivate(): void {
    this.isActive = false;
    this.clear();
    //this.update();
  };

  clear(): void {
    //this.searchTerm = new Control('');
    this.searchTerm.updateValue('');
  };

 /**
  * If matchStart > 0 - returns HTML with the whole value highlighted,
  * and the portion of the text that matches current search marked with an additional highlight
  * Otherwise returns the original text, unchanged
  */
  getHlText(listItem: any, fieldName: string): string {
    const text = listItem[fieldName];

    if (text == null || listItem._matches == null) {
      return text; // text null, or matches are not initialized yet, no filtering
    }

    const matchStart = listItem._matches[fieldName];
    if (matchStart == null || matchStart < 0) {
      return text; // no match, return the original text, no highlighting
    }

    const searchLen = this.searchTerm.value.trim().length;

    // extra spans are necessary, otherwise IE may loose leading spaces in some cases, e.g.:
    // <span class='cet-hl-field'><span class='cet-hl-match'>PREVOST</span> CAR INC</span >
    // - space before "CAR" will be lost in IE for some reason, so the whole line will read like PREVOSTCAR INC
    var html = '<span class="cet-hl-field">' + (matchStart === 0 ? '' : '<span>' +
                text.substr(0, matchStart) + '</span>') + '<span class="cet-hl-match">' +
                text.substr(matchStart, searchLen) + '</span><span>' + text.substr(matchStart + searchLen) + '</span></span>';
    return html;
  };

  private getMatchIndex(s: string, search: string, startPos: number = 0): number {
    if (s == null || search.length === 0) {
      return -1;
    }
    return s.toLocaleLowerCase().indexOf(search, startPos);
  };

  private checkFilterMatch(item: any, noFilter: boolean, searchFor: string): boolean {
    if (!item._matches) {
      item._matches = {}; // attach the 'matches' object if not attached yet
    }

    var m = item._matches;
    if (noFilter) {
      this.resetAllMatches(m);
      return true;  // every record matches since there's no filter
    }

    let atLeastOneMatch = false;
    this.searchFields.forEach((fieldName: string) => {
      let matchIdx = this.getMatchIndex(item[fieldName], searchFor);
      m[fieldName] = matchIdx;
      if (!atLeastOneMatch) {
        atLeastOneMatch = matchIdx >= 0;
      }
    });

    return atLeastOneMatch;
  };

  private resetAllMatches(matches: any): void {
    this.searchFields.forEach((fieldName: string) => {
      matches[fieldName] = -1;
    });
  }

}
