export class SelectItem {
  _id: string;
  _text: string;
  _displayText: string;

  static idPropertyName: string = 'id';
  static textPropertyName: string = 'text';

  constructor(source: any) {
    if (typeof source === 'string') {
      this.id = this.text = this.displayText = source;
    }

    if (typeof source === 'object') {
      this.id = source[SelectItem.idPropertyName] || source[SelectItem.textPropertyName];
      this.text = source[SelectItem.textPropertyName];
      // TODO make an input for display text format
      this.displayText = source[SelectItem.idPropertyName] + ' ' + source[SelectItem.textPropertyName];
      this.displayText = this.displayText.trim();
    }
  }

  get id(): string {
    return this._id;
  }

  set id(value: string) {
    this._id = value;
  }

  get text(): string {
    return this._text;
  }

  set text(value: string) {
    this._text = value;
  }

  get displayText(): string {
    return this._displayText;
  }

  set displayText(text: string) {
    this._displayText = text;
  }

}
