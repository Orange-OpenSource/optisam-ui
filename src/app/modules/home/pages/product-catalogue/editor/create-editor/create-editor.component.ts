import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import {
  Editor,
  ErrorResponse,
  PartnerManager,
  ProductCatalogEditor,
} from '@core/modals';
import { ProductCatalogService } from '@core/services/product-catalog.service';
import { ErrorDialogComponent } from '@shared/error-dialog/error-dialog.component';
import { EditorListComponent } from '../editor-list/editor-list.component';

@Component({
  selector: 'app-create-editor',
  templateUrl: './create-editor.component.html',
  styleUrls: ['./create-editor.component.scss'],
})
export class CreateEditorComponent implements OnInit {
  createEditor: FormGroup;
  id!: string;
  isCreateMode: boolean;
  updatedId: string;
  createdOn: string;
  updatedOn: string;
  _loading: boolean = false;
  isViewMode: boolean = false;
  editorData: ProductCatalogEditor = null;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private productCatalog: ProductCatalogService,
    public dialog: MatDialog,
    private datePipe: DatePipe,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<EditorListComponent>
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((res: any) => {
      this.id = res.params.id;
    });
    this.isCreateMode = !this.id;
    this.createEditor = this.fb.group({
      name: this.fb.control('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100),
      ]),
      partner_managers: this.fb.array([]),
      genearlInformation: this.fb.control('', Validators.maxLength(200)),
      audits: this.fb.array([]),
      vendors: this.fb.array([
        this.fb.group({
          name: ['', [Validators.minLength(3)]],
        }),
      ]),
    });

    //function to load values based on id
    if (!this.isCreateMode) {
      this._loading = true;
      this.productCatalog
        .getEditorById(this.id)
        .subscribe((editorData: ProductCatalogEditor) => {
          this.editorData = editorData;
          this.updatedId = editorData.id;
          this.createdOn = editorData.created_on;
          this.updatedOn = editorData.updated_on;
          const vendors = this.createEditor.get('vendors') as FormArray;
          while (vendors.length) {
            vendors.removeAt(0);
          }
          this.createEditor.patchValue({
            name: editorData.name,
            genearlInformation: editorData.general_information,
          });

          const vendorString: string[] = editorData.vendors.map((v) => {
            if (v?.name) {
              return v.name;
            }
          });

          vendors.push(
            this.fb.group({
              name: this.fb.control(vendorString.join(', '), [
                Validators.minLength(3),
              ]),
            })
          );

          this._loading = false;
        });
    }

    if (this.data) {
      this.isViewMode = true;
      const val = this.data.audits;
      const partner_managers = this.createEditor.get(
        'partner_managers'
      ) as FormArray;
      const audits = this.createEditor.get('audits') as FormArray;
      const vendors = this.createEditor.get('vendors') as FormArray;
      for (let i = 0; i < (val?.length || 0); i++) {
        let dates = val[i].date;
        val[i].date = this.datePipe.transform(dates, 'yyyy-MM-dd');
      }
      while (partner_managers.length) {
        partner_managers.removeAt(0);
      }
      while (audits.length) {
        audits.removeAt(0);
      }
      while (vendors.length) {
        vendors.removeAt(0);
      }
      this.createEditor.patchValue({
        name: this.data.name,
        genearlInformation: this.data.general_information,
      });
    }
  }

  get editorName(): FormControl {
    return this.createEditor.get('name') as FormControl;
  }

  get generalInfo(): FormControl {
    return this.createEditor.get('genearlInformation') as FormControl;
  }

  openDetails(x: any) {}

  closeDialog() {
    this.dialogRef.close();
  }
  // form to submit values
  submitForm(sucess, errors): void {
    let val = this.createEditor.value.audits;
    let vendors = this.createEditor.value.vendors;
    this.createEditor.value.vendors = vendors[0]?.name
      ?.split(',')
      .map((x: any) => {
        return { name: x.trim() };
      });
    for (let i = 0; i < val.length; i++) {
      let x = val[i].date;
      val[i].date = x ? new Date(x, 0, 1).toISOString() : null;
    }
    this.createEditor.value.audits = val;

    this.createEditor.value.partner_managers =
      this.createEditor.value.partner_managers.filter(
        (manager: PartnerManager) => manager.name.trim() || manager.email.trim()
      );

    this.productCatalog.createEditor(this.createEditor.value).subscribe(
      (x: any) => {
        console.log(x);
        this.dialog.open(sucess, {
          width: '30%',
          disableClose: true,
        });
      },
      (error: ErrorResponse) => {
        console.log(error);
        this.dialog.open(ErrorDialogComponent, {
          disableClose: true,
          height: '180px',
          minWidth: '200px',
          width: '30%',
          data: {
            error: error.message,
          },
        });
      }
    );
  }

  //form to update values
  updateForm(sucess, errors) {
    let val = this.createEditor.value.audits;
    for (let i = 0; i < val.length; i++) {
      let x = val[i].date;
      val[i].date = !!x ? new Date(x, 0, 1).toISOString() : null;
    }

    const updatedObj = {
      ...this.createEditor.value,
      id: this.updatedId,
      createdOn: this.createdOn,
      updatedOn: this.updatedOn,
    };
    this.productCatalog.updateEditor(updatedObj).subscribe(
      (res) => {
        this.dialog.open(sucess, {
          width: '30%',
          disableClose: true,
        });
      },
      (error: ErrorResponse) => {
        this.dialog.open(ErrorDialogComponent, {
          disableClose: true,
          height: '180px',
          minWidth: '200px',
          width: '30%',
          data: {
            error: error.message,
          },
        });
      }
    );
  }

  cancelForm() {
    console.log('test');
    this.router.navigate(['/optisam/pc/editors']);
  }

  get partnerManagers(): FormArray {
    return this.createEditor.get('partner_managers') as FormArray;
  }
}
