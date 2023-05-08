import { Injectable, Type } from '@angular/core';
import { Observable, Subject, startWith } from 'rxjs';
import { Optional } from 'typescript-optional';

export class Property<T> {
  constructor(public key: string) {}
}

export class DefinedProperty<T> extends Property<T> {
  constructor(key: string, public initial: T) {
    super(key);
  }
}

export const VOLUME = new DefinedProperty<number>('volume', 1);
export const AUTOSTART = new DefinedProperty<boolean>('autostart', false);
export const GHOST = new DefinedProperty<boolean>('ghost', true);
export const TOKEN = new Property<string>('token');
export const REACTIONS = new DefinedProperty<boolean>('reactions', true);

export const DEFINED_PROPERTIES = {
  volume: VOLUME,
  autostart: AUTOSTART,
  ghost: GHOST,
  reactions: REACTIONS
};

export type DefinedPropertyKey = 'volume' | 'autostart' | 'ghost' | 'reactions';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  private subjects = new Map<Property<any>, Subject<any>>();


  constructor() { }

  saveForKey<T>(value: T, key: DefinedPropertyKey) {
    const property: DefinedProperty<unknown> = DEFINED_PROPERTIES[key];
    return this.save(value, property);
  }

  save<T>(value: T, property: Property<T>) {
    localStorage.setItem(property.key, JSON.stringify(value));
    Optional.ofNullable(this.subjects.get(property)).ifPresent(sub => sub.next(value));
  }


  loadFromKey(key: DefinedPropertyKey): unknown {
      const property: DefinedProperty<unknown> = DEFINED_PROPERTIES[key];
      return this.load(property);
  }

  load<T>(property: DefinedProperty<T>): T {
    return this.loadOpt<T>(property).orElse(property.initial);
  }

  loadFromKey$(key: DefinedPropertyKey): Observable<unknown> {
    const property: DefinedProperty<unknown> = DEFINED_PROPERTIES[key];
    return this.load$(property);
}

  load$<T>(property: DefinedProperty<T>): Observable<T> {
     const subject: Subject<T> = Optional.ofNullable(this.subjects.get(property))
    .orElseGet(() => new Subject<T>());
    this.subjects.set(property, subject);
    //every new subscriber should have the chance to consume a value
    //could also work with behavioursubject instead
    return subject.pipe(startWith(this.load(property)));
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


