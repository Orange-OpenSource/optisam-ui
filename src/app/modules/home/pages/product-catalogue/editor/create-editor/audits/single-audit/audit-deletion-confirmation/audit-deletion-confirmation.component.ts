import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-audit-deletion-confirmation',
  templateUrl: './audit-deletion-confirmation.component.html',
  styleUrls: ['./audit-deletion-confirmation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuditDeletionConfirmationComponent implements OnInit {
  constructor(

  ) {}

  ngOnInit(): void {}
}
