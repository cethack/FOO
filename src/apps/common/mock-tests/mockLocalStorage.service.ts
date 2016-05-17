import {LocalStorageService} from '../services/localStorage.service';

export class MockLocalStorageService extends LocalStorageService {
  get(key: string): any {
    return 'value of ' + key;
  }
}