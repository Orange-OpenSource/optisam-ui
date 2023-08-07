import { Component, Input, OnInit } from '@angular/core';
import { ControlContainer, FormArray, FormGroup } from '@angular/forms';
import { Sourcers } from '@core/modals/product-catalog.modal';
import { SingleSourcerComponent } from './single-sourcer/single-sourcer.component';

@Component({
  selector: 'app-sourcers',
  templateUrl: './sourcers.component.html',
  styleUrls: ['./sourcers.component.scss'],
})
export class SourcersComponent implements OnInit {
  @Input() sourcerData: Sourcers[] = null;
  SourcerGroup: FormGroup;
  SourcersArray: FormArray;
  constructor(private container: ControlContainer) {}

  ngOnInit(): void {
    this.SourcerGroup = this.container.control as FormGroup;
    this.SourcersArray = this.SourcerGroup?.get('sourcers') as FormArray;

    for (let data of this.sourcerData || []) {
      this.addNewSourcer(data);
    }
  }

  addNewSourcer(data?: Sourcers) {
    this.SourcersArray.push(SingleSourcerComponent.addSourcer(data));
  }
}
