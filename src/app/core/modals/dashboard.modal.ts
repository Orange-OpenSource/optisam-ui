import { ApexAxisChartSeries, ApexChart, ApexDataLabels, ApexTitleSubtitle, ApexPlotOptions, ApexLegend } from "ng-apexcharts";

export enum DashboardTabs {
    tab1 = 'OPTIMIZE',
    tab2 = 'EXPLORE'
}
export interface DashboardTabList {
    tabLink: string;
    translate: string;
}

export interface DashboardScrollTabList {
    fragment: string;
    translate: string;
}

export interface KpiOptions {
    icon: string;
    number: number;
    description: string;
    metaDescription: string;
    showToggle?: boolean;
    toggleText?: string;
    titleTooltip?: string;
}

export interface KpiPieData {
    title: PieBlockTitle;
    isError: boolean;
    loading?: boolean;
    noData?: boolean;
}
export interface PieBlockTitle {
    title: string;
    info?: string;
}


export type ChartOptions = {
    series: ApexAxisChartSeries;
    chart: ApexChart;
    dataLabels: ApexDataLabels;
    title: ApexTitleSubtitle;
    plotOptions: ApexPlotOptions;
    legend: ApexLegend;
};


export interface DashboardDataLabels {
    SoftwareProductSpend: SoftwareProductSpend;
    SharedReceivedLicenses: SharedReceivedLicenses;
}

export interface SharedReceivedLicenses {
    sharedLicenses: string;
    receivedLicenses: string;
    remaining: string;
}

export interface SoftwareProductSpend {
    totalExpenditure: string;
    totalExpenditureCovered: string;
}
