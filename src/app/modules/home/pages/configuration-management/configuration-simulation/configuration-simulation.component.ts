import { Component, OnInit } from '@angular/core';
import { SharedService } from 'src/app/shared/shared.service';
import { GroupService } from 'src/app/core/services/group.service';
import { EquipmentsService } from 'src/app/core/services/equipments.service';
import { Papa } from 'ngx-papaparse';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { ConfigurationService } from 'src/app/core/services/configuration.service';
import { isUndefined } from 'util';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { CommonService } from '@core/services';
import { LOCAL_KEYS } from '@core/util/constants/constants';

@Component({
  selector: 'app-configuration-simulation',
  templateUrl: './configuration-simulation.component.html',
  styleUrls: ['./configuration-simulation.component.scss'],
})
export class ConfigurationSimulationComponent implements OnInit {
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
  invalidConfigName: Boolean = false;
  configName: string = '';
  configNamesList: any[] = [];
  duplicateConfigName: Boolean = false;
  allowedLengthExceeded: Boolean = false;
  configNameRequired: Boolean = false;
  loading: Boolean;

  constructor(
    private sharedService: SharedService,
    private groupService: GroupService,
    private equipmentService: EquipmentsService,
    private configurationService: ConfigurationService,
    private papa: Papa,
    private _formBuilder: FormBuilder,
    private dialog: MatDialog,
    private cs: CommonService,
    private router: Router
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
        this.getConfigNames();
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

  // get list of all configurations
  getConfigNames() {
    for (let i = 0; i < this.equipmentList.length; i++) {
      this.configurationService
        .listConfiguration(this.equipmentList[i].type)
        .subscribe(
          (response: any) => {
            if (response.configurations) {
              response.configurations.map((res) =>
                this.configNamesList.push(res.config_name)
              );
            }
          },
          (error) => {
            console.log('Error fetching metric list');
          }
        );
    }
  }
  // Function for change in dropdown selection
  selectionChanged(ev: any, type: string, templateRef) {
    switch (type) {
      case 'equipment': //Get Attributes
        const changedAttributes = this.configObj.attributes.filter(
          (res) => res.fileName
        ).length;
        if (changedAttributes > 0) {
          this.openModal(templateRef, '40%');
        }
        if (changedAttributes === 0) {
          this.selectedEqType = ev.value;
          this.getEquipmentAttributeList(this.selectedEqType.type);
        }
        break;

      default:
        break;
    }
  }
  refreshAttributes() {
    this.refreshAttributesFlag = true;
    this.selectedEqType = this.configObj.equipmentType;
    this.reset();
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
      this.configObj.attributes.push({
        attributeName: item.name,
        simulable: item.simulable,
        file: {},
        fileName: item.fileName,
        fileInvalid: false,
      });
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
    this.checkConfigName();
  }

  // Atleast one configuration attribute changed check
  checkIfAnyChangeMade() {
    let files = this.configObj.attributes.filter((res) => {
      if (res.fileName) return res;
    });
    if (files.length > 0) {
      this.NoFileSelectedFlag = false;
    }
  }

  // Validate configuration name format
  validateConfigName(ev) {
    var regEx = new RegExp('^[-_,A-Za-z0-9]+$');
    const specialKeys: Array<string> = [
      'Backspace',
      'Delete',
      'End',
      'Home',
      'Enter',
    ];
    if (
      !regEx.test(ev.srcElement.value) &&
      specialKeys.indexOf(ev.key) === -1
    ) {
      this.invalidConfigName = true;
    } else {
      this.invalidConfigName = false;
    }
    if (
      this.configNamesList
        .map((res) => res.toLowerCase())
        .includes(ev.srcElement.value.toLowerCase())
    ) {
      this.duplicateConfigName = true;
    } else {
      this.duplicateConfigName = false;
    }
    if (ev.srcElement.value.length > 50) {
      this.allowedLengthExceeded = true;
    } else {
      this.allowedLengthExceeded = false;
    }
  }

  checkConfigName() {
    if (!this.configName || this.configName == '') {
      this.configNameRequired = true;
    } else {
      this.configNameRequired = false;
    }
  }

  //Apply changes
  uploadFile(successMsg, errorMsg) {
    this.loading = true;
    this.NoChangesFlag = true;
    const formData = new FormData();
    formData.append('equipment_type', this.selectedEqType.type);
    formData.append('scope', this.cs.getLocalData(LOCAL_KEYS.SCOPE));
    formData.append('config_name', this.configName);
    this.filesArray.value.map((val) => {
      if (val.name) {
        formData.append(val.name, val.file);
      }
    });

    this.configurationService.uploadConfiguration(formData).subscribe(
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
    this.configObj.attributes[index].file = {}; // .map((res)=>{if(res.fileName) {res.file = {}; res.fileName=null; res.simulable=false;}})
    this.configObj.attributes[index].fileName = null;
    this.configObj.attributes[index].simulable = false;
    this.configObj.attributes[index].fileInvalid = false;
    this.clearFileInput(document.getElementsByClassName('file-upload'), index);
    this.NoFileSelectedFlag = true;
    this.checkIfAnyChangeMade();
    this.canApplyCheck();
    for (var j = 0; j < this.filesArray.value.length; j++) {
      if (
        this.filesArray.value[j].name ===
        this.configObj.attributes[index].attributeName
      ) {
        this.id = j;
      }
    }

    this.filesArray.removeAt(this.id);
  }

  // Reset form
  reset() {
    // this.configObj.attributes.forEach((attr) => { attr.simulable = false; attr.file = {}; attr.fileName = null; attr.fileInvalid = false;});
    // this.clearFileInput(document.getElementsByClassName("file-upload"));
    this.getEquipmentAttributeList(this.selectedEqType.type);
    while (this.filesArray.length !== 0) {
      this.filesArray.removeAt(0);
    }
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
    this.dialog.closeAll();
    this.loadingSubscription.unsubscribe();
  }
}
