import { Injectable } from '@angular/core';
import { PROHIBIT_SCOPES } from '../util/constants';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  constructor() {}

  get allowedScopes(): boolean {
    const currentScope: string = this.getLocalData('scopeType') || '';
    const prohibitedScopes: Array<string> = PROHIBIT_SCOPES || []; // prohibition list
    if (!prohibitedScopes.length) return true; // Blank array([]) means no prohibition is set and we can pass true.
    return !prohibitedScopes.includes(currentScope); // If the current scope is present in the prohibition list then we can return false.
  }

  getLocalData(key: string): string {
    return localStorage.getItem(key);
  }

  setLocalData(key: string, value: string): void {
    localStorage.setItem(key, value);
  }

  _dateUTC(date: Date) {
    return new Date(
      date.setMinutes(date.getMinutes() + date.getTimezoneOffset())
    );
  }
}
