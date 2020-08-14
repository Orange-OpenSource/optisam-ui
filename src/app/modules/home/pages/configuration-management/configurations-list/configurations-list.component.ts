// Copyright (C) 2019 Orange
// 
// This software is distributed under the terms and conditions of the 'Apache License 2.0'
// license which can be found in the file 'License.txt' in this package distribution 
// or at 'http://www.apache.org/licenses/LICENSE-2.0'. 

import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog } from '@angular/material';
import { SharedService } from 'src/app/shared/shared.service';
import { Subscription, forkJoin } from 'rxjs';
import { EquipmentsService } from 'src/app/core/services/equipments.service';
import { ConfigurationService } from 'src/app/core/services/configuration.service';
import { EditConfigurationComponent } from '../edit-configuration/edit-configuration.component';
import { ConfigurationSimulationComponent } from '../configuration-simulation/configuration-simulation.component';

@Component({
  selector: 'app-configurations-list',
  templateUrl: './configurations-list.component.html',
  styleUrls: ['./configurations-list.component.scss']
})
export class ConfigurationsListComponent implements OnInit {
  loadingSubscription: Subscription;
  HTTPActivity: Boolean;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  configurationData: any[]=[];
  displayedColumns: string[] = [
    'id',
    'name',
    'equipType',
    'attributes',
    'created_by',
    'created_on',
    'action'
  ];
  role: string;
  _loading: Boolean = true;
  equipmentList: any[] = [];
  configToDelete: any;
  data: any=[];

  constructor(
    private sharedService: SharedService,
    private equipmentService: EquipmentsService,
    private configurationService: ConfigurationService,
    public dialog: MatDialog) { 
      this.loadingSubscription = this.sharedService.httpLoading().subscribe(data => {
        this.HTTPActivity = data;
      });
      dialog.afterAllClosed.subscribe((res)=>this.getEquipmentList());
    }

  ngOnInit() {
    this.role = localStorage.getItem('role');
    // this.getEquipmentList();
  }

  // Get All Equipment types
  getEquipmentList() {
    this._loading = true;
    this.configurationData = [];
    this.equipmentService.getTypes().subscribe((response: any) => {
      this.equipmentList = response.equipment_types || [];
      this.getConfigurations();
    }, (error) => {
      console.log("Error fetching equipments list");
    });
  }

  getConfigurations() {
    this.data = [];
    var url = [];
    for (let i = 0; i < this.equipmentList.length; i++) {
      url.push(this.configurationService.listConfiguration(this.equipmentList[i].type));
    }
    forkJoin(url).subscribe(res => {
      res.map(eq=>{if(eq.configurations) {
        eq.configurations.map((config)=>{
          this.data.push({
            'config_id': config.config_id,
            'config_name': config.config_name,
            'equipment_type': config.equipment_type,
            'created_by': config.created_by,
            'created_on': config.created_on,
            'attributes': config.config_attributes.map((res) => res.attribute_name)});
          });
        }});
        this.configurationData = [];
        this.configurationData = this.data;
        this._loading = false;
      }, (error) => {
        this._loading = false;
        console.log("Error fetching configurations list", error);
      });
  }

  sortData(ev) {
    return ev;
  }

  deleteConfigurationConfirmation(configuration, templateRef) {
    this.configToDelete = configuration;
    this.openModal(templateRef);
  }
  deleteConfiguration(successMsg,errorMsg) {
    if(this.configurationData && this.configurationData.length>0) {
      this.configurationService.deleteConfiguration(this.configToDelete.config_id).subscribe(data => {
        var temp = this.configurationData.filter((res)=>{if(res.config_id !== this.configToDelete.config_id) {return res;}})
        this.openModal(successMsg);
        this.configurationData = [];
        this.configurationData = temp;
        this._loading = false;
      }, (error) => {
        this.openModal(errorMsg);
        this._loading = false;
        console.log("Error fetching configurations list");
      });
    }
  }

  openDialog(value): void {
    localStorage.setItem('eqType', value.equipment_type);
    const dialogRef = this.dialog.open(EditConfigurationComponent, {
      width: '700px',
      disableClose: true,
      maxHeight: '90vh',
      data: {
          datakey : value
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      localStorage.setItem('eqType', '');
    });
  }
  
  createNew() {
    const dialogRef = this.dialog.open(ConfigurationSimulationComponent, {
      width: '700px',
      autoFocus: false,
      disableClose: true,
      maxHeight: '90vh'
    });
  }

  openModal(templateRef) {
    let dialogRef = this.dialog.open(templateRef, {
        width: '50%',
        disableClose: true
    });
  }
  ngOnDestroy() {
    this.loadingSubscription.unsubscribe();
  }
}
