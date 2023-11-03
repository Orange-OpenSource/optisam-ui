import { ChangeDetectionStrategy, Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '@core/auth/auth.service';
import { ForgotPasswordParams } from '@core/modals';
import { ForgotPasswordRetrieveSentComponent } from './forgot-password-retrieve-sent/forgot-password-retrieve-sent.component';
import { Router } from '@angular/router';
import { CommonService } from '@core/services';
import { SharedService } from '@shared/shared.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordGroup: FormGroup;
  _loading: boolean = false;

  constructor(private fb: FormBuilder, private authService: AuthService, private dialog: MatDialog, private router: Router, private ss: SharedService, private cd: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.forgotPasswordGroup = this.fb.group({
      email: this.fb.control('', [Validators.required, Validators.email])
    })
  }

  get userEmail(): FormControl {
    return this.forgotPasswordGroup.get('email') as FormControl;
  }

  retrievePassword(): void {
    if (this._loading) return;
    this._loading = true;
    const body: ForgotPasswordParams = {
      user: this.userEmail.value
    }

    this.authService.forgotPassword(body).subscribe((res: any) => {
      this._loading = false;

      this.ss.commonPopup({
        title: "SUCCESS_TITLE",
        message: "FORGOT_PASSWORD_SUCCESS_MESSAGE",
        messageVariable: { email: this.userEmail.value },
        singleButton: true,
        buttonText: "OK"
      }).afterClosed().subscribe(() => {
        this.router.navigate(['/login']);
      })

    }, (e: { code: number; message: string; }) => {
      this._loading = false;
      let message = "INTERNAL_SERVER_ERROR";
      switch (e.code) {
        case 400:
          message = e.message;
          break;

        default:
          message = "INTERNAL_SERVER_ERROR"
          break;

      }
      this.ss.commonPopup({
        title: "ERROR_TITLE",
        message,
        singleButton: true,
        buttonText: "OK"
      }).afterClosed().subscribe(() => {
        // this.router.navigate(['/login']);
      })
      this.cd.detectChanges();

    })
  }



}
