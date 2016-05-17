import {ReflectiveInjector, provide} from 'angular2/core';
import {DashboardComponent} from './dashboard/dashboard.cmp';
import {LoginComponent} from './common/components/login.cmp';
import {TaskListComponent} from './task-list/task-list.cmp';
import {NotFoundComponent} from './common/components/notFound.cmp';
import {IConfig} from './common/services/FAR.d';
import {APP_CONFIG, CONFIG} from './common/services/app.config';

var injectors = ReflectiveInjector.resolve([
  provide(APP_CONFIG, {useValue: CONFIG})
]);

var config: IConfig = injectors[0].resolvedFactories[0].factory();
var ROUTE_NAME = config.routeName;

export const ROOT_ROUTES = [
  {
    path: '/', name: ROUTE_NAME.root, redirectTo: [ROUTE_NAME.login], useAsDefault: true,
    data: { title: '', requireAuth: false }
  },
  {
    path: '/login', name: ROUTE_NAME.login, component: LoginComponent,
    data: {
      title: 'FOO',
      requireAuth: false
    }
  },
  {
    path: '/dashboard', name: ROUTE_NAME.dashboard, component: DashboardComponent,
    data: {
      title: 'FOO',
      requireAuth: true,
      isNavigable: true
    }
  },
  {
    path: '/task-list', name: ROUTE_NAME.taskList, component: TaskListComponent,
    data: {
      title: 'FOO',
      requireAuth: true,
      isNavigable: true
    }
  },
  {
    path: '/**', name: ROUTE_NAME.notFound, component: NotFoundComponent,
    data: { requireAuth: true }
  }
];
