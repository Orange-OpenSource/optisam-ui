export interface Expenditure{ 
    "expense_percent": ExpansePercent[];
    "total_expenditure": number;
    "total_cost": number;
}

export interface ExpansePercent{
    "scope": string;
    "expenditure": number;
    "totalCost": number;
    "expenditure_percent": number;
}