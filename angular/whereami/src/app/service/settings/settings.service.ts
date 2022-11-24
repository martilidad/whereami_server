import { Injectable, Type } from '@angular/core';
import { Subject } from 'rxjs';
import { Optional } from 'typescript-optional';

class Property<T> {
  constructor(public key: string) {}
}

class DefinedProperty<T> extends Property<T> {
  constructor(key: string, public initial: T) {
    super(key);
  }
}

export const VOLUME = new DefinedProperty<number>('volume', 1);
export const AUTOSTART = new DefinedProperty<boolean>('autostart', false);
export const GHOST = new DefinedProperty<boolean>('ghost', true);
export const TOKEN = new Property<string>('token');

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  private subjects = new Map<Property<any>, Subject<any>>();


  constructor() { }

  save<T>(value: T, property: Property<T>) {
    localStorage.setItem(property.key, JSON.stringify(value));
    Optional.ofNullable(this.subjects.get(property)).ifPresent(sub => sub.next(value));
  }

  load<T>(property: DefinedProperty<T>): T {
    return this.loadOpt<T>(property).orElse(property.initial);
  }

  private _listen<T>(property: DefinedProperty<T>, once: (value: T) => void = ()=>{}, onupdate: (value: T) => void = ()=>{}) {
    Optional.ofNullable(this.subjects.get(property))
    .ifPresentOrElse(val => val.subscribe(onupdate), () => {
      let subject = new Subject<T>();
      this.subjects.set(property, subject);
      subject.subscribe(onupdate);
    });
    once(this.load(property));
  }

  listen<T>(property: DefinedProperty<T>, always: (value: T) => void): void;
  listen<T>(property: DefinedProperty<T>, once: (value: T) => void, onupdate: (value: T) => void): void;
  listen<T>(property: DefinedProperty<T>, once?: (value: T) => void, onupdate?: (value: T) => void, always?: (value: T) => void) {
    always ? this._listen(property, always, always) : {};
    once || onupdate ? this._listen(property, once, onupdate) : {};
  }

  saveOpt<T>(value: Optional<T>, property: Property<T>) {
    value.ifPresentOrElse(
      val => this.save(value, property),
      () => localStorage.removeItem(property.key)
    );
  }

  loadOpt<T>(property: Property<T>): Optional<T> {
    return Optional.ofNullable(localStorage.getItem(property.key))
    .map(val => 
      {
        try {
          let parsed = JSON.parse(val)
          return parsed;
        } catch { SyntaxError } {
          return null;
        }
      }).filter(val => val != null);
  }

}


