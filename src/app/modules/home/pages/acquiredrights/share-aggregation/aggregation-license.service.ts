import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AggregationLicenseService {
  private availableLicenses = new BehaviorSubject<number>(0);
  public availableLicenses$ = this.availableLicenses.asObservable();

  constructor() {}

  getAvailableLicense(): Observable<number> {
    return this.availableLicenses.asObservable();
  }

  setAvailableLicenses(licenses: number) {
    this.availableLicenses.next(licenses);
  }

  decreaseAvailableLicenses(licenses: number) {
    const current = this.availableLicenses.getValue() - licenses;
    this.availableLicenses.next(current);
  }

  updateAvailableLicenses(licenses: number) {
    const current = this.availableLicenses.getValue() + licenses;
    this.availableLicenses.next(current);
  }
}
