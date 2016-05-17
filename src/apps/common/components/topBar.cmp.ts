import {Component, OnInit, DoCheck, Inject} from 'angular2/core';
import {ROUTER_DIRECTIVES} from 'angular2/router';
import {LocalStorageService} from '../services/localStorage.service';
import {MessageService} from '../services/message.service';
import {MenuService} from '../services/menu.service';
import {BaseComponent} from './base.cmp';
import {UserService} from '../services/user.service';
import {IConfig} from '../services/FAR.d';
import {APP_CONFIG} from '../services/app.config';

@Component({
  selector: 'top-bar',
  moduleId: module.id,
  templateUrl: './top-bar.tpl.html',
  styleUrls: ['./top-bar.css'],
  directives: [ROUTER_DIRECTIVES]
})

export class TopBarComponent extends BaseComponent implements OnInit, DoCheck  {
  loggedIn: boolean;
  showReloadIcon: boolean = false;

  private routeActivateMessageData: any = {};

  constructor(
    private localStorageService: LocalStorageService,
    public messageService: MessageService,
    public menu: MenuService,
    public user: UserService,
    @Inject(APP_CONFIG) private config: IConfig
  ) {
    super(messageService);
  }

  ngOnInit(): void {
    this.subscribeMessage(this.config.topicName.routeActivate, (message: any) => {
      this.routeActivateMessageData = message;
    });
  }

  ngDoCheck(): void {
    this.showReloadIcon = this.routeActivateMessageData.hasReload;
  }

  get isAuthenticated(): boolean {
    return this.routeActivateMessageData.isAuthenticated;
  }

  get title(): string {
    return this.routeActivateMessageData.title || '';
  }

  reloadPartList(): void {
    this.messageService.publish(this.config.topicName.reloadPartList);
  }

}
