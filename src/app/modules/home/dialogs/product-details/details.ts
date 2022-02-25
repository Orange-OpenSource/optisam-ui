export class DialogData {
  productInfo = new ProductInfo() ;
  productOptions = new ProductOptions();
  productRights = new ProductRights ();
  optioninfo = new OptionInfo();
}
class ProductInfo {
  swidTag: String = '';
  editor: String = '';
  metric: String = '';
  Edition: String = '';
  edition: String = '';
  release: String = '';
  numOfApplications: String = '';
  numofEquipments: String = '';
}
class ProductOptions {
  numOfOptions: String = '';
  optioninfo: String = '';

}
class OptionInfo {
  swidTag: String = '';
  editor: String = '';
  Name: String = '';
  version: String = '';
}

class ProductRights {
  swidTag: String = '';
}
