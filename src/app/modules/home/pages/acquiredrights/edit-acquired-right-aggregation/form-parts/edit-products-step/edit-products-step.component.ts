import {
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import {
  Aggregation,
  AggregationEditorParams,
  AggregationProductListResponse,
  AggregationProductObject,
  AggregationProductsParams,
} from '@core/modals';
import { CommonService } from '@core/services/common.service';
import { MetricService } from '@core/services/metric.service';
import { ProductService } from '@core/services/product.service';
import { LOCAL_KEYS } from '@core/util/constants/constants';
import { SharedService } from '@shared/shared.service';
import { Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-edit-products-step',
  templateUrl: './edit-products-step.component.html',
  styleUrls: ['./edit-products-step.component.scss'],
})
export class EditProductsStepComponent implements OnInit, OnDestroy {
  @ViewChild('errorDialog') errorDialog: TemplateRef<HTMLElement>;
  productsForm: FormGroup;
  data: Aggregation;
  HTTPActivity: Boolean;
  loadingSubscription: Subscription;
  productNameList: AggregationProductObject[] = [];
  private defaultEditor: string;
  currentScope: string = this.cs.getLocalData(LOCAL_KEYS.SCOPE);
  private setLoad: any = {};
  metricsList: any[] = [];
  currentMetricType: string;
  editorsList: string[] = [];
  filteredEditorsList: string[];
  selectedSwidList: any[] = [];
  swidList: any[] = [];
  errorMsg: any;
  disabledMetricNameList: string[] = [];
  private oracleTypes: string[] = [
    'oracle.nup.standard',
    'oracle.processor.standard',
  ];
  userSelectedMetrics: string[];
  productsList: any[] = [];
  displayProductsList: any[] = [];
  filteredProductsList: any[];

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private sharedService: SharedService,
    private cs: CommonService,
    private metricService: MetricService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.formInit();
    this.loadingSubscription = this.sharedService
      .httpLoading()
      .subscribe((data) => {
        this.HTTPActivity = data;
      });

    this.setFormData();
    this.listMetrics();
    this.listEditors();
    this.productsEditorList();
    this.checkForProductName();
    this.fetchLatestProducts(true);
  }

  formInit(): void {
    this.productsForm = this.fb.group({
      productsEditor: this.fb.control('', [Validators.required]),
      productsName: this.fb.control('', [Validators.required]),
      productsMetrics: this.fb.control('', [Validators.required]),
      productsSwidtag: this.fb.control([], [Validators.required]),
    });
  }

  setFormData(): void {
    this.productService.getAggregationData().subscribe((data: Aggregation) => {
      this.data = data;
      //set default editor
      this.defaultEditor = this.data.product_editor;
      this.productsForm.setValue({
        productsEditor: this.data.product_editor,
        productsName: this.data.product_names,
        productsMetrics: (this.data.metric_name || '').split(','),
        productsSwidtag: this.data.swidtags,
      });
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

  get productDisabled(): boolean {
    return !!(
      this.HTTPActivity ||
      this.productNameList?.length === 0 ||
      !this.productsEditor.value ||
      !(this.productsMetrics.value || []).length
    );
  }

  get fetchProductsStatus(): boolean {
    return (
      (this.productsMetrics.value || []).length && this.productsEditor.value
    );
  }

  /* /Getter */

  listMetrics() {
    this.setLoad.metricslist = true;
    this.metricService.getMetricList().subscribe(
      (res) => {
        this.metricsList = res.metrices.sort((a, b) => {
          if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
          if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
          return 0;
        });
        if (this.data?.metric_name) {
          // taking the the last metric name and fetching it's type and setting it to the currentMetricType
          this.currentMetricType = this.metricsList.find(
            (metric) =>
              metric.name === (this.data.metric_name || '').split(',').pop()
          )?.type;
          if (this.currentMetricType) this.changed();
        }
        this.setLoad.metricslist = false;
      },
      (err) => {
        console.log('Some error occured! Could not fetch metrics list.');
        this.setLoad.metricslist = false;
      },
      () => {
        this.setLoad.metricslist = false;
      }
    );
  }
  // Get editors list
  listEditors() {
    this.setLoad.editorList = true;
    const query = '?scopes=' + this.currentScope;
    this.productService.getEditorList(query).subscribe(
      (res) => {
        this.editorsList = res.editors || [];
        this.filteredEditorsList = this.editorsList;
        this.setLoad.editorList = false;
      },
      (err) => {
        console.log('Some error occured! Could not fetch editors list.');
        this.setLoad.editorList = false;
      },
      () => {
        this.setLoad.editorList = false;
      }
    );
  }

  productsEditorList(): void {
    const params: AggregationEditorParams = {
      scope: this.currentScope,
    };
    this.setLoad.productEditorList = true;
    this.productService.getProductsEditorList(params).subscribe(
      (res) => {
        this.editorsList = res.editor;
        this.setLoad.productEditorList = false;
      },
      (err) => {
        console.log('Some error occured! Could not fetch products list.');
        this.setLoad.productEditorList = false;
      },
      () => {
        this.setLoad.productEditorList = false;
      }
    );
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

  private resetSwidTags(): void {
    this.selectedSwidList = [];
    this.productsSwidtag.setValue(this.selectedSwidList);
    this.swidList = [];
  }

  addSwidTag(swid: any, index: number) {
    this.swidList.splice(index, 1);
    this.selectedSwidList.push(swid);
    this.productsSwidtag.setValue(this.selectedSwidList);
    this.productsForm.markAsDirty();
  }

  removeSwidTag(swid: any, index: number) {
    this.selectedSwidList.splice(index, 1);
    this.swidList.push(swid);
    this.productsSwidtag.setValue(this.selectedSwidList);
    this.productsForm.markAsDirty();
  }

  private fetchLatestProducts(customCall: boolean = false): void {
    if (!this.fetchProductsStatus) {
      this.productsName.setValue('');
      return;
    }

    const params: AggregationProductsParams = {
      metric: this.productsMetrics.value.join(','),
      editor: this.productsEditor.value,
      scope: this.currentScope,
      ID: this.data.ID,
    };
    this.setLoad.latestProduct = true;
    this.productService.getProductListAggr(params).subscribe(
      (res: AggregationProductListResponse) => {
        this.productsName.setValue('');
        this.productNameList = res.aggrights_products || [];
        const selectedProducts =
          this.defaultEditor === this.productsEditor.value
            ? res.selected_products
            : [];
        this.productNameList = [
          ...this.productNameList,
          ...selectedProducts,
        ].sort((a, b) =>
          a.product_name > b.product_name
            ? 1
            : b.product_name > a.product_name
            ? -1
            : 0
        );

        if (customCall) {
          this.productsName.setValue(this.data.product_names);
          this.productSelectionChanged(true);
        }
        // removing duplicates swidtags
        const swidTagList = [];
        this.productNameList = this.productNameList.filter(
          (pnl: AggregationProductObject) => {
            const rtn = !swidTagList.includes(pnl.swidtag);
            swidTagList.push(pnl.swidtag);
            return rtn;
          }
        );
        this.setLoad.latestProduct = false;
      },
      (error) => {
        this.errorMsg = error.message;
        this.openModal(this.errorDialog);
        this.setLoad.latestProduct = false;
      },
      () => {
        this.setLoad.latestProduct = false;
      }
    );
  }

  productSelectionChanged(filter: boolean = false): void {
    if (filter) {
      // when filter is true that means It's a initial load. Now we are setting data according to the
      this.selectedSwidList = [];
      this.swidList = [];
      this.swidList = this.productNameList.filter(
        (res: AggregationProductObject) =>
          (this.productsName.value || []).includes(res.product_name) &&
          !this.data.swidtags.includes(res.swidtag)
      );
      this.selectedSwidList = this.productNameList.filter(
        (res: AggregationProductObject) =>
          this.data.swidtags.includes(res.swidtag)
      );
      this.productsSwidtag.setValue(this.selectedSwidList);

      return;
    }

    let selectedSwids = this.selectedSwidList.map(
      (s: AggregationProductObject) => s.swidtag
    );
    this.selectedSwidList = this.productNameList.filter(
      (res: AggregationProductObject) =>
        selectedSwids.includes(res.swidtag) &&
        (this.productsName.value || []).includes(res.product_name)
    );
    selectedSwids = this.selectedSwidList.map(
      (s: AggregationProductObject) => s.swidtag
    );
    this.productsSwidtag.setValue(this.selectedSwidList);

    this.swidList = this.productNameList.filter(
      (res: AggregationProductObject) =>
        (this.productsName.value || []).includes(res.product_name) &&
        !selectedSwids.includes(res.swidtag)
    );
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

  changed(values: string[] = []) {
    setTimeout(() => {
      if (!this.productsMetrics.value.length) this.disabledMetricNameList = [];
      // condition for if metric type is in the oracle block list-- this.oracleTypes
      if (
        this.productsMetrics.value.length &&
        this.oracleTypes.includes(this.currentMetricType)
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
        !this.oracleTypes.includes(this.currentMetricType)
      ) {
        this.disabledMetricNameList = this.metricsList
          .filter((m) => this.oracleTypes.includes(m.type))
          .map((m) => m?.name);
      }

      if (this.productsMetrics.value.length <= 5) {
        this.userSelectedMetrics = this.productsMetrics.value;
      } else {
        this.productsMetrics.setValue(this.userSelectedMetrics);
      }
    }, 0);
  }

  // Shows creation success/error
  openModal(templateRef) {
    let dialogRef = this.dialog.open(templateRef, {
      width: '30%',
      disableClose: true,
    });
  }

  metricClickHandler(selected: boolean, metricType: string): void {
    // if (!selected) return;
    this.currentMetricType = metricType;
  }

  // Get products list
  listProducts() {
    const query =
      '?scopes=' + this.currentScope + '&editor=' + this.productsEditor.value;
    this.productService.getProductList(query).subscribe(
      (res) => {
        this.productsList = res.products || [];
        this.displayProductsList = [
          ...new Set(this.productsList.map((prod) => prod.name)),
        ];
        this.filteredProductsList = this.displayProductsList;
      },
      (err) => {
        console.log('Some error occured! Could not fetch products list.');
      }
    );
  }

  ngOnDestroy(): void {
    this.loadingSubscription.unsubscribe();
  }
}
