import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-partner-deletion-confirmation',
  templateUrl: './partner-deletion-confirmation.component.html',
  styleUrls: ['./partner-deletion-confirmation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PartnerDeletionConfirmationComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
