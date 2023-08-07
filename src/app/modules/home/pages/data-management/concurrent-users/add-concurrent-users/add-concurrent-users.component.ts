import { keyframes } from '@angular/animations';
import {
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
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
import { MatDialog } from '@angular/material/dialog';
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
  ConcurrentUserBody,
  ConcurrentUserList,
  AggregationSingle,
} from '@core/modals';
import { CommonService } from '@core/services';
import { DataManagementService } from '@core/services/data-management.service';
import { ProductService } from '@core/services/product.service';
import { COMMON_REGEX, LOCAL_KEYS } from '@core/util/constants/constants';
import { CommonPopupComponent } from '@shared/dialog/common-popup/common-popup.component';
import { SharedService } from '@shared/shared.service';
import { Observable } from 'rxjs';
import { map, pluck, tap } from 'rxjs/operators';
import { SubSink } from 'subsink';

type userTypeList = { name: string; value: UserType };
enum UserType {
  product = 'product',
  aggregation = 'aggregation',
}

const MIN_USERS_LIMIT = 1;

@Component({
  selector: 'app-add-concurrent-users',
  templateUrl: './add-concurrent-users.component.html',
  styleUrls: ['./add-concurrent-users.component.scss'],
})
export class AddConcurrentUsersComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  @ViewChild('nominativeFileUpload')
  fileUploadInput: ElementRef<HTMLInputElement>;
  @Output('isSuccess') isSuccess: EventEmitter<boolean> = new EventEmitter();
  @Input() data: ConcurrentUserList = null;
  @Input() activeTitle: string = 'CONCURRENT_USER.TAB.INDIVIDUAL';

  userTypeList: userTypeList[] = [
    {
      name: 'NOMINATIVE_USER.FIELD.PRODUCT',
      value: UserType.product,
    },
    {
      name: 'NOMINATIVE_USER.FIELD.AGGREGATION',
      value: UserType.aggregation,
    },
  ];

  concurrentUserForm: FormGroup;
  aggregationForm: FormGroup = this.fb.group({
    aggregationName: this.fb.control('', [Validators.required]),
    team: this.fb.control('', []),
    numberOfUsers: this.fb.control('', [
      Validators.required,
      Validators.pattern(COMMON_REGEX.ONLY_DIGITS),
      Validators.min(MIN_USERS_LIMIT),
    ]),
    profile: this.fb.control('', []),
  });

  productForm: FormGroup = this.fb.group({
    productEditor: this.fb.control('', [Validators.required]),
    productName: this.fb.control('', [Validators.required]),
    productVersion: this.fb.control(''),
    team: this.fb.control('', []),
    numberOfUsers: this.fb.control('', [
      Validators.required,
      Validators.pattern(COMMON_REGEX.DIGITS_WITH_NAV),
      Validators.min(MIN_USERS_LIMIT),
    ]),
    profile: this.fb.control('', []),
  });
  subs: SubSink = new SubSink();
  productEditors$: Observable<string[] | ErrorResponse>;
  aggregationList$: Observable<any>;
  latestProducts: string[] = [];
  loadingProducts: boolean = true;
  latestProducts$!: Observable<string[]>;
  isSaving: boolean = false;

  // Getters -- start ------------------------------------
  get type(): FormControl {
    return this.concurrentUserForm?.get('type') as FormControl;
  }

  get aggregation(): FormGroup {
    return this.concurrentUserForm?.get('aggregation') as FormGroup;
  }

  get aggregationName(): FormControl {
    return this.aggregation?.get('aggregationName') as FormControl;
  }

  get product(): FormGroup {
    return this.concurrentUserForm?.get('product') as FormGroup;
  }

  get productType(): UserType {
    return UserType.product;
  }

  get isProductType(): boolean {
    return this.type.value === this.productType;
  }

  get aggregationType(): UserType {
    return UserType.aggregation;
  }

  get userDetails(): FormArray {
    const form: FormGroup =
      this.type.value === this.productType
        ? this.productForm
        : this.aggregationForm;
    return form.get('userDetails') as FormArray;
  }

  get productEditor(): FormControl {
    return this.concurrentUserForm
      ?.get(this.getType)
      ?.get('productEditor') as FormControl;
  }

  get productName(): FormControl {
    return this.concurrentUserForm
      ?.get('product')
      ?.get('productName') as FormControl;
  }

  get productVersion(): FormControl {
    return this.concurrentUserForm
      ?.get('product')
      ?.get('productVersion') as FormControl;
  }

  get aggregationId(): FormControl {
    return this.concurrentUserForm
      .get('aggregation')
      .get('aggregationName') as FormControl;
  }

  get getType(): string {
    return this.type.value === this.productType ? 'product' : 'aggregation';
  }

  get numberOfUsers(): FormControl {
    return this.concurrentUserForm
      .get(this.getType)
      ?.get('numberOfUsers') as FormControl;
  }

  get team(): FormControl {
    return this.concurrentUserForm
      .get(this.getType)
      ?.get('team') as FormControl;
  }

  get profile(): FormControl {
    return this.concurrentUserForm
      .get(this.getType)
      ?.get('profile') as FormControl;
  }

  // Getters -- end ---------------------------------------

  constructor(
    private fb: FormBuilder,
    private dataManagement: DataManagementService,
    private productService: ProductService,
    private cs: CommonService,
    private cd: ChangeDetectorRef,
    private sharedService: SharedService,
    private dialog: MatDialog
  ) {}
  ngAfterViewInit(): void {
    // this.checkForDisable();
  }

  ngOnInit(): void {
    this.fetchData();
    this.formInit();
    this.changeEvents();
    this.subs.add(
      this.dataManagement.isRemoveUserTriggered().subscribe((index: number) => {
        this.userDetails.removeAt(index);
      })
    );
  }

  private checkForDisable(): void {
    if (this.data !== null) {
      this.productEditor?.disable();
      this.productVersion?.disable();
      this.productName?.disable();
      // this.profile?.disable();
      this.cd.detectChanges();
    }
  }

  private formInit(): void {
    this.concurrentUserForm = this.fb.group({
      type: this.fb.control(
        {
          value: this.data?.aggregation_id
            ? UserType.aggregation
            : this.activeTitle === 'CONCURRENT_USER.TAB.INDIVIDUAL'
            ? UserType.product
            : UserType.aggregation,
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
    if (!this.data) {
      if (this.activeTitle === 'CONCURRENT_USER.TAB.INDIVIDUAL') {
        this.concurrentUserForm.removeControl('aggregation');
        return;
      }
      this.concurrentUserForm.removeControl('product');
      return;
    }

    if (this.data?.is_aggregation) {
      // aggregation
      if (this.activeTitle === 'CONCURRENT_USER.TAB.AGGREGATION')
        this.concurrentUserForm.removeControl('product');
      this.concurrentUserForm.patchValue({
        type: UserType.aggregation,
        aggregation: {
          productEditor: this.data.product_editor || '',
          aggregationName: this.data.aggregation_id || '',
          team: this.data.team,
          numberOfUsers: this.data.number_of_users,
          profile: this.data.profile_user,
        },
      });
    } else {
      //product
      if (this.activeTitle === 'CONCURRENT_USER.TAB.INDIVIDUAL')
        this.concurrentUserForm.removeControl('aggregation');
      this.concurrentUserForm.patchValue({
        type: UserType.product,
        product: {
          productEditor: this.data?.product_editor || '',
          productName: this.data.product_name,
          productVersion: this.data.product_version,
          team: this.data.team,
          numberOfUsers: this.data.number_of_users,
          profile: this.data.profile_user,
        },
      });
    }
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
    this.type.valueChanges.subscribe((type: UserType) => {
      if (
        type === this.aggregationType &&
        !this.concurrentUserForm?.get('aggregation')
      ) {
        this.productForm.reset();
        this.concurrentUserForm.removeControl('product');
        this.concurrentUserForm.addControl('aggregation', this.aggregationForm);
        this.cd.detectChanges();
        return;
      }
      this.aggregationForm.reset();
      this.concurrentUserForm.removeControl('aggregation');
      this.concurrentUserForm.addControl('product', this.productForm);
      this.cd.detectChanges();
    });

    this.productEditor?.valueChanges.subscribe((editor: string) => {
      this.getLatestProducts(editor);
    });
  }

  onSubmit(): void {
    if (this.isSaving) return;
    this.isSaving = true;
    if (this.concurrentUserForm.invalid) {
      this.concurrentUserForm.markAllAsTouched();
      this.dataManagement.updateUserDetailsValidity();
      return;
    }
    const body: ConcurrentUserBody = {
      aggregation_id: this.isProductType ? 0 : this.aggregationId.value,
      scope: this.cs.getLocalData(LOCAL_KEYS.SCOPE),
      product_name: this.isProductType ? this.productName.value : '',
      product_version: this.isProductType ? this.productVersion.value : '',
      number_of_users: Number(this.numberOfUsers.value),
      team: this.team.value,
      profile_user: this.profile.value,
      swidtag: '',
      is_aggregations: !this.isProductType,
      ...(this.isProductType && {
        product_editor: this.productEditor.value,
      }),
      id: this.data?.id || 0,
    };
    const actionFunction: Function = this.data
      ? this.productService.updateConcurrentUer.bind(this.productService)
      : this.productService.createConcurrentUer.bind(this.productService);
    actionFunction(body).subscribe(
      ({ success }: { success: boolean }) => {
        this.isSaving = false;
        //TODO: use proper dialog for success/error
        if (success) {
          this.sharedService
            .commonPopup({
              title: 'CONCURRENT_USER.TITLE.SUCCESS',
              buttonText: 'CONCURRENT_USER.BUTTON.OK',
              message: this.data
                ? 'CONCURRENT_USER.MESSAGE.USER_UPDATED_SUCCESS'
                : 'CONCURRENT_USER.MESSAGE.USER_ADDED_SUCCESS',
              singleButton: true,
            })
            .afterClosed()
            .subscribe(() => this.isSuccess.emit(true));
        } else {
          console.log('There is some problem creating the users!');
          this.isSuccess.emit(false);
        }
      },
      (e: ErrorResponse) => {
        this.isSaving = false;
        //TODO: Fix error dialog (incomplete)
        let message: string = '';
        switch (e.code) {
          case 5:
            message = 'NOMINATIVE_USER.ERROR.SERVER_ERROR';
            break;

          case 12:
            message = 'NOMINATIVE_USER.ERROR.METHOD_NOT_ALLOWED';
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

  removeUserSection(index: number): void {
    this.userDetails.removeAt(index);
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

  restrictNonDigitAndNegative(event: KeyboardEvent): void {
    const digitOnly: RegExp = COMMON_REGEX.DIGITS_WITH_NAV;
    const isBlock: boolean = event.key.match(digitOnly) === null;
    if (isBlock) {
      event.preventDefault();
      return;
    }
  }

  restrictPaste(e: ClipboardEvent): void {
    e.preventDefault();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
