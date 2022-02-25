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
  productList: any[] = [];
  editorList: Editor[] = [];
  metricesList: Metrics[] = [];
  swidList: any[] = [];
  selectedSwidList: any[] = [];
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
      metric: ['', [Validators.required]],
      product_names: ['', [Validators.required]],
    });
    this.getEditorsList();
    this.getMetricesList();
  }

  // Get All Editors
  getEditorsList() {
    this.productService.getEditorListAggr(this.selectedScope).subscribe(
      (response: any) => {
        this.editorList = response.editor || [];
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
      metric: this.createForm.value.metric,
    };
    this.productService.getProductListAggr(query).subscribe(
      (response: any) => {
        this.acqrights_products = response.acqrights_products;
        this.productList = response.acqrights_products.filter((v, i, s) => {
          return s.findIndex((pr) => pr.product_name === v.product_name) === i;
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
        this.createForm.controls['metric'].reset();
        this.createForm.controls['product_names'].reset();
        this.productList = [];
        this.swidList = [];
        this.selectedSwidList = [];
        break;

      case 'metric':
        this.createForm.controls['product_names'].patchValue('');
        this.getProductsList();
        break;

      case 'product':
        this.selectedSwidList = [];
        this.swidList = [];
        for (let i = 0; i < this.createForm.value.product_names.length; i++) {
          this.acqrights_products.filter((res) => {
            console.log('res:', res, 'swidList : ', this.swidList);
            if (
              res.product_name == this.createForm.value.product_names[i] &&
              this.swidList.indexOf(res) == -1
            ) {
              this.swidList.push(res);
            }
          });
        }
        break;
    }
  }

  createAggregation(successMsg, errorMsg) {
    this.createForm.markAsPristine();
    this.errorMessage = '';
    if (this.createForm.valid && this.selectedSwidList.length > 0) {
      const reqbody = {
        ID: 0,
        name: this.createForm.get('name').value,
        editor: this.createForm.get('editor').value,
        metric: this.createForm.get('metric').value,
        scope: this.selectedScope,
        products: this.selectedSwidList.map((swid) => swid.swidtag),
      };
      this.productService.saveAggregation(reqbody).subscribe(
        (resp) => {
          console.log('aggregation save successfully');
          this.openModal(successMsg);
        },
        (error) => {
          this.errorMessage =
            error && error.error
              ? error.error.message
              : 'Some error occured! Aggregation could not be created.';
          this.openModal(errorMsg);
          console.log('Error saving aggregation', error);
        }
      );
    } else {
      return false;
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

  openModal(templateRef) {
    let dialogRef = this.dialog.open(templateRef, {
      width: '30%',
      disableClose: true,
    });
  }

  ngOnDestroy() {
    this.dialog.closeAll();
    this.loadingSubscription.unsubscribe();
  }
}
