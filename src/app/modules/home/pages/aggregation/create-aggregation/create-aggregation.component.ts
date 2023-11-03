import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/shared/shared.service';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { Editor, Metrics } from '../aggregation.model';
import { ProductService } from 'src/app/core/services/product.service';
import { MetricService } from 'src/app/core/services/metric.service';
import {
  CreateAggregationPlayload,
  EditorName,
  ErrorResponse,
  ProductDetails,
  SuccessResponse,
  EditorsListParams,
  EditorsListResponse,
} from '@core/modals';
import { MatSelect } from '@angular/material/select';

function validateAggregationName(c: FormControl) {
  const EMAIL_REGEXP = /[^a-zA-Z\d_]/g;

  return !EMAIL_REGEXP.test(c.value)
    ? null
    : {
        validAggName: true,
      };
}
@Component({
  selector: 'app-create-aggregation',
  templateUrl: './create-aggregation.component.html',
  styleUrls: ['./create-aggregation.component.scss'],
})
export class CreateAggregationComponent implements OnInit, OnDestroy {
  createForm: FormGroup;
  productList: ProductDetails[] = [];
  editorList: string[] = [];
  metricesList: Metrics[] = [];
  swidList: any = [];
  swidVersions: any = [];
  selectedSwidList: ProductDetails[] = [];
  selectedScope: any = '';
  errorMessage: string;
  loadingSubscription: Subscription;
  HTTPActivity: Boolean;
  acqrights_products: any[] = [];
  searchLoading: boolean = false;
  delayLoader: any = null;
  delayProductLoader: any = null;
  searchText: string = '';
  searchProductText: string = '';
  filteredEditor: string[] = [];
  filteredProduct: string[] = [];
  searchProductLoading: boolean = false;
  @ViewChild('productInput') productSelect: MatSelect;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    protected metricService: MetricService,
    private router: Router,
    private sharedService: SharedService,
    public dialog: MatDialog,
    private cd: ChangeDetectorRef
  ) {
    this.loadingSubscription = this.sharedService
      .httpLoading()
      .subscribe((data) => {
        this.HTTPActivity = data;
      });
    this.selectedScope = localStorage.getItem('scope');
  }

  ngOnInit() {
    this.createForm = this.fb.group({
      name: ['', [Validators.required, validateAggregationName]],
      editor: ['', [Validators.required]],
      product_names: ['', [Validators.required]],
    });
    this.getEditorsList();
  }

  // <getters>
  get finalProducts(): string[] {
    return this.selectedSwidList.reduce(
      (products: string[], product: ProductDetails) => {
        if (!products.includes(product.product_name)) {
          products.push(product.product_name);
        }
        return products;
      },
      []
    );
  }
  // </getters>

  // Get All Editors
  getEditorsList() {
    const params: EditorsListParams = {
      scopes: this.selectedScope,
    };
    this.productService.getEditorsList(params).subscribe(
      ({ editors }: EditorsListResponse) => {
        this.editorList = (editors || []).sort();
        this.filteredEditor = this.editorList;
      },
      (error: ErrorResponse) => {
        console.log('Error fetching editors');
      }
    );
  }

  // Get All Metrices based on Editor
  getMetricesList() {
    this.metricService.getMetricList().subscribe(
      (res) => {
        this.metricesList = res.metrices.map((metric) => metric.name).sort();
      },
      (err) => {
        console.log('Some error occured! Could not fetch metrics list.');
      }
    );
  }

  // Get All Products based on Editor and Metrics
  getProductsList() {
    this.errorMessage = '';
    const query: any = {
      scope: this.selectedScope,
      editor: this.createForm.value.editor,
      ID: 0,
    };
    this.productService.getProductListAggr(query).subscribe(
      (response: any) => {
        this.acqrights_products = response.aggrights_products;

        this.productList = this.acqrights_products.filter((v, i, s) => {
          return s.findIndex((pr) => pr.product_name === v.product_name) === i;
        });
        this.productList = this.productList.sort((a, b) => {
          if (a.product_name.toLowerCase() > b.product_name.toLowerCase())
            return 1;
          if (a.product_name.toLowerCase() < b.product_name.toLowerCase())
            return -1;
          return 0;
        });
        this.filteredProduct = this.productList?.map((pr: ProductDetails) => {
          return pr?.product_name.toLowerCase();
        });
      },
      (error) => {
        this.errorMessage = error && error.error ? error.error.message : '';
        console.log('Error fetching metric');
      }
    );
  }

  selectionChanged(ev: any, type: string) {
    switch (type) {
      case 'editor':
        this.createForm.controls['product_names'].reset();
        this.productList = [];
        this.swidList = [];
        this.selectedSwidList = [];
        this.getProductsList();
        break;

      case 'metric':
        this.createForm.controls['product_names'].patchValue('');
        this.getProductsList();
        break;

      case 'product':
        this.selectedSwidList = this.selectedSwidList || [];
        const selectedSwidtags = this.selectedSwidList.map((s) => s.swidtag);
        // this.swidList =
        //   this.acqrights_products.filter(
        //     (ap) =>
        //       this.createForm.value.product_names.includes(
        //         ap.product_name.toLowerCase()
        //       ) && !selectedSwidtags.includes(ap.swidtag)
        //   ) || [];

        this.swidList = this.acqrights_products.filter(
          (ap) =>
            this.createForm.value.product_names.includes(
              ap.product_name.toLowerCase()
            ) && !selectedSwidtags.includes(ap.swidtag)
        );
        // this.swidList = this.swidList.concat(filteredProducts);
        this.swidList = this.swidList?.map((x) => {
          return {
            ...x,
            swidVersion: x.product_name + ' ' + x.product_version,
          };
        });
        const selectedSwidListFilter = this.selectedSwidList.filter((s) =>
          (this.createForm.value.product_names || []).includes(s.product_name)
        );
        this.selectedSwidList = this.selectedSwidList.concat(
          selectedSwidListFilter
        );

        // setTimeout(() => {
        //   if (this.productSelect?.panelOpen) {
        //     this.productSelect.close();
        //   }
        // }, 5000);

        break;
    }
  }

  createAggregation(successMsg, errorMsg): void {
    this.createForm.markAsPristine();
    this.errorMessage = '';

    if (this.createForm.valid && this.selectedSwidList.length > 0) {
      const reqbody: CreateAggregationPlayload = {
        ID: 0,
        aggregation_name: this.createForm.get('name').value,
        product_editor: this.createForm.get('editor').value,
        scope: this.selectedScope,
        product_names: this.finalProducts,
        swidtags: this.selectedSwidList.map((swid) => swid.swidtag),
      };

      this.productService.saveAggregation(reqbody).subscribe(
        (res: SuccessResponse) => {
          if (res.success) this.openModal(successMsg, '25%');
        },
        (error: ErrorResponse) => {
          this.errorMessage =
            error?.message ||
            'Some error occured! Aggregation could not be created.';
          this.openModal(errorMsg);
        }
      );
    } else {
      return;
    }
  }

  addSwidTag(swid: any, index: number) {
    console.log(swid);
    this.swidList.splice(index, 1);
    console.log(this.swidList);
    this.selectedSwidList.push(swid);
  }

  removeSwidTag(swid: any, index: number) {
    this.selectedSwidList.splice(index, 1);
    this.swidList.push(swid);
  }

  resetForm() {
    this.createForm.reset();
    this.selectedSwidList = [];
    this.swidList = [];
    this.productList = [];
  }

  backToList() {
    this.router.navigate(['/optisam/ag/list-aggregation']);
  }

  openModal(templateRef, width: string = '30%') {
    let dialogRef = this.dialog.open(templateRef, {
      width: width,
      disableClose: true,
    });
  }

  selectAllSwid(checked: boolean): void {
    if (checked) {
      this.selectedSwidList = [...this.selectedSwidList, ...this.swidList];
      this.swidList = [];
    }
  }

  searchEditor(e: Event): void {
    e.stopImmediatePropagation();
    e.preventDefault();
  }

  searchProduct(e: Event): void {
    e.stopImmediatePropagation();
    e.preventDefault();
  }
  searchKeydown(e: Event): void {
    e.stopPropagation();
  }

  searchProductKeyDown(e: Event): void {
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
        this.filteredEditor = this.editorList;
        this.searchLoading = false;
        this.cd.detectChanges();
        return;
      }
      this.filteredEditor = this.editorList.filter((editor: string) =>
        editor.toLowerCase().includes(this.searchText.toLowerCase())
      );
      this.delayLoader = null;
      this.searchLoading = false;
      this.cd.detectChanges();
    }, 500);
  }

  searchProductInputEvent(e: KeyboardEvent): void {
    this.searchProductLoading = true;
    if (this.delayProductLoader !== null) clearTimeout(this.delayProductLoader);
    this.delayProductLoader = setTimeout(() => {
      this.searchProductText = (e.target as HTMLInputElement).value
        .trim()
        .toLowerCase();

      if (this.searchProductText === '') {
        this.filteredProduct = this.productList?.map((pr: ProductDetails) => {
          return pr.product_name.toLowerCase();
        });
      } else {
        const filteredProducts = this.productList
          ?.map((pr: ProductDetails) => {
            return pr?.product_name.toLowerCase();
          })
          ?.filter((pr: string) => pr.includes(this.searchProductText));

        // Merge filtered products with selected products
        const selectedProducts = this.createForm.value.product_names || [];
        this.filteredProduct = [...filteredProducts, ...selectedProducts];
      }

      this.delayProductLoader = null;
      this.searchProductLoading = false;
      this.cd.detectChanges();
    }, 500);
  }

  ngOnDestroy() {
    this.dialog.closeAll();
    this.loadingSubscription.unsubscribe();
  }
}
