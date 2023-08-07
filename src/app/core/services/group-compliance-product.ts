export interface GroupComplianceProducts{
    
        licences: ComplianceProductsLicense[];
        cost: ComplianceProductsCost[];
      
}

export interface ComplianceProductsLicense{
    scope: string;
    acquired_licences: number;
    computed_licences: number;
}

export interface ComplianceProductsCost{
    scope: string;
    total_cost: number;
    underusage_cost: number;
    counterfeiting_cost: number;
}