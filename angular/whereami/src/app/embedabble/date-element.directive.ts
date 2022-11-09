import { Directive, ElementRef, Input } from '@angular/core';
import * as moment from 'moment';
import { FormatTimePipe } from './format-time.pipe';

@Directive({
  selector: '[appDateElement]'
})
export class DateElementDirective {
  @Input() 
  set appDateElement(utc: string | undefined) {
    if(utc == undefined) {
      return;
    }
    this.el.nativeElement.innerText = FormatTimePipe.transform(utc);
    this.el.nativeElement.setAttribute('data-order', utc);
    this.el.nativeElement.setAttribute('title', moment(utc).local().format('YYYY-MM-DD HH:mm:ss'));
  }

  constructor(private el: ElementRef<HTMLElement>) {
 }

}
