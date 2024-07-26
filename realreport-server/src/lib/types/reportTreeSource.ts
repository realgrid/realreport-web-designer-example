import { ReportTemplate } from '@projectRoot/src/schema/reportTemplate';

export type ReportTreeSource = (ReportGroupSource | ReportSource)[];

export type ReportGroupSource = {
    type: 'group';
    name: string;
    children: (ReportGroupSource | ReportSource)[];
};

export type ReportSource = {
    type: 'report';
    id: string;
    name: string;
};

export type ReportTreeSourceType = 'group' | 'report';

export type ReportTemplateListItem = Pick<
    ReportTemplate,
    'id' | 'path' | 'name' | 'createdAt' | 'updatedAt'
>;
