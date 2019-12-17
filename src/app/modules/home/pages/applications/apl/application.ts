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