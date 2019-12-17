interface EditorList {
    editors: Editor[];
}

interface Editor {
    ID: string;
    Name: string;
}

interface MetricsList {
    metrices: Editor[];
}

interface Metrics {
    type: string;
    name: string;
    description?: string;
}
