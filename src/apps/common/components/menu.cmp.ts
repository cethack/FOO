import {Component} from 'angular2/core';
import {Router} from 'angular2/router';

import {UserService} from '../services/user.service';
import {MenuService} from '../services/menu.service';
import {CetDisableIOSScrollDirective} from '../../../core/directives/cetDisableIosScroll.directive';
import {PopupService} from '../services/popup.service';

@Component({
  selector: 'menu',
  moduleId: module.id,
  templateUrl: './menu.tpl.html',
  directives: [CetDisableIOSScrollDirective],
  styleUrls: ['./menu.css']
})

export class MenuComponent {

  public closed: boolean;

  constructor(
    public menu: MenuService,
    public popup: PopupService,
    public userService: UserService,
    public router: Router
  ) { }


  openFeedbackPopup(): void {
    this.menu.showMenu = false;
  }

  closeMenu(): void {
    this.closed = true;
    setTimeout( () => {
      this.menu.showMenu = false;
      this.closed = false;
    }, 200);
  }

  hideMenu(): void {
    this.menu.showMenu = false;
    this.closed = false;
  }

  logout(): void {
    this.hideMenu();
    this.userService.logout();
    this.router.navigate(['Login']);
  }

  goDashboard(): void {
    this.hideMenu();
    this.router.navigate(['Dashboard']);
  }

  goTaskList(): void {
    this.hideMenu();
    this.router.navigate(['TaskList']);
  }

  goTask1(): void {
    this.hideMenu();
    alert('task1');
    console.log('task 1');
    // TODO add component name
    // this.router.navigate(['COMPONENT-NAME']);
  }

  goTask2(): void {
    this.hideMenu();
    alert('task2');
    console.log('task 2');
    // TODO add component name
    // this.router.navigate(['COMPONENT-NAME']);
  }

  goTask3(): void {
    this.hideMenu();
    alert('task3');
    console.log('task 3');
    // TODO add component name
    // this.router.navigate(['COMPONENT-NAME']);
  }
}
