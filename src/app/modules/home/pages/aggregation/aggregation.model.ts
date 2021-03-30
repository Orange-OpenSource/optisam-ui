// Copyright (C) 2019 Orange
// 
// This software is distributed under the terms and conditions of the 'Apache License 2.0'
// license which can be found in the file 'License.txt' in this package distribution 
// or at 'http://www.apache.org/licenses/LICENSE-2.0'. 

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
