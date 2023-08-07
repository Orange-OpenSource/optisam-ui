import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit,
} from '@angular/core';
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
  SharedDataLicences,
  SharedDatum,
  SharedLicData,
  SharedLicencesParams,
  SharedLicencesUpdateParams,
  SharedLicencesUpdateResponse,
} from '@core/modals';
import { CommonService, ProductService } from '@core/services';
import { AccountService } from '@core/services/account.service';
import { LOCAL_KEYS } from '@core/util/constants/constants';
import { Observable } from 'rxjs';
import { ErrorDialogComponent } from './error-dialog/error-dialog.component';
import { LicenseServiceService } from './license-service.service';
import { SharedLicencesComponent } from './shared-licences/shared-licences.component';
import { SuccessDialogComponent } from './success-dialog/success-dialog.component';
@Component({
  selector: 'app-share-accquired-right',
  templateUrl: './share-accquired-right.component.html',
  styleUrls: ['./share-accquired-right.component.scss'],
})
export class ShareAccquiredRightComponent implements OnInit {
  sharedAccquiredRights: FormGroup;
  sharedLicencesData: SharedDataLicences;
  licence_data: LicenseDatum[];
  originalAvailableLicenses: number;
  availableLicenses$: Observable<number>;
  sharedDataValue: number;
  modifiedData: any;
  new_data: any;
  result: any = {};
  _createLoading: boolean = false;
  actionSuccessful: boolean = false;
  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data,
    private productService: ProductService,
    private accountService: AccountService,
    public dialog: MatDialog,
    private cd: ChangeDetectorRef,
    private cs: CommonService,
    private router: Router,
    private dialogRef: MatDialogRef<ShareAccquiredRightComponent>,
    private sharedLicense: LicenseServiceService
  ) {}

  ngOnInit(): void {
    this.sharedAccquiredRights = this.fb.group({
      shared_licences: this.fb.array([], Validators.required),
    });
    this.originalAvailableLicenses = this.data?.available_licenses;
    this.sharedLicense.setAvailableLicenses(this.originalAvailableLicenses);
    //Behavior Subject for Shared Licenses

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
    this.availableLicenses$ = this.sharedLicense.getAvailableLicense();
    this.getSharedLicences();

    if (!this.sharedDataValue) this.addNewSharedAcc();
  }

  get shared_licences(): FormArray {
    return this.sharedAccquiredRights.controls['shared_licences'] as FormArray;
  }

  totalLessThanAvailLic(control: FormArray) {
    let total = 0;
    control.controls.forEach((control) => {
      total += Number(control.value?.sharedLicencesNum);
    });
    if (total >= this.data?.available_licenses) {
      return { totalLessThanAvailLic: true };
    }
    return null;
  }

  addNewSharedAcc(data: SharedDatum = null): void {
    // console.log(data)
    if (data) {
      if (data.shared_licenses === 0) {
        return;
      }
    }
    //adding code to add
    this.shared_licences.push(
      SharedLicencesComponent.addNewSharedLicencse(data)
    );
  }

  getSharedLicences(): void {
    const obj: SharedLicencesParams = {
      scope: this.cs.getLocalData(LOCAL_KEYS.SCOPE),
      sku: this.data?.SKU,
    };
    this.productService
      .getSharedAccquiredLicences(obj)
      .subscribe((licenseData: SharedDataLicences) => {
        this.sharedLicencesData = licenseData;
        if (this.sharedLicencesData?.shared_data?.length !== 0) {
          const sharedArray = this.sharedAccquiredRights.get(
            'shared_licences'
          ) as FormArray;
          (this.sharedLicencesData?.shared_data || []).forEach(
            (x: SharedDatum) => this.addNewSharedAcc(x)
          );
        }
      });
  }

  removeSharedLicence(index: number): void {
    if (this.sharedDataValue === 0) {
      const formArrayValues = this.shared_licences?.value;
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
      const item = this.shared_licences.at(index);
      const value = item.value;
      // console.log(currentTotal, value?.sharedLicencesNum);
      this.sharedLicense.setAvailableLicenses(
        currentTotal + Number(value?.sharedLicencesNum)
      );
    } else {
      // console.log(this.new_data);
      const item = this.shared_licences.at(index);
      const value = item.value;
      if (this.new_data[value?.scope]) {
        const pctValue = Number(this.new_data[value?.scope]);
        this.new_data.availableLicence += pctValue;
        this.new_data[value.scope] = 0;
      }
      this.sharedLicense.setAvailableLicenses(this.new_data?.availableLicence);
    }
    // this.updateSharedLicensesNumber();
    this.shared_licences.removeAt(index);
  }

  doActionWhenChangeinScope(obj: { selectedScope: string; index: number }) {
    if (this.sharedDataValue === 0) {
      return;
    } else {
      console.log(obj, this.new_data, this.shared_licences?.value);
    }
  }

  updateSharedLicensesNumber() {
    if (this.sharedDataValue === 0) {
      const formArrayValues = this.shared_licences?.value;
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
      // console.log(sharedDataValue, finalTotal, this.data?.available_licenses);
      this.sharedLicense.setAvailableLicenses(finalTotal - totalSharedLicenses);
    } else {
      const currentVal = this.shared_licences?.value;

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

      //condition added if the scope has changed or not
      this.result = this.shared_licences.value?.reduce((acc, obj) => {
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

  createShare(): void {
    //FormArray
    this._createLoading = true;
    this.licence_data = this.sharedAccquiredRights.value?.shared_licences?.map(
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

    const obj: SharedLicencesUpdateParams = {
      sku: this.data?.SKU,
      scope: localStorage.getItem('scope'),
      license_data: this.licence_data,
    };

    if (Object.values(this.result)[0] === 0) {
      this.productService.putSharedAccquiredLicences(obj).subscribe(
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
      this.productService.putSharedAccquiredLicences(obj).subscribe(
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
