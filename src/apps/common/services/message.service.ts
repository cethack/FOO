import {Injectable} from 'angular2/core';

@Injectable()
export class MessageService {

  public topics: any = {};

  subscribe(topic: string, listener: (message: any) => void): any {
    var index: number;
    var listeners = this.topics[topic];

    if (!listeners) {
      // console.log('No subscribed listener');
      this.topics[topic] = listeners = [];
    }

    index = listeners.push(listener) - 1;
    // console.log('subscribe for ', topic, ' at ', index);

    return {
      unsubscribe: (): void => {
        listeners.splice(index, 1);
        // console.log('unsubscribe for ', topic, ' at ', index);
      }
    };
  }

  unsubscribe(topic: string): void {
    if (this.topics[topic]) {
      this.topics[topic] = [];
      delete this.topics[topic];
      // console.log('unsubscribe for ', topic);
    }
  }

  publish(topic: string, message?: any): void {
    var i: number;
    var listeners = this.topics[topic];

    if (listeners) {
      for (i = 0; i < listeners.length; i++) {
        // console.log('publish for ', topic);
        listeners[i](message, topic);
      }
    } else {
      console.log('No listener for ', topic);
    }
  }

}
