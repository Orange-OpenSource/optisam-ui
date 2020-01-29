// Copyright (C) 2019 Orange
// 
// This software is distributed under the terms and conditions of the 'Apache License 2.0'
// license which can be found in the file 'License.txt' in this package distribution 
// or at 'http://www.apache.org/licenses/LICENSE-2.0'. 

export class Type {
  id: string;
  type: string;
  parent_id: string;
  metadata_id: string;
  metadata_source: String = '';
  ID: String = '';
  attributes: [];
  equipment_types: EquipmentTypes[];
}
export class EquipmentTypes {
  ID: String = '';
  id: String = '';
  type: String = '';
  parent_id: String = '';
  metadata_source: String = '';
  metadata_id: String = '';
}

export class DialogData {
  listAttributes = new ListAttributes();
}
export class ListAttributes {
  name: String = '';
  data_type: String = '';
  primary_key: Boolean = false;
  displayed: Boolean = false;
  searchable: Boolean = false;
  mapped_to: String = '';
}
