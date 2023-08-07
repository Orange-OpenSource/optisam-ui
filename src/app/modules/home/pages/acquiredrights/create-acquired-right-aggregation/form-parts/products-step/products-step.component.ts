import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import {
  ErrorResponse,
  ListProductQueryParams,
  ProductListResponse,
} from '@core/modals';
import { MetricService } from '@core/services/metric.service';
import { ProductService } from '@core/services/product.service';
import { LOCAL_KEYS } from '@core/util/constants/constants';
import {
  AggregationEditorParams,
  AggregationProductListResponse,
  AggregationProductObject,
  AggregationProductsParams,
} from '@home/pages/acquiredrights/acquired-rights.modal';
import { SharedService } from '@shared/shared.service';
import { Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { UniqueProductPipe } from '../../../unique-product.pipe';

@Component({
  selector: 'app-products-step',
  templateUrl: './products-step.component.html',
  styleUrls: ['./products-step.component.scss'],
})
export class ProductsStepComponent implements OnInit {
  productNameList: AggregationProductObject[] = [];
  metricsList: any[] = [];
  editorsList: string[] = [];
  displayProductsList: any[] = [];
  productsForm: FormGroup;
  currentScope: string = localStorage.getItem(LOCAL_KEYS.SCOPE);
  versionsList: string[] = [];
  disabledMetricNameList: string[] = [];
  currentMetricType: string;
  mySelections: string[];
  productsList: any[] = [];
  filteredProductsList: any[];
  selectedSwidList: any[] = [];
  swidList: any[] = [];
  HTTPActivity: Boolean;
  loadingSubscription: Subscription;

  constructor(
    private fb: FormBuilder,
    private metricService: MetricService,
    private productService: ProductService,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
    this.loadingSubscription = this.sharedService
      .httpLoading()
      .subscribe((data) => {
        this.HTTPActivity = data;
      });

    this.listMetrics();
    this.listEditors();
    this.productsEditorList();
    this.formInit();
    this.checkForProductName();
  }

  formInit(): void {
    this.productsForm = new FormGroup({
      productsEditor: new FormControl('', [Validators.required]),
      productsName: new FormControl('', [Validators.required]),
      productsMetrics: new FormControl('', [Validators.required]),
      productsSwidtag: new FormControl([], [Validators.required]),
    });
  }

  get productsMetrics(): FormControl {
    return this.productsForm.get('productsMetrics') as FormControl;
  }

  get productsName(): FormControl {
    return this.productsForm.get('productsName') as FormControl;
  }

  get productsEditor(): FormControl {
    return this.productsForm.get('productsEditor') as FormControl;
  }

  get productsSwidtag(): FormControl {
    return this.productsForm.get('productsSwidtag') as FormControl;
  }

  get fetchProductsStatus(): boolean {
    return (
      (this.productsMetrics.value || []).length && this.productsEditor.value
    );
  }

  // Get editors list
  listEditors() {
    const query = '?scopes=' + this.currentScope;
    this.productService.getEditorList(query).subscribe(
      (res) => {
        this.editorsList = res.editors || [];
      },
      (err) => {
        console.log('Some error occured! Could not fetch editors list.');
      }
    );
  }

  listMetrics() {
    this.metricService.getMetricList().subscribe(
      (res) => {
        this.metricsList = res.metrices.sort((a, b) => {
          if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
          if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
          return 0;
        });
      },
      (err) => {
        console.log('Some error occured! Could not fetch metrics list.');
      }
    );
  }

  productsEditorList(): void {
    const params: AggregationEditorParams = {
      scope: this.currentScope,
    };
    this.productService.getProductsEditorList(params).subscribe(
      (res) => (this.editorsList = res.editor),
      (err) => console.log('Some error occured! Could not fetch products list.')
    );
  }

  metricClickHandler(selected: boolean, metricType: string): void {
    // if (!selected) return;
    this.currentMetricType = metricType;
    console.log('test2!');
  }

  changed(values: string[]) {
    console.log('test!');
    setTimeout(() => {
      const ORACLE_TYPES = ['oracle.nup.standard', 'oracle.processor.standard'];
      if (!this.productsMetrics.value.length) this.disabledMetricNameList = [];
      // condition for if metric type is in the oracle block list-- ORACLE_TYPES
      if (
        this.productsMetrics.value.length &&
        ORACLE_TYPES.includes(this.currentMetricType)
      ) {
        const selectedMetricName =
          this.productsMetrics.value[this.productsMetrics.value.length - 1];
        this.disabledMetricNameList = this.metricsList
          .filter(
            (m) =>
              m.type !== this.currentMetricType || m.name !== selectedMetricName
          )
          .map((m) => m.name);
      }

      if (
        this.productsMetrics.value.length &&
        !ORACLE_TYPES.includes(this.currentMetricType)
      ) {
        this.disabledMetricNameList = this.metricsList
          .filter((m) => ORACLE_TYPES.includes(m.type))
          .map((m) => m?.name);
      }

      if (this.productsMetrics.value.length <= 5) {
        this.mySelections = this.productsMetrics.value;
      } else {
        this.productsMetrics.setValue(this.mySelections);
      }
    }, 0);
  }

  // Get products list
  listProducts() {
    // const query =
    //   '?scopes=' + this.currentScope + '&editor=' + this.productsEditor.value;

    const query: ListProductQueryParams = {
      scopes: this.currentScope,
      editor: this.productsEditor.value,
    };

    this.productService.getProductList(query).subscribe(
      (res: ProductListResponse) => {
        this.productsList = res.products || [];
        this.displayProductsList = [
          ...new Set(this.productsList.map((prod) => prod.name)),
        ];
        this.filteredProductsList = this.displayProductsList;
      },
      (err: ErrorResponse) => {
        console.log('Some error occured! Could not fetch products list.');
      }
    );
  }

  resetForm(): void {
    // this.filteredEditorsList = this.editorsList;
    this.filteredProductsList = [];
    // this.filteredVersionsList = [];
  }

  checkForProductName(): void {
    this.productsEditor.valueChanges
      .pipe(tap(() => this.resetProductsName()))
      .subscribe(() => {
        this.resetSwidTags();
        this.fetchLatestProducts();
      });

    this.productsMetrics.valueChanges.subscribe(() => {
      this.resetSwidTags();
      this.fetchLatestProducts();
    });
  }

  private resetProductsName(): void {
    this.productsName.patchValue('');
    this.productsName.markAsDirty();
  }

  fetchLatestProducts(): void {
    if (!this.fetchProductsStatus) {
      this.productsName.setValue('');
      return;
    }
    const params: AggregationProductsParams = {
      metric: this.productsMetrics.value.join(','),
      editor: this.productsEditor.value,
      scope: this.currentScope,
    };

    this.productService
      .getProductListAggr(params)
      .subscribe((res: AggregationProductListResponse) => {
        this.productsName.setValue('');
        this.productNameList = res.aggrights_products || [];
      }, console.log);
  }

  addSwidTag(swid: any, index: number) {
    this.swidList.splice(index, 1);
    this.selectedSwidList.push(swid);
    this.productsSwidtag.setValue(this.selectedSwidList);
  }

  removeSwidTag(swid: any, index: number) {
    this.selectedSwidList.splice(index, 1);
    this.swidList.push(swid);
    this.productsSwidtag.setValue(this.selectedSwidList);
  }

  private resetSwidTags(): void {
    this.selectedSwidList = [];
    this.productsSwidtag.setValue(this.selectedSwidList);
    this.swidList = [];
  }

  productSelectionChanged(ev: MatSelectChange): void {
    this.selectedSwidList = this.selectedSwidList.filter(
      (s: AggregationProductObject) =>
        (this.productsName.value || []).includes(s.product_name)
    );
    this.productsSwidtag.setValue(this.selectedSwidList);
    this.swidList = [];
    const selectedSwidTagNames: string[] = (this.selectedSwidList || []).map(
      (swidTag: AggregationProductObject) => swidTag.swidtag
    );
    for (let i = 0; i < this.productsName.value.length; i++) {
      this.productNameList.filter((res: AggregationProductObject) => {
        if (
          res.product_name == this.productsName.value[i] &&
          this.swidList.indexOf(res) == -1 &&
          !selectedSwidTagNames.includes(res.swidtag)
        ) {
          this.swidList.push(res);
        }
      });
    }
  }

  selectAllSwid(checked: boolean): void {
    if (checked) {
      this.selectedSwidList = [
        ...new Set([...this.selectedSwidList, ...this.swidList]),
      ];
      this.productsSwidtag.setValue(this.selectedSwidList);
      this.swidList = [];
    }
  }

  get productDisabled(): boolean {
    return !!(
      this.HTTPActivity ||
      this.productNameList?.length === 0 ||
      !this.productsEditor.value ||
      !(this.productsMetrics.value || []).length
    );
  }

  /* // Return filtered list for autocomplete options
  private _filter(type, value): string[] {
    let list;
    switch (type) {
      case 'editor':
        list = this.editorsList;
        break;
      case 'product':
        list = this.displayProductsList;
        break;
      case 'version':
        list = this.versionsList;
    }
    return list.filter((option) =>
      option.toLowerCase().includes(value ? value.toLowerCase() : '')
    );
  } 
  */
}
