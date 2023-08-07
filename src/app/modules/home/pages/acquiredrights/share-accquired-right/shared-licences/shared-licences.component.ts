import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {
  AbstractControl,
  ControlContainer,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSelect, MatSelectChange } from '@angular/material/select';
import {
  LicenseDatum,
  SharedDataLicences,
  SharedDatum,
  SharedLicencesParams,
} from '@core/modals';
import { CommonService, ProductService } from '@core/services';
import { AccountService } from '@core/services/account.service';
import { LOCAL_KEYS } from '@core/util/constants/constants';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { DeleteConfirmationComponent } from '../delete-confirmation/delete-confirmation.component';
import { LicenseServiceService } from '../license-service.service';
const SCOPE_LIST: string = 'scopeList';
const CURRENT_SCOPE = 'scope';
@Component({
  selector: 'app-shared-licences',
  templateUrl: './shared-licences.component.html',
  styleUrls: ['./shared-licences.component.scss'],
})
export class SharedLicencesComponent implements OnInit {
  @Input('index') index: number;
  @Input('data') data: any;
  @Input() sharedData: SharedDataLicences;
  @Output('removeShared') remove: EventEmitter<number> =
    new EventEmitter<number>();
  @Output('updateLicense') updateLicense: EventEmitter<boolean> =
    new EventEmitter<boolean>();
  @Output('scopeChange') scopeChange = new EventEmitter<{
    selectedScope: string;
    index: number;
  }>();

  form: FormGroup;
  sharedLicencesData: any;
  _loading: boolean = false;
  scopesList: string[];
  incomingScopesList: string[];
  static availableLicences: number = 0;
  scopesListFromService: string[];
  static sharedLicencesNumber: any;
  static oldTotal: number = 0;
  prevScope: string;
  // private unsubscribe$: Subject<void> = new Subject();
  constructor(
    private container: ControlContainer,
    private accountService: AccountService,
    private dialog: MatDialog,
    private cs: CommonService,
    private ps: ProductService,
    private licenseService: LicenseServiceService
  ) {}

  ngOnInit(): void {
    //to get total Avaialble Licences from parent

    SharedLicencesComponent.availableLicences = this.data?.available_licenses;
    //FormGroup
    this.form = (this.container.control?.get('shared_licences') as FormGroup)
      ?.controls[this.index] as FormGroup;
    // console.log(this.form);
    // to get the Scopes from FormArray in a array scopesListFromService
    this.scopesListFromService = (
      this.container.control.get('shared_licences') as FormArray
    )?.value?.map((x) => x.scope);

    // this.form
    //   .get('sharedLicencesNum')
    //   .valueChanges.pipe(
    //     debounceTime(1000),
    //     takeUntil(this.unsubscribe$)
    //   )
    //   .subscribe((value) => {
    //     const currentValue = parseInt(value);
    //       this.licenseService.decreaseAvailableLicenses(
    //         currentValue
    //       );

    //   });

    this.getScopesList();
  }

  static totalLessThanAvailLic(controlForm: FormControl) {
    const formGroup = controlForm.parent as FormGroup;
    const formArray: FormArray = formGroup?.parent as FormArray;
    let newAvailable = 0;
    SharedLicencesComponent.sharedLicencesNumber?.forEach((control) => {
      SharedLicencesComponent.oldTotal += control;
    });
    //Total available Licenses
    let threshold =
      SharedLicencesComponent.oldTotal +
      SharedLicencesComponent.availableLicences;
    let currentTotal = formArray
      ?.getRawValue()
      ?.reduce(
        (sum: number, val: { scope: string; sharedLicencesNum: string }) => {
          sum += +val.sharedLicencesNum;
          return sum;
        },
        0
      );
    newAvailable = threshold - currentTotal;
    // console.log(
    //   `total:${SharedLicencesComponent.oldTotal},currentTotal:${currentTotal},threshold:${threshold},newAvailable:${newAvailable}`
    // );
    if (newAvailable < 0) {
      return { totalLessThanAvailLic: true };
    } else {
      return null;
    }
  }

  static addNewSharedLicencse(data: SharedDatum): FormGroup {
    return new FormGroup({
      scope: new FormControl(data?.scope || '', Validators.required),
      sharedLicencesNum: new FormControl(
        data?.shared_licenses?.toString() || '',
        [
          // SharedLicencesComponent.totalLessThanAvailLic,
          Validators.min(0),
          // Validators.compose([
          //   (control: AbstractControl) => {
          //     if (data?.shared_licenses < 1) {
          //       return { sharedError: 'Shared licenses must be greater than 0' };
          //     }
          //     return null;
          //   },
          //   Validators.min(data?.shared_licenses || 1)
          // ]),
          Validators.required,
          Validators.pattern('^[0-9]*$'),
        ]
      ),
    });
  }

  get sharedLicences(): FormControl {
    return this.form?.get('sharedLicencesNum') as FormControl;
  }

  // handleKeyDown(event: KeyboardEvent) {
  //   const inputElement = event.target as HTMLInputElement;

  //   if (
  //     (event.key === 'Backspace' || event.key === 'Delete') &&
  //     inputElement.value.length === 0
  //   ) {
  //     // handle backspace or delete key here
  //     const sharedLicencesNum = this.form.get('sharedLicencesNum').value;
  //     console.log(event);
  //     this.licenseService.updateAvailableLicenses(sharedLicencesNum);
  //   }
  // }

  triggerUpdate() {
    this.updateLicense.emit(true);
  }

  getScopesList(): void {
    this._loading = true;
    if (this.cs.getLocalData(SCOPE_LIST)) {
      try {
        this._loading = false;
        this.scopesList = JSON.parse(this.cs.getLocalData(SCOPE_LIST));
        const currentScope = this.cs.getLocalData(CURRENT_SCOPE);
        this.scopesList = this.scopesList?.filter(
          (scope) => scope !== currentScope
        );
        this.scopesList.sort();
        const obj: SharedLicencesParams = {
          scope: this.cs.getLocalData(LOCAL_KEYS.SCOPE),
          sku: this.data?.SKU,
        };
        this.ps
          .getSharedAccquiredLicences(obj)
          .subscribe((licenseData: SharedDataLicences) => {
            this.sharedLicencesData = licenseData?.shared_data;
            if (this.sharedLicencesData?.length !== 0) {
              return (this.incomingScopesList = this.sharedLicencesData?.map(
                (sharedData: SharedDatum) => sharedData.scope
              ));
            }
          });
        // console.log(this.scopesListFromService, this.sharedData);
        // condition added to filter scopes whose shared_licenses value is 0 from array
        this.sharedData.shared_data = this.sharedData?.shared_data?.filter(
          (item) => item.shared_licenses !== 0
        );
        if (
          JSON.stringify(this.scopesListFromService) ===
          JSON.stringify(
            this.sharedData?.shared_data?.map((data: SharedDatum) => data.scope)
          )
        ) {
          return;
        } else {
          this.scopesList = this.scopesList?.filter(
            (data) => !this.scopesListFromService?.includes(data)
          );
          return;
        }
      } catch (e) {
        console.log(e);
      }
    }
    this.accountService.getScopesList().subscribe(
      (res) => {
        this._loading = false;
        this.scopesList = res.scopes?.map((scope) => scope.scope_code);
        const currentScope = this.cs.getLocalData(CURRENT_SCOPE);
        this.scopesList = this.scopesList?.filter(
          (scopes) => scopes !== currentScope
        );
        this.scopesList.sort();
        // console.log(this.scopesList);
        this.cs.setLocalData(
          SCOPE_LIST,
          JSON.stringify(this.scopesList.sort())
        );
        const obj: SharedLicencesParams = {
          scope: this.cs.getLocalData(LOCAL_KEYS.SCOPE),
          sku: this.data?.SKU,
        };
        this.ps
          .getSharedAccquiredLicences(obj)
          .subscribe((licenseData: SharedDataLicences) => {
            this.sharedLicencesData = licenseData?.shared_data;
            if (this.sharedLicencesData?.length !== 0) {
              return (this.incomingScopesList = this.sharedLicencesData?.map(
                (sharedData: SharedDatum) => sharedData.scope
              ));
            }
          });
      },
      (err) => {
        this._loading = false;
        console.log('Error fetching list of scopes ', err);
      }
    );
  }

  removeShared(): void {
    this.remove.emit(this.index);
  }

  // onSelectOpen(event: MatSelectChange, select: MatSelect) {
  //   if (event) {
  //     let currentScopeValue = select.value;
  //     //scopes from
  //     let scopesTofilter = this.incomingScopesList;
  //     scopesTofilter = scopesTofilter?.filter(
  //       (scope) => currentScopeValue !== scope
  //     );
  //     console.log(currentScopeValue, scopesTofilter, select.options);
  //     // select.options.filter((scope) => scopesTofilter.includes(scope));
  //     // select.options.forEach((option) => {
  //     //   if (option.value.startsWith('A')) {
  //     //     option.disabled = true;
  //     //   }
  //     // });
  //   }
  // }

  confirmRemove(): void {
    let dialog = this.dialog.open(DeleteConfirmationComponent, {
      disableClose: true,
      height: '180px',
      width: '30%',
      minWidth: '250px',
      data: this.index,
    });

    dialog
      .afterClosed()
      .subscribe((res: boolean) => res && this.removeShared());
  }

  // ngOnDestroy() {
  //   this.unsubscribe$.next();
  //   this.unsubscribe$.complete();
  // }
}
