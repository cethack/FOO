import {PopupService} from './popup.service';
import {IJSONObject} from './FAR';
import {MessageComponent} from '../components/message.cmp';


export class CetExceptionLogger {
  messages: Array<any> = [];

  constructor(public popup: PopupService) {
  }

  log(s: any): void {
    this.messages.push(s);
  }

  logError(s: any): void {
    this.messages.push(s);
  }

  logGroup(s: any): void {
    this.messages.push(s);
  }

  logGroupEnd(): void {
    let data = this.messages;
    if (data.length > 1) {
      let lastIndex = data.length - 1;
      data[lastIndex] = data[lastIndex].constructor.name; //to avoid circular reference error
    }
    //let feedbackOptions: IFeedbackPopupOptions = {caller: this, data: data};

    // if error is 409, show status text to user, otherwise show feedback popup
    if (this.errorObject && this.errorObject['status'] === 409) {
      this.popup.open(MessageComponent, {
        titleId: 'ERROR',
        message: this.errorObject['statusText'],
        buttons: {ok: (): void => this.popup.close()}
      });
    } else {
      console.log('Error...');
      // this.popup.open(FeedbackComponent, feedbackOptions);
    }

    this.messages = []; // messages needs to be cleaned after showing popup
  };

  get errorObject(): IJSONObject {
    let errStr: string = this.messages[0];
    let matches: string[] = errStr.match(/\{(.*)\}$/); /* string between { and } */
    let errObj;
    if (matches) {
      errObj = JSON.parse(matches[0]);
    }
    return errObj;
  }

}
