import { GroupusrmanagementComponent } from './../groupusrmanagement/groupusrmanagement.component';
import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EditGrpNameComponent } from '../edit-grp-name/edit-grp-name.component';
import { GroupService } from 'src/app/core/services/group.service';
import { BehaviorSubject, observable, of as observableOf, merge, Observable, Subject } from 'rxjs';
import { CollectionViewer, SelectionChange } from '@angular/cdk/collections';
import { map, first } from 'rxjs/operators';
import { CreateGroupComponent } from '../create-group/create-group.component';
import { Router } from '@angular/router';
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
  childNode: Group[];
  rootLevelNodes: Group[];
  _childrenLoaded = new Subject<boolean>();
  constructor(private groupService: GroupService) {}

  /** Initial data from database */
  initialData(data): DynamicFlatNode[] {
    let expand = false;
    const arr: DynamicFlatNode[] = [];
    for (let i = 0; i < data.length; i++) {
      const obj = Object.keys(data[i]);
      if (!obj.includes('num_of_child_groups')) {
        data[i].num_of_child_groups = '0';
        expand = false;
      } else {
        expand = true;
      }
      arr.push(new DynamicFlatNode(data[i], 0, expand));
    }
    return arr;
  }

  getChildren(node: Group) {
    let nestedRes = [];
    this.childNode = null;
    this.groupService.getChildGroups(node.ID).subscribe(res => {
      nestedRes = res.groups;
      for (let i = 0; i < nestedRes.length; i++) {
        const obj = Object.keys(nestedRes[i]);
        if (!obj.includes('num_of_child_groups')) {
          nestedRes[i].num_of_child_groups = '0';
        }
        if (!obj.includes('num_of_users')) {
          nestedRes[i].num_of_users = '0';
        }
      }
      this.childNode = nestedRes;
      this._childrenLoaded.next(true);
    });
    return this._childrenLoaded;
  }

  isExpandable(node: Group): boolean {
    const obj = Object.keys(node);
    if (obj.includes('num_of_child_groups')) {
      return parseInt(node.num_of_child_groups, 10) > 0;
    } else {
      return false;
    }
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
    this._treeControl.expansionModel.changed.subscribe(change => {
      if ((change as SelectionChange<DynamicFlatNode>).added ||
        (change as SelectionChange<DynamicFlatNode>).removed) {
        this.handleTreeControl(change as SelectionChange<DynamicFlatNode>);
      }
    });
    return merge(collectionViewer.viewChange, this.dataChange).pipe(map(() => this.data));
  }

  // Handle expand/collapse behaviors 
  handleTreeControl(change: SelectionChange<DynamicFlatNode>) {
    if (change.added) {
      change.added.forEach(node => this.toggleNode(node, true));
    }
    if (change.removed) {
      change.removed.slice().reverse().forEach(node => this.toggleNode(node, false));
    }
  }

  // Toggle the node
  toggleNode(node: DynamicFlatNode, expand: boolean) {
    const index = this.data.indexOf(node);
    if (!expand) {
      let count = 0;
      for (let i = index + 1; i < this.data.length
        && this.data[i].level > node.level; i++, count++) { }
      this.data.splice(index + 1, count);
      this.dataChange.next(this.data);
    }
    else {
      node.isLoading = true;
      this._database.getChildren(node.item).pipe(first()).subscribe(c => {
        const children = this._database.childNode;
        if (!children || index < 0) { // If no children, or cannot find the node, no op
          return;
        }
        if (expand) {
          const nodes = children.map(name =>
            new DynamicFlatNode(name, node.level + 1, this._database.isExpandable(name)));
          this.data.splice(index + 1, 0, ...nodes);
        } else {
          let count = 0;
          for (let i = index + 1; i < this.data.length
            && this.data[i].level > node.level; i++, count++) { }
          this.data.splice(index + 1, count);
        }
        // notify the change
        this.dataChange.next(this.data);
        node.isLoading = false;
      });
    }
  }
}
//  Component code start from here
@Component({
  selector: 'app-groupmangement',
  templateUrl: './groupmangement.component.html',
  styleUrls: ['./groupmangement.component.scss'],
})
export class GroupmangementComponent {
  treeControl: FlatTreeControl<DynamicFlatNode>;
  role: String;
  _loading: Boolean;
  _deleteLoading: Boolean;
  dataSource: DynamicDataSource;
  IDToDelete: any;
  nodeToDelete: any;
  errorMessage:string;

  constructor(public database: DynamicDatabase, private groupService: GroupService, public dialog: MatDialog) {
    this.role = localStorage.getItem('role');
    this.processTree();
   
  }

  processTree() {
    this._loading = true;
    this.treeControl = new FlatTreeControl<DynamicFlatNode>(this.getLevel, this.isExpandable);
    this.dataSource = new DynamicDataSource(this.treeControl, this.database);
    this.groupService.getDirectGroups().subscribe(res => {
      this.dataSource.data = this.database.initialData(res.groups);
      this.treeControl.expandAll();
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
    this.openModal(confirmationMsg,'40%');
  }

  deleteGrp(successMsg, errorMsg) {
    this._deleteLoading = true;
    this.groupService.deleteGroups(this.IDToDelete).subscribe(res => {
         this.groupService.getChildGroups(this.nodeToDelete.item.parent_id).subscribe(chilres => {
          this.nodeToDelete.item = chilres;
        });
        this._deleteLoading = false;
        this.dialog.closeAll();
        this.openModal(successMsg,'30%');
      },
        error => {
          this._deleteLoading = false;
          this.errorMessage = error.error.message;
          this.dialog.closeAll();
          console.log('Group Delete response ERROR !!!' + error);
          this.openModal(errorMsg,'30%');
        });
  }

  createNewGroup(parent) {
    const dialogRef = this.dialog.open(CreateGroupComponent, {
      width: '35vw',
      autoFocus: false,
      disableClose: true,
      maxHeight: '90vh',
      data: parent
    });

    dialogRef.afterClosed().subscribe(result => {
      const successEvent = dialogRef.componentInstance.actionSuccessful;
      if(successEvent){
        this.processTree();
      }
    });
  }

  manageUsers(item) {
    const dialogRef = this.dialog.open(GroupusrmanagementComponent, {
      autoFocus: false,
      disableClose: true,
      maxHeight: '90vh',
      data: item
    });

    dialogRef.afterClosed().subscribe(result => {
      const successEvent = dialogRef.componentInstance.actionSuccessful;
        if(successEvent) {
          this.processTree();
        }
    });
  }

  editGroup(item) {
    const dialogRef = this.dialog.open(EditGrpNameComponent, {
      data: item,
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      const successEvent = dialogRef.componentInstance.actionSuccessful;
        if(successEvent) {
          this.processTree();
        }
    });
  }

  formatScopes(scopes) {
    let scopesList = scopes[0];
    for(let i=1; i<scopes.length; i++) {
      scopesList += (', ' + scopes[i]);
    }
    return scopesList;
  }

  openModal(templateRef,width) {
    let dialogRef = this.dialog.open(templateRef, {
      width: width,
      disableClose: true
    });
  }

  ngOnDestroy() {
    this.dialog.closeAll();
  }

}