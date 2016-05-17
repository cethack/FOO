import {Injectable} from 'angular2/core';

// TDOD put all API endpoints so that data services can get it with key name not real endpoint
interface IGlobalConfig {
  apiBaseUrl: string;
}

/**
 * Singleton, responsible for reading configuration (from the config.json file or/and any other sources)
 * and making it available to any other consumers (such as apiEndpoints class, for example).
 * The client does not need to know how the configuration/global variables were populated, just consumes 
 * them via this abstraction Config service.
 * Note: designed with future extensibility in mind: can be easily extended to serve multiple configuration values.
 */
@Injectable()
export class ConfigService {
  apiBaseUrl: string;

  constructor() {
    const configData = <IGlobalConfig>(<any>window).Cetaris.configData;
    this.apiBaseUrl = configData.apiBaseUrl;
  }

}
