import {SelectItem} from './selectItem.service';

export interface IOutPutEventData {
  event?: any;
  filteredItems?: Array<SelectItem>;
  selectedItem?: SelectItem;
  inputTerm?: string;
}
