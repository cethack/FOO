import {Inject, Injectable} from 'angular2/core';
import {IConfig} from './FAR.d';
import {APP_CONFIG} from './app.config';

@Injectable()
export class IconService {
  constructor(@Inject(APP_CONFIG) private config: IConfig) {
  }

  getSrcUrl(lutName: string, code: string): string {
    return `${this.config.apiEndPoint.image}?lutName=${lutName}&code=${encodeURIComponent(code)}`;
  }
}
