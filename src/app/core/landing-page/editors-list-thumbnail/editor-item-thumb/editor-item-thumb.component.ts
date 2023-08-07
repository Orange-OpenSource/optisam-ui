import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { ProductCatalogEditor, TrimTextRangeInput } from '@core/modals';

@Component({
  selector: 'app-editor-item-thumb',
  templateUrl: './editor-item-thumb.component.html',
  styleUrls: ['./editor-item-thumb.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditorItemThumbComponent implements OnInit, OnChanges {
  showScopeCount: number = 3;
  @Input('width') firstContainerWidth: number = 0;
  @Input('editor') editor: ProductCatalogEditor = null;
  trimRangeHeader: TrimTextRangeInput;
  trimRangeInfo: TrimTextRangeInput;
  constructor(private cd: ChangeDetectorRef) {}

  ngOnInit(): void {}

  ngOnChanges(change: SimpleChanges): void {
    if (change?.firstContainerWidth) {
      this.trimRangeHeader = {
        min: { char: 21, minWidth: 300 },
        max: { char: 37, maxWidth: 454 },
        currentWidth: this.firstContainerWidth,
      };
    }
    this.trimRangeInfo = {
      min: { char: 43, minWidth: 300 },
      max: { char: 67, maxWidth: 454 },
      currentWidth: this.firstContainerWidth,
    };
  }

  onImgError(event): void {
    event.target.src = 'assets/images/default-company-icon.svg';
  }
}
