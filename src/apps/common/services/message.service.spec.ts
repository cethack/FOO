import {it, describe} from 'angular2/testing';
import {MessageService} from './message.service';

export function main(): void {
  'use strict';

  describe('Message Service', () => {

    var messageService: MessageService;

    var subscribeTopic: any = (topic?: string, listener?: (message: any) => void): any => {
      var defaultListener: (message: any) => void = () => {
        console.log('default listener called.');
      };

      return messageService.subscribe(topic || 'test-topic', listener || defaultListener);
    };

    beforeEach(() => {
      messageService = new MessageService();
    });

    it ('should have topics object', () => {
      expect(messageService.topics).toBeTruthy(typeof Object);
    });

    describe('Subscribe', () => {
      it ('should have two parameters', () => {
        expect(messageService.subscribe.length).toBe(2);
      });

      it ('should return unsubscribe function in object literal', () => {
        var subscription = subscribeTopic();

        expect(typeof subscription.unsubscribe).toBe('function');
      });

      it ('should save a topic into topics object', () => {
        subscribeTopic();

        expect(messageService.topics['test-topic'].length).toBe(1);
      });

      it ('should be able to save a different listener into the same topic', () => {
        subscribeTopic();
        subscribeTopic();

        expect(messageService.topics['test-topic'].length).toBe(2);
      });

      it ('should remove only its listener', () => {
        var subscription1 = subscribeTopic();
        subscribeTopic();

        expect(messageService.topics['test-topic'].length).toBe(2);

        subscription1.unsubscribe();

        expect(messageService.topics['test-topic'].length).toBe(1);
      });
    });

    describe('Publish', () => {
      it ('should have two parameters', () => {
        expect(messageService.publish.length).toBe(2);
      });

      it ('should call different listeners for the topic', () => {
        var subscribeStub = {
          listener1: (message: any): void => {
            //console.log(`listener1 called with ${message}`);
          },
          listener2: (message: any): void => {
            //console.log(`listener2 called with ${message}`);
          }
        };

        spyOn(subscribeStub, 'listener1').and.callThrough();
        spyOn(subscribeStub, 'listener2').and.callThrough();

        subscribeTopic('test-topic', subscribeStub.listener1);
        subscribeTopic('test-topic', subscribeStub.listener2);

        messageService.publish('test-topic', 'test-data');

        expect(subscribeStub.listener1).toHaveBeenCalled();
        expect(subscribeStub.listener2).toHaveBeenCalled();
      });
    });

    describe('UnSubscribe', () => {
      it ('should remove a topic and its listerners', () => {
        subscribeTopic();
        subscribeTopic();

        expect(messageService.topics['test-topic'].length).toBe(2);

        messageService.unsubscribe('test-topic');

        expect(messageService.topics['test-topic']).toBe(undefined);
      });
    });

  });

}
