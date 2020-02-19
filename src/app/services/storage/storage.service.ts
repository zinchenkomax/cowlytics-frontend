import {Injectable} from '@angular/core';
import {EventEntry} from '../../models/event-entry';

export interface InternalStateType {
  [key: string]: any;
}

@Injectable()
export class StorageService {

  public STATE: InternalStateType = { };

  public get all() {
    return StorageService._clone(this.STATE);
  }

  private static _clone(object: InternalStateType) {
    /**
     * Simple object clone.
     */
    return JSON.parse(JSON.stringify( object ));
  }

  public get(prop?: any): any|null {
    /**
     * Use our state getter for the clone.
     */
    const state = this.STATE;
    // console.log('State', state, state.constructor.name);
    // console.log('Имеющиеся ключи', Object.keys(state));
    // console.log('Prop from storage: ', prop);
    if ( this.has(prop) ) {
      return state[prop];
    } else {
      return null;
    }

  }

  public has(prop?: any): boolean {
    return Object.keys(this.STATE).indexOf(prop.toString()) !== -1;
  }

  public set(prop: string, value: any) {
    // console.log('Setting prop to storage', prop, value);
    /**
     * Internally mutate our state.
     */
    return this.STATE[prop] = value;
  }

  public unset(prop: string) {
    delete this.STATE[prop];
  }

  public setEventEntityList(list: EventEntry[]) {
    // console.log('Setting prop to storage', list);
    for (const [, value] of Object.entries(list)) {
      this.set(value.eventId, value);
    }
  }

}
