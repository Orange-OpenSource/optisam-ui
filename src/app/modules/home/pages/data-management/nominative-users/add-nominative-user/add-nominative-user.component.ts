import { CommonService } from '@core/services/common.service';
import {
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import {
  ErrorResponse,
  DashboardEditorListParams,
  DashboardEditorListResponse,
  ListProductQueryParams,
  Product,
  ProductListResponse,
  NominativeUserProductBody as NominativeUserBody,
  NominativeUserDetails,
  UserDetailFormType,
  GetAggregationParams,
  NominativeUserList,
  ProductType,
  NominativeUserType,
} from '@core/modals';
import { DataManagementService } from '@core/services/data-management.service';
import { ProductService } from '@core/services/product.service';
import { LOCAL_KEYS } from '@core/util/constants/constants';
import { CommonPopupComponent } from '@shared/dialog/common-popup/common-popup.component';
import { SharedService } from '@shared/shared.service';
import { Observable, Subscription } from 'rxjs';
import { map, pluck, tap } from 'rxjs/operators';
import { SubSink } from 'subsink';
import { SingleNominativeUserComponent } from './single-nominative-user/single-nominative-user.component';
import { ISOFormat, updateValidity } from '@core/util/common.functions';
import { BrowseFileUploadComponent } from './browse-file-upload/browse-file-upload.component';
import { FileProcessedComponent } from './file-processed/file-processed.component';
import { AddConcurrentUsersDialogComponent } from '../../concurrent-users/add-concurrent-users-dialog/add-concurrent-users-dialog.component';
import { HighlightSpanKind } from 'typescript';

type NominativeUserTypeList = { name: string; value: NominativeUserType };

@Component({
  selector: 'app-add-nominative-user',
  templateUrl: './add-nominative-user.component.html',
  styleUrls: ['./add-nominative-user.component.scss'],
})
export class AddNominativeUserComponent
  implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('nominativeFileUpload')
  fileUploadInput: ElementRef<HTMLInputElement>;
  @Output('isSuccess') isSuccess: EventEmitter<boolean> = new EventEmitter();
  @Input('data') editData: NominativeUserList = null;
  @Input() activeTitle: ProductType;
  uploadedPercent: number = 40;

  nominativeUserTypeList: NominativeUserTypeList[] = [
    {
      name: 'NOMINATIVE_USER.FIELD.PRODUCT',
      value: NominativeUserType.product,
    },
    {
      name: 'NOMINATIVE_USER.FIELD.AGGREGATION',
      value: NominativeUserType.aggregation,
    },
  ];
  isSaving: boolean = false;
  userUploading$: Subscription;
  fileUploading$: Subscription;
  get isEdit(): boolean {
    return this.editData !== null;
  }

  nominativeUserForm: FormGroup;
  aggregationForm: FormGroup = this.fb.group({
    aggregationName: this.fb.control('', [Validators.required]),
    userDetails: this.fb.array([], [Validators.required]),
  });

  productForm: FormGroup = this.fb.group({
    productEditor: this.fb.control('', [Validators.required]),
    productName: this.fb.control('', [Validators.required]),
    productVersion: this.fb.control(''),
    userDetails: this.fb.array([], [Validators.required]),
  });
  subs: SubSink = new SubSink();
  productEditors$: Observable<string[] | ErrorResponse>;
  aggregationList$: Observable<any>;
  latestProducts: string[] = [];
  loadingProducts: boolean = true;
  latestProducts$!: Observable<string[]>;

  // Getters -- start ------------------------------------
  get type(): FormControl {
    return this.nominativeUserForm?.get('type') as FormControl;
  }

  get aggregation(): FormGroup {
    return this.nominativeUserForm?.get('aggregation') as FormGroup;
  }

  get product(): FormGroup {
    return this.nominativeUserForm?.get('product') as FormGroup;
  }

  get productType(): NominativeUserType {
    return NominativeUserType.product;
  }

  get isProductType(): boolean {
    return this.type.value === this.productType;
  }

  get aggregationType(): NominativeUserType {
    return NominativeUserType.aggregation;
  }

  get userDetails(): FormArray {
    const form: FormGroup =
      this.type.value === this.productType
        ? this.productForm
        : this.aggregationForm;
    return form?.get('userDetails') as FormArray;
  }

  get productEditor(): FormControl {
    const type: string =
      this.type.value === this.productType ? 'product' : 'aggregation';
    return this.nominativeUserForm
      ?.get(type)
      ?.get('productEditor') as FormControl;
  }

  get productName(): FormControl {
    return this.nominativeUserForm
      ?.get('product')
      ?.get('productName') as FormControl;
  }

  get aggregationName(): FormControl {
    return this.aggregation?.get('aggregationName') as FormControl;
  }

  get productVersion(): FormControl {
    return this.nominativeUserForm
      ?.get('product')
      ?.get('productVersion') as FormControl;
  }

  get aggregationId(): FormControl {
    return this.nominativeUserForm
      ?.get('aggregation')
      ?.get('aggregationName') as FormControl;
  }

  get isGeneralInfoValid(): boolean {
    const form = this.nominativeUserForm.get(
      this.type.value === this.productType ? 'product' : 'aggregation'
    ) as FormGroup;

    const validSet = [];
    for (let control in form.controls)
      if (control !== 'userDetails')
        validSet.push((form.get(control) as FormControl).valid);
    return !validSet.includes(false);
  }

  // Getters -- end ---------------------------------------

  constructor(
    private fb: FormBuilder,
    private dm: DataManagementService,
    private productService: ProductService,
    private cs: CommonService,
    private cd: ChangeDetectorRef,
    private sharedService: SharedService,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<AddConcurrentUsersDialogComponent>
  ) { }
  ngAfterViewInit(): void {
    // this.checkForDisable();
  }

  ngOnInit(): void {
    this.fetchData();
    this.formInit();
    this.changeEvents();
    this.subs.add(
      this.dm.isRemoveUserTriggered().subscribe((index: number) => {
        this.userDetails.removeAt(index);
      })
    );
  }

  private checkForDisable(): void {
    if (this.editData !== null) {
      this.productName?.disable();
      this.productVersion?.disable();
      this.aggregationName?.disable();
      this.cd.detectChanges();
      return;
    }
  }

  private formInit(): void {
    this.nominativeUserForm = this.fb.group({
      type: this.fb.control(
        {
          value: this.editData?.aggregation_id
            ? NominativeUserType.aggregation
            : this.activeTitle === ProductType.INDIVIDUAL
              ? NominativeUserType.product
              : NominativeUserType.aggregation,
          disabled: true,
        },
        [Validators.required]
      ),
      aggregation: this.aggregationForm,
      product: this.productForm,
    });
    this.setInputData();
  }

  private setInputData(): void {
    if (!this.editData) {
      if (this.activeTitle === ProductType.INDIVIDUAL)
        this.nominativeUserForm.removeControl('aggregation');
      else this.nominativeUserForm.removeControl('product');
      return;
    }
    if (this.editData?.aggregation_id) {
      // aggregation
      this.nominativeUserForm.removeControl('product');
      this.nominativeUserForm.patchValue({
        type: NominativeUserType.aggregation,
        aggregation: {
          productEditor: this.editData?.editor || '',
          aggregationName: this.editData.aggregation_id || '',
        },
      });
    } else {
      //product
      this.nominativeUserForm.removeControl('aggregation');
      this.nominativeUserForm.patchValue({
        type: NominativeUserType.product,
        product: {
          productEditor: this.editData?.editor || '',
          productName: this.editData.product_name,
          productVersion: this.editData.product_version,
        },
      });
    }
    this.addNewNominativeUser({
      activation_date: this.editData.activation_date,
      email: this.editData.user_email,
      first_name: this.editData.first_name,
      profile: this.editData.profile,
      user_name: this.editData.user_name,
    });
  }

  private fetchData(): void {
    const param: DashboardEditorListParams = {
      scopes: this.cs.getLocalData(LOCAL_KEYS.SCOPE),
    };
    this.productEditors$ = this.productService
      .getDashboardEditorList(param)
      .pipe(pluck('editors'));

    const query: GetAggregationParams = {
      scope: this.cs.getLocalData(LOCAL_KEYS.SCOPE),
      page_size: 200,
      page_num: 1,
      sort_by: 'aggregation_name',
      sort_order: 'asc',
    };

    this.aggregationList$ = this.productService
      .getAggregationListNew(query)
      .pipe(pluck('aggregations'));
  }

  private changeEvents(): void {
    this.type?.valueChanges.subscribe((type: NominativeUserType) => {
      this.addNewNominativeUser();
      if (
        type === this.aggregationType &&
        !this.nominativeUserForm?.get('aggregation')
      ) {
        this.productForm.reset();
        (this.productForm?.get('userDetails') as FormArray).clear();
        this.nominativeUserForm.removeControl('product');
        this.nominativeUserForm.addControl('aggregation', this.aggregationForm);
        this.cd.detectChanges();
        return;
      }
      this.aggregationForm.reset();
      (this.aggregationForm?.get('userDetails') as FormArray).clear();
      this.nominativeUserForm.removeControl('aggregation');
      this.nominativeUserForm.addControl('product', this.productForm);
      this.cd.detectChanges();
    });

    this.productEditor?.valueChanges.subscribe((editor: string) => {
      this.getLatestProducts(editor);
    });
  }

  private gotResponse(res: any): void {
    this.sharedService.commonPopup({
      title: "SUCCESS",
      singleButton: true,
      buttonText: "OK",
      message: 'The user(s) has been added!',
    }).afterClosed().subscribe(() => {
      this.dialogRef.close(true);
    });
  }

  onSubmit(): void {
    if (this.isSaving) return;
    this.isSaving = true;
    if (this.nominativeUserForm.invalid) {
      this.nominativeUserForm.markAllAsTouched();
      this.dm.updateUserDetailsValidity();
      return;
    }
    const body: NominativeUserBody = {
      ...(this.isProductType && {
        editor: this.productEditor.value,
      }),
      aggregation_id: this.isProductType ? 0 : this.aggregationId.value,
      scope: this.cs.getLocalData(LOCAL_KEYS.SCOPE),
      product_name: this.isProductType ? this.productName.value : '',
      product_version: this.isProductType ? this.productVersion.value : '',
      user_details: this.getUserDetails(),
    };

    // create data into file
    const xlsxData: File = this.dm.exportToExcelBlob(body.user_details, 'nominative_user', 'Nominative_User');
    let formData = new FormData();
    formData.append('file', xlsxData);
    formData.append('scope', this.cs.getLocalData(LOCAL_KEYS.SCOPE));
    if (this.type.value === NominativeUserType.product) {
      formData.append('editor', this.productEditor.value);
      formData.append('product_name', this.productName.value);
      formData.append('product_version', this.productVersion.value);
    }

    if (this.type.value === NominativeUserType.aggregation) {
      this.aggregationName.value &&
        formData.append('aggregation_id', String(this.aggregationName.value));
    }

    this.fileUploading$ = this.dm.uploadNominativeUserData(formData).subscribe(
      (res: any) => {
        if (res === true)
          this.gotResponse(res);

      },
      (e) => {
        this.sharedService.commonPopup({
          title: "ERROR",
          buttonText: "OK",
          singleButton: true,
          message: e.message
        })
      }
    );


    return;


    const actionFunction: Function = this.editData
      ? this.productService.updateNominativeUser.bind(this.productService)
      : this.productService.createNominativeUser.bind(this.productService);

    actionFunction(body).subscribe(
      ({ status }: { status: boolean }) => {
        this.isSaving = false;
        if (status) {
          this.sharedService
            .commonPopup({
              title: 'NOMINATIVE_USER.TITLE.SUCCESS',
              message: this.editData
                ? 'NOMINATIVE_USER.MESSAGE.USERS_UPDATED_SUCCESS'
                : 'NOMINATIVE_USER.MESSAGE.USERS_ADDED_SUCCESS',
              messageVariable: { userCount: body.user_details.length },
              singleButton: true,
              buttonText: 'NOMINATIVE_USER.BUTTON.OK',
            })
            .afterClosed()
            .subscribe((res: boolean) => {
              this.isSuccess.emit(true);
            });
        } else {
          console.log('There is some problem creating the users!');
          this.isSuccess.emit(false);
        }
      },
      (e: ErrorResponse) => {
        this.isSaving = false;
        let message: string = '';
        switch (e.code) {
          case 5:
            message = 'NOMINATIVE_USER.ERROR.SERVER_ERROR';
            break;

          default:
            message = e.message;
            break;
        }

        this.sharedService
          .commonPopup({
            title: 'NOMINATIVE_USER.TITLE.ERROR',
            message,
            singleButton: true,
            buttonText: 'COMMON.BUTTON.OK',
          })
          .afterClosed()
          .subscribe(() => {
            this.isSuccess.emit(false);
          });
      }
    );
  }

  addNewNominativeUser(data: NominativeUserDetails = null): void {
    this.userDetails.push(
      SingleNominativeUserComponent.addNominativeUserGroup(data)
    );

    updateValidity(this.nominativeUserForm);
  }

  removeUserSection(index: number): void {
    this.userDetails.removeAt(index);
  }

  private getUserDetails(): NominativeUserDetails[] {
    return (this.userDetails.getRawValue() || []).reduce(
      (ud: NominativeUserDetails[], data: UserDetailFormType) => {
        ud.push(<NominativeUserDetails>{
          first_name: data.firstName,
          email: data.email,
          user_name: data.username,
          profile: data.profile,
          activation_date: data?.activationDate
            ? ISOFormat(new Date(data.activationDate))
            : null,
        });
        return ud;
      },
      []
    );
  }

  private getLatestProducts(editor: string): void {
    const query: ListProductQueryParams = {
      scopes: this.cs.getLocalData(LOCAL_KEYS.SCOPE),
      editor: editor || '',
    };
    this.latestProducts$ = this.productService.getProductList(query).pipe(
      pluck('products'),
      map((product: Product[]) =>
        product.map((product: Product) => product.name)
      )
    );
  }

  browseFileUpload(): void {
    this.dialog
      .open(BrowseFileUploadComponent, {
        disableClose: true,
        minWidth: '400px',
        maxWidth: '800px',
        data: {
          formData: this.nominativeUserForm.value,
          type: this.type.value,
        },
      })
      .afterClosed()
      .subscribe((res: boolean) => {
        res && this.dataImported();
      });
  }

  dataImported(): void {
    this.dialog
      .open(FileProcessedComponent, {
        disableClose: true,
        minWidth: '400px',
        maxWidth: '800px',
      })
      .afterClosed()
      .subscribe((res: boolean) => {
        res && this.dm.triggerNavToLog(res);
        this.dialogRef.close(true);
      });
  }

  private readCSV(file): void {
    const LINE_DELIMITER: string = '\r\n';
    const COLUMN_DELIMITER: string = ',';
    const DEFAULT_HEADERS: string[] = [
      'first_name',
      'user_name',
      'profile',
      'email',
      'activation_date',
    ];

    if (file.type && !file.type.startsWith('text/csv')) {
      this.sharedService.commonPopup({
        title: 'NOMINATIVE_USER.TITLE.ERROR',
        message: 'NOMINATIVE_USER.ERROR.CSV_FILE_TYPE_ERROR',
        singleButton: true,
        buttonText: 'COMMON.BUTTON.OK',
      });
      return;
    }

    let csv;
    let fileReader = new FileReader();
    fileReader.readAsText(file, 'UTF-8');
    fileReader.onload = () => {
      try {
        csv = fileReader.result.toString();
      } catch (error) {
        csv = null;
      }
      if (csv) {
        let headers: string[] = null;
        let dataObject: NominativeUserDetails[] = [];
        for (let line of csv.split(LINE_DELIMITER)) {
          if (line != '') {
            line = line.trim();
            // Sanitize the row if there is extra quotes symbol.
            if (line.startsWith('"') && line.endsWith('"'))
              line = line.slice(1, line.length - 1);

            if (!headers) {
              headers = (line as string).split(COLUMN_DELIMITER);
              // checking if all necessary headers are available in the file.
              if (
                !headers.every((header: string) =>
                  DEFAULT_HEADERS.includes(header)
                )
              ) {
                this.sharedService.commonPopup({
                  title: 'NOMINATIVE_USER.TITLE.ERROR',
                  message: 'NOMINATIVE_USER.ERROR.CSV_EMPTY',
                  singleButton: true,
                  buttonText: 'COMMON.BUTTON.OK',
                });
                break;
              }
              continue;
            }
            const dataRow: string[] = (line as string).split(COLUMN_DELIMITER);
            dataObject.push(
              headers.reduce(
                (userDetails: any, header: string, key: number) => {
                  userDetails = {
                    ...userDetails,
                    [header]: dataRow[key],
                  };
                  // adding flag for file insertion;
                  if (key === headers.length - 1)
                    userDetails['fileInsertion'] = true;
                  return userDetails;
                },
                {}
              )
            );
          }
        }
        if (!dataObject.length) {
          this.sharedService.commonPopup({
            title: 'NOMINATIVE_USER.TITLE.ERROR',
            message: 'NOMINATIVE_USER.ERROR.CSV_EMPTY',
            singleButton: true,
            buttonText: 'COMMON.BUTTON.OK',
          });
          return;
        }

        const emptyObject = {
          username: '',
          firstName: '',
          email: '',
          profile: '',
          activationDate: null,
        };
        if (
          JSON.stringify(this.userDetails.value[0]) ===
          JSON.stringify(emptyObject)
        ) {
          this.userDetails.removeAt(0); // remove first element if it's empty
        }

        this.addUsersFromData(dataObject);

        return;
      }

      this.sharedService.commonPopup({
        title: 'NOMINATIVE_USER.TITLE.ERROR',
        message: 'NOMINATIVE_USER.ERROR.CSV_EMPTY',
        singleButton: true,
        buttonText: 'COMMON.BUTTON.OK',
      });
    };
  }

  addUsersFromData(data: NominativeUserDetails[]): void {
    try {
      data.forEach((userDetails: NominativeUserDetails) => {
        this.addNewNominativeUser(userDetails);
      });

      this.sharedService.commonPopup({
        title: 'NOMINATIVE_USER.TITLE.SUCCESS',
        message: 'NOMINATIVE_USER.MESSAGE.USERS_ADDED_SUCCESS',
        messageVariable: { userCount: data.length },
        singleButton: true,
        buttonText: 'COMMON.BUTTON.OK',
      });
    } catch (e) {
      this.sharedService.commonPopup({
        title: 'NOMINATIVE_USER.TITLE.ERROR',
        message: 'NOMINATIVE_USER.ERROR.USER_ADD_ERROR',
        singleButton: true,
        buttonText: 'COMMON.BUTTON.OK',
      });
    }
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
