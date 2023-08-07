import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Aggregation, Metric, MetricList } from '@core/modals';
import { MetricService } from '@core/services/metric.service';
import { ProductService } from '@core/services/product.service';

@Component({
  selector: 'app-edit-license-step',
  templateUrl: './edit-license-step.component.html',
  styleUrls: ['./edit-license-step.component.scss'],
})
export class EditLicenseStepComponent implements OnInit {
  licenseForm: FormGroup;
  private data: Aggregation;
  metricsList: Metric[];
  currentMetricType: string = '';
  disabledMetricNameList: string[] = [];
  temporarydisabledMetricList: string[] = [];
  mySelections: Metric[] = [];

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private metricService: MetricService
  ) {}

  ngOnInit(): void {
    this.formInit();
    this.productService.getAggregationData().subscribe((data: Aggregation) => {
      this.data = data;

      this.listMetrics();
    });
  }

  formInit(): void {
    this.licenseForm = this.fb.group({
      licenses_acquired: this.fb.control(null, [
        Validators.required,
        Validators.pattern(/^[0-9]*$/),
      ]),
      unit_price: this.fb.control(null, [
        Validators.pattern(/^[0-9]+(\.[0-9]{1,2})*$/),
      ]),
      productsMetrics: this.fb.control(null, [Validators.required]),
    });
  }

  listMetrics(): void {
    this.metricService.getMetricList().subscribe(
      (res: MetricList) => {
        this.metricsList = res.metrices.sort((a, b) => {
          if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
          if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
          return 0;
        });

        const selectedMetrics = this.data.metric_name.split(',');

        if (!this.metricsList.length) return;
        this.licenseForm.setValue({
          licenses_acquired: this.data.num_licenses_acquired,
          unit_price: this.data.avg_unit_price,
          productsMetrics: this.metricsList.filter((metric) =>
            selectedMetrics.includes(metric.name)
          ),
        });

        this.metricSelectChange(this.productsMetrics.value);
      },
      (err) => {
        console.log('Some error occured! Could not fetch metrics list.');
      }
    );
  }

  get licenses_acquired(): FormControl {
    return this.licenseForm.get('licenses_acquired') as FormControl;
  }

  get unit_price(): FormControl {
    return this.licenseForm.get('unit_price') as FormControl;
  }

  get productsMetrics(): FormControl {
    return this.licenseForm.get('productsMetrics') as FormControl;
  }

  metricCompare(metric1: Metric, metric2: Metric): boolean {
    return metric1 && metric2
      ? metric1.name === metric2.name
      : metric1 === metric2;
  }

  metricSelectChange(metrics: Metric[]): void {
    this.currentMetricType = metrics.length
      ? metrics[metrics.length - 1].type
      : null;

    const ORACLE_TYPES = ['oracle.nup.standard', 'oracle.processor.standard'];
    if (!this.productsMetrics.value.length) this.disabledMetricNameList = [];
    // condition for if metric type is in the oracle block list-- ORACLE_TYPES
    const nominativeUserType = 'user.nominative.standard';
    const concurrentUserType = 'user.concurrent.standard';
    if (
      this.productsMetrics.value.length &&
      this.currentMetricType === nominativeUserType
    ) {
      const selectedMetricName: Metric =
        this.productsMetrics.value[this.productsMetrics.value.length - 1];
      this.disabledMetricNameList = this.metricsList
        .filter(
          (m) =>
            m.type !== nominativeUserType && m.name !== selectedMetricName.name
        )
        .map((m) => m.name);
      console.log(this.disabledMetricNameList);
      return;
    }

    if (
      this.productsMetrics.value.length &&
      this.currentMetricType === concurrentUserType
    ) {
      const selectedMetricName: Metric =
        this.productsMetrics.value[this.productsMetrics.value.length - 1];
      this.disabledMetricNameList = this.metricsList
        .filter(
          (m) =>
            m.type !== concurrentUserType && m.name !== selectedMetricName.name
        )
        .map((m) => m.name);
      console.log(this.disabledMetricNameList);
      return;
    }
    if (
      this.productsMetrics.value.length &&
      ORACLE_TYPES.includes(this.currentMetricType)
    ) {
      const selectedMetricName: Metric =
        this.productsMetrics.value[this.productsMetrics.value.length - 1];

      this.disabledMetricNameList = this.metricsList
        .filter(
          (m) =>
            m.type !== this.currentMetricType ||
            m.name !== selectedMetricName.name
        )
        .map((m) => m.name);
      return;
    }

    if (
      this.productsMetrics.value.length &&
      !ORACLE_TYPES.includes(this.currentMetricType) &&
      this.currentMetricType !== nominativeUserType &&
      this.currentMetricType !== concurrentUserType
    ) {
      this.disabledMetricNameList = this.metricsList
        .filter((m) => ORACLE_TYPES.includes(m.type))
        .map((m) => m?.name);

      this.temporarydisabledMetricList = this.metricsList
        .filter(
          (x) => x.type === nominativeUserType || x.type === concurrentUserType
        )
        .map((m) => m?.name);
      this.temporarydisabledMetricList.forEach((x) => {
        this.disabledMetricNameList.push(x);
      });
      return;
    }

    if (this.productsMetrics.value.length <= 5) {
      this.mySelections = this.productsMetrics.value;
    } else {
      this.productsMetrics.setValue(this.mySelections);
    }
  }
}
