// Copyright (C) 2019 Orange
// 
// This software is distributed under the terms and conditions of the 'Apache License 2.0'
// license which can be found in the file 'License.txt' in this package distribution 
// or at 'http://www.apache.org/licenses/LICENSE-2.0'. 

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
