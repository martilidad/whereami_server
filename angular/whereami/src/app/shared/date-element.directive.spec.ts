import { ElementRef } from '@angular/core';
import * as moment from 'moment';
import { DateElementDirective } from './date-element.directive';

describe('DateElementDirective', () => {
  let directive : DateElementDirective;
  let anElement : HTMLElement;

  beforeEach(() => {
    anElement = document.createElement('div');
    directive = new DateElementDirective(new ElementRef(anElement));
  })
  it('test current day', () => {
    expect(directive).toBeTruthy();
    const value = moment();
    directive.appDateElement = value.utc().toISOString();
    expect(anElement.innerText).toEqual('a few seconds ago');
    expect(anElement.getAttribute('data-order')).toEqual(value.utc().toISOString());
    expect(anElement.getAttribute('title')).toEqual(value.local().format('YYYY-MM-DD HH:mm:ss'));
  });

  it('test current year', () => {
    if(moment().day() == 31 && moment().month() == 12) {
      pending('Ignore this test. can\'t be tested on last day of year.')
    }
    let value = moment().subtract(1, 'days');
    directive.appDateElement = value.utc().toISOString();
    expect(anElement.innerText).toEqual(value.format('DD MMM'));
    expect(anElement.getAttribute('data-order')).toEqual(value.utc().toISOString());
    expect(anElement.getAttribute('title')).toEqual(value.local().format('YYYY-MM-DD HH:mm:ss'));
  });

  it('test old date', () => {
    let value = moment().subtract(1, 'years');
    directive.appDateElement = value.utc().toISOString();
    expect(anElement.innerText).toEqual(value.format('YYYY-MM-DD'));
    expect(anElement.getAttribute('data-order')).toEqual(value.utc().toISOString());
    expect(anElement.getAttribute('title')).toEqual(value.local().format('YYYY-MM-DD HH:mm:ss'));
  });

  it('test empty value', () => {
    directive.appDateElement = '';
    expect(anElement.innerText).toEqual('Invalid date');
    expect(anElement.getAttribute('data-order')).toEqual('');
    expect(anElement.getAttribute('title')).toEqual('Invalid date');
  });

});
