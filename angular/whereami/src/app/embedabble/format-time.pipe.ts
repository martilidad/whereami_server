import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'formatTime'
})
export class FormatTimePipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): unknown {
    if (moment(value).isAfter(moment().subtract(1, 'days'))) {
      return moment(value).fromNow();
    } else {
      return moment(value).format('LLLL');
    }
  }

}
