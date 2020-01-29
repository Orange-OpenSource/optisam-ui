// Copyright (C) 2019 Orange
// 
// This software is distributed under the terms and conditions of the 'Apache License 2.0'
// license which can be found in the file 'License.txt' in this package distribution 
// or at 'http://www.apache.org/licenses/LICENSE-2.0'. 

export class Products {
  swidTag: string;
  name: string;
  version: string;
  category: string;
  editor: string;
  numOfOptions: string;
  numOfApplications: string;
  numofEquipments: string;
}
class ProdApplications {
  swidTag: string;
  name: string;
  Editor: string;
  Edition: string;
  Version: string;
  totalCost: string;
  numOfInstances: string;
  numofEquipments: string;
}

export interface AggregationDetailsInformation {
  ID: string;
  name: string;
  editor: string;
  product_name: string;
  metric: string;
  num_applications: number;
  num_equipments: number;
  products: string[];
  editions: string[];
}


export interface AggregationDetailsOptions {
  numOfOptions: number;
  optioninfo: OptionInformation[];
}

interface OptionInformation {
  swidTag: string;
  Name: string;
  edition: string;
  editor: string;
  version: string;
  metric: string;
}

export interface AggregationDetailsAquiredRights {
  acq_rights: AquiredRightsInformation[];
}

interface AquiredRightsInformation {
  SKU: string;
  swidTag: string;
  metric: string;
  numCptLicences: number;
  numAcqLicences: number;
  totalCost: number;
  deltaNumber: number;
  deltaCost: number;
}
