import createError from 'http-errors';
import express, { json, urlencoded, static as expressStatic } from 'express';
import { join } from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors';
import { createServer } from 'http';

import { consoleRouter } from '@routes/consoleRouter';
import { errorHandler } from '@routes/errorRouter';
import { reportApiRouter } from '@routes/reportApiRouter';
import { homeRouter } from '@routes/homeRouter';

const PORT_NUMBER = 3000;

const prepareServer = async () => {
    const app = express();

    // view engine setup
    app.set('views', join(__dirname, 'views'));
    app.set('view engine', 'ejs');

    app.use(logger('dev'));
    app.use(json());
    app.use(cors());
    app.use(urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(expressStatic(join(__dirname, 'public')));

    app.use('/', homeRouter);
    app.use('/reports', consoleRouter);
    app.use('/api/v1', reportApiRouter);

    // catch 404 and forward to error handler
    app.use(function (req, res, next) {
        next(createError(404));
    });

    // error handler
    app.use(errorHandler);

    /**
     * Get port from environment and store in Express.
     */
    app.set('port', PORT_NUMBER);

    /**
     * Create HTTP server.
     */
    const server = createServer(app);

    /**
     * Listen on provided port, on all network interfaces.
     */
    console.log(`r2 resource server url: http://localhost:${PORT_NUMBER}`);
    server.listen(PORT_NUMBER);
};

prepareServer();
