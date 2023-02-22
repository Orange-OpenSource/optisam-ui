import { LOCAL_KEYS } from '../util/constants/constants';
import { Injectable } from '@angular/core';
import { PROHIBIT_SCOPES } from '../util/constants/constants';
import { v4 as uuidv4 } from 'uuid';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
@Injectable({
  providedIn: 'root',
})
export class CommonService {
  constructor(private dialog: MatDialog) {}

  get allowedScopes(): boolean {
    const currentScope: string = this.getLocalData(LOCAL_KEYS.SCOPE_TYPE) || '';
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

  customSort(
    array: any[],
    order: 'asc' | 'desc',
    keys?: string | string[]
  ): any[] {
    if (
      !!!keys &&
      array.every((a) => ['Number', 'String'].includes(a.constructor.name))
    ) {
      return array.sort((a, b) =>
        (order === 'asc' ? a > b : a < b) ? 1 : a === b ? 0 : -1
      );
    }
    if (keys.constructor === Array) {
      keys.reverse().forEach((key) => {
        array = this.simpleSort(array, order, key);
      });
      return array;
    }
    return this.simpleSort(array, order, <string>keys);
  }
  openModal(
    template: any,
    config?: MatDialogConfig,
    data?: any
  ): MatDialogRef<any> {
    return this.dialog.open(template, {
      ...{
        height: '470px',
        width: '60vw',
        disableClose: true,
        ...(data && { data: data }),
      },
      ...(config && config),
    });
  }

  generateUID(): string {
    return uuidv4();
  }

  private simpleSort(array: any[], order: 'asc' | 'desc', key: string): any[] {
    /* first check for the order. It will either be 'asc' or 'desc'*/
    /* The below line is for ascending (asc) order */
    if (order === 'asc') {
      return array.sort((a: any, b: any) => {
        /* In the below line: checking the type of the incoming variable */
        if (a[key].constructor === String && b[key].constructor === String) {
          /* in the below line we are checking if the number is in string format */
          if (isNaN(a[key]) && isNaN(b[key]))
            // this condition will run if the value is not a number
            return a[key].toLowerCase() > b[key].toLowerCase()
              ? 1
              : a[key].toLowerCase() === b[key].toLowerCase()
              ? 0
              : -1;
          /* 
          The below line will run if the above IF condition will fail that 
          means it's a number and we can change the login for number; 
          */
          return <number>a[key] - <number>b[key];
        }

        /* The below if condition will run when the incoming value is a number only */
        if (a[key].constructor === Number && b[key].constructor === Number)
          return <number>a[key] - <number>b[key];
      });
    }

    /* The below line will run only if the order is 'desc' */
    return array.sort((a: any, b: any) => {
      /* The below line is checking of 'string' type */
      if (a[key].constructor === String && b[key].constructor === String) {
        /* The below line is checking if the number is in string type */
        if (isNaN(a[key]) && isNaN(b[key]))
          return a[key].toLowerCase() < b[key].toLowerCase()
            ? 1
            : a[key].toLowerCase() === b[key].toLowerCase()
            ? 0
            : -1;
        /* 
        The below line will only run when order is 'desc' and incoming 
        value is a number as a string  and we can change the logic 
        according to number
        */
        return <number>b[key] - <number>a[key];
      }

      /* The below line will only run when incoming value is number only and the order is 'desc' */
      if (a[key].constructor === Number && b[key].constructor === Number)
        return <number>b[key] - <number>a[key];
    });
  }
}
