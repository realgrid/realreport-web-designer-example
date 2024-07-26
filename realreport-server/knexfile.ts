import { Knex } from 'knex';

const devConfig: Knex.Config = {
    client: 'pg',
    // DB 연결 구성 방법: https://knexjs.org/guide/#configuration-options
    connection: process.env.PG_CONNECTION_STRING,
    searchPath: ['r2db', 'public'],
    // DB 커넥션 풀 구성 방법: https://knexjs.org/guide/#pool
    pool: {
        min: 0,
        max: 10,
    },
};

export default {
    development: devConfig,
};
