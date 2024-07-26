import { TABLE_NAME_REPORT_TEMPLATE } from '../src/schema/reportTemplate';
import { Knex } from 'knex';
import { reports } from './reports';

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex(TABLE_NAME_REPORT_TEMPLATE).del();

    // Inserts seed entries
    const inputData = [
        {
            path: '/home/test1',
            name: reports[0].report.name,
            r2Data: reports[0],
        },
        {
            path: '/home/test1',
            name: reports[1].report.name,
            r2Data: reports[1],
        },
        {
            path: '/home/test2',
            name: reports[2].report.name,
            r2Data: reports[2],
        },
        {
            path: '/home/test2',
            name: reports[3].report.name,
            r2Data: reports[3],
        },
        { path: '/temp', name: reports[0].report.name, r2Data: reports[0] },
        { path: '/', name: reports[1].report.name, r2Data: reports[1] },
    ];

    await knex(TABLE_NAME_REPORT_TEMPLATE).insert(inputData);
}
