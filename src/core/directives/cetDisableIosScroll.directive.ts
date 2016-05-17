/**
 * To disable background scroll on ios devices
 */
import {Directive, ElementRef} from 'angular2/core';

@Directive({
  selector: '[cet-disable-ios-scroll]',
  host: {
    '(touchstart)': 'onTouchStart($event)',
    '(touchmove)': 'onTouchMove($event)'
  }
})
export class CetDisableIOSScrollDirective {
  public touchStartY: number;
  private el: HTMLElement;

  constructor(el: ElementRef) {
    this.el = el.nativeElement;
  }

  isIOS(): boolean {
    return !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);
  }

  /**
   * record the starting position of scroll to calculate the move up or down
   */
  onTouchStart(event: TouchEvent): boolean {
    this.touchStartY = event.touches[0].clientY;
    return true;
  }

  /**
   * allow or disallow the touch move event
   */
  onTouchMove(event: TouchEvent): boolean {
    if (!this.isIOS()) {
      return true;
    }
    event.stopPropagation();

    var currentY = event.changedTouches[0].clientY;
    var scrollMove   = (currentY < this.touchStartY) ?  'down' : 'up';

    var totalScroll = this.el.scrollHeight;
    var currentScroll = this.el.scrollTop + this.el.offsetHeight;

    if (scrollMove === 'down' && currentScroll >= totalScroll) {
      return false;
    } else if (scrollMove === 'up' && this.el.scrollTop === 0) {
      return false;
    }
    return true;
  }
}
