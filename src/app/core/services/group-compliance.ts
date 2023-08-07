export interface GroupCompliance {
    complience_groups: Group[]
}
export interface Group {
    group_id: string;
    name: string;
    scope_code: string[];
    scope_name: string[]
}