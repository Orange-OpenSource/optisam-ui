import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { EquipmentTypeManagementService } from 'src/app/core/services/equipmenttypemanagement.service';
import { RequiredJSONFormat } from '../model';
import { GroupService } from 'src/app/core/services/group.service';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
})
export class AddComponent implements OnInit {
  createForm: FormGroup;
  selectedAttributes = [];
  types: any[] = [];
  metaData = [];
  primaryKeys = [];
  primaryKeyValue = [];
  parentIStatus = [];
  selectedParent: any;
  checkStatus: Boolean = false;
  selected = [];
  prntChckStats: Boolean = false;
  errorMsg: String = '';
  selectedScope: any;
  reqInProgress: Boolean;

  constructor(
    private equipmentTypeService: EquipmentTypeManagementService,
    private dialog: MatDialog
  ) {
    this.selectedScope = localStorage.getItem('scope');
  }

  ngOnInit() {
    this.initForm();
    this.getAttributes();
    this.getTypes();
  }

  initForm() {
    this.createForm = new FormGroup({
      type: new FormControl(null, [
        Validators.required,
        Validators.minLength(1),
        Validators.pattern(/^[-_,A-Za-z0-9]+$/),
      ]),
      from: new FormControl(null, [Validators.required]),
      root: new FormControl(null),
      attribute: new FormArray([]),
    });
  }
  get type() {
    return this.createForm.get('type');
  }
  get from() {
    return this.createForm.get('from');
  }
  get root() {
    return this.createForm.get('root');
  }
  get attribute() {
    return this.createForm.get('attribute');
  }

  get parent_identifier(): FormControl {
    return this.createForm.get('parent_identifier') as FormControl;
  }

  // get checkParent(): boolean {
  //   return (
  //     this.root.value != null ||
  //     (this.root.value != '' && this.parent_identifier.value)
  //   );
  // }
  getControls() {
    return (<FormArray>this.createForm.get('attribute')).controls;
  }

  get duplicateName(): Boolean {
    const value = this.type.value || '';
    const typeNamesList =
      this.types.length > 0 ? this.types.map((eq) => eq.type) : [];
    return typeNamesList.includes(value.trim());
  }

  get hasAllDataTypes(): boolean {
    const attributeFormData = (
      this.createForm.get('attribute') as FormArray
    ).getRawValue();
    return attributeFormData.every(
      (attribute: any) => attribute.primary_key || !!attribute.data_type
    );
  }

  getTypes() {
    //TODO: scope based equipment types fetch
    this.equipmentTypeService.getTypes(this.selectedScope).subscribe(
      (res: any) => {
        this.types = (res.equipment_types || []).reverse();
      },
      (error) => {
        console.log('There was an error while retrieving Posts !!!' + error);
      }
    );
  }
  getAttributes() {
    this.equipmentTypeService.getMetaData(this.selectedScope).subscribe(
      (res: any) => {
        this.metaData = res.metadata || [];
      },
      (error) => {
        console.log('There was an error while retrieving Posts !!!' + error);
      }
    );
  }

  // On metadata select
  filterAttributes(ID) {
    if (ID.isUserInput) {
      this.selectedAttributes = this.metaData
        .filter((x) => x.ID === ID.source.value)
        .map((x) => x.attributes);
      this.selectedAttributes.forEach((sa) => sa.sort());
    }
  }
  // On mapped_to select
  reduceMapped_toList(type, selectedAttributes, value) {
    for (let j = 0; j < selectedAttributes[value].length; j++) {
      if (selectedAttributes[value][j] === type) {
        const arr = [];
        for (let m = 0; m < selectedAttributes[value].length; m++) {
          if (selectedAttributes[value][m] !== type) {
            arr.push(selectedAttributes[value][m]);
          }
        }
        selectedAttributes[selectedAttributes.length] = arr;
      }
    }
  }
  onSelect(ID) {
    this.selectedParent = ID;
  }
  onChangeParentI(event, i) {
    if (event.checked === true) {
      this.selected[i] = 'STRING';
      this.primaryKeyValue[i] = true;
      this.primaryKeys[i] = true;
      this.prntChckStats = true;
    } else {
      this.selected[i] = '';
      this.primaryKeyValue[i] = false;
      this.prntChckStats = false;
    }
    for (let j = 0; j <= this.getControls().length - 1; j++) {
      if (event.checked === true) {
        if (i === j) {
          this.parentIStatus[j] = false;
        } else {
          this.parentIStatus[j] = true;
        }
      } else {
        if (i === j) {
        } else {
          this.parentIStatus[j] = false;
        }
      }
    }
  }
  onChange(event, i) {
    console.log('event', event);

    if (event.checked === true) {
      this.primaryKeyValue[i] = true;
      this.selected[i] = 'STRING';
      this.parentIStatus[i] = true;
      this.checkStatus = true;
    } else {
      this.selected[i] = '';
      this.primaryKeyValue[i] = false;
      this.parentIStatus[i] = false;
      this.checkStatus = false;
    }
    for (let j = 0; j <= this.getControls().length - 1; j++) {
      if (event.checked === true) {
        if (i === j) {
          this.primaryKeys[j] = false;
        } else {
          this.primaryKeys[j] = true;
        }
      } else {
        if (i === j) {
        } else {
          this.primaryKeys[j] = false;
        }
      }
    }
  }
  onAddAttribute() {
    const len = this.getControls().length || 0;
    if (this.checkStatus === true) {
      this.primaryKeys[len] = true;
    }
    if (this.prntChckStats === true) {
      this.parentIStatus[len] = true;
    } else {
      this.parentIStatus[len] = false;
    }

    (<FormArray>this.createForm.get('attribute')).push(
      new FormGroup({
        name: new FormControl(null, [
          Validators.required,
          Validators.minLength(1),
          Validators.pattern(/^[-_,A-Za-z0-9]+$/),
        ]),
        data_type: new FormControl(null),
        primary_key: new FormControl(null),
        displayed: new FormControl(null),
        searchable: new FormControl(null),
        parent_identifier: new FormControl(null),
        mapped_to: new FormControl(null, [Validators.required]),
      })
    );
  }
  onDeleteAttribute(index: number) {
    if (this.primaryKeys[index] === false) {
      for (let j = 0; j <= this.getControls().length; j++) {
        this.primaryKeys[j] = false;
      }
    }
    this.parentIStatus[index] = false;
    this.primaryKeys[index] = false;
    this.primaryKeyValue[index] = false;
    (<FormArray>this.createForm.get('attribute')).removeAt(index);
  }

  onSubmit(successMsg, errorMsg) {
    this.reqInProgress = true;
    this.createForm.markAsPristine();
    const form_data = this.createForm.value;
    for (let i = 0; i <= this.selected.length; i++) {
      if (this.selected[i] === 'STRING') {
        form_data.attribute[i].data_type = 'STRING';
      }
    }
    const attributeData = new RequiredJSONFormat();
    attributeData.parent_id = form_data.root;
    attributeData.type = form_data.type;
    attributeData.metadata_id = form_data.from;
    attributeData.attributes = form_data.attribute;
    attributeData.scopes = [this.selectedScope];
    if (form_data) {
      this.equipmentTypeService.createEquipments(attributeData).subscribe(
        (res) => {
          this.errorMsg = '';
          this.openModal(successMsg);
          this.reqInProgress = false;
        },
        (err) => {
          this.errorMsg =
            err.error && err.error.message
              ? err.error.message
              : 'Backend validation failed';
          this.reqInProgress = false;
          this.openModal(errorMsg);
        }
      );
    }
  }
  onFormReset() {
    this.createForm.reset();
    this.checkStatus = false;
    this.prntChckStats = false;
    this.primaryKeys = [];
    const control = <FormArray>this.createForm.get('attribute');
    for (let i = control.length - 1; i >= 0; i--) {
      control.removeAt(i);
    }
    this.createForm.markAsPristine();
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
