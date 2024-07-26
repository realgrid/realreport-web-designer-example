import { NextFunction, Request, Response } from 'express';
import { isApiError, ApiError } from '../errors/error';
import { ErrorCode } from '../errors/errorCode';
import { ErrorMessage } from '../errors/errorMessage';

export type HandlerCallback = (
    req: Request,
    res: Response,
    next: NextFunction
) => Promise<void>;

export const pageHandler =
    (callback: HandlerCallback) =>
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            await callback(req, res, next);
        } catch (error: unknown) {
            next(error);
        }
    };

export const apiHandler =
    (callback: HandlerCallback) =>
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            await callback(req, res, next);
        } catch (error: unknown) {
            _handleApiError(req, res, error);
        }
    };

/**
 * 에러를 처리하는 함수
 *
 * @param req Express HTTP Request 객체
 * @param res Express HTTP Response 객체
 */
function _handleApiError(req: Request, res: Response, error: unknown) {
    console.error(error);

    const message = isApiError(error)
        ? error.message
        : ErrorMessage.UNKNOWN_ERROR;

    const errorCode = isApiError(error) ? error.code : ErrorCode.UNKNOWN_ERROR;

    res.statusCode = error instanceof ApiError ? error.status : 500;

    res.json({
        errorCode,
        message,
    });
}
