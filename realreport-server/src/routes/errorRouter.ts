import { ErrorRequestHandler } from 'express';

export const errorHandler: ErrorRequestHandler = function (
    err,
    req,
    res,
    next // 이거 지우면 errorHandler가 호출되지 않으니 주의
) {
    console.log('[error handler] : ', err);

    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status ?? err.status ?? 500);
    res.render('error');
};
