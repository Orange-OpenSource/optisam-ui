import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MetricList, Metric } from '@core/modals';
import { MetricService } from '@core/services/metric.service';

@Component({
  selector: 'app-license-step',
  templateUrl: './license-step.component.html',
  styleUrls: ['./license-step.component.scss'],
})
export class LicenseStepComponent implements OnInit {
  licenseForm: FormGroup;
  metricsList: Metric[] = [];
  disabledMetricNameList: string[] = [];
  currentMetricType: string = '';
  mySelections: Metric[] = [];
  constructor(private fb: FormBuilder, private metricService: MetricService) {}

  ngOnInit(): void {
    this.formInit();
    this.listMetrics();
  }

  formInit(): void {
    this.licenseForm = this.fb.group({
      licenses_acquired: this.fb.control(null, [
        Validators.required,
        Validators.pattern(/^[0-9]*$/),
      ]),
      productsMetrics: this.fb.control(null, [Validators.required]),
      unit_price: this.fb.control(null, [
        Validators.pattern(/^[0-9]+(\.[0-9]{1,2})*$/),
      ]),
    });
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

  listMetrics(): void {
    this.metricService.getMetricList().subscribe(
      (res: MetricList) => {
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
  }
}
