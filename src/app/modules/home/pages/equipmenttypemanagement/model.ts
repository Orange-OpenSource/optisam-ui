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
