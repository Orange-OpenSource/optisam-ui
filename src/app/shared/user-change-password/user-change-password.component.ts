import { AbstractControl, ValidationErrors } from '@angular/forms';
import { ValidatorFn } from '@angular/forms';
import { ChangeDetectionStrategy, Component, ElementRef, Input, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ErrorResponse, PasswordAction, SetPasswordBody, SetPasswordResponse } from '@core/modals';
import { SharedService } from '@shared/shared.service';
import { AccountService, AuthService } from '@core/services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-change-password',
  templateUrl: './user-change-password.component.html',
  styleUrls: ['./user-change-password.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserChangePasswordComponent implements OnInit {
  @Input() user: string;
  @Input() token: string;
  @Input() type: PasswordAction;
  visibility: boolean = false;
  visibilityConfirm: boolean = false;
  userLang: string = 'en';
  cpForm!: FormGroup;
  _loading: boolean = false;
  constructor(
    private fb: FormBuilder,
    private ac: AccountService,
    private ss: SharedService,
    private as: AuthService,
    private router: Router,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.formInit()

  }

  get activationType(): PasswordAction {
    return PasswordAction.activation;
  }

  get resetType(): PasswordAction {
    return PasswordAction.reset;
  }

  get passwordField(): FormControl {
    return this.cpForm?.get('password') as FormControl;
  }

  get confirmPasswordField(): FormControl {
    return this.cpForm?.get('confirmPassword') as FormControl;
  }

  private formInit(): void {
    this.cpForm = this.fb.group({
      password: this.fb.control(null, [Validators.required, Validators.minLength(8), Validators.maxLength(50), Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[.@#$&*_,])[A-Za-z0-9.@#$&*_,]{8,}'), this.resetConfirmPasswordValidation()]),
      confirmPassword: this.fb.control(null, [Validators.required, this.matchPassword()])
    })
  }

  private resetConfirmPasswordValidation(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      this.confirmPasswordField?.updateValueAndValidity();
      return null;
    }
  }

  private matchPassword(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control?.value != this.passwordField?.value) return { matchError: true };
      return null;
    }
  }

  setPassword(): void {
    if (this._loading) return;
    this._loading = true;

    const body: SetPasswordBody = {
      password: this.passwordField.value,
      passwordConfirmation: this.confirmPasswordField.value,
      user: this.user,
      token: this.token,
      action: this.type === this.activationType ? PasswordAction.activation : PasswordAction.reset
    }

    this.as.setPassword(body).subscribe((res: SetPasswordResponse) => {
      this._loading = false;
      this.ss.commonPopup({
        title: "SUCCESS_TITLE",
        message: body.action === PasswordAction.activation ? "USER_ACTIVATION_MSG" : "PASSWORD_RESET_MSG",
        buttonText: "OK",
        singleButton: true
      }).afterClosed().subscribe(() => {
        this.router.navigate(['/login'])
      })
      this.cd.detectChanges();

    }, (error: ErrorResponse) => {
      this._loading = false;
      this.cd.detectChanges();

      this.ss.commonPopup({
        title: "ERROR_TITLE",
        message: error.message,
        buttonText: "OK",
        singleButton: true
      })
    })
  }



}
