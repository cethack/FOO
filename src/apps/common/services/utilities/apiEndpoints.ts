//TODO: not used anymore, can be removed

import {Injectable} from 'angular2/core';
import {ConfigService} from './config.service';

@Injectable()
export class ApiEndpoints {

  constructor(config: ConfigService) {
        this.apiBaseUrl = config.apiBaseUrl;
    }

    apiBaseUrl: string;

    getUrl(url: string): string {
        return this.apiBaseUrl + url;
    };

    // Names of the known API endpoints
    get poapproval(): string {
        return this.getUrl('/poapproval');
    }

    get po(): string {
        return this.getUrl('/poapproval/PurchaseOrder');
    }

    get login(): string {
        return this.getUrl('/security/token');
    }

    get currentUser(): string {
        return this.getUrl('/security/tokenInfo');
    }
}
