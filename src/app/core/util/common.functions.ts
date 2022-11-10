import { PROHIBIT_SCOPES } from './constants/constants';
import { format } from 'date-fns';
import { throwError } from 'rxjs';

export function allowedScopes(): boolean {
  const currentScope: string = localStorage.getItem('scopeType') || '';
  const prohibitedScopes: Array<string> = PROHIBIT_SCOPES || []; // prohibition list
  if (!prohibitedScopes.length) return true; // Blank array([]) means no prohibition is set and we can pass true.
  return !prohibitedScopes.includes(currentScope); // If the current scope is present in the prohibition list then we can return false.
}

export function _dateUTC(date: Date) {
  return new Date(
    date.setMinutes(date.getMinutes() + date.getTimezoneOffset())
  );
}

export function ISOFormat(date: Date | string): string {
  if (!date) return '';
  date = typeof date === 'string' ? new Date(date) : date;
  return format(date, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
}

export const fixErrorResponse = (e) =>
  e?.error ? throwError(e.error) : throwError(e);

export function bytesToMB(number: number): number {
  return Number((number / 1024 / 1000).toFixed(2));
}
