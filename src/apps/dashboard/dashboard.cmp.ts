import {Component} from 'angular2/core';
import {Router, ROUTER_DIRECTIVES} from 'angular2/router';
import {UserService} from '../common/services/user.service';
import {CetTrimDirective} from '../../core/directives/cetTrim.directive';

@Component({
  directives: [ROUTER_DIRECTIVES, CetTrimDirective],
  moduleId: module.id,
  templateUrl: './dashboard.tpl.html'
})
export class DashboardComponent {
  constructor(private router: Router,
    private userService: UserService
  ) {}

}
