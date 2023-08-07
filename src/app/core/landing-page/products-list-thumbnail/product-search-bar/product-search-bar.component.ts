import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import {
  FormGroup,
  ControlContainer,
  FormGroupDirective,
  FormControl,
} from '@angular/forms';

@Component({
  selector: 'app-product-search-bar',
  templateUrl: './product-search-bar.component.html',
  styleUrls: ['./product-search-bar.component.scss'],
})
export class ProductSearchBarComponent implements OnInit {
  @Input('formControlName') controlName: string = 'search';
  @Input('total') count: number = 0;
  @Input() isLoading: boolean = false;
  form: FormGroup;
  @Output() searchValue: EventEmitter<string> = new EventEmitter<string>();
  constructor(private container: ControlContainer) { }

  ngOnInit(): void {
    this.form = (this.container as FormGroupDirective).form as FormGroup;
    console.log('form', this.form);
  }

  get search(): FormControl {
    return this.form?.get('search') as FormControl;
  }

  triggerSearch(value: string): void {
    this.searchValue.emit(value);
  }

  clearSearch(): void {
    this.search.setValue('');
    this.triggerSearch(this.search?.value);
  }
}
