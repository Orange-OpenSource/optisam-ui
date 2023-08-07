import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { Router } from '@angular/router';
import {
  ErrorResponse,
  LicenseDatum,
  SharedAggregationUpdateParams,
  SharedDataLicences,
  SharedDatum,
  SharedLicData,
  SharedLicencesParams,
  SharedLicencesUpdateResponse,
} from '@core/modals';
import { CommonService, ProductService } from '@core/services';
import { AccountService } from '@core/services/account.service';
import { LOCAL_KEYS } from '@core/util/constants/constants';
import { Observable } from 'rxjs';
import { ErrorDialogComponent } from '../share-accquired-right/error-dialog/error-dialog.component';
import { SuccessDialogComponent } from '../share-accquired-right/success-dialog/success-dialog.component';
import { AggregationLicenseService } from './aggregation-license.service';
import { SharedAggregationsLicencesComponent } from './shared-aggregations-licences/shared-aggregations-licences.component';

@Component({
  selector: 'app-share-aggregation',
  templateUrl: './share-aggregation.component.html',
  styleUrls: ['./share-aggregation.component.scss'],
})
export class ShareAggregationComponent implements OnInit {
  sharedAggregations: FormGroup;
  sharedLicencesData: SharedDataLicences;
  licence_data: LicenseDatum[];
  originalAvailableLicenses: number;
  availableLicenses$: Observable<number>;
  sharedDataValue: any;
  modifiedData: { availableLicence: any; data: any };
  new_data: { availableLicence: any };
  _createLoading: boolean = false;
  result: any = {};
  actionSuccessful: boolean;
  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data,
    private productService: ProductService,
    private accountService: AccountService,
    public dialog: MatDialog,
    private cd: ChangeDetectorRef,
    private cs: CommonService,
    private router: Router,
    private dialogRef: MatDialogRef<ShareAggregationComponent>,
    private sharedLicense: AggregationLicenseService
  ) {}

  ngOnInit(): void {
    // console.log(this.data);

    this.sharedAggregations = this.fb.group({
      sharedAggregationsArray: this.fb.array([], Validators.required),
    });

    this.originalAvailableLicenses = this.data?.available_licenses;
    this.sharedLicense.setAvailableLicenses(this.originalAvailableLicenses);

    this.sharedDataValue = this.data?.shared_data?.reduce(
      (
        total: number,
        group: {
          scope: string;
          shared_licenses: number;
          recieved_licenses: number;
        }
      ) => {
        total += group.shared_licenses;
        return total;
      },
      0
    );
    this.modifiedData = {
      availableLicence: this.data?.available_licenses,
      data: this.data?.shared_data?.map((data) => data),
    };
    this.new_data = { availableLicence: this.modifiedData['availableLicence'] };
    this.modifiedData?.data?.forEach((item) => {
      this.new_data[item.scope] = item.shared_licenses;
    });
    // console.log(JSON.stringify(this.new_data));
    this.availableLicenses$ = this.sharedLicense.getAvailableLicense();

    this.getSharedLicences();
    if (!this.sharedDataValue) this.addNewSharedAgg();
  }

  get sharedAggregationsArray(): FormArray {
    return this.sharedAggregations.controls[
      'sharedAggregationsArray'
    ] as FormArray;
  }

  addNewSharedAgg(data = null): void {
    if (data) {
      if (data.shared_licenses === 0) {
        return;
      }
    }
    this.sharedAggregationsArray.push(
      SharedAggregationsLicencesComponent.addNewSharedLicencse(data)
    );
  }

  getSharedLicences(): void {
    const obj: SharedLicencesParams = {
      scope: this.cs.getLocalData(LOCAL_KEYS.SCOPE),
      sku: this.data?.sku,
    };
    this.productService
      .getSharedAccquiredLicences(obj)
      .subscribe((licenseData: SharedDataLicences) => {
        this.sharedLicencesData = licenseData;
        if (this.sharedLicencesData?.shared_data?.length !== 0) {
          (this.sharedLicencesData?.shared_data || []).forEach(
            (shared: SharedDatum) => this.addNewSharedAgg(shared)
          );
        }
      });
  }

  removeSharedAggregations(index: number): void {
    if (this.sharedDataValue === 0) {
      const formArrayValues = this.sharedAggregationsArray?.value;
      const totalSharedLicenses = formArrayValues.reduce(
        (
          total: number,
          group: { scope: string; sharedLicencesNum: string }
        ) => {
          total += Number(group.sharedLicencesNum);
          return total;
        },
        0
      );

      // console.log(
      //   'sharedDataValue',
      //   this.sharedDataValue,
      //   'totalSharedLicenses',
      //   totalSharedLicenses,
      //   'this.data?.available_licenses',
      //   this.data?.available_licenses
      // );
      const currentTotal =
        this.sharedDataValue +
        this.data?.available_licenses -
        totalSharedLicenses;
      const item = this.sharedAggregationsArray.at(index);
      const value = item.value;
      // console.log(currentTotal, value?.sharedLicencesNum);
      this.sharedLicense.setAvailableLicenses(
        currentTotal + Number(value?.sharedLicencesNum)
      );
    } else {
      // console.log(this.new_data);
      const item = this.sharedAggregationsArray.at(index);
      const value = item.value;
      if (this.new_data[value?.scope]) {
        const pctValue = Number(this.new_data[value?.scope]);
        this.new_data.availableLicence += pctValue;
        this.new_data[value.scope] = 0;
      }
      this.sharedLicense.setAvailableLicenses(this.new_data?.availableLicence);
    }
    this.sharedAggregationsArray.removeAt(index);
  }

  updateSharedLicensesNumber() {
    if (this.sharedDataValue === 0) {
      const formArrayValues = this.sharedAggregationsArray?.value;
      const totalSharedLicenses = formArrayValues.reduce(
        (
          total: number,
          group: { scope: string; sharedLicencesNum: string }
        ) => {
          total += Number(group.sharedLicencesNum);
          return total;
        },
        0
      );
      const sharedDataValue = this.data?.shared_data?.reduce(
        (
          total: number,
          group: { scope: string; sharedLicencesNum: string }
        ) => {
          total += Number(group.sharedLicencesNum);
          return total;
        },
        0
      );
      const finalTotal = this.sharedDataValue + this.data?.available_licenses;
      // console.log(finalTotal, totalSharedLicenses);
      this.sharedLicense.setAvailableLicenses(finalTotal - totalSharedLicenses);
    } else {
      const currentVal = this.sharedAggregationsArray?.value;

      const newDataObject = currentVal.reduce((obj, item) => {
        obj[item.scope] = Number(item.sharedLicencesNum);
        return obj;
      }, {});
      // console.log(JSON.stringify(newDataObject), JSON.stringify(this.new_data));

      // for (const key in newDataObject) {
      //   if (this.new_data[key] !== newDataObject[key]) {
      //     const oldValue = this.new_data[key];
      //     const newValue = newDataObject[key];
      //     this.new_data[key] = newValue;
      //     console.log(oldValue, newValue, this.new_data[key]);
      //     if (key === 'availableLicence') {
      //       this.new_data[key] = oldValue + newValue - this.new_data[key];
      //     } else {
      //       this.new_data['availableLicence'] -= newValue - oldValue;
      //     }
      //   }
      // }

      for (const key in newDataObject) {
        if (newDataObject[key] !== this.new_data[key]) {
          const oldValue = this.new_data[key] ? this.new_data[key] : 0;
          const newValue = newDataObject[key];
          this.new_data[key] = newValue;
          if (key === 'availableLicence') {
            const diff = newValue - oldValue;
            this.new_data['availableLicence'] -= diff;
          } else {
            const diff = oldValue - newValue;
            this.new_data['availableLicence'] += diff;
          }
        }
      }

      this.result = this.sharedAggregationsArray.value?.reduce((acc, obj) => {
        acc[obj.scope] = parseInt(obj.sharedLicencesNum);
        return acc;
      }, {});

      const temporaryObject = { ...this.new_data }; // or Object.assign({}, this.new_data);
      delete temporaryObject.availableLicence;
      console.log(temporaryObject, this.result);
      let keyToBeMakeZero = this.objectDiff(temporaryObject, this.result);
      console.log(keyToBeMakeZero, this.new_data);
      for (let key in keyToBeMakeZero) {
        if (this.new_data.hasOwnProperty(key)) {
          // Get the value of the key to be deleted
          let valueToBeAdded = keyToBeMakeZero[key];

          // Add the value to availableLicence
          this.new_data.availableLicence += valueToBeAdded;

          // Delete the key from new_data
          this.new_data[key] = 0;
        } else {
          console.log(`Key ${key} not found in new_data.`);
        }
      }
      console.log(this.new_data, temporaryObject, this.result);

      // console.log(this.new_data);
      this.sharedLicense.setAvailableLicenses(this.new_data.availableLicence);
      // console.log(this.new_data.availableLicence);
    }
  }

  objectDiff(obj1, obj2) {
    const diff = {};

    for (let key in obj1) {
      if (!obj2.hasOwnProperty(key)) {
        diff[key] = obj1[key];
      }
    }

    return diff;
  }

  createShareAgg(): void {
    this._createLoading = true;
    this.licence_data =
      this.sharedAggregations.value?.sharedAggregationsArray?.map(
        (shared: SharedLicData) => {
          return {
            reciever_scope: shared.scope,
            shared_licenses: shared.sharedLicencesNum,
          };
        }
      );

    //Fetching the Already Shared Scopes
    let alreadySharedLicenseScope = this.sharedLicencesData?.shared_data?.map(
      (x) => {
        return x.scope;
      }
    );

    //extracting scopes from FormArray
    let scopedInFormArray = this.licence_data?.map((x) => x.reciever_scope);

    // console.log('alreadySharedLicense', alreadySharedLicenseScope);

    //Now Adding if alreadyshared scope is not present in FormArray
    let found = {};
    for (let i = 0; i < scopedInFormArray.length; i++) {
      for (let j = 0; j < alreadySharedLicenseScope.length; j++) {
        if (scopedInFormArray[i] === alreadySharedLicenseScope[j]) {
          found[alreadySharedLicenseScope[j]] = true;
        }
      }
    }

    for (let i = 0; i < alreadySharedLicenseScope.length; i++) {
      if (!found[alreadySharedLicenseScope[i]]) {
        this.licence_data.push({
          reciever_scope: alreadySharedLicenseScope[i],
          shared_licenses: '0',
        });
      }
    }
    // console.log(this.licence_data);

    const obj: SharedAggregationUpdateParams = {
      sku: this.data?.sku,
      scope: localStorage.getItem('scope'),
      aggregation_name: this.data?.aggregation_name,
      license_data: this.licence_data,
    };
    if (Object.values(this.result)[0] === 0) {
      this.productService.putSharedAggregationLicences(obj).subscribe(
        (res: SharedLicencesUpdateResponse) => {
          this._createLoading = false;
          this.actionSuccessful = true;
          const numLicensesDeleted = Object.keys(this.result).length;
          const message =
            numLicensesDeleted > 1
              ? `${Object.keys(this.result)} licenses are successfully deleted`
              : `${Object.keys(this.result)} License is successfully deleted`;
          this.dialog
            .open(SuccessDialogComponent, {
              disableClose: true,
              height: '180px',
              minWidth: '200px',
              width: '30%',
              data: {
                message: message,
              },
            })
            .afterClosed()
            .subscribe(() => {
              this.dialogRef.close(true);
            });
        },
        (error: ErrorResponse) => {
          this._createLoading = false;
          this.dialog
            .open(ErrorDialogComponent, {
              disableClose: true,
              height: '180px',
              minWidth: '200px',
              width: '30%',
              data: {
                error: error.message,
              },
            })
            .afterClosed()
            .subscribe(() => {
              this.cd.detectChanges();
            });
        }
      );
    } else {
      this.productService.putSharedAggregationLicences(obj).subscribe(
        (res: SharedLicencesUpdateResponse) => {
          this._createLoading = false;
          this.actionSuccessful = true;
          this.dialog
            .open(SuccessDialogComponent, {
              disableClose: true,
              height: '180px',
              minWidth: '200px',
              width: '30%',
              data: {
                message: 'Licenses have been successfully shared',
              },
            })
            .afterClosed()
            .subscribe(() => {
              this.dialogRef.close(true);
            });
        },
        (error: ErrorResponse) => {
          this._createLoading = false;
          this.dialog
            .open(ErrorDialogComponent, {
              disableClose: true,
              height: '180px',
              minWidth: '200px',
              width: '30%',
              data: {
                error: error.message,
              },
            })
            .afterClosed()
            .subscribe(() => {
              this.cd.detectChanges();
            });
        }
      );
    }
  }
}
