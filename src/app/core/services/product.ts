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
