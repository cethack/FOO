import {Component, OnInit, ElementRef} from 'angular2/core';
import {IMessageOptions} from '../services/FAR';

@Component({
  selector: 'message',
  moduleId: module.id,
  templateUrl: './message.tpl.html',
  styleUrls: ['./message.css']
})

export class MessageComponent implements OnInit {

  public popupOptions: IMessageOptions = {};
  public titleId: string;
  public messageId: string;
  public message: string;
  public buttons: any;

  constructor(public elementRef: ElementRef) {}

  ngOnInit(): void {
    if (this.popupOptions) {
      this.titleId = this.popupOptions.titleId;
      this.messageId = this.popupOptions.messageId;
      this.message = this.popupOptions.message;
      this.buttons = this.popupOptions.buttons;
    }
  }

  // All messages are defined in HTML
  getTranslated(id: string): string {
    let msgEl = this.elementRef.nativeElement.querySelector('#' + id);
    return msgEl ? msgEl.innerHTML : `Invalid Translation(${id})`;
  }

  cancel(): void {
    this.buttons.cancel();
  }

  ok(): void {
    this.buttons.ok();
  }
}

