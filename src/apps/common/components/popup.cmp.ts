import {Component, ComponentRef, DynamicComponentLoader, ViewChild, ViewContainerRef} from 'angular2/core';
import {PopupService } from '../services/popup.service';
import {CetDisableIOSScrollDirective} from '../../../core/directives/cetDisableIosScroll.directive';

@Component({
  selector: 'popup',
  moduleId: module.id,
  templateUrl: './popup.tpl.html',
  styleUrls: ['./popup.css'],
  directives: [CetDisableIOSScrollDirective]
})
export class PopupComponent {
  @ViewChild('dynCmp', {read: ViewContainerRef}) dynCmp: ViewContainerRef;

  public visible: boolean;
  public cmpRef: Promise<ComponentRef>;

  constructor(
    public dcl: DynamicComponentLoader,
    public popup: PopupService
  ) {
    popup.visibleChanges$.subscribe(visible => {
      visible ? this.openPopup() : this.closePopup();
    });
  }

  openPopup(): Promise<any> {
    return this.disposeDynCmp().then(() => {
      let component = this.popup.component;
      this.cmpRef = this.dcl.loadNextToLocation(component, this.dynCmp)
        .then(cmp => {
          if (this.popup.componentOptions) {
            cmp.instance.popupOptions = this.popup.componentOptions;
          }
          cmp.instance.popup = this.popup;
          return cmp;
        });
      this.visible = true;
    });
  }

  closePopup(): void {
    this.disposeDynCmp();
    this.visible = false;
  }

  private disposeDynCmp(): Promise<any> {
    if (this.cmpRef) {
      return this.cmpRef.then(ref => ref.destroy());
    } else {
      return new Promise(resolve => resolve(true));
    }
  }
}
