import { Component, OnInit } from '@angular/core';
import { EquipmentTypeManagementService } from '../../../../core/services/equipmenttypemanagement.service';
import { HttpClient } from '@angular/common/http';
import { AddComponent } from './dialogs/add/add.component';
import { EditComponent } from './dialogs/edit/edit.component';
import { ListComponent } from './dialogs/list/list.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { allowedScopes } from 'src/app/core/util/common.functions';
import { CommonService } from '@core/services/common.service';
import { LOCAL_KEYS } from '@core/util/constants/constants';

@Component({
  selector: 'app-equipmenttypemanagement',
  templateUrl: './equipmenttypemanagement.component.html',
  styleUrls: ['./equipmenttypemanagement.component.scss'],
})
export class EquipmenttypemanagementComponent implements OnInit {
  role: string;
  displayedColumns = [
    'type',
    'metadata_source',
    'parent_type',
    'attributes',
    'actions',
  ];
  index: number;
  id: string;
  equipment_types = [];
  _loading: Boolean;
  datasource: MatTableDataSource<{}>;
  mydatasource: MatTableDataSource<{}>;
  MyDataSource: MatTableDataSource<{}>;
  typeToDelete: string;
  parentTypeIDs: any[] = [];
  _deleteLoading: Boolean;
  errorMessage: string;
  allowedRoles: string[] = ['ADMIN', 'SUPER_ADMIN'];

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public equipmentTypeManagementService: EquipmentTypeManagementService,
    public common: CommonService
  ) {}

  ngOnInit() {
    this.role = this.common.getLocalData(LOCAL_KEYS.ROLE);
    this.loadData();
  }

  // Flag showing if type can be deleted or not
  canDelete(IDToDelete): Boolean {
    if (this.parentTypeIDs.includes(IDToDelete)) {
      return false;
    }
    return true;
  }

  // Get list of equipments
  loadData() {
    this._loading = true;
    this.equipmentTypeManagementService.getTypes().subscribe(
      (res: any) => {
        this.MyDataSource = new MatTableDataSource(
          (res.equipment_types || []).reverse()
        );
        this.parentTypeIDs = (res.equipment_types || []).map(
          (type) => type.parent_id
        );
        this._loading = false;
      },
      (error) => {
        this._loading = false;
        console.log('There was an error while retrieving Posts !!!' + error);
      }
    );
  }
  // Add new Equipment Type
  addNew() {
    const dialogRef = this.dialog.open(AddComponent, {
      autoFocus: false,
      minWidth: '80vw',
      maxHeight: '90vh',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((res) => {
      this.loadData();
    });
  }
  // Edit existing Equipment Type
  startEdit(equipment) {
    const dialogRef = this.dialog.open(EditComponent, {
      minWidth: '80vw',
      maxHeight: '90vh',
      autoFocus: false,
      data: equipment,
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((res) => {
      this.loadData();
    });
  }

  listAttributes(name, attributes) {
    const dialogRef = this.dialog.open(ListComponent, {
      minWidth: '80vw',
      maxHeight: '90vh',
      autoFocus: false,
      data: { name, attributes },
      disableClose: true,
    });
  }
  deleteEquipmentTypeConfirmation(type, templateRef) {
    this.typeToDelete = type.type;
    this.openModal(templateRef, '40%');
  }

  deleteEquipmentType(successMsg, errorMsg) {
    this._deleteLoading = true;
    this.equipmentTypeManagementService
      .deleteEquipmentType(this.typeToDelete)
      .subscribe(
        (res) => {
          this.dialog.closeAll();
          this.openModal(successMsg, '30%');
          this._deleteLoading = false;
          console.log('Successfully Deleted! ', this.typeToDelete);
        },
        (error) => {
          this.dialog.closeAll();
          this.errorMessage =
            error.error.message ||
            'Some error occured! Equipment type could not be deleted';
          this.openModal(errorMsg, '30%');
          this._deleteLoading = false;
          console.log('Error occured while deleting equipment type!');
        }
      );
  }

  openModal(templateRef, width) {
    let dialogRef = this.dialog.open(templateRef, {
      width: width,
      disableClose: true,
    });
  }

  get allowedScope(): boolean {
    return this.common.allowedScopes;
  }

  ngOnDestroy() {
    this.dialog.closeAll();
  }
}
