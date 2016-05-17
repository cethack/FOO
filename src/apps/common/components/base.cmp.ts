import {Component, OnDestroy} from 'angular2/core';
import {MessageService} from '../services/message.service';

@Component({
  template: ''
})
export class BaseComponent implements OnDestroy {

  subscriptions: Array<any> = [];
  isAuthenticated: boolean;

  constructor(public messageService: MessageService) {}

  subscribeMessage(topic: string, listener: any): any {
    var subscription = this.messageService.subscribe(topic, listener);
    this.subscriptions.push(subscription);

    return subscription;
  }

  ngOnDestroy(): void {
    if (this.subscriptions.length > 0) {
      var i = 0;
      var len = this.subscriptions.length;

      for (; i < len; i++) {
        this.subscriptions[i].unsubscribe();
      }

      this.subscriptions = [];
    }
  }

}
