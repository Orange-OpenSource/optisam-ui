export class ModifyJSONFormat {
  attributes: Attribute[];
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
