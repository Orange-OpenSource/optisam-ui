// Copyright (C) 2019 Orange
// 
// This software is distributed under the terms and conditions of the 'Apache License 2.0'
// license which can be found in the file 'License.txt' in this package distribution 
// or at 'http://www.apache.org/licenses/LICENSE-2.0'. 

export class Equipments {
  'ID': 'string';
  'name': 'string';
      'type': 'string';
      'parent_id': 'string';
      'attributes': [
        {
          'ID': 'string';
          'name': 'string';
          'data_type': 'UNKNOWN';
          'primary_key': true;
          'displayed': true;
          'searchable': true;
          'parent_identifier': true;
          'mapped_to': 'string'
        }
      ];
      'metadata_id': 'string';
}
