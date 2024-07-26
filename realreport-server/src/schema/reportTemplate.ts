export const TABLE_NAME_REPORT_TEMPLATE = 'ReportTemplate';

export interface ReportTemplate {
    id: number;
    path: string;
    name: string;
    r2Data: string;
    createdAt: Date;
    updatedAt: Date;
}
