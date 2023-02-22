import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { ControlContainer, FormControl, FormGroup } from '@angular/forms';
import { OpenSourceType } from '@core/modals';
import { CRUD, OPEN_SOURCE_LIST } from '@core/util/constants/constants';

@Component({
  selector: 'app-product-open-source',
  templateUrl: './product-open-source.component.html',
  styleUrls: ['./product-open-source.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductOpenSourceComponent implements OnInit {
  @Input('crud') crud: CRUD = CRUD.CREATE;
  openSourceList: string[] = OPEN_SOURCE_LIST.sort();
  openSourceGroup: FormGroup;
  showOpenSourceType: boolean;

  constructor(private container: ControlContainer) {}

  ngOnInit(): void {
    this.openSourceGroup = this.container.control as FormGroup;
    this.isOpenSource?.valueChanges.subscribe((value: boolean) => {
      this.showOpenSourceType = value;
      this.openSourceGroup.patchValue({
        openSourceType: value ? OpenSourceType.community : OpenSourceType.none,
      });
    });
  }

  get crudRead(): CRUD {
    return CRUD.READ;
  }

  get isOpenSource(): FormControl {
    return this.openSourceGroup?.get('isOpenSource') as FormControl;
  }

  get openSourceType(): FormControl {
    return this.openSourceGroup?.get('openSourceType') as FormControl;
  }

  get commercial(): OpenSourceType {
    return OpenSourceType.commercial;
  }

  get community(): OpenSourceType {
    return OpenSourceType.community;
  }
}
