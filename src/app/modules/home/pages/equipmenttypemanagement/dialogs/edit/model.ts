export class ModifyJSONFormat {
  attributes: Attribute[];
  updattr: Updattr[];
  scopes: String[];
  parent_id: String;
}

export class Attribute {
  name: String = '';
  data_type: String = '';
  primary_key: Boolean = false;
  displayed: Boolean = false;
  searchable: Boolean = false;
  parentI_key: Boolean = false;
  mapped_to: String = '';
}

export class Updattr {
  ID: String = '';
  name: String = '';
  displayed: Boolean = false;
  searchable: Boolean = false;
}
