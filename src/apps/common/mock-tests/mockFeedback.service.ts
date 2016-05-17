/* tslint:disable:typedef no-empty */
import {Observable} from 'rxjs/Observable';

export class MockFeedbackService {
  showFeedback: boolean = false;
  init() {}
  submit(): Observable<any> {
    return Observable.of({});
  }
}