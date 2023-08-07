import { Component, HostListener, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SharedService } from 'src/app/shared/shared.service';
import { MatDialog } from '@angular/material/dialog';
import { AccountService } from 'src/app/core/services/account.service';
import { CreateScopeComponent } from '../create-scope/create-scope.component';
import { COMMON_REGEX } from '@core/util/constants/constants';
import { ExpenseBodyParams } from '@core/modals';
import { Role } from 'src/app/utils/roles.config';

interface Scope {
  expenditure?: string;
  created_by: string;
  created_on: string;
  group_names: string[];
  scope_code: string;
  scope_name: string;
  scope_type: string;
}

@Component({
  selector: 'app-list-scopes',
  templateUrl: './list-scopes.component.html',
  styleUrls: ['./list-scopes.component.scss'],
})
export class ListScopesComponent implements OnInit {
  loadingSubscription: Subscription;
  HTTPActivity: Boolean;
  scopeData: any[] = [];

  _loading: Boolean = true;
  _deleteLoading: Boolean;
  role: any;
  scopeToDelete: string;
  errorMessage: string;
  blur: any = null;
  _loadingExp: boolean = false;
  excludeColumnsForAdmin: string[] = ['action'];
  displayedColumns: string[] = [
    'scope_code',
    'scope_name',
    'scope_type',
    'created_by',
    'created_on',
    'groups',
    'expenditure',
    'action',
  ];

  constructor(
    private accountService: AccountService,
    public dialog: MatDialog
  ) {
    this.role = localStorage.getItem('role');
  }

  ngOnInit() {
    if (this.role === this.adminRole) {
      this.displayedColumns = this.displayedColumns.filter(
        (column: string) => !this.excludeColumnsForAdmin.includes(column)
      );
    }

    this.getScopesList();
  }

  get adminRole(): Role {
    return Role.Admin;
  }

  get superAdminRole(): Role {
    return Role.SuperAdmin;
  }

  getScopesList() {
    this._loading = true;
    this.scopeData = [];
    this.accountService.getScopesList().subscribe(
      (res) => {
        this.scopeData = res.scopes || [];
        this._loading = false;
      },
      (err) => {
        this._loading = false;
        console.log('Scopes could not be listed! ', err);
      }
    );
  }
  // testing comment
  createNew(): void {
    if (![this.superAdminRole].includes(this.role)) return;
    const dialogRef = this.dialog.open(CreateScopeComponent, {
      width: '500px',
      autoFocus: false,
      disableClose: true,
      maxHeight: '90vh',
    });
    dialogRef.afterClosed().subscribe((result) => {
      const successEvent = dialogRef.componentInstance.actionSuccessful;
      if (successEvent) {
        this.getScopesList();
      }
    });
  }

  deleteScopeConfirmation(scope, templateRef) {
    this.scopeToDelete = scope.scope_code;
    this.openModal(templateRef, '40%');
  }

  deleteScope(successMsg, errorMsg) {
    this._deleteLoading = true;
    this.accountService.deleteScope(this.scopeToDelete).subscribe(
      (res) => {
        this.dialog.closeAll();
        this._deleteLoading = false;
        this.openModal(successMsg, '30%');
        console.log('Successfully Deleted! ', this.scopeToDelete);
      },
      (error) => {
        this.dialog.closeAll();
        this._deleteLoading = false;
        this.errorMessage =
          error.error.message || 'Some error occured! Could not delete scope';
        this.openModal(errorMsg, '30%');
        console.log('Error occured while deleting user!');
      }
    );
  }

  openModal(templateRef, width) {
    let dialogRef = this.dialog.open(templateRef, {
      width: width,
      disableClose: true,
    });
  }

  editExp(el: HTMLElement): void {
    if (el.classList.contains('loading') || this._loadingExp) return;
    const input: HTMLInputElement = el.querySelector(
      'input'
    ) as HTMLInputElement;
    const editButton: HTMLElement = el.querySelector(
      '.edit-exp-box'
    ) as HTMLElement;
    const actionBlock: HTMLElement = el.querySelector(
      '.action-block'
    ) as HTMLElement;
    input.readOnly = false;
    input.select();
    this.blur = null;
    document
      .querySelectorAll('.expenditure-block.active')
      .forEach((block: HTMLElement) => block.classList.remove('active'));
    el.classList.add('active');
  }

  onBlur(input: HTMLInputElement, scope: Scope): void {
    this.blur = setTimeout(() => {
      if (this.blur) {
        input.parentElement.classList.contains('active') &&
          this.updateExpenditure(input, scope);
        input.parentElement.classList.remove('active');
        input.readOnly = true;
      }
    }, 500);
  }

  expMouseEnter(el): void {
    const input: HTMLInputElement = el.querySelector(
      'input'
    ) as HTMLInputElement;
    const editBox: HTMLElement = el.querySelector(
      '.edit-exp-box'
    ) as HTMLElement;
    editBox.style.visibility = 'visible';
  }

  expMouseLeave(el): void {
    const input: HTMLInputElement = el.querySelector(
      'input'
    ) as HTMLInputElement;
    const editBox: HTMLElement = el.querySelector(
      '.edit-exp-box'
    ) as HTMLElement;
    editBox.style.visibility = 'hidden';
    input.readOnly = true;
  }

  addExp(input: HTMLInputElement, scope: Scope): void {
    input.closest('.expenditure-block.active').classList.remove('active');
    this.updateExpenditure(input, scope);
  }
  cancelChange(input: HTMLInputElement, scope: Scope): void {
    input.closest('.expenditure-block.active').classList.remove('active');
    input.value = String(scope?.expenditure || 0);
  }

  updateExpenditure(input: HTMLInputElement, activeScope: Scope): void {
    if (input.value == (activeScope?.expenditure || 0)) return;
    this._loadingExp = true;
    input.parentElement.classList.add('loading');
    const params: ExpenseBodyParams = {
      expenses: +input.value,
      scope_code: activeScope.scope_code,
    };

    this.accountService.updateExpenditure(params).subscribe(
      (res: any) => {
        this.scopeData = this.scopeData.map((scope: Scope) => {
          if (activeScope.scope_code === scope.scope_code)
            scope.expenditure = input.value;
          return scope;
        });
        this.resetExpInput(input);
      },
      (error) => {
        this.resetExpInput(input);
        input.value = String(activeScope?.expenditure || 0);
      }
    );
  }
  enterExp(input: HTMLInputElement, scope: Scope, el: HTMLElement): void {
    if (
      el.classList.contains('loading') ||
      this._loadingExp ||
      !el.classList.contains('active')
    ) {
      input.readOnly = true;
      return;
    }
    this.editExp(el);
    this.addExp(input, scope);
  }

  private resetExpInput(input: HTMLInputElement): void {
    this._loadingExp = false;
    input.parentElement.classList.remove('loading');
    input.readOnly = true;
  }

  restrictNonDigit(e: KeyboardEvent): void {
    if (!COMMON_REGEX.DIGITS_WITH_NAV.test(e.key)) e.preventDefault();
  }

  private testFunction(): void {
    return void 0;
  }
}
