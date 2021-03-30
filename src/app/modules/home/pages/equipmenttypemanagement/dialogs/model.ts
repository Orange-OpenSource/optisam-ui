// Copyright (C) 2019 Orange
// 
// This software is distributed under the terms and conditions of the 'Apache License 2.0'
// license which can be found in the file 'License.txt' in this package distribution 
// or at 'http://www.apache.org/licenses/LICENSE-2.0'. 

export class RequiredJSONFormat {
  ID: String = '';
  type: String = '';
  parent_id: String = '';
  metadata_id: String = '';
  attributes: Attribute[];
  scopes:String[] = [];
}

export class Attribute {
  name: String = '';
  data_type: String = '';
  primary_key: Boolean = false;
  displayed: Boolean = false;
  searchable: Boolean = false;
  parent_identifier: Boolean = false;
  mapped_to: String = '';
}
export class EquipmentType {
  equipment_types: EquipmentTypes[];

}
export class EquipmentTypes {
  ID: String = '';
  id: String = '';
  type: String = '';
  parent_id: String = '';
  metadata_source: String = '';
  metadata_id: String = '';
  attributes: Attribute[];
}
