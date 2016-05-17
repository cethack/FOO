import {provide, ReflectiveInjector} from 'angular2/core';
import {describe, expect, it} from 'angular2/testing';
import {XHRBackend, HTTP_PROVIDERS, Response, ResponseOptions} from 'angular2/http';
import {MockBackend, MockConnection} from 'angular2/http/testing';

import {LocalStorageService} from './localStorage.service';
import {HttpService} from './http.service';
import {APP_CONFIG, CONFIG} from './app.config';

class MockLocalStorage {
  get(): any { return undefined; }
}

/* tslint:disable:no-empty */
export function main(): void {
  'use strict';

  describe('UserService', () => {

    let xhrBackend: MockBackend;
    let http: HttpService;

    beforeEach(() => {
      //mock providers
      let injector: ReflectiveInjector = ReflectiveInjector.resolveAndCreate([
        HTTP_PROVIDERS,
        provide(LocalStorageService, {useClass: MockLocalStorage}),
        HttpService,
        provide(XHRBackend, {useClass: MockBackend}),
        provide(APP_CONFIG, {useValue: CONFIG})
      ]);

      http = injector.get(HttpService);
      xhrBackend = injector.get(XHRBackend);  //mock http backend
    });

    describe('#get', () => {
      it('should handle errors when not logged in', () => {
        xhrBackend.connections.subscribe((connection: MockConnection) => {
          if (connection.request.url === 'some/login.json') {
            connection.mockError(
              <any>new Response(new ResponseOptions({status: 400, statusText: '400 error'}))
            );
          }
        });
        http.get('some/error400.json').subscribe(
          resp => {
            expect(resp.status).toBe(400);
          }
        );
      });

      it('should handle errors when logged in', () => {
        spyOn(http.localStorageService, 'get').and.returnValue('valid token');

        xhrBackend.connections.subscribe((connection: MockConnection) => {
          if (connection.request.url === 'some/error500.json') {
            connection.mockError(
              <any>new Response(new ResponseOptions({status: 500}))
            );
          }
        });
        http.get('some/error500.json').subscribe(
          resp => {},
          err => expect(err).not.toBeNull()
        );
      });

      it('should set token bearer', () => {
        spyOn(http.localStorageService, 'get').and.returnValue('valid token');

        xhrBackend.connections.subscribe((connection: MockConnection) => {
          expect(connection.request.headers.get('Authorization')).toBe('Bearer valid token');
          connection.mockRespond(new Response(new ResponseOptions({body: '{"get":1}'})));
        });

        http.get('some/url.json').subscribe((resp: any) => {});
      });

      it('should get', () => {
        xhrBackend.connections.subscribe((connection: MockConnection) => {
          if (connection.request.url === 'some/url.json') {
            connection.mockRespond(new Response(new ResponseOptions({body: '{"getJson":1}'})));
          } else if (connection.request.url === 'some/url.txt') {
            connection.mockRespond(new Response(new ResponseOptions({body: 'getText'})));
          } else if (connection.request.url === 'some/error500.json') {
            connection.mockRespond(new Response(new ResponseOptions({status: 500})));
          }
        });
        let msgs = [];  //collect all notification and verify at the end
        http.requestNotifier.subscribe(msg => {
          msgs.push(msg.type);
        });

        http.get('some/url.json').subscribe((resp: any) => {
          expect(resp.getJson).toBe(1);
        });
        http.get('some/url.txt').subscribe((resp: any) => {
          expect(resp).toBe('getText');
        });
        http.get('some/error500.json').subscribe(
          resp => {},
          err => {
            expect(msgs).toContain('start');
            expect(msgs).toContain('done');
            expect(msgs).toContain('complete');
          }
        );
      });
    });

    describe('#post', () => {
      it('should post', () => {
        xhrBackend.connections.subscribe((connection: MockConnection) => {
          connection.mockRespond(new Response(new ResponseOptions({body: '{"post":1}'})));
        });
        http.post('some/url.json', {ping: 1}).subscribe((resp: any) => {
          expect(resp.post).toBe(1);
        });
      });
    });

    describe('#put', () => {
      it('should post', () => {
        xhrBackend.connections.subscribe((connection: MockConnection) => {
          connection.mockRespond(new Response(new ResponseOptions({body: '{"put":1}'})));
        });
        http.put('some/url.json', 'ping').subscribe((resp: any) => {
          expect(resp.put).toBe(1);
        });
      });
    });

    describe('#delete', () => {
      it('should delete', () => {
        xhrBackend.connections.subscribe((connection: MockConnection) => {
          connection.mockRespond(new Response(new ResponseOptions({body: '{"delete":1}'})));
        });
        http.delete('some/url.json').subscribe((resp: any) => {
          expect(resp.delete).toBe(1);
        });
      });
    });

    describe('#patch', () => {
      it('should delete', () => {
        xhrBackend.connections.subscribe((connection: MockConnection) => {
          connection.mockRespond(new Response(new ResponseOptions({body: '{"patch":1}'})));
        });
        http.patch('some/url.json', 'ping').subscribe((resp: any) => {
          expect(resp.patch).toBe(1);
        });
      });
    });

    describe('#head', () => {
      it('should head', () => {
        xhrBackend.connections.subscribe((connection: MockConnection) => {
          connection.mockRespond(new Response(new ResponseOptions({body: '{"head":1}'})));
        });
        http.head('some/url.json').subscribe((resp: any) => {
          expect(resp.head).toBe(1);
        });
      });
    });
  }); //describe

} //export
