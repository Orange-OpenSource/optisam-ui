import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';

@Component({
  selector: 'app-editor-info-v2',
  templateUrl: './editor-info-v2.component.html',
  styleUrls: ['./editor-info-v2.component.scss'],
})
export class EditorInfoV2Component implements OnInit, OnChanges {
  constructor() {}
  @Input() data: any;
  @Input() loading: boolean;

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.data);
  }
}
