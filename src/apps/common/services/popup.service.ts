import {Injectable} from 'angular2/core';
import {Type} from 'angular2/src/facade/lang';
import {Subject} from 'rxjs/Subject';

import {IJSONObject} from './FAR.d';

@Injectable()
export class PopupService {

  component: Type;
  componentOptions: IJSONObject;

  visibleChanges$: Subject<boolean> = new Subject<boolean>();

  open(component: Type, options?: IJSONObject): void {
    this.component = component;
    this.componentOptions = options;
    this.visibleChanges$.next(true);
  }

  //
  close(): void {
    this.visibleChanges$.next(false);
  }

}