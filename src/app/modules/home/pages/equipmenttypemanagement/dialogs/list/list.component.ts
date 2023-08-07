import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  attribute = this.data.attributes;
  
  displayedColumns = ['name', 'data_type', 'mapped_to', 'searchable', 'displayed' ];
  equipName: any;
  attributes1:any=[]

  constructor(public dialogRef: MatDialogRef<ListComponent>,
    @Inject(MAT_DIALOG_DATA) public data) { }

  ngOnInit() {
    this.attributes1=this.attribute?.filter((att:any)=>att.name!=='parent_id')
    this.equipName = this.data['name'];
  }

}
