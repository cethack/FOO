import {Component, OnInit} from 'angular2/core';
import {Router} from 'angular2/router';

// TODO what is this?
//      All properties in component metadata are optional according to the API docs.
//      Why should it be like that to avoid an error?
let template: string = '';
@Component({
  template
})
export class NotFoundComponent implements OnInit {
  constructor(private router: Router) {
  }

  ngOnInit(): void {
    console.log('NotFoundComponent Init...');
    // TODO check the user preference to get a start page
    //      For now, it redirects to Dashboard
    this.router.navigate(['Dashboard']);
  }
}
