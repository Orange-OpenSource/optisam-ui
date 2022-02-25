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
