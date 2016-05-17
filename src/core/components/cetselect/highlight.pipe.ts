import {Pipe} from 'angular2/core';

@Pipe({
  name: 'cetHighlight'
})
export class HighlightPipe {
  transform(value: string, searchTerm?: string): any {
    if (!searchTerm) {
      return value;
    }

    let escapedRegExp = new RegExp(this.escapeSpecialCharacters(searchTerm), 'gi');

    return searchTerm ? value.replace(escapedRegExp, '<strong>$&</strong>') : value;
  }

  private escapeSpecialCharacters(searchTerm: string): string {
    return searchTerm.replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1');
  }
}
