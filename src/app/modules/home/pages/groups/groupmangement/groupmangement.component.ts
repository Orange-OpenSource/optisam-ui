// Copyright (C) 2019 Orange
// 
// This software is distributed under the terms and conditions of the 'Apache License 2.0'
// license which can be found in the file 'License.txt' in this package distribution 
// or at 'http://www.apache.org/licenses/LICENSE-2.0'. 

import { GroupusrmanagementComponent } from './../groupusrmanagement/groupusrmanagement.component';
import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, OnInit, Injectable } from '@angular/core';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { MatDialog, MatTableDataSource } from '@angular/material';
import { EditGrpNameComponent } from '../edit-grp-name/edit-grp-name.component';
import { GroupService } from 'src/app/core/services/group.service';
import { BehaviorSubject, observable, of as observableOf, merge, Observable } from 'rxjs';
import { CollectionViewer, SelectionChange } from '@angular/cdk/collections';
import { map } from 'rxjs/operators';
import { CreateGroupComponent } from '../create-group/create-group.component';
import { Router} from '@angular/router';
export class Group {
  ID: any;
  fully_qualified_name: string;
  scopes: string[];
  name: string;
  num_of_child_groups: string;
  num_of_users: string;
  parent_id: any;
  children?: Group[];
}

export class DynamicFlatNode {
  constructor(public item: Group, public level = 1, public expandable = false,
    public isLoading = false) { }
}

@Injectable()
export class DynamicDatabase {
  childNode:  Group[];
  rootLevelNodes: Group[];
  constructor(private groupService: GroupService) {
  }


  /** Initial data from database */
  initialData(data): DynamicFlatNode[] {
    let expand = false;
    const arr: DynamicFlatNode[] = [];
      for (let i = 0; i <  data.length; i++ ) {
        const  obj =  Object.keys(data[i]);
        if (!obj.includes('num_of_child_groups')) {
          data[i].num_of_child_groups = '0' ;
          expand = false;
        } else {
          expand = true;
        }
       /*  if (!obj.includes('num_of_users')) {
          data[i].num_of_users = '0' ;
        } */
        arr.push(new DynamicFlatNode(data[i], 0, expand));
      }
    console.log('Initialize---------',  arr );
    return  arr;
  }

   getChildren(node: Group): Group[] | undefined {
    console.log('getChildren call--------', node.ID);
     let nestedRes = [];
     this.childNode = null;
    this.groupService.getChildGroups(node.ID).subscribe(res => {
     nestedRes = res.groups;
      for (let i = 0; i < nestedRes.length; i++) {
        const  obj =  Object.keys(nestedRes[i]);
      if (!obj.includes('num_of_child_groups')) {
        nestedRes[i].num_of_child_groups = '0' ;
      }
      if (!obj.includes('num_of_users')) {
        nestedRes[i].num_of_users = '0' ;
      }
    }
    this.childNode = nestedRes;
    }, );
   return ;
  }
  isExpandable(node: Group): boolean {
  const  obj =  Object.keys(node);
   if (obj.includes('num_of_child_groups')) {
    return parseInt(node.num_of_child_groups, 10) > 0;
   } else {
    return false;
   }
/*     return parseInt(node.num_of_child_groups, 10) > 0;
 */
  }
}
/**
 * File database, it can build a tree structured Json object from string.
 * Each node in Json object represents a file or a directory. For a file, it has filename and type.
 * For a directory, it has filename and children (a list of files or directories).
 * The input will be a json object string, and the output is a list of `FileNode` with nested
 * structure.
 */


@Injectable()
export class DynamicDataSource {

  dataChange = new BehaviorSubject<DynamicFlatNode[]>([]);

  get data(): DynamicFlatNode[] { return this.dataChange.value; }
  set data(value: DynamicFlatNode[]) {
    this._treeControl.dataNodes = value;
    this.dataChange.next(value);
  }

  constructor(private _treeControl: FlatTreeControl<DynamicFlatNode>,
    private _database: DynamicDatabase) { }

  connect(collectionViewer: CollectionViewer): Observable<DynamicFlatNode[]> {
    this._treeControl.expansionModel.onChange.subscribe(change => {
      if ((change as SelectionChange<DynamicFlatNode>).added ||
        (change as SelectionChange<DynamicFlatNode>).removed) {
        this.handleTreeControl(change as SelectionChange<DynamicFlatNode>);
      }
    });

    return merge(collectionViewer.viewChange, this.dataChange).pipe(map(() => this.data));
  }

  /** Handle expand/collapse behaviors */
  handleTreeControl(change: SelectionChange<DynamicFlatNode>) {
    /* setTimeout(() => { */
    if (change.added) {
      change.added.forEach(node => this.toggleNode(node, true));
    }
    if (change.removed) {
      change.removed.slice().reverse().forEach(node => this.toggleNode(node, false));
    }
 /*  }, 1050); */
  }

  /**
   * Toggle the node, remove from display list
   */
  toggleNode(node: DynamicFlatNode, expand: boolean) {
    this._database.getChildren(node.item);
    node.isLoading = true;
    setTimeout(() => {
      const children = this._database.childNode ;
    const index = this.data.indexOf(node);
    if (!children || index < 0) { // If no children, or cannot find the node, no op
      return;
    }

    node.isLoading = true;

  /*   setTimeout(() => { */
      if (expand) {
        const nodes = children.map(name =>
          new DynamicFlatNode(name, node.level + 1, this._database.isExpandable(name)));
        this.data.splice(index + 1, 0, ...nodes);
      } else {
        let count = 0;
        for (let i = index + 1; i < this.data.length
          && this.data[i].level > node.level; i++ , count++) { }
        this.data.splice(index + 1, count);
      }

      // notify the change
      this.dataChange.next(this.data);
      node.isLoading = false;
    }, 2000);
  }
}



@Component({
  selector: 'app-groupmangement',
  templateUrl: './groupmangement.component.html',
  styleUrls: ['./groupmangement.component.scss'],
})
export class GroupmangementComponent  {
  treeControl: FlatTreeControl<DynamicFlatNode>;
  role: String;
  _loading: Boolean;
  dataSource: DynamicDataSource;
  IDToDelete: any;
  nodeToDelete:any;

  constructor(private database: DynamicDatabase, private groupService: GroupService, public dialog: MatDialog,
    private router: Router) {
      this.role = localStorage.getItem('role');
      this.processTree();
      // dialog.afterAllClosed.subscribe((res)=>this.processTree());
  }
 processTree() {
  this._loading = true;
  this.treeControl = new FlatTreeControl<DynamicFlatNode>(this.getLevel, this.isExpandable);
  this.dataSource = new DynamicDataSource(this.treeControl, this.database);
  this.groupService.getDirectGroups().subscribe(res => {
    this.dataSource.data = this.database.initialData(res.groups);
    this._loading = false;
  },
    error => {
      console.log('Fetch direct Group response ERROR !!!' + error);
    });

}


  getLevel = (node: DynamicFlatNode) => node.level;

  isExpandable = (node: DynamicFlatNode) => node.expandable;

  hasChild = (_: number, _nodeData: DynamicFlatNode) => _nodeData.expandable;

  deleteConfirmation(id, node, confirmationMsg) {
    this.IDToDelete = id;
    this.nodeToDelete = node;
    this.openModal(confirmationMsg);
  }
  deleteGrp(successMsg, errorMsg) {
    // const r = confirm('Are you sure to delete Group??');
    // if (r === true) {
      this.groupService.deleteGroups(this.IDToDelete).subscribe
      (res => {
        console.log('Group Delete response------', this.nodeToDelete.item.parent_id);
        this.processTree();
        this.groupService.getChildGroups(this.nodeToDelete.item.parent_id).subscribe(chilres => {
          this.nodeToDelete.item = chilres;
       //   this.dataSource.toggleNode(node, true);
        });
        this.openModal(successMsg);
        /* this._database.tog */
      },
      error => {
        console.log('Group Delete response ERROR !!!' + error);
        this.openModal(errorMsg);
      });
    // } else {
    //   console.log('not delete', r);
    // }
}
addNew(item, node) {
  const dialogRef = this.dialog.open(CreateGroupComponent, {
    // width: '850px',
    maxHeight: '600px',
    data: item,
    disableClose: true
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result === 1) {
      this.processTree();
      this.loadData();
    }
  });
}
loadData() {

}

userManegment(item, node) {
  const dialogRef = this.dialog.open(GroupusrmanagementComponent, {
    width: '850px',
    maxHeight: '500px',
    autoFocus:false,
    data: item,
    disableClose:true
  });

  dialogRef.afterClosed().subscribe(result => {
    /* if (result === 1) { */
     /*  this.router.navigate(['/optisam/gr/groupMang']); */
     this.processTree();
      this.loadData();
  /*   } */
  });
  }
EditName(item, node) {
const dialogRef = this.dialog.open(EditGrpNameComponent, {
//  width: '850px',
 data: {node: item, type : 'edit'},
 disableClose: true
});

dialogRef.afterClosed().subscribe(result => {
  if (result === 1) {
   /*  this.router.navigate(['/optisam/gr/groupMang']); */
 // data.item.ID = item.parent_id;
 // item.ID = item.parent_id;
  // this.database.getChildren(item);
 // this.dataSource.toggleNode(data, true);
   /* this.processTree();
    this.loadData(); */
    if (result === 1) {
      this.processTree();
      this.loadData();
    }
  }
});
}
viewScope(node) {
  const dialogRef = this.dialog.open(EditGrpNameComponent, {
   width: '600px',
   autoFocus:false,
   data: {node: node, type : 'scope'},
  });
  dialogRef.afterClosed().subscribe(result => {
    if (result === 1) {
     /*  this.router.navigate(['/optisam/gr/groupMang']); */
      this.loadData();
    }
  });
  }

  openModal(templateRef) {
    let dialogRef = this.dialog.open(templateRef, {
        width: '50%',
        disableClose: true
    });
  }

  ngOnDestroy() {
    this.dialog.closeAll();
  }
}
