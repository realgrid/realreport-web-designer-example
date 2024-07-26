import { TABLE_NAME_REPORT_TEMPLATE } from '../src/schema/reportTemplate';
import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    return knex.schema
        .dropSchemaIfExists(TABLE_NAME_REPORT_TEMPLATE, true)
        .createTable(TABLE_NAME_REPORT_TEMPLATE, function (table) {
            table.increments();
            table.string('path').notNullable();
            table.string('name').notNullable();
            table.json('r2Data').notNullable();
            table.timestamp('createdAt').defaultTo(knex.fn.now());
            table.timestamp('updatedAt').defaultTo(knex.fn.now());
            table.unique(['path', 'name'], {
                indexName: 'r2_template_path_name_unique_key',
                useConstraint: true,
            });
            table.index(['createdAt'], 'idx_r2_template_created_at');
            table.index(['updatedAt'], 'idx_r2_template_updated_at');
        });
}

export async function down(knex: Knex): Promise<void> {}
