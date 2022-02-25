import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
} from '@angular/material/dialog';
import { EquipmentTypeManagementService } from 'src/app/core/services/equipmenttypemanagement.service';
import { FormArray, FormGroup, FormControl, Validators } from '@angular/forms';
import { ModifyJSONFormat } from './model';
import { RequiredJSONFormat } from '../model';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
})
export class EditComponent implements OnInit {
  id: any;
  type: any;
  metadata_source: any;
  attributes: any;
  attributeForm: FormGroup;
  selectedAttributes = [];
  types: any;
  metaData = [];
  parent_type: any;
  metadata_id: String;
  parentId: String;
  scope: any = '';
  parent: any;
  attribute: any;
  displayedColumns = [
    'name',
    'data_type',
    'mapped_to',
    'searchable',
    'displayed',
  ];
  errorMessage: string;
  reqInProgress: Boolean;
  attributeControls: FormControl[];
  private mappingKey: string = 'parentid';

  constructor(
    private equipmentTypeService: EquipmentTypeManagementService,
    private dialogRef: MatDialogRef<EditComponent>,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) private data: RequiredJSONFormat
  ) {}

  ngOnInit() {
    this.type = this.data['type'];
    this.id = this.data['ID'];
    this.metadata_id = this.data['metadata_id'];
    this.metadata_source = this.data['metadata_source'];
    this.scope = this.data['scope'];
    this.parent_type = this.data['parent_type'];
    this.attribute = this.data.attributes;
    this.getTypes();
    this.getMappedSource();
    this.initForm();
  }
  initForm() {
    this.attributeForm = new FormGroup({
      from: new FormControl({ disabled: true }),
      scope: new FormControl({ disabled: true }),
      root: new FormControl(null),
      attribute: new FormArray([]),
    });
  }
  get root() {
    return this.attributeForm.get('root');
  }
  get attribute_form() {
    return this.attributeForm.get('attribute') as FormArray;
  }
  get getControls(): FormControl[] {
    return (<FormArray>this.attributeForm.get('attribute'))
      .controls as FormControl[];
  }
  // Get data
  getTypes() {
    this.equipmentTypeService.getTypes(this.scope).subscribe(
      (res: any) => {
        const equipTypes = (res.equipment_types || []).reverse();
        this.types = equipTypes.filter((eq) => eq.type !== this.type);
        this.parent = equipTypes.filter(
          (eq) => eq.type === this.parent_type
        )[0].ID;
        this.root.setValue(this.parent);
      },
      (error) => {
        console.log('There was an error while retrieving Posts !!!' + error);
      }
    );
  }

  getMappedSource() {
    this.equipmentTypeService.getMappedSource(this.metadata_id).subscribe(
      (res: any) => {
        this.selectedAttributes = this.attribute.map((atr) => atr.mapped_to);
        this.metaData = res.attributes
          .filter((s) => !this.selectedAttributes.includes(s))
          .sort();
      },
      (error) => {
        console.log('There was an error while retrieving Posts !!!' + error);
      }
    );
  }

  get missingParentAttribute(): Boolean {
    if (this.root.value) {
      // below if condition is checking if any of the attribute's parent_identifier(FormControl) has value = true.
      if (
        this.attribute_form.controls.some(
          (control: FormGroup) => !!control.get('parent_identifier').value
        )
      )
        return false;
      // for (let i = 0; i < this.attribute_form.value.length; i++) {
      //   if (this.attribute_form.controls[i].get('parent_identifier').value) {
      //     return false;
      //   }
      // }
      this.selectedAttributes = this.attribute.map((atr) => atr.mapped_to);

      if (this.selectedAttributes.includes(this.mappingKey)) return false;
      return true;
    } else {
      return false;
    }
  }

  onAddAttribute() {
    (<FormArray>this.attributeForm.get('attribute')).push(
      new FormGroup({
        name: new FormControl(null, [
          Validators.required,
          Validators.minLength(1),
          Validators.pattern(/^[-_,A-Za-z0-9]+$/),
        ]),
        data_type: new FormControl(null, [Validators.required]),
        displayed: new FormControl(null),
        searchable: new FormControl(null),
        mapped_to: new FormControl(null, [Validators.required]),
        parent_identifier: new FormControl(null),
      })
    );
    this.attributeControls = this.getControls;
  }
  onDeleteAttribute(index: number) {
    (<FormArray>this.attributeForm.get('attribute')).removeAt(index);
    this.attributeControls = this.getControls;
  }
  onChangeParent(ev, i) {
    if (ev.checked) {
      this.parentId = i;
    } else {
      this.parentId = null;
    }
  }
  compareWithFn(listOfItems, selectedItem) {
    return listOfItems && selectedItem && listOfItems === selectedItem;
  }

  modifyAttribute(successMsg, errorMsg, parentErrorMsg, equipmentDataErrorMsg) {
    this.reqInProgress = true;
    this.attributeForm.markAsPristine();
    const attribute_data = this.attributeForm.value;
    const attributeData = new ModifyJSONFormat();
    attributeData.attributes = attribute_data.attribute;
    attributeData.parent_id = this.root.value;
    attributeData.scopes = [localStorage.getItem('scope')];
    if (attribute_data) {
      this.equipmentTypeService
        .updateAttribute(this.id, attributeData)
        .subscribe(
          (res) => {
            this.openModal(successMsg);
            this.reqInProgress = false;
          },
          (error) => {
            this.reqInProgress = false;
            console.log('Some error occured!' + error);
            if (
              error.status == 400 &&
              error.error.message == 'child can not be parent'
            ) {
              this.openModal(parentErrorMsg);
            } else if (
              error.status == 400 &&
              error.error.message == 'equipment type contains equipments data'
            ) {
              this.openModal(equipmentDataErrorMsg);
            } else {
              this.errorMessage = error.error.message;
              this.openModal(errorMsg);
            }
          }
        );
    }
  }

  onFormReset() {
    this.attributeForm.reset();
    this.root.setValue(this.parent);
    this.attribute_form.clear();
  }

  openModal(templateRef) {
    let dialogRef = this.dialog.open(templateRef, {
      width: '30%',
      disableClose: true,
    });
  }

  ngOnDestroy() {
    this.dialog.closeAll();
  }
}
