import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import {
  ControlContainer,
  FormControl,
  FormControlName,
  FormGroup,
  FormGroupDirective,
} from '@angular/forms';

@Component({
  selector: 'app-editor-search-bar',
  templateUrl: './editor-search-bar.component.html',
  styleUrls: ['./editor-search-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditorSearchBarComponent implements OnInit {
  @Input('formControlName') controlName: string = 'search';
  @Input('total') count: number = 0;
  @Input() isLoading: boolean = false;
  form: FormGroup;
  @Output() searchValue: EventEmitter<string> = new EventEmitter<string>();
  constructor(private container: ControlContainer) { }

  get search(): FormControl {
    return this.form?.get('search') as FormControl;
  }

  ngOnInit(): void {
    this.form = (this.container as FormGroupDirective).form as FormGroup;
  }

  emitSearch(value: string): void {
    this.searchValue.next(value);
  }

  clearSearch(): void {
    this.search.setValue('');
    this.emitSearch(this.search?.value)
  }
}
