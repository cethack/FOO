import {Directive, Attribute, Inject, DynamicComponentLoader, ViewContainerRef} from 'angular2/core';
import {Router, RouterOutlet, ComponentInstruction} from 'angular2/router';
import {LocalStorageService} from '../services/localStorage.service';
import {MessageService} from '../services/message.service';
import {NavigationHistoryService} from '../services/navigationHistory.service';
import {APP_CONFIG} from '../services/app.config';
import {IConfig} from '../services/FAR.d';

/**
 * It tries to get a valid token for each router in order to check authentication.
 * If there is no valid token then navigate to login page.
 */
@Directive({
  selector: 'cet-router-outlet'
})

export class CetAuthRouterOutletDirective extends RouterOutlet {
  private parentRouter: Router;

  constructor(
    _viewContainerRef: ViewContainerRef,
    _loader: DynamicComponentLoader,
    _parentRouter: Router,
    @Attribute('name') nameAttr: string,
    public localStorageService: LocalStorageService,
    public messageService: MessageService,
    public historyService: NavigationHistoryService,
    @Inject(APP_CONFIG) private config: IConfig
  ) {
    super(_viewContainerRef, _loader, _parentRouter, nameAttr);
    this.parentRouter = _parentRouter;
  }

  activate(instruction: ComponentInstruction): Promise<any> {
    var data: any = instruction.routeData.data;
    var token = this.localStorageService.get('cet-token');

    data.isAuthenticated = !!token;

    this.historyService.push({urlPath: instruction.urlPath, data: data});

    data.isHomePage = this.historyService.isHomePage();

    this.messageService.publish('route-activate', data);

    if ((<any>data.requireAuth) && !data.isAuthenticated) {
      this.parentRouter.navigate([this.config.routeName.login]);
    } else if (instruction.urlPath.indexOf('login') >= 0 && data.isAuthenticated) {
      //TODO it might redirect to user's start page defined in user preference
      this.parentRouter.navigate([this.config.routeName.dashboard]);
    }

    return super.activate(instruction);
  }

}
