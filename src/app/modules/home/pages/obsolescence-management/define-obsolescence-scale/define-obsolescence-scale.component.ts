// Copyright (C) 2019 Orange
// 
// This software is distributed under the terms and conditions of the 'Apache License 2.0'
// license which can be found in the file 'License.txt' in this package distribution 
// or at 'http://www.apache.org/licenses/LICENSE-2.0'. 

import { Component, OnInit } from '@angular/core';
import { ApplicationService } from 'src/app/core/services/application.service';

export interface Tile {
  id?:number;
  color: string;
  cols: number;
  rows: number;
  text: string;
  header: boolean;
}

export interface RiskTile {
  level?:number;
  criticity?:number;
  color: string;
  cols: number;
  rows: number;
  text: string;
  header: boolean;
}

@Component({
  selector: 'app-define-obsolescence-scale',
  templateUrl: './define-obsolescence-scale.component.html',
  styleUrls: ['./define-obsolescence-scale.component.scss']
})
export class DefineObsolescenceScaleComponent implements OnInit {

  allDomainsList: string[] =[];
  domainsList:any[] = [];
  criticityMeta:any[] = [];
  maintenanceLevels:any[] = [];
  riskLevels:any[] = [];
  maintenanceTiles: Tile[]=[];
  riskMatrixTiles: RiskTile[]=[];
  criticityDomains: any[] = [];
  selectedCriticity: {'domain_critic_id':any,'domain_critic_name':any};
  maintenanceCriticity: any[]=[];
  maxMonth:number = 72;
  startMonthArray:any[]=[];
  endMonthArray:any[]=[this.maxMonth];
  riskMatrix: any[];
  riskMatrixValues: any[][];
  emptyDomain: Boolean;
  emptyCriticity:Boolean;
  domainCriticitySaved: Boolean;
  domainCriticitySavedError: Boolean;
  noChangeDomainCriticity:Boolean = true;
  maintenanceTimeCriticitySaved: Boolean;
  maintenanceTimeCriticitySavedError: Boolean;
  noChangeTimeCriticity: Boolean = true;
  riskMatrixSaved: Boolean;
  riskMatrixSavedError: Boolean;
  noChangeRiskMatrix: Boolean = true;
  incompleteMatrix: Boolean;
  _domainLoading: Boolean;
  _maintenanceLoading: Boolean;
  _riskLoading: Boolean;

  constructor(private applicationService: ApplicationService) { 
    this.getDomainsPerCriticity();
    this.getCriticityMeta();
  }

  ngOnInit(): void {
  }

  // Get Metadata for domains, criticity, maintenance levels & risks
  getDomainsMeta() {
    this.allDomainsList = [];
    this._domainLoading = true;
    this.applicationService.getDomainsMeta().subscribe(res => {
      this.allDomainsList = res.domains;
      if(this.criticityDomains.length == 0) {
        this.domainsList = [];
        this.allDomainsList.map(ad => this.domainsList.push({'name':ad, 'isChecked': false}));
      } else { // To exclude already selected domains
        let selectedDomains =[];
        this.domainsList = [];
        this.criticityDomains.map(cd=> cd.domains.map(d => selectedDomains.push(d)));
        this.allDomainsList.map(ad => {
          if(!selectedDomains.includes(ad)) {
            this.domainsList.push({'name':ad, 'isChecked': false})};
        })
      } 
      this._domainLoading = false;
    }, err => {
      this._domainLoading = false;
      console.log('Some error occured! Could not fetch list of domains.')
    });  
  }

  getCriticityMeta() {
    this.criticityMeta = [];
    this._domainLoading = true;
    this.applicationService.getCriticityMeta().subscribe(res => {
      this.criticityMeta = res.domain_criticity_meta || [];
      this._domainLoading = false;
      this.getMaintenanceLevelsMeta();
      this.getMaintenanceCriticity();
    }, err => {
      this._domainLoading = false;
      console.log('Some error occured! Could not fetch criticity types.');
    });
  }

  getMaintenanceLevelsMeta() {
    this._maintenanceLoading = true;
    this.applicationService.getMaintenanceCriticityMeta().subscribe(res => {
      this.maintenanceLevels = res.maintenance_criticity_meta || [];
      this.startMonthArray[this.maintenanceLevels.length-1] = 0;
      this._maintenanceLoading = false;
      this.getRisksMeta();
      this.getRiskMatrix();
    }, err => {
      this._maintenanceLoading = false;
      console.log('Some error occured! Could not fetch maintenance time criticity.');
    });
  }

  getRisksMeta() {
    this._riskLoading = true;
    this.applicationService.getRisksMeta().subscribe(res => {
      this.riskLevels = res.risk_meta || [];
      this._riskLoading = false;
    }, err => {
      this._riskLoading = false;
      console.log('Some error occured! Could not fetch list of risks.');
    });
  }

  // Get existing data for view
  getDomainsPerCriticity() {
    this.criticityDomains = [];
    this._domainLoading = true;
    this.applicationService.getDomainsPerCriticity().subscribe(res => {
      this.criticityDomains = res.domains_criticity|| [];
      this.getDomainsMeta();
      this._domainLoading = false;
    }, err => {
      this._domainLoading = false;
      console.log('Some error occured! Could not fetch domains for criticity.');
    });
  }

  getMaintenanceCriticity() {
    this.maintenanceCriticity = [];
    this._maintenanceLoading = true;
    this.applicationService.getMaintenanceCriticity().subscribe(res => {
      this.maintenanceCriticity = res.maintenance_criticy || [];
      if(this.maintenanceCriticity.length > 0) {
        for(let i=0; i<this.maintenanceCriticity.length; i++) {
          const level = this.maintenanceCriticity[i].maintenance_level_id;//name.substr(this.maintenanceCriticity[i].maintenance_level_name.length -1, 1); //TODO
          this.startMonthArray[Number(level) -1] = this.maintenanceCriticity[i].start_month||0;
          this.endMonthArray[Number(level) -1] = this.maintenanceCriticity[i].end_month;
        }
      }
      this._maintenanceLoading = false;
      this.setGridForMaintenanceTimeCriticity();
    }, err => {
      this._maintenanceLoading = false;
      console.log('Some error occured! Could not fetch Maintenance Time Criticity Details.')
    });
  }

  getRiskMatrix() {
    this.riskMatrix = [];
    this._riskLoading = true;
    this.applicationService.getRiskMatrix().subscribe(res => {
      this.riskMatrix = res.risk_matrix || [];
      
    // Get data in 2-D array
    this.riskMatrixValues = [];
    for(let i=0; i< this.maintenanceLevels.length; i++) {
      this.riskMatrixValues.push(new Array(this.criticityMeta.length));
    }
    for(let i=0; i< this.maintenanceLevels.length; i++) {
      for(let j=0; j<this.criticityMeta.length; j++) {
        const risk= this.riskMatrix.findIndex(r => (r.maintenance_critic_id == this.maintenanceLevels[i].maintenance_critic_id
          && r.domain_critic_id == this.criticityMeta[j].domain_critic_id));
        if(risk > -1) {
          this.riskMatrixValues[i][j] = {
            "domain_critic_id": this.criticityMeta[j].domain_critic_id,
            "domain_critic_name": this.criticityMeta[j].domain_critic_name,
            "maintenance_critic_id": this.maintenanceLevels[i].maintenance_critic_id,
            "maintenance_critic_name": this.maintenanceLevels[i].maintenance_critic_name,
            "risk" : {
              "risk_id": this.riskMatrix[risk].risk_id,
              "risk_name": this.riskMatrix[risk].risk_name
            }            
          };
        }  
        else {
          this.riskMatrixValues[i][j] = {
            "domain_critic_id": this.criticityMeta[j].domain_critic_id,
            "domain_critic_name": this.criticityMeta[j].domain_critic_name,
            "maintenance_critic_id": this.maintenanceLevels[i].maintenance_critic_id,
            "maintenance_critic_name": this.maintenanceLevels[i].maintenance_critic_name,
            "risk" : null
          };
        }    
      }
    }
      this.setGridForRiskMatrix();
      this._riskLoading = false;
    }, err => {
      this._riskLoading = false;
      console.log('Some error occured! Could not fetch risk matrix.');
    });
  }

  setGridForMaintenanceTimeCriticity() {
    this.maintenanceTiles = [];
    for(let i=0;i<this.maintenanceLevels.length;i++) {
      this.maintenanceTiles.push({id: i+1, text:this.maintenanceLevels[i].maintenance_critic_name, cols: 1, rows: 1, color: 'whitesmoke', header: false});
      this.maintenanceTiles.push({id: i+1, text:'inputStartMonth', cols: 1, rows: 1, color: 'white', header: false});
      this.maintenanceTiles.push({id: i+1, text:'inputEndMonth', cols: 1, rows: 1, color: 'white', header: false});
    }
  }

  setGridForRiskMatrix() {
    this.riskMatrixTiles = [];
    if (this.criticityMeta.length > 0 && this.maintenanceLevels.length) {
      this.riskMatrixTiles.push({ text: 'Risk Matrix', cols: 3, rows: 2, color: '#F5F5F5', header: true });
      this.riskMatrixTiles.push({ text: 'Domain', cols: this.criticityMeta.length * 3, rows: 1, color: '#F5F5F5', header: true });
      for (let i = 0; i < this.criticityMeta.length; i++) {
        this.riskMatrixTiles.push({ text: this.criticityMeta[i].domain_critic_name, cols: 3, rows: 1, color: '#EAEAEA', header: true })
      }
      this.riskMatrixTiles.push({ text: 'Maintenance', cols: 1, rows: this.maintenanceLevels.length, color: '#F5F5F5', header: true });
      for (let j = 0; j < this.maintenanceLevels.length; j++) {
        this.riskMatrixTiles.push({ text: this.maintenanceLevels[j].maintenance_critic_name, cols: 2, rows: 1, color: '#EAEAEA', header: true });
        for (let k = 0; k < this.criticityMeta.length; k++) {
          this.riskMatrixTiles.push({ level: j, criticity: k, text: 'Select', cols: 3, rows: 1, color: 'white', header: false })
        }
      }
    }
  }

  validatePattern(monthVal, ev) {
    const newVal = monthVal.value.toString() + ev.key.toString();
    if(Number(newVal)>=0 && (Number(newVal)) < this.maxMonth) {
      return true;
    }
    else {
      return false;
    }    
  }
// Domain Criticity Handling
  addDomain() {
    this.emptyDomain = false;
    this.emptyCriticity = false;
    this.domainCriticitySaved = false;
    this.domainCriticitySavedError = false;
    let checkedDomains = this.domainsList.filter(d=>d.isChecked).map(d => d.name);
    if(checkedDomains.length>0 && this.selectedCriticity) {
      checkedDomains.map(cd => {
        const index = this.domainsList.findIndex(d => d.name == cd);
        this.domainsList.splice(index,1);
      });
      let criticRef = this.criticityDomains.filter(d=>d.domain_critic_id == this.selectedCriticity.domain_critic_id);
      if(criticRef.length !== 0) {
        checkedDomains.map(cd => criticRef[0].domains.push(cd));
      }
      else {
        this.criticityDomains.push({
          "domain_critic_id": this.selectedCriticity.domain_critic_id,
          "domain_critic_name": this.selectedCriticity.domain_critic_name,
          "domains": [...checkedDomains]
        })
      }
      this.noChangeDomainCriticity = false;
    } else {
      if(checkedDomains.length == 0) {
        this.emptyDomain = true;
      } 
      if(!this.selectedCriticity) {
        this.emptyCriticity = true;
      }
    }
  }

  removeDomain(domain, criticID) {
    this.domainCriticitySaved = false;
    this.domainCriticitySavedError = false;
    let criticRef = this.criticityDomains.filter(d=>d.domain_critic_id == criticID)[0].domains;
    criticRef.splice(criticRef.indexOf(domain),1)
    this.domainsList.push({'name':domain, 'isChecked': false});
    this.noChangeDomainCriticity = false;
  }

  resetDomainCriticity() {
    this.getDomainsPerCriticity();
    this.getDomainsMeta();
    this.noChangeDomainCriticity = true;
    this.selectedCriticity = null;
    this.emptyDomain = false;
    this.emptyCriticity = false;
    this.domainCriticitySaved = false;
    this.domainCriticitySavedError = false;
  }

  saveDomainCriticity() {
    const body = {
      "scope": localStorage.getItem('scope'),
      "domains_criticity" : this.criticityDomains
    };
    this.applicationService.saveDomainCriticity(body).subscribe(res => {
      this.domainCriticitySaved = true;
      this.domainCriticitySavedError = false;
      this.noChangeDomainCriticity = true;
      console.log('Success');
    }, err => {
      this.domainCriticitySavedError = true;
      this.domainCriticitySaved = false;
      console.log('Some error occured! Could not save your changes.');
    });
  }

  // Maintenance Time Criticity Handling

  setEndDate(level) {
    if(level > 0 ) {
      // If entered start month of a level is more than it's end date replace it with value = (End Month - 1)
      if(this.startMonthArray[level - 1] >= (this.endMonthArray[level - 1])) {
        this.startMonthArray[level - 1] = this.endMonthArray[level - 1] - 1;
      }
      if(this.startMonthArray[level - 1] ) {
        this.endMonthArray[level] = this.startMonthArray[level - 1] - 1;
      }
      this.noChangeTimeCriticity = false;
    }
  }

  resetMaintenanceCriticity() {
    this.maintenanceTimeCriticitySaved = false;
    this.maintenanceTimeCriticitySavedError = false;
    this.startMonthArray = [];
    this.startMonthArray[this.maintenanceLevels.length-1] = 0;
    this.endMonthArray = [this.maxMonth];
    this.noChangeTimeCriticity = true;
    this.getMaintenanceCriticity();
  }

  saveMaintenanceTimeCriticity() {
    let maintenance_criticy = [];
    for(let i=0; i< this.maintenanceLevels.length; i++) {
      maintenance_criticy.push({
        "maintenance_level_id": this.maintenanceLevels[i].maintenance_critic_id,
        "maintenance_level_name": this.maintenanceLevels[i].maintenance_critic_name,
        "start_month": this.startMonthArray[i],
        "end_month": this.endMonthArray[i]
      });
    }
    const body = {
      "scope": localStorage.getItem('scope'),
      "maintenance_criticy" : maintenance_criticy
    };
    this.applicationService.saveMaintenanceCriticity(body).subscribe(res => {
      this.maintenanceTimeCriticitySaved = true;
      this.maintenanceTimeCriticitySavedError = false;
      this.noChangeTimeCriticity = true;
      console.log('Success');
    }, err => {
      this.maintenanceTimeCriticitySavedError = true;
      this.maintenanceTimeCriticitySaved = false;
      console.log('Some error occured! Could not save your changes.');
    });
  }

  // Risk Matrix
  selectionChanged() {
    this.incompleteMatrix = false;
    this.noChangeRiskMatrix = false;
    for(let i=0; i< this.riskMatrixValues.length; i++) {
      for(let j=0; j<this.riskMatrixValues[i].length; j++) {
        if(!this.riskMatrixValues[i][j].risk)
        this.incompleteMatrix = true;
      }
    }
  }

  resetRiskMatrix() {
    this.incompleteMatrix = false;
    this.noChangeRiskMatrix = true;
    this.riskMatrixSaved = false;
    this.riskMatrixSavedError = false;
    this.getRiskMatrix();
  }

  saveRiskMatrix() {
    let risk_matrix = [];
    for(let i=0; i< this.riskMatrixValues.length; i++) {
      for(let j=0; j<this.riskMatrixValues[i].length; j++) {
        risk_matrix.push({
          "domain_critic_id": this.riskMatrixValues[i][j].domain_critic_id,
          "domain_critic_name": this.riskMatrixValues[i][j].domain_critic_name,
          "maintenance_critic_id": this.riskMatrixValues[i][j].maintenance_critic_id,
          "maintenance_critic_name": this.riskMatrixValues[i][j].maintenance_critic_name,
          "risk_id": this.riskMatrixValues[i][j].risk.risk_id,
          "risk_name": this.riskMatrixValues[i][j].risk.risk_name
        });
      }
    }
    const body = {
      "scope": localStorage.getItem('scope'),
      "risk_matrix" : risk_matrix
    };
    this.applicationService.saveRiskMatrix(body).subscribe(res => {
      this.riskMatrixSaved = true;
      this.riskMatrixSavedError = false;
      this.noChangeRiskMatrix = true;
      console.log('Success');
    }, err => {
      this.riskMatrixSavedError = true;
      this.riskMatrixSaved = false;
      console.log('Some error occured! Could not save your changes.');
    });
  }
}
