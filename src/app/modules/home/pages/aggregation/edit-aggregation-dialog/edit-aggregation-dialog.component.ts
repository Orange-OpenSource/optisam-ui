import { Component, OnInit, Inject } from '@angular/core';
import {
  FormBuilder,
  Validators,
  FormGroup,
  FormControl,
} from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import {
  AggregationProductListResponse,
  AggregationProductRes,
  ErrorResponse,
  ProductDetails,
} from '@core/modals';
import { CommonService } from '@core/services/common.service';
import { LOCAL_KEYS } from '@core/util/constants/constants';
import { SharedService } from '@shared/shared.service';
import { Subscription } from 'rxjs';
import { ProductService } from 'src/app/core/services/product.service';
import { Editor } from '../aggregation.model';

function validateAggregationName(c: FormControl) {
  const AGG_EXP = /[^a-zA-Z\d_]/g;

  return !AGG_EXP.test(c.value)
    ? null
    : {
        validAggName: true,
      };
}

@Component({
  selector: 'app-edit-aggregation-dialog',
  templateUrl: './edit-aggregation-dialog.component.html',
  styleUrls: ['./edit-aggregation-dialog.component.scss'],
})
export class EditAggregationDialogComponent implements OnInit {
  readonly aggName = this.data.name;
  readonly aggID = this.data.ID;
  _loading: boolean;
  updateForm: FormGroup;
  productList: any[] = [];
  swidList: any[] = [];
  selectedSwidList: any[] = [];
  errorMessage: string;
  prodLoading: boolean;
  removeItem = []; // Removed orignal swidtags list
  msgtxt: string;
  noChangesMadeFlag: Boolean = true;
  acqrights_products: any[] = [];
  editorList: string[] = [];
  currentScope: string;
  productListResponse: AggregationProductRes;
  initProductListResponse: AggregationProductRes;
  loadingSubscription: Subscription;
  HTTPActivity: Boolean;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<EditAggregationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private productService: ProductService,
    private dialog: MatDialog,
    private cs: CommonService,
    private sharedService: SharedService
  ) {
    this._loading = false;
    this.prodLoading = false;
  }

  ngOnInit() {
    this.loadingSubscription = this.sharedService
      .httpLoading()
      .subscribe((data) => {
        this.HTTPActivity = data;
      });

    this.setFormData();
    // Fetch all products
    this.getInitialProductsList();
    this.updateForm.markAsPristine();
    this.noChangesMadeFlag = true;
    this.currentScope = this.cs.getLocalData(LOCAL_KEYS.SCOPE);
    this.getEditorsList();
  }

  get productNames(): FormControl {
    return this.updateForm.get('product_names') as FormControl;
  }

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

  getEditorsList() {
    this.productService.getEditorListAggr(this.currentScope).subscribe(
      (response: { editor: string[] }) => {
        this.editorList = response.editor || [];
        this.editorList.sort();
      },
      (error: ErrorResponse) => {
        console.log('Error fetching editors');
      }
    );
  }

  setFormData() {
    this.updateForm = this.fb.group({
      name: [
        this.data.aggregation_name,
        [Validators.required, validateAggregationName],
      ],
      editor: [this.data.product_editor, [Validators.required]],
      product_names: [this.data.product_names, [Validators.required]],
    });
    if (this.data.products) {
      this.selectedSwidList = this.data.swidtags;
      console.log(this.data.swidtags);
    }
  }

  getSwidtags(initReq?: boolean) {
    console.log('worknig');
    initReq = initReq || false;
    // debugger;
    const productNames = this.productNames.value;
    const allSwidTags = [
      ...this.productListResponse.aggrights_products,
      ...this.productListResponse.selected_products,
    ];
    this.swidList = this.cs.customSort(
      allSwidTags.filter(
        (p) =>
          productNames.includes(p.product_name) &&
          !this.selectedSwidList.map((s) => s.swidtag).includes(p.swidtag)
      ),
      'asc',
      'swidtag'
    );
    this.swidList = this.swidList?.map((x) => {
      return {
        ...x,
        swidVersion: x.product_name + ' ' + x.product_version,
      };
    });
    this.selectedSwidList = this.cs.customSort(
      this.selectedSwidList.filter((s) =>
        productNames.includes(s.product_name)
      ),
      'asc',
      'swidtag'
    );
    this.selectedSwidList = this.selectedSwidList?.map((x) => {
      return {
        ...x,
        swidVersion: x.product_name + ' ' + x.product_version,
      };
    });
    console.log(this.selectedSwidList);
  }

  getProductsList() {
    this.errorMessage = '';
    const query: any = {
      scope: this.currentScope,
      editor: this.updateForm.value.editor,
      ID: this.data.ID,
    };
    this.productService.getProductListAggr(query).subscribe(
      (response: any) => {
        console.log(response);
        this.productListResponse = response;
        this.productList = [];
        const sameEditor: boolean = response.selected_products.some(
          (p: ProductDetails) => p.editor === this.updateForm.value.editor
        );

        this.acqrights_products = response.aggrights_products;
        const products: ProductDetails[] = [
          ...this.acqrights_products,
          ...(sameEditor ? response.selected_products : []),
        ];

        this.productList = products.reduce(
          (products: ProductDetails[], product: ProductDetails) => {
            if (!products.some((p) => p.product_name === product.product_name))
              products.push(product);

            return products;
          },
          []
        );

        console.log('this.productList', this.productList);
      },
      (error) => {
        this.errorMessage = error && error.error ? error.error.message : '';
        console.log('Error fetching metric');
      }
    );
  }

  // Get All Products/Swidtags based on Editor and Metrics
  getInitialProductsList() {
    this.prodLoading = true;
    this.swidList = [];
    const query: any = {
      scope: this.data.scope,
      editor: this.data.product_editor,
      ID: this.data.ID, //this.data.metric,
    };
    this.productService.getProductListAggr(query).subscribe(
      (response: AggregationProductRes) => {
        console.log(response);
        this.initProductListResponse = response;
        this.setSwidtags(response);
      },
      (error) => {
        this.prodLoading = false;
        console.log('Error fetching metric');
      }
    );
  }

  openModal(templateRef, width: string = '30%') {
    let dialogRef = this.dialog.open(templateRef, {
      width: width,
      disableClose: true,
    });
  }

  confirm(successMsg, errorMsg) {
    this.updateForm.markAsPristine();
    if (this.updateForm.valid && this.selectedSwidList.length > 0) {
      this._loading = true;
      const body = {
        ID: this.aggID,
        aggregation_name: this.updateForm.value.name,
        product_editor: this.updateForm.value.editor,
        product_names: this.finalProducts,
        swidtags: this.selectedSwidList.map((swid) => swid.swidtag),
        scope: this.data.scope,
      };

      this.productService.updateAggregation(this.aggID, body).subscribe(
        (resp) => {
          this._loading = false;
          this.openModal(successMsg, '20%');
        },
        (error) => {
          this._loading = false;
          this.errorMessage =
            error && error.error
              ? error.error.message
              : 'Some error occured! Aggregation could not be updated.';
          this.openModal(errorMsg);
        }
      );
    }
  }

  // Get products not in second array
  compareProductList(primary: string[], compare: string[]): string[] {
    const retArr = [];
    primary.forEach((ele) => {
      if (compare.indexOf(ele) === -1) {
        retArr.push(ele);
      }
    });
    return retArr;
  }

  addSwidTag(swid: any, index: number) {
    this.noChangesMadeFlag = false;
    this.swidList.splice(index, 1);
    console.log(this.swidList);
    this.selectedSwidList.push(swid);
    this.swidList = this.cs.customSort(this.swidList, 'asc', 'swidtag');
    this.selectedSwidList = this.cs.customSort(
      this.selectedSwidList,
      'asc',
      'swidtag'
    );
  }

  removeSwidTag(swid: any, index: number) {
    this.noChangesMadeFlag = false;
    this.selectedSwidList.splice(index, 1);
    this.swidList.push(swid);
    this.swidList = this.cs.customSort(this.swidList, 'asc', 'swidtag');
    this.selectedSwidList = this.cs.customSort(
      this.selectedSwidList,
      'asc',
      'swidtag'
    );
  }

  editorChange(event: any): void {
    this.updateForm.controls['product_names'].reset();
    this.productList = [];
    this.swidList = [];
    this.selectedSwidList = [];
    this.getProductsList();
  }

  selectAllSwid(checked: boolean): void {
    if (!checked) return;
    this.noChangesMadeFlag = false;
    this.selectedSwidList = [...this.selectedSwidList, ...this.swidList];
    this.swidList = [];
  }

  setSwidtags(response: AggregationProductRes): void {
    this.productListResponse = response;
    this.acqrights_products = response.aggrights_products || [];

    this.productList = this.cs.customSort(
      [...this.acqrights_products, ...response.selected_products].reduce(
        (products: ProductDetails[], product: ProductDetails) => {
          if (
            !products.some(
              (p: ProductDetails) => p.product_name === product.product_name
            )
          ) {
            products.push(product);
          }
          return products;
        },
        []
      ),
      'asc',
      'product_name'
    );

    console.log(this.productList);
    const collator = new Intl.Collator(undefined, {
      numeric: true,
      sensitivity: 'base',
    });

    //alphanumerically sorting
    this.productList = this.productList.sort((a, b) => {
      return collator.compare(a.product_name, b.product_name);
    });

    // sort selected swid tags
    this.selectedSwidList = this.cs.customSort(
      response.selected_products,
      'asc',
      'swidtag'
    );

    this.selectedSwidList = this.selectedSwidList?.map((x) => {
      return {
        ...x,
        swidVersion: x.product_name + ' ' + x.product_version,
      };
    });
    console.log(this.selectedSwidList);

    // Fetch all swidtags with products
    this.swidList = (this.acqrights_products || []).filter((v) =>
      this.data.product_names.includes(v.product_name)
    );
    this.swidList = this.cs.customSort(this.swidList, 'asc', 'swidtag');
    this.swidList = this.swidList?.map((x) => {
      return {
        ...x,
        swidVersion: x.product_name + ' ' + x.product_version,
      };
    });
    console.log(this.swidList);

    this.prodLoading = false;
  }

  resetAggregation(): void {
    this.setFormData();
    this.setSwidtags(this.initProductListResponse);
  }

  ngOnDestroy() {
    this.dialog.closeAll();
  }
}
