// Copyright (C) 2019 Orange
// 
// This software is distributed under the terms and conditions of the 'Apache License 2.0'
// license which can be found in the file 'License.txt' in this package distribution 
// or at 'http://www.apache.org/licenses/LICENSE-2.0'. 

export interface Application {
  name: string;
  application_owner: string;
  numOfInstances: string;
  numofProducts: string;
  applicationId: string;
}

export interface AdvanceSearch {
  primary: string;
  other: AdvanceOtherFields[];
}

interface AdvanceOtherFields {
  key: string;
  label: string;
}
