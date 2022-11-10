import { Injectable, Type } from '@angular/core';
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
export const TOKEN = new Property<string>('token');

@Injectable({
  providedIn: 'root'
})
export class SettingsService {


  constructor() { }

  save<T>(value: T, property: Property<T>) {
    localStorage.setItem(property.key, JSON.stringify(value));
  }

  load<T>(property: DefinedProperty<T>): T {
    return this.loadOpt<T>(property).orElse(property.initial);
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


