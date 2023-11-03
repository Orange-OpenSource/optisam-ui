import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatOptionSelectionChange } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { MetricList, Metric } from '@core/modals';
import { ProductService } from '@core/services';
import { MetricService } from '@core/services/metric.service';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-license-step',
  templateUrl: './license-step.component.html',
  styleUrls: ['./license-step.component.scss'],
})
export class LicenseStepComponent implements OnInit, AfterViewInit {
  @ViewChild('aggMetrics', { static: true }) metricsEl: MatSelect;
  licenseForm: FormGroup;
  metricsList: Metric[] = [];
  disabledMetricNameList: string[] = [];
  temporarydisabledMetricList: string[] = [];
  currentMetricType: string = '';
  mySelections: Metric[] = [];
  subs: SubSink = new SubSink();


  constructor(private fb: FormBuilder, private metricService: MetricService, private ps: ProductService) { }
  ngAfterViewInit(): void {
    this.subs.add(
      this.metricsEl.optionSelectionChanges.subscribe((option: MatOptionSelectionChange) => {
        this.ps.metricOptionsChange.call(this, option, false);
      })
    )
  }

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

  get metrics(): FormControl {
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
    if (!this.metrics.value.length) this.disabledMetricNameList = [];
    // condition for if metric type is in the oracle block list-- ORACLE_TYPES
    if (
      this.metrics.value.length &&
      ORACLE_TYPES.includes(this.currentMetricType)
    ) {
      const selectedMetricName: Metric =
        this.metrics.value[this.metrics.value.length - 1];

      this.disabledMetricNameList = this.metricsList
        .filter(
          (m) =>
            m.type !== this.currentMetricType ||
            m.name !== selectedMetricName.name
        )
        .map((m) => m.name);
      return;
    }

    const nominativeUserType = 'user.nominative.standard';
    const concurrentUserType = 'user.concurrent.standard';
    if (
      this.metrics.value.length &&
      this.currentMetricType === nominativeUserType
    ) {
      const selectedMetricName: Metric =
        this.metrics.value[this.metrics.value.length - 1];
      this.disabledMetricNameList = this.metricsList
        .filter(
          (m) =>
            m.type !== nominativeUserType || m.name !== selectedMetricName.name
        )
        .map((m) => m.name);
      return;
    }

    if (
      this.metrics.value.length &&
      this.currentMetricType === concurrentUserType
    ) {
      const selectedMetricName: Metric =
        this.metrics.value[this.metrics.value.length - 1];
      this.disabledMetricNameList = this.metricsList
        .filter(
          (m) =>
            m.type !== concurrentUserType || m.name !== selectedMetricName.name
        )
        .map((m) => m.name);
      console.log(this.disabledMetricNameList);
      return;
    }

    if (
      this.metrics.value.length &&
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

    if (this.metrics.value.length <= 5) {
      this.mySelections = this.metrics.value;
    } else {
      this.metrics.setValue(this.mySelections);
    }
  }
}
