import { Component, OnInit, OnDestroy } from '@angular/core';
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
  ErrorResponse,
  ProductDetails,
  SuccessResponse,
} from '@core/modals';

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
  editorList: Editor[] = [];
  metricesList: Metrics[] = [];
  swidList: ProductDetails[] = [];
  selectedSwidList: ProductDetails[] = [];
  selectedScope: any = '';
  errorMessage: string;
  loadingSubscription: Subscription;
  HTTPActivity: Boolean;
  acqrights_products: any[] = [];

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    protected metricService: MetricService,
    private router: Router,
    private sharedService: SharedService,
    public dialog: MatDialog
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
    this.productService.getEditorListAggr(this.selectedScope).subscribe(
      (response: any) => {
        this.editorList = response.editor || [];
        this.editorList.sort();
      },
      (error) => {
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
        this.swidList =
          this.acqrights_products.filter(
            (ap) =>
              this.createForm.value.product_names.includes(ap.product_name) &&
              !selectedSwidtags.includes(ap.swidtag)
          ) || [];
        this.selectedSwidList = this.selectedSwidList.filter((s) =>
          (this.createForm.value.product_names || []).includes(s.product_name)
        );
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
    this.swidList.splice(index, 1);
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

  ngOnDestroy() {
    this.dialog.closeAll();
    this.loadingSubscription.unsubscribe();
  }
}
