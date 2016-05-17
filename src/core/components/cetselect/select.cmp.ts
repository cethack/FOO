import {Component, OnInit, OnDestroy, Input, Output, EventEmitter, ElementRef} from 'angular2/core';
import {SelectItem} from './selectItem.service';
import {HighlightPipe} from './highlight.pipe';
import {IOutPutEventData} from './select.d';

@Component({
  selector: 'cet-select',
  templateUrl: './select.tpl.html',
  styleUrls: ['./select.css'],
  pipes: [HighlightPipe],
  moduleId: module.id
})
export class Select implements OnInit, OnDestroy {
  private _disabled: boolean = false;
  private _allItems: Array<SelectItem> = [];
  private _initItem: any = {};
  // items to show as options in dropdown
  private filteredItems: Array<SelectItem> = [];
  // item to show in the INPUT text box
  private selectedItem: SelectItem;
  // item highlighted in the dropdown
  private activeItem: SelectItem;
  private itemsOpened: boolean = false;
  private searchTerm: string = '';

  constructor(private element: ElementRef) {
  }

  @Input() minLength: number = 1;
  @Input() idPropertyName: string = '';
  @Input() textPropertyName: string = '';
  @Input() placeholder: string = '';
  @Input() isRequired: boolean = false;

  @Input('selectItems') set allItems(items: Array<SelectItem>) {
    SelectItem.idPropertyName = this.idPropertyName;
    SelectItem.textPropertyName = this.textPropertyName;

    if (items) {
      this._allItems = items.map((item: any) => new SelectItem(item));
      this.filteredItems = this._allItems;
      this.activeItem = this.filteredItems[0];
    }
  }

  @Input() set initItem(initItem: any) {
    this._initItem = initItem;

    if (initItem) {
      this.selectedItem = new SelectItem(initItem);
      this.activeItem = this.selectedItem;
    }
  }

  @Input() set disabled(value: boolean) {
    this._disabled = value;
    if (this._disabled) {
      this.hideItems();
    }
  }

  @Output() clicked: EventEmitter<IOutPutEventData> = new EventEmitter();
  @Output() selected: EventEmitter<IOutPutEventData> = new EventEmitter();
  @Output() typed: EventEmitter<IOutPutEventData> = new EventEmitter();
  @Output() nomatched: EventEmitter<IOutPutEventData> = new EventEmitter();

  get allItems(): Array<SelectItem> {
    return this._allItems;
  }

  get disabled(): boolean {
    return this._disabled;
  }

  get initItem(): any {
    return this._initItem;
  }

  private currentClickedEl: any;

  public handleClickOutsideSelect = (e: any) => {
    let nodeName = e.target.nodeName;
    let className = e.target.className && e.target.className || '';
    let clickedEl = this.currentClickedEl;

    if (clickedEl !== e.target || !(nodeName === 'INPUT' && className.indexOf('cet-select') >= 0)) {
      this.hideItems();
      if (clickedEl) {
        clickedEl.value = this.selectedItem.displayText;
        //this.typed.emit({event: event, inputTerm: this.selectedItem.displayText});
        //this.selected.emit({selectedItem: this.selectedItem});
      }
    }
  };

  ngOnInit(): void {
    document.addEventListener('click', this.handleClickOutsideSelect);
  }

  ngOnDestroy(): void {
    document.removeEventListener('click', this.handleClickOutsideSelect);
  }

  showItems(): void {
    this.activeItem = this.filteredItems[0];
    !this.disabled && (this.itemsOpened = true);
  }

  hideItems(): void {
    this.itemsOpened = false;
  }

  processFocusIn = (event): void => {
    this.clicked.emit({event: event, filteredItems: this.filteredItems});
    this.currentClickedEl = event.target;
    setTimeout(() => { this.showItems(); }, 1);
    // event.target.value = '';
  };

  processKeyup = (event: any): void => {
    let term = event.target.value;
    let code = event.keyCode;

    // up (38) and down (40) keys are processed at keydown event
    if (term.length < this.minLength || code === 9 || code === 38 || code === 40) {
      return;
    }

    this.processUserInput({term: term, event: event});
  };

  processKeydown = (event: any): void => {
    let code = event.keyCode;

    // in order to support for keeping pressing arrow keys
    if (code === 9 || code === 38 || code === 40) {
      this.processUserInput({term: event.target.value, event: event});
    }
  };

  private handleNoMatched = (data: any) => {
    this.nomatched.emit({event: data.event, inputTerm: data.term.trim()});
    data.event.target.value = this.selectedItem.displayText || '';
    this.activeItem = this.allItems[0];
    this.filteredItems = this.allItems;
  };

  processUserInput = (data: any) => {
    let event = data.event;
    let inputKeyCode = event.keyCode;
    let inputTerm: string = data.term.trim();

    if (inputKeyCode === 13) {  // enter
      if (this.filteredItems.length === 0) {
        this.handleNoMatched(data);
        event.preventDefault();
      } else {
        this.setSelectedItem(data.event, this.activeItem);
        this.hideItems();
      }

      return;
    }

    if (inputKeyCode === 9) { // tab
      if (this.filteredItems.length === 0) {
        this.handleNoMatched(data);
        event.preventDefault();
      } else if (this.filteredItems.length === 1) {
        this.setSelectedItem(data.event, this.filteredItems[0]);
        this.hideItems();
      } else if (this.itemsOpened) {
        event.preventDefault();
      }

      return;
    }

    if (inputKeyCode === 27) { // ESC
      event.preventDefault();
      this.hideItems();
      event.target.value = this.selectedItem.displayText;
      return;
    }

    if (inputKeyCode === 38) {  // up
      event.preventDefault();

      let index = this.filteredItems.indexOf(this.activeItem);

      // if activeItem is the first one just ignore
      if (index) {
        this.activeItem = this.filteredItems[index - 1];
      }

      this.ensureActiveItemVisible();
      return;
    }

    if (inputKeyCode === 40) {  // down
      event.preventDefault();

      let index = this.filteredItems.indexOf(this.activeItem);

      if (index + 1 !== this.filteredItems.length) {
        this.activeItem = this.filteredItems[index + 1];
      }

      this.ensureActiveItemVisible();
      return;
    }


    this.filteredItems = this.allItems.filter(item => {
      return item.displayText.toLowerCase().indexOf(inputTerm.toLowerCase()) >= 0;
    });

    this.showItems();
    this.searchTerm = inputTerm;
    this.typed.emit({event: event, inputTerm: inputTerm.trim(), selectedItem: this.selectedItem});

  };

  ensureActiveItemVisible(): void {
    let container = this.element.nativeElement.querySelector('.cet-select-items-content');
    let rowItems = container.querySelectorAll('.cet-select-items-row');

    if (rowItems.length < 1) {
      return;
    }

    let activeIndex = this.filteredItems.indexOf(this.activeItem);
    let activeItem = rowItems[activeIndex < 0 ? 0 : activeIndex];

    let posY: number = activeItem.offsetTop + activeItem.clientHeight - container.scrollTop;
    let height: number = container.offsetHeight;

    if (posY > height) {
      container.scrollTop += posY - height;
    } else if (posY < activeItem.clientHeight) {
      container.scrollTop -= activeItem.clientHeight - posY;
    }
  }

  setSelectedItem(event: any, item: SelectItem): void {
    let defaultItem = {};

    if (!item) {
      defaultItem[this.idPropertyName] = '';
      defaultItem[this.textPropertyName] = '';
      item = new SelectItem(defaultItem);
    }

    this.selectedItem = item;
    this.searchTerm = ''; // remove highlighted style from filteredItems
    this.hideItems();
    this.selected.emit({selectedItem: this.selectedItem});
  }

  isActiveItem(item: SelectItem): boolean {
    return this.activeItem && this.activeItem.id === item.id;
  }

  setActiveItem(item: SelectItem): void {
    this.activeItem = item;
  }

}
