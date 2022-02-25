export interface EditorList {
    editors: Editor[];
}

export interface Editor {
    ID: string;
    Name: string;
}

export interface MetricsList {
    metrices: Editor[];
}

export interface Metrics {
    type: string;
    name: string;
    description?: string;
}