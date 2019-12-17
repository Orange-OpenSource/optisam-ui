import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {EquipmentTypeManagementService} from '../../../../core/services/equipmenttypemanagement.service';
import {HttpClient} from '@angular/common/http';
import {MatDialog, MatTableDataSource } from '@angular/material';
import {Type} from './model';
import {DataSource} from '@angular/cdk/collections';
import {AddComponent} from './dialogs/add/add.component';
import {EditComponent} from './dialogs/edit/edit.component';
import {BehaviorSubject, fromEvent, merge, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import { ListComponent } from './dialogs/list/list.component';
import { RequiredJSONFormat } from './dialogs/model';

@Component({
  selector: 'app-equipmenttypemanagement',
  templateUrl: './equipmenttypemanagement.component.html',
  styleUrls: ['./equipmenttypemanagement.component.scss']
})
export class EquipmenttypemanagementComponent implements OnInit {
  role: String;
  displayedColumns = ['type', 'metadata_source',  'parent_type', 'attributes' , 'actions'];
  equipmentTypeService: EquipmentTypeManagementService | null;
  // dataSource: ExampleDataSource | null;
  index: number;
  id: string;
  equipment_types = [];
  datasource: MatTableDataSource<{}>;
  mydatasource: MatTableDataSource<{}>;
  MyDataSource: MatTableDataSource<{}>;
  constructor(public httpClient: HttpClient,
              public dialog: MatDialog,
              public equipmentTypeManagementService: EquipmentTypeManagementService) {}

  ngOnInit() {
 this.role = localStorage.getItem('role');
    this.loadData();
  }

  refresh() {
    this.loadData();
  }

  addNew() {
    const dialogRef = this.dialog.open(AddComponent, {
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        // After dialog is closed we're doing frontend updates
        // For add we're just pushing a new row inside DataService
        this.loadData();
      }
    });
  }

  startEdit( id: string, type: string, metadata_id: string,
     metadata_source: string, parent_type: string, parent_id: string, attributes: string) {
    const dialogRef = this.dialog.open(EditComponent, {
      // width: '850px',
      data: { id: id, type: type, metadata_id: metadata_id,
        metadata_source: metadata_source, parent_type: parent_type, parent_id: parent_id, attributes: attributes}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        // // When using an edit things are little different, firstly we find record inside DataService by id
        // const foundIndex = this.equipmentTypeService.dataChange.value.findIndex(x => x.id === this.id);
        // // Then you update that record using data from dialogData (values you enetered)
        // this.equipmentTypeService.dataChange.value[foundIndex] = this.equipmentTypeManagementService.getDialogData();
        // // And lastly refresh table
        this.loadData();
      }
    });
  }

  listAttributes(name, attributes) {
    console.log('list data', attributes);
    const dialogRef = this.dialog.open(ListComponent, {
      width: '850px',
      data: {name, attributes},
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        // // When using an edit things are little different, firstly we find record inside DataService by id
        // const foundIndex = this.equipmentTypeService.dataChange.value.findIndex(x => x.id === this.id);
        // // Then you update that record using data from dialogData (values you enetered)
        // this.equipmentTypeService.dataChange.value[foundIndex] = this.equipmentTypeManagementService.getDialogData();
        // // And lastly refresh table
        this.loadData();
      }
    });
  }
  // private refreshTable() {
  //   this.paginator._changePageSize(this.paginator.pageSize);
  // }

  public loadData() {
    // this.equipmentTypeService = new EquipmentTypeManagementService(this.httpClient);
    // this.dataSource = new ExampleDataSource(this.equipmentTypeService);
    this.equipmentTypeManagementService.getAllTypes().subscribe(
            (res: any) => {
              this.MyDataSource = new MatTableDataSource(res.equipment_types);
              console.log('data', this.MyDataSource);
              // this.dataSource.sort = this.sort;
              // this.length = res.totalRecords;
            },
            error => {
              console.log('There was an error while retrieving Posts !!!' + error);
            });
        }
  }

// export class ExampleDataSource extends DataSource<RequiredJSONFormat> {

//   renderedData: Type[] = [];

//   constructor(public _equipmentTypeService: EquipmentTypeManagementService) {
//     super();
//     // Reset to the first page when the user changes the filter.
//   }

//   /** Connect function called by the table to retrieve one stream containing the data to render. */
//   connect(): Observable<RequiredJSONFormat[]> {
//     const displayDataChanges = [
//       this._equipmentTypeService.dataChange,
//     ];

//     this._equipmentTypeService.getAllTypes();
//     return merge(...displayDataChanges).pipe(map( () => {
//         this.renderedData = this._equipmentTypeService.data.equipment_types;
//         return this.renderedData;
//       }
//     ));
//   }
//   disconnect() {}
// }
