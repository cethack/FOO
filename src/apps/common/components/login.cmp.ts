import {Component, Inject} from 'angular2/core';
import {RouterLink, Router} from 'angular2/router';
import {CORE_DIRECTIVES} from 'angular2/common';
import {UserService} from '../services/user.service';
import {IConfig} from '../services/FAR.d';
import {APP_CONFIG} from '../services/app.config';

@Component({
  selector: 'cet-login',
  moduleId: module.id,
  templateUrl: './login.tpl.html',
  styleUrls: ['./login.css'],
  directives: [RouterLink, CORE_DIRECTIVES]
})
export class LoginComponent {
  constructor(
    public user: UserService,
    private router: Router,
    @Inject(APP_CONFIG) private config: IConfig
  ) {
  }

  private _disableFormInterval: any;
  public attempts: number = 0;
  public loginFormDisabled: boolean = false;
  public message: string;

  private disableLoginForm(): void {
    this.message = 'Login has been disabled due to number of invalid log in attempts';
    this.loginFormDisabled = true;
    this._disableFormInterval = setInterval(() => {
      clearInterval(this._disableFormInterval);
      this.enableLoginForm();
    }, 30000);
  };

  private enableLoginForm(): void {
    this.message = null;
    this.loginFormDisabled = false;
    this.attempts = 0;
  };

  ignoreSpace(evt: KeyboardEvent): boolean {
    if (evt.keyCode === 32) {
      return false;
    }

    return true;
  };

  doLogin(username: string, password: string): Promise<any> {
    let loginHttp = this.user.login(username.trim(), password.trim());
    this.message = null;

    return loginHttp
      .then((results: any) => {
        if (this.router.parent) { // #/login
          this.router.navigate([this.config.routeName.dashboard]);
        }
        this.user.sessionExpiredByTimer = false;
      })
      .catch((reason: any) => {
        try {
          if (reason) {
            switch (reason.status) {
              case 400: // incorrect un or pw
                this.message = 'Opps! Either your username or password is invalid, please try again.';
                this.attempts += 1;
                (this.attempts >= 3) && this.disableLoginForm();
                break;

              default: // any other HTTP response code
                this.message = reason.error_description;
            }
          }
        } catch (e) {
          this.message = 'We are sorry. Due to unknown reason, login failed';
        }
      });
  }
}
