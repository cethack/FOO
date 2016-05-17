import {Component, provide} from 'angular2/core';
import {RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router';

import {ROOT_ROUTES} from './routes';
import {HttpService} from './common/services/http.service';
import {CetAuthRouterOutletDirective} from './common/directives/cetAuthRouterOutlet.directive';
import {TopBarComponent} from './common/components/topBar.cmp';
import {MenuComponent} from './common/components/menu.cmp';
import {IconService} from './common/services/icon.service';
import {LoginComponent} from './common/components/login.cmp';
import {PopupComponent} from './common/components/popup.cmp';
import {TokenService} from './common/services/token.service';
import {NavigationHistoryService} from './common/services/navigationHistory.service';
import {UserService} from './common/services/user.service';
import {MenuService} from './common/services/menu.service';
import {LocalStorageService} from './common/services/localStorage.service';
import {MessageService} from './common/services/message.service';
import {APP_CONFIG, CONFIG} from './common/services/app.config';
import {INotification} from './common/services/FAR';

@Component({
  selector: 'cet-app',
  moduleId: module.id,
  templateUrl: './app.tpl.html',
  directives: [
    ROUTER_DIRECTIVES,
    CetAuthRouterOutletDirective,
    TopBarComponent,
    LoginComponent,
    MenuComponent,
    PopupComponent
  ],
  providers: [
    HttpService,
    TokenService,
    IconService,
    NavigationHistoryService,
    UserService,
    LocalStorageService,
    MessageService,
    MenuService,
    provide(APP_CONFIG, {useValue: CONFIG})
  ]
})
@RouteConfig(ROOT_ROUTES)
export class AppComponent {
  public httpInProgress: boolean;

  constructor(
    public http: HttpService,
    public user: UserService,
    public menu: MenuService
  ) {
    this.http.requestNotifier.subscribe(
      //error
      httpMsg => this.handleHttpMessages(httpMsg),
      error => console.log('error', error)
    );
  }

  get sessionExpiredByTimer(): boolean {
    return this.user.sessionExpiredUsername && this.user.sessionExpiredByTimer;
  }

  handleHttpMessages(httpMsg: INotification): void {
    switch (httpMsg.type) {
      case 'start':
        this.httpInProgress = true;
        break;
      case 'done':
      case 'complete':
        this.httpInProgress = false;
        break;
      case 'error':
        this.httpInProgress = false;
        break;
      default:
    }
  }

}
