import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import {
  EditorNamesResponse,
  ErrorResponse,
  OpenSourceType,
  LicenseType,
  ProductCatalogEditor,
  ProductCatalogEditorListParams,
  ProductCatalogEditorListResponse,
  ProductCatalogProduct,
  ProductCatalogVersion,
  ProductCatalogEditProductData,
  EditorName,
} from '@core/modals';
import { ProductCatalogService } from '@core/services';
import { createPostData } from '@core/util/common.functions';
import { CRUD } from '@core/util/constants/constants';
import { ErrorDialogComponent } from '@shared/error-dialog/error-dialog.component';
import { SharedService } from '@shared/shared.service';
import { SuccessDialogComponent } from '@shared/success-dialog/success-dialog.component';
// import { CloseSourceListComponent } from './product-source/product-close-source/close-source-list/close-source-list.component';
// import { ProductCloseSourceComponent } from './product-source/product-close-source/product-close-source.component';
import { ProductSupportVendorComponent } from './product-support-vendor/product-support-vendor.component';
import { ProductUsefulLinksComponent } from './product-useful-links/product-useful-links.component';
import { ProductVersionComponent } from './product-version/product-version.component';
import { MatSelect } from '@angular/material/select';
import { PRODUCT_RECOMMENDATION } from '@core/util/constants/constants';
import { MatCheckboxChange } from '@angular/material/checkbox';

interface SelectArray {
  key: string;
  value: string;
}

@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateProductComponent implements OnInit {
  @Input('data') data: ProductCatalogProduct = null;
  @Input('crud') crud: CRUD = CRUD.CREATE;
  @ViewChild('searchInput') searchInput: HTMLInputElement;
  productRecommendationList: string[] = PRODUCT_RECOMMENDATION.sort();
  productForm: FormGroup;
  httpLoading: boolean = true;
  editorList: EditorName[] = [];
  filteredEditor: EditorName[] = [];
  id: any;
  productId: any;
  swidId: any;
  data1: ProductCatalogProduct = null;
  delayLoader: any = null;
  searchLoading: boolean = false;
  searchText: string = '';
  loadingEditor: boolean = false;
  constructor(
    private fb: FormBuilder,
    private productCatalogService: ProductCatalogService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private sharedService: SharedService,
    @Inject(MAT_DIALOG_DATA) public updatedData: any,
    private dialogRef: MatDialogRef<CreateProductComponent>,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((res: any) => {
      this.id = res.params.id;
      this.formInit();
      this.getEditorList();
    });

    this.sharedService.httpLoading().subscribe((loadingStatus: boolean) => {
      this.httpLoading = loadingStatus;
    });
  }

  formInit(): void {
    this.productForm = this.fb.group({
      productName: this.fb.control('', [
        Validators.required,
        Validators.maxLength(200),
      ]),
      productEditor: this.fb.control({ value: '', disabled: false }, [
        Validators.required,
      ]),
      productMetric: this.fb.control(''),
      swidTag: this.fb.control(''),
      productVersions: this.fb.array([]),
      productSupportVendor: this.fb.array([]),
      productGeneralInformation: this.fb.control(
        '',
        Validators.maxLength(1000)
      ),
      productContractTips: this.fb.control('', Validators.maxLength(200)),
      productRecommendation: this.fb.control('NONE'),
      productLocation: this.fb.group({
        locationType: ['NONE'],
      }),
      licensing: [LicenseType.NONE],
      opensources: this.fb.control(''),
      closesource: this.fb.control(''),
      OpenSource: this.fb.group({
        openLicenses: [''],
        openLicensesType: [OpenSourceType.none],
      }),

      // productOpenSource: this.fb.group({
      //   isOpenSource: this.fb.control(false),
      //   openSourceType: this.fb.control(OpenSourceType.none),
      //   openLicenses: this.fb.control(''),
      // }),
      // productCloseSource: this.fb.group({
      //   isCloseSource: this.fb.control(false),
      //   closeLicenses: this.fb.array([]),
      // }),
      productUsefulLinks: this.fb.array([]),
    });
    //if id is present in url, then update
    if (this.id) {
      this.crud = this.crudUpdate;
      this.productCatalogService
        .getProductByIdV2(this.id)
        .subscribe((res: any) => {
          this.data1 = res;
          this.productId = res.id;
          this.swidId = res.swidtagProduct;
          while (this.productVersions.length) {
            this.productVersions.removeAt(0);
          }
          while (this.productSupportVendor.length) {
            this.productSupportVendor.removeAt(0);
          }
          while (this.productUsefulLinks.length) {
            this.productUsefulLinks.removeAt(0);
          }
          // while (this.closeLicenses.length) {
          //   this.closeLicenses.removeAt(0);
          // }
          this.patchData(this.data1);
        });
    }
    if (this.crud === this.crudCreate) {
      this.insertInitialControls();
    }
    if (this.data) {
      this.patchData(this.data);
    }
    if (this.updatedData) {
      this.crud = this.crudUpdate;
      while (this.productVersions.length) {
        this.productVersions.removeAt(0);
      }
      while (this.productSupportVendor.length) {
        this.productSupportVendor.removeAt(0);
      }
      while (this.productUsefulLinks.length) {
        this.productUsefulLinks.removeAt(0);
      }
      // while (this.closeLicenses.length) {
      //   this.closeLicenses.removeAt(0);
      // }
      this.patchData(this.updatedData);
    }
  }

  get crudRead(): CRUD {
    return CRUD.READ;
  }
  get crudCreate(): CRUD {
    return CRUD.CREATE;
  }
  get crudUpdate(): CRUD {
    return CRUD.UPDATE;
  }
  get productName(): FormControl {
    return this.productForm.get('productName') as FormControl;
  }
  get productEditor(): FormControl {
    return this.productForm.get('productEditor') as FormControl;
  }
  get productMetric(): FormControl {
    return this.productForm.get('productMetric') as FormControl;
  }
  get swidTag(): FormControl {
    return this.productForm.get('swidTag') as FormControl;
  }
  get productVersions(): FormArray {
    return this.productForm.get('productVersions') as FormArray;
  }
  get productSupportVendor(): FormArray {
    return this.productForm.get('productSupportVendor') as FormArray;
  }
  get productGeneralInformation(): FormControl {
    return this.productForm.get('productGeneralInformation') as FormControl;
  }
  get productContractTips(): FormControl {
    return this.productForm.get('productContractTips') as FormControl;
  }
  get productRecommendation(): FormControl {
    return this.productForm.get('productRecommendation') as FormControl;
  }
  get productLocation(): FormGroup {
    return this.productForm.get('productLocation') as FormGroup;
  }
  // get onPremise(): FormControl {
  //   return this.productLocation.get('onPremise') as FormControl;
  // }
  // get saas(): FormControl {
  //   return this.productLocation.get('saas') as FormControl;
  // }

  get licensingControl(): FormControl {
    return this.productForm.get('licensing') as FormControl;
  }
  // get productOpenSource(): FormGroup {
  //   return this.productForm.get('productOpenSource') as FormGroup;
  // }
  // get isOpenSource(): FormControl {
  //   return this.productOpenSource.get('isOpenSource') as FormControl;
  // }
  // get openLicenses(): FormControl {
  //   return this.productOpenSource.get('openLicenses') as FormControl;
  // }
  get productUsefulLinks(): FormArray {
    return this.productForm.get('productUsefulLinks') as FormArray;
  }

  // get productCloseSource(): FormGroup {
  //   return this.productForm.get('productCloseSource') as FormGroup;
  // }
  // get isCloseSource(): FormControl {
  //   return this.productCloseSource.get('isCloseSource') as FormControl;
  // }
  // get closeLicenses(): FormArray {
  //   return this.productCloseSource.get('closeLicenses') as FormArray;
  // }

  // get currentLocationType(): string {
  //   if (
  //     this.onPremise !== undefined &&
  //     this.saas !== undefined &&
  //     !this.onPremise.value &&
  //     !this.saas.value
  //   ) {
  //     return 'NONE';
  //   }
  //   return this.onPremise.value && this.saas.value
  //     ? 'Both'
  //     : this.onPremise.value
  //     ? 'On Premise'
  //     : 'SAAS';
  // }

  private patchData(data: any): void {
    console.log(data);
    if (!data) return;
    data = this.removeEmptyFromData(data);
    this.productForm.patchValue({
      productName: data?.name,
      productEditor: data?.editorID,
      productMetric: data?.metrics?.length ? data?.metrics[0] : [],
      swidTag: data?.productSwidTag,
      licensing: data?.licensing,
      productGeneralInformation: data.genearlInformation,
      OpenSource: {
        openLicenses: data?.openSource?.openLicences,
        openLicensesType: data?.openSource?.openSourceType,
      },
      productLocation: { locationType: data?.locationType },
      productContractTips: data.contracttTips,
      productRecommendation:
        data?.recommendation === '' ? 'NONE' : data?.recommendation,
    });

    (data?.version || []).forEach((version: ProductCatalogVersion) => {
      this.addVersion(version);
    });
    (data?.usefulLinks || []).forEach((link: string) =>
      this.addUsefulLink(link)
    );
    (data?.supportVendors || []).forEach((vendor: string) =>
      this.addSupportVendor(vendor)
    );

    console.log(this.productForm.value);

    // (data?.closeSource?.closeLicences || []).forEach((data: any) => {
    //   this.addCloseLicenses(data);
    // });
  }

  addVersion(data: ProductCatalogVersion = null): void {
    this.productVersions.push(ProductVersionComponent.addNewVersion(data));
  }

  addSupportVendor(data: string = null): void {
    this.productSupportVendor.push(
      ProductSupportVendorComponent.addNewSupportVendor(data)
    );
  }

  addUsefulLink(data: string = null): void {
    this.productUsefulLinks.push(
      ProductUsefulLinksComponent.addNewUsefulLink(data)
    );
  }

  // addCloseLicenses(data: any) {
  //   this.closeLicenses.push(CloseSourceListComponent.addNewCloseSource(data));
  // }

  removeProductVersion(index: number): void {
    this.productVersions.removeAt(index);
  }

  removeProductSupportVendor(index: number): void {
    this.productSupportVendor.removeAt(index);
  }

  removeProductUsefulLink(index: number): void {
    this.productUsefulLinks.removeAt(index);
  }

  private insertInitialControls(): void {
    // this.addVersion();
    // this.addUsefulLink();
    // this.addSupportVendor();
  }

  createProduct(): void {
    if (this.productForm.invalid && this.crud !== CRUD.CREATE) return;
    console.log(this.productForm.value);
    const postData: ProductCatalogProduct = createPostData.call(
      this,
      this.productForm.value
    );

    console.log(postData);
    this.productCatalogService.addProduct(postData).subscribe(
      (res: ProductCatalogProduct) => {
        this.dialog
          .open(SuccessDialogComponent, {
            disableClose: true,
            height: '180px',
            minWidth: '200px',
            width: '30%',
            data: {
              message: 'PRODUCT_CATALOG.MESSAGE.PRODUCT_ADDED',
            },
          })
          .afterClosed()
          .subscribe(() => {
            this.router.navigate(['/optisam/pc/products']);
          });
      },
      (error: ErrorResponse) => {
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

  updateForm() {
    if (this.productForm.invalid && this.crud !== CRUD.UPDATE) return;
    console.log('productvalue', this.productForm.value);
    const postData: ProductCatalogProduct = createPostData.call(
      this,
      this.productForm.value
    );
    if (this.updatedData) {
      (postData.id = this.updatedData.id),
        (postData.swidtagProduct = this.updatedData.productSwidTag);
    }
    if (this.productId) {
      postData.id = this.productId;
      //postData.swidtagProduct = this.swidId;
    }
    this.productCatalogService.updateProduct(postData).subscribe(
      (res: ProductCatalogProduct) => {
        this.dialog
          .open(SuccessDialogComponent, {
            disableClose: true,
            height: '180px',
            minWidth: '200px',
            width: '30%',
            data: {
              message: 'Product updated successfully',
            },
          })
          .afterClosed()
          .subscribe(() => {
            if (this.updatedData === null) {
              this.router.navigate(['/optisam/pc/products']);
              return;
            }
            this.dialogRef.close(true);
          });
      },
      (error: ErrorResponse) => {
        this.dialog.open(ErrorDialogComponent, {
          disableClose: true,
          height: '180px',
          minWidth: '200px',
          width: '30%',
          data: {
            error: error.message,
          },
        });
      }
    );
  }

  private getEditorList(): void {
    this.loadingEditor = true;
    this.productCatalogService.getEditorNames().subscribe(
      (editorNames: EditorNamesResponse) => {
        this.loadingEditor = false;
        this.editorList = editorNames.editors;
        this.filteredEditor = this.sortEditorName(editorNames.editors);
        this.cd.detectChanges();
      },
      (e: ErrorResponse) => {
        this.loadingEditor = false;
      }
    );
  }

  private sortEditorName(editorNames: EditorName[]): EditorName[] {
    return editorNames.sort((a: EditorName, b: EditorName) => {
      return a.name < b.name ? -1 : a.name == b.name ? 0 : 1;
    });
  }

  searchEditor(e: Event): void {
    e.stopImmediatePropagation();
    e.preventDefault();
  }

  searchKeydown(e: Event): void {
    e.stopPropagation();
  }

  searchInputEvent(e: KeyboardEvent): void {
    this.searchLoading = true;
    if (this.delayLoader !== null) clearTimeout(this.delayLoader);
    this.delayLoader = setTimeout(() => {
      this.searchText = (e.target as HTMLInputElement).value
        .trim()
        .toLowerCase();
      if (this.searchText == '') {
        this.filteredEditor = this.sortEditorName(this.editorList);
        this.searchLoading = false;
        this.cd.detectChanges();
        return;
      }
      this.filteredEditor = this.sortEditorName(
        this.editorList.filter((editor: EditorName) =>
          editor.name.toLowerCase().includes(this.searchText)
        )
      );
      this.delayLoader = null;
      this.searchLoading = false;
      this.cd.detectChanges();
    }, 500);
  }

  searchInputOpenChange(change: boolean, target: MatSelect): void {
    this.searchText = '';
    // this.searchInput. as HTMLInputElement));
  }

  private removeEmptyFromData(
    data: ProductCatalogEditProductData
  ): ProductCatalogEditProductData {
    for (let [key, item] of Object.entries(data)) {
      if (item?.constructor.name == 'Array') {
        data[key] = item.filter((i) => !!i);
      }
    }
    return data;
  }
}
