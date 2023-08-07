export interface GroupComplianceEditors {
  costs: GroupComplianceEditorsCosts;
  groupCounterFeitingCost: number;
  groupUnderUsageCost: number;
  groupTotalCost: number;
}
export interface GroupComplianceEditorsCosts {
  counterFeiting: EditorCostChart[];
  underUsage: EditorCostChart[];
  total: EditorCostChart[];
}

export interface EditorCostChart {
  scope: string;
  cost: number;
}
