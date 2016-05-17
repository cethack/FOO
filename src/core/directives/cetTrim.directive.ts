/**
 * trim out leading and trailing spaces on input and textarea
 */
import {Directive, ElementRef, Optional} from 'angular2/core';
import {NgModel} from 'angular2/common';

@Directive({
  selector: '[cet-trim]',
  host: {
    '(change)': 'onChange($event)'
  }
})
export class CetTrimDirective {
  private el: HTMLInputElement | HTMLTextAreaElement;
  private ngModel: NgModel;

  constructor(el: ElementRef, @Optional() ngModel: NgModel) {
    this.el = el.nativeElement;
    this.ngModel = ngModel;
  }

  onChange(event: Event): void {
    this.el.value = this.el.value.trim();
    if (this.ngModel) {
      this.ngModel.viewToModelUpdate(this.el.value);
    }
  }
}
