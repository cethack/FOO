import {Pipe, PipeTransform} from 'angular2/core';
import {Utils} from '../services/utils';

@Pipe({name: 'cetComma'})
export class CetCommaPipe implements PipeTransform {

  transform(value: number, isFluid: boolean): any {
    var parts = value.toString().split('.');
    // if isFluid, show all the time 3 digits after decimal point
    var decimalPlace = (isFluid && parts.length > 1 && parts[1].substring(0, 3)) || '000';
    var valueWithCommas = Utils.formatNumberWith(parts[0]);

    return isFluid ? `${valueWithCommas}.${decimalPlace}` : valueWithCommas;
  }

}
