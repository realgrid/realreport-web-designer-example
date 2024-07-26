import knex from 'knex';
import config from '@projectRoot/knexfile';
import { TABLE_NAME_REPORT_TEMPLATE } from '@src/schema/reportTemplate';

const knexInstance = knex(config.development);

type ITableNames = typeof TABLE_NAME_REPORT_TEMPLATE;

const getQueryBuilder = <T extends object>({
    tableName,
}: {
    tableName: ITableNames;
}) => {
    return knexInstance<T>(tableName);
};

export { getQueryBuilder };

export type DatabaseError = {
    code: string;
    constraint: string;
    table: string;
    severity: string;
};

export const isDatabaseError = (error: unknown): error is DatabaseError => {
    if (typeof error !== 'object' || !error) {
        return false;
    }

    return (
        !!Reflect.get(error, 'code') &&
        !!Reflect.get(error, 'constraint') &&
        !!Reflect.get(error, 'table') &&
        !!Reflect.get(error, 'severity')
    );
};
