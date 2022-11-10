import { Component, OnInit, Inject } from '@angular/core';
import { SharedService } from 'src/app/shared/shared.service';
import { GroupService } from 'src/app/core/services/group.service';
import { EquipmentsService } from 'src/app/core/services/equipments.service';
import { Papa } from 'ngx-papaparse';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { ConfigurationService } from 'src/app/core/services/configuration.service';
import { isUndefined } from 'util';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { DialogData } from '../../../dialogs/product-details/details';
import { LOCAL_KEYS } from '@core/util/constants/constants';
import { CommonService } from '@core/services';

@Component({
  selector: 'app-edit-configuration',
  templateUrl: './edit-configuration.component.html',
  styleUrls: ['./edit-configuration.component.scss'],
})
export class EditConfigurationComponent implements OnInit {
  configObj: any;
  groupList: any[] = [];
  equipmentList: any[] = [];
  attributeList: any[] = [];
  scopesList: any[] = [];
  displayedColumns: string[] = ['attribute', 'simulable', 'file', 'delete'];
  uploadForm: FormGroup;
  formInvalidFlag: Boolean = false;
  NoChangesFlag: Boolean = true;
  NoFileSelectedFlag: Boolean = true;
  refreshAttributesFlag: Boolean = false;
  selectedEqType: any;
  id: any;
  loadingSubscription: Subscription;
  HTTPActivity: Boolean;
  delimiter: any = ';';
  eqTypeForUpdate: any;
  eqTypeMetadata: any;
  deletedConfigAttrs: any[] = [];
  disableResetFlag: Boolean = true;
  configID: any;
  configName: string = '';
  editRequestSentFlag: Boolean = false;
  loading: Boolean;

  constructor(
    private sharedService: SharedService,
    private groupService: GroupService,
    private equipmentService: EquipmentsService,
    private configurationService: ConfigurationService,
    private papa: Papa,
    private _formBuilder: FormBuilder,
    private dialog: MatDialog,
    private router: Router,
    private cs: CommonService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.loadingSubscription = this.sharedService
      .httpLoading()
      .subscribe((data) => {
        this.HTTPActivity = data;
      });
    this.configObj = {
      equipmentType: null,
      group: null,
      attributes: [],
    };
    if (this.data['datakey']) {
      this.configID = this.data['datakey'].config_id;
      this.eqTypeForUpdate = this.data['datakey'].equipment_type;
      this.configName = this.data['datakey'].config_name;
    }
  }

  ngOnInit() {
    this.getGroups();
    this.getEquipmentList();
    this.setFormData();
  }

  // Set form data
  setFormData() {
    this.uploadForm = this._formBuilder.group({
      filesArray: this._formBuilder.array([this.createItem('', '')]),
    });
  }

  // Create FormGroup for an attribute
  createItem(name, file): FormGroup {
    return this._formBuilder.group({
      name: name,
      file: file,
    });
  }
  // Get All Equipment types
  getEquipmentList() {
    this.equipmentService.getTypes().subscribe(
      (response: any) => {
        this.equipmentList = (response.equipment_types || []).reverse();
        if (this.eqTypeForUpdate !== '') {
          for (let i = 0; i < this.equipmentList.length; i++) {
            if (this.equipmentList[i].type === this.eqTypeForUpdate) {
              this.configObj.equipmentType = this.equipmentList[i];
              break;
            } else {
              continue;
            }
          }
          this.getAttrMetadata();
        }
      },
      (error) => {
        console.log('Error fetching equipments list');
      }
    );
  }

  // Get Groups
  getGroups() {
    this.groupService.getDirectGroups().subscribe(
      (response: any) => {
        this.groupList = response.groups.map((res) => res.name);
        this.scopesList = response.groups.map((res) => {
          return res.scopes;
        });
        this.configObj.group = this.groupList[0];
      },
      (error) => {
        console.log('Error fetching groups');
      }
    );
  }

  // Get metadata
  getAttrMetadata() {
    this.configurationService.listConfiguration(this.eqTypeForUpdate).subscribe(
      (response: any) => {
        if (response.configurations) {
          response.configurations
            .filter((res) => res.config_id == this.configID)
            .map((res) => {
              this.eqTypeMetadata = res;
            });
          this.getEquipmentAttributeList(this.eqTypeForUpdate);
        }
      },
      (error) => {
        console.log('Error fetching metric list');
      }
    );
  }

  refreshAttributes() {
    this.refreshAttributesFlag = true;
    this.getEquipmentAttributeList(this.configObj.equipmentType.type);
  }
  cancel() {
    this.refreshAttributesFlag = false;
    this.configObj.equipmentType = this.selectedEqType;
  }
  openModal(templateRef, width) {
    let dialogRef = this.dialog.open(templateRef, {
      width: width,
      disableClose: true,
    });
  }

  get filesArray() {
    return this.uploadForm.get('filesArray') as FormArray;
  }
  // Get Attributes of selected equipment type
  getEquipmentAttributeList(selectedEquip) {
    let allAttributes = [];
    this.equipmentList
      .filter((eqs) => eqs.type === selectedEquip)
      .map((eq) => {
        eq.attributes.map((attr) => {
          allAttributes.push({
            name: attr.name,
            simulable: false,
            fileName: null,
          });
        });
      });
    this.attributeList = allAttributes.filter(
      (value, index, self) =>
        self.map((x) => x.name).indexOf(value.name) == index
    );
    this.configObj.attributes = [];
    this.attributeList.map((item) => {
      var attrFound = false;
      var attrFileName = '';
      var attrID = '';
      // for(var i = 0; i < this.eqTypeMetadata.length; i++) { // get creation data
      for (var j = 0; j < this.eqTypeMetadata.config_attributes.length; j++) {
        if (
          this.eqTypeMetadata.config_attributes[j].attribute_name === item.name
        ) {
          attrFound = true;
          attrID = this.eqTypeMetadata.config_attributes[j].attribute_id;
          attrFileName =
            this.eqTypeMetadata.config_attributes[j].config_filename;
          break;
        }
      }
      // }
      if (attrFound) {
        this.configObj.attributes.push({
          attributeID: attrID,
          attributeName: item.name,
          simulable: true,
          file: {},
          fileName: attrFileName,
          fileInvalid: false,
        });
      } else {
        this.configObj.attributes.push({
          attributeID: '',
          attributeName: item.name,
          simulable: item.simulable,
          file: {},
          fileName: item.fileName,
          fileInvalid: false,
        });
      }
    });
    this.NoChangesFlag = true;
    this.canApplyCheck();
  }

  // file upload
  fileChangeListener(event: any, index): void {
    const files = event.srcElement.files;

    if (files !== null && files !== undefined && files.length > 0) {
      const reader: FileReader = new FileReader();
      reader.readAsText(files[0]);
      reader.onload = (e) => {
        const csv = reader.result;
        const results = this.papa.parse(csv as string, {
          header: false,
          delimiter: () => {
            if (csv.toString().indexOf(this.delimiter) !== -1) {
              return this.delimiter;
            } else {
              return ' ';
            }
          },
        });

        // VALIDATE PARSED CSV FILE
        if (
          results !== null &&
          results !== undefined &&
          results.data !== null &&
          results.data !== undefined &&
          results.data.length > 0 &&
          results.errors.length === 0
        ) {
          // PERFORM OPERATIONS ON PARSED CSV
          let csvTableHeader = results.data[0];
          if (csvTableHeader[0] === this.attributeList[index].name) {
            this.configObj.attributes[index].simulable = true;
            this.configObj.attributes[index].file = files;
            this.configObj.attributes[index].fileName = files[0].name;
            this.configObj.attributes[index].fileInvalid = false;
            this.filesArray.push(
              this.createItem(this.attributeList[index].name, files[0])
            );
            this.NoChangesFlag = false;
          } else {
            this.configObj.attributes[index].simulable = false;
            this.configObj.attributes[index].file = {};
            this.configObj.attributes[index].fileName = files[0].name;
            this.configObj.attributes[index].fileInvalid = true;
            this.filesArray.removeAt(
              this.filesArray.value.findIndex(
                (res) => res.name === this.attributeList[index].name
              )
            );
            this.NoChangesFlag = false;
          }
          this.canApplyCheck();
        } else {
          for (let i = 0; i < results.errors.length; i++) {
            console.log('Error Parsing CSV File: ', results.errors[i].message);
          }
        }
      };
    } else {
      console.log('No File Selected');
    }
  }

  // Check if user can apply the uploaded files
  canApplyCheck() {
    this.formInvalidFlag = false;
    this.configObj.attributes.map((res) => {
      if (res.fileInvalid) this.formInvalidFlag = true;
    });
    this.checkIfAnyChangeMade();
  }

  // Atleast one configuration attribute changed check
  checkIfAnyChangeMade() {
    this.NoFileSelectedFlag = true;
    const files = this.filesArray.value.filter((val) => {
      if (val.name && val.name != '') {
        return val;
      }
    });
    const allFiles = this.configObj.attributes.filter((res) => {
      if (res.fileName && (res.fileInvalid || (res.file && res.file.length))) {
        return res;
      }
    });
    if (allFiles && allFiles.length > 0) {
      this.disableResetFlag = false;
    } else {
      this.disableResetFlag = true;
    }
    if (files && files.length > 0) {
      this.NoFileSelectedFlag = false;
    }
    if (this.deletedConfigAttrs.length > 0) {
      this.NoChangesFlag = false;
      this.NoFileSelectedFlag = false;
      this.disableResetFlag = false;
    }
    if (
      files &&
      files.length == 0 &&
      this.deletedConfigAttrs.length ===
        this.eqTypeMetadata.config_attributes.length
    ) {
      this.NoFileSelectedFlag = true;
    }
  }

  //Apply changes
  uploadFile(successMsg, errorMsg) {
    this.loading = true;
    const formData = new FormData();
    formData.append('scope', this.cs.getLocalData(LOCAL_KEYS.SCOPE));
    this.filesArray.value.map((val) => {
      if (val.name) {
        formData.append(val.name, val.file);
      }
    });
    formData.append('deletedMetadataIDs', this.deletedConfigAttrs.toString());
    this.editRequestSentFlag = true;
    this.configurationService
      .updateConfiguration(formData, this.configID)
      .subscribe(
        (data) => {
          this.openModal(successMsg, '30%');
          this.loading = false;
          console.log('success! ', data);
        },
        (err) => {
          this.openModal(errorMsg, '30%');
          this.loading = false;
          console.log('error ', err);
        }
      );
  }

  //Delete a particular attribute from list
  deleteAttributeById(index) {
    this.configObj.attributes[index].file = {};
    this.configObj.attributes[index].fileName = null;
    this.configObj.attributes[index].simulable = false;
    this.configObj.attributes[index].fileInvalid = false;
    var attrFound = false;
    // for(var i = 0; i < this.eqTypeMetadata.length; i++) { // get creation data
    for (var j = 0; j < this.eqTypeMetadata.config_attributes.length; j++) {
      if (
        this.eqTypeMetadata.config_attributes[j].attribute_name ===
        this.configObj.attributes[index].attributeName
      ) {
        attrFound = true;
        break;
      }
    }
    //  }
    if (attrFound) {
      if (
        this.deletedConfigAttrs.indexOf(
          this.configObj.attributes[index].attributeID
        ) === -1
      ) {
        this.deletedConfigAttrs.push(
          this.configObj.attributes[index].attributeID
        );
      }
    }
    this.clearFileInput(document.getElementsByClassName('file-upload'), index);
    for (var j = 0; j < this.filesArray.value.length; j++) {
      if (
        this.filesArray.value[j].name ===
        this.configObj.attributes[index].attributeName
      ) {
        this.id = j;
        break;
      }
    }
    if (this.id) {
      this.filesArray.removeAt(this.id);
    }
    this.canApplyCheck();
  }

  // Reset form
  reset(e) {
    while (this.filesArray.length !== 0) {
      this.filesArray.removeAt(0);
    }
    this.deletedConfigAttrs = [];
    this.getEquipmentAttributeList(this.eqTypeForUpdate);
    this.NoChangesFlag = true;
    this.NoFileSelectedFlag = true;
  }

  // Reset selected files
  clearFileInput(ctrl: any, index?: number) {
    if (ctrl) {
      let nodes = ctrl.length;
      if (!isUndefined(index)) {
        ctrl[index].value = null;
      } else {
        for (let i = 0; i < nodes; i++) {
          try {
            ctrl[i].value = null;
          } catch (ex) {
            if (ctrl[i].value) {
              ctrl[i].parentNode.replaceChild(
                ctrl[i].parentNode.firstChild.cloneNode(true),
                ctrl[i].parentNode.firstChild
              );
            }
          }
        }
      }
    }
  }

  // Navigate to list view
  backToList() {
    this.router.navigate(['/optisam/cm/simulation-configuration']);
  }

  ngOnDestroy() {
    this.loadingSubscription.unsubscribe();
    this.dialog.closeAll();
  }
}
