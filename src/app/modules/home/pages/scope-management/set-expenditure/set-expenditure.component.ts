import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { Scope } from '@core/modals';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FrenchNumberPipe } from '@shared/common-pipes';

@Component({
  selector: 'app-set-expenditure',
  templateUrl: './set-expenditure.component.html',
  styleUrls: ['./set-expenditure.component.scss'],
  providers: [FrenchNumberPipe]
})
export class SetExpenditureComponent implements OnInit {
  entityExpenditureGroup: FormGroup;
  constructor(@Inject(MAT_DIALOG_DATA) public data: Scope, private frenchNumber: FrenchNumberPipe) { }

  ngOnInit(): void {

    this.entityExpenditureGroup = new FormGroup({
      expenditure: new FormControl(
        this.data?.expenditure,
        [
          Validators.max(100000000000000),
        ])
    })
  }

  get expenditure(): FormControl {
    return this.entityExpenditureGroup.get('expenditure') as FormControl;
  }

  get maxValueExpenditure(): string {
    return this.frenchNumber.transform(this.expenditure?.errors?.max?.max).toString();
  }

  onlyNumber(e: KeyboardEvent): void {
    const ALLOWED_KEYS: string = 'Delete|Left|Backspace|Right|End|Home';
    if (!new RegExp(ALLOWED_KEYS).test(e.key)) {
      const key = e.key;
      const prevValue = (e.target as HTMLInputElement).value;
      if (isNaN(Number(prevValue + key)))
        e.preventDefault();
    }
  }

}
