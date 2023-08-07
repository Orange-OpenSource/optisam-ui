import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  ControlContainer,
  FormArray,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import {
  SharedDataLicences,
  SharedDatum,
  SharedLicencesParams,
} from '@core/modals';
import { CommonService, ProductService } from '@core/services';
import { AccountService } from '@core/services/account.service';
import { LOCAL_KEYS } from '@core/util/constants/constants';
import { DeleteConfirmationComponent } from '../../share-accquired-right/delete-confirmation/delete-confirmation.component';
const SCOPE_LIST: string = 'scopeList';
const CURRENT_SCOPE = 'scope';
@Component({
  selector: 'app-shared-aggregations-licences',
  templateUrl: './shared-aggregations-licences.component.html',
  styleUrls: ['./shared-aggregations-licences.component.scss'],
})
export class SharedAggregationsLicencesComponent implements OnInit {
  @Input('index') index: number;
  @Input() data: any;
  @Input() sharedData: SharedDataLicences;
  @Output('removeShared') remove: EventEmitter<number> =
    new EventEmitter<number>();
  @Output('updateLicense') updateLicense: EventEmitter<boolean> =
    new EventEmitter<boolean>();
  form: FormGroup;
  _loading: boolean = false;
  scopesList: string[];
  sharedLicencesData: any;
  incomingScopesList: string[];
  scopesListFromService: string[];
  static availableLicences: number = 0;

  constructor(
    private container: ControlContainer,
    private accountService: AccountService,
    private dialog: MatDialog,
    private cs: CommonService,
    private ps: ProductService
  ) {}
  ngOnInit(): void {
    // console.log(this.data);
    SharedAggregationsLicencesComponent.availableLicences =
      this.data?.available_licenses;
    this.form = (
      this.container.control?.get('sharedAggregationsArray') as FormGroup
    )?.controls[this.index] as FormGroup;
    this.scopesListFromService = (
      this.container.control.get('sharedAggregationsArray') as FormArray
    )?.value?.map((x) => x.scope);
    this.getScopesList();
  }

  // get availableLicences():number{

  //    SharedLicencesComponent.availableLicences=this.avail
  //    console.log(SharedLicencesComponent.availableLicences)
  //    return SharedLicencesComponent.availableLicences

  // }

  static addNewSharedLicencse(data): FormGroup {
    return new FormGroup({
      scope: new FormControl(data?.scope || '', Validators.required),
      sharedLicencesNum: new FormControl(
        data?.shared_licenses?.toString() || '',
        [Validators.min(0), Validators.required, Validators.pattern('^[0-9]*$')]
      ),
    });
  }

  triggerUpdate() {
    this.updateLicense.emit(true);
  }

  get sharedLicences(): FormControl {
    return this.form?.get('sharedLicencesNum') as FormControl;
  }

  getScopesList(): void {
    this._loading = true;
    if (this.cs.getLocalData(SCOPE_LIST)) {
      try {
        this._loading = false;
        this.scopesList = JSON.parse(this.cs.getLocalData(SCOPE_LIST));
        const currentScope = this.cs.getLocalData(CURRENT_SCOPE);
        this.scopesList = this.scopesList?.filter((x) => x !== currentScope);
        this.scopesList.sort();
        const obj: SharedLicencesParams = {
          scope: this.cs.getLocalData(LOCAL_KEYS.SCOPE),
          sku: this.data?.sku,
        };
        this.ps
          .getSharedAccquiredLicences(obj)
          .subscribe((licenseData: SharedDataLicences) => {
            this.sharedLicencesData = licenseData?.shared_data;
            // console.log(this.sharedLicencesData);
            if (this.sharedLicencesData?.length !== 0) {
              return (this.incomingScopesList = this.sharedLicencesData?.map(
                (sharedData: SharedDatum) => sharedData.scope
              ));
            }
          });
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
        this.scopesList = res.scopes?.map((x) => x.scope_code);
        const currentScope = this.cs.getLocalData(CURRENT_SCOPE);
        this.scopesList = this.scopesList?.filter((x) => x !== currentScope);
        this.scopesList.sort();
        this.cs.setLocalData(SCOPE_LIST, JSON.stringify(this.scopesList));
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
}
