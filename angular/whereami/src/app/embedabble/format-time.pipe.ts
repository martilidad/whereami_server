import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'formatTime'
})
export class FormatTimePipe implements PipeTransform {
  transform(value: string | undefined): unknown {
    return FormatTimePipe.transform(value);
  }

  static transform(value: string | undefined): string {
    const momentVal = moment(value);
    if(!momentVal.isValid()) {
      return momentVal.format();
    } else if (momentVal.isAfter(moment().subtract(1, 'days'))) {
      return momentVal.fromNow();
    } else if (momentVal.get('year') == moment().get('year')) {
      return momentVal.local().format('DD MMM');
    } else {
      return momentVal.local().format('YYYY-MM-DD');
    }
  }

}
