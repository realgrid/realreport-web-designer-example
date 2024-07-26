import { ErrorCode } from './errorCode';
import { ErrorMessage } from './errorMessage';

export interface CreateApiErrorParam {
    message?: string;
    status?: number;
    code?: ErrorCode;
}

/**
 * 애플리케이션에서 발생하는 에러를 일반화한 추상 클래스
 *
 * - 앱에서 발생하는 모든 에러는 ErrorCode를 가진다.
 */
export abstract class ApplicationError extends Error {
    private _code: ErrorCode;

    constructor({
        message = ErrorMessage.UNKNOWN_ERROR,
        code = ErrorCode.UNKNOWN_ERROR,
    }: CreateApiErrorParam) {
        super(message);

        this._code = code;
    }

    public get code(): ErrorCode {
        return this._code;
    }
}

/**
 * 서버 API에서 발생한 에러를 일반화 한 클래스
 *
 * - 해당 에러를 클라이언트에게 HTTP 응답으로 내려줄 수 있어야 하므로 status를 속성으로 가진다.
 */
export abstract class ApiError extends ApplicationError {
    private _status: number;

    constructor({ status = 500, ...remainparam }: CreateApiErrorParam) {
        super({ status, ...remainparam });

        this._status = status;
    }

    public get status(): number {
        return this._status;
    }
}

export function isApiError(error: unknown) {
    return error instanceof ApiError;
}

/**
 * 알 수 없는 문제가 발생한 경우 사용하는 에러
 */
export class UnkonwnError extends ApiError {
    constructor(param: Omit<CreateApiErrorParam, 'status'> = {}) {
        super({
            status: 500,
            code: ErrorCode.UNKNOWN_ERROR,
            message: ErrorMessage.UNKNOWN_ERROR,
            ...param,
        });
    }
}

/**
 * 지정한 경로에 양식파일이 이미 존재하여 양식파일 생성에 실패한 경우 사용하는 에러
 */
export class R2TemplateCreateFailedAlreadyExist extends ApiError {
    constructor(param: Omit<CreateApiErrorParam, 'status'> = {}) {
        super({
            status: 404,
            code: ErrorCode.R2_TEMPLATE_CREATE_FAILED_ALREADY_EXIST,
            message: ErrorMessage.R2_TEMPLATE_CREATE_FAILED_ALREADY_EXIST,
            ...param,
        });
    }
}

/**
 * 리포트 양식을 못찾은 경우에 사용하는 에러
 */
export class R2TemplateNotFoundError extends ApiError {
    constructor(param: Omit<CreateApiErrorParam, 'status'> = {}) {
        super({
            status: 404,
            code: ErrorCode.R2_TEMPLATE_NOT_FOUND,
            message: ErrorMessage.R2_TEMPLATE_NOT_FOUND,
            ...param,
        });
    }
}

/**
 * 리포트 양식 삭제에 실패한 경우 사용하는 에러
 */
export class R2TemplateDeleteFailed extends ApiError {
    constructor(param: Omit<CreateApiErrorParam, 'status'> = {}) {
        super({
            status: 404,
            code: ErrorCode.R2_TEMPLATE_DELETE_FAILED,
            message: ErrorMessage.R2_TEMPLATE_DELETE_FAILED,
            ...param,
        });
    }
}

/**
 * 대상 리포트 양식이 존재하지 않아, 리포트 양식 수정에 실패한 경우 사용하는 에러
 */
export class R2TemplateUpdateFailedNoTarget extends ApiError {
    constructor(param: Omit<CreateApiErrorParam, 'status'> = {}) {
        super({
            status: 404,
            code: ErrorCode.R2_TEMPLATE_UPDATE_FAILED_NO_TARGET,
            message: ErrorMessage.R2_TEMPLATE_UPDATE_FAILED_NO_TARGET,
            ...param,
        });
    }
}

/**
 * 지정한 경로에 양식파일이 이미 존재하여 양식파일 수정에 실패한 경우 사용하는 에러
 */
export class R2TemplateUpdateFailedAlreadyExist extends ApiError {
    constructor(param: Omit<CreateApiErrorParam, 'status'> = {}) {
        super({
            status: 404,
            code: ErrorCode.R2_TEMPLATE_UPDATE_FAILED_ALREADY_EXIST,
            message: ErrorMessage.R2_TEMPLATE_UPDATE_FAILED_ALREADY_EXIST,
            ...param,
        });
    }
}

/**
 * 대상 리포트 양식이 존재하지 않아, 리포트 양식 수정에 실패한 경우 사용하는 에러
 */
export class InvalidParameter extends ApiError {
    constructor(param: Omit<CreateApiErrorParam, 'status'> = {}) {
        super({
            status: 400,
            code: ErrorCode.INVALID_PARAM,
            message: ErrorMessage.INVALID_PARAM,
            ...param,
        });
    }
}
