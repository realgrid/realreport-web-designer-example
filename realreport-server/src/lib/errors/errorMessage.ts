import { ErrorCode } from './errorCode';

/**
 * 애플리케이션 에러 코드에 대한 기본 에러 메시지
 */
export const ErrorMessage: Record<ErrorCode, string> = {
    UNKNOWN_ERROR: '알 수 없는 에러가 발생했습니다',
    R2_TEMPLATE_NOT_FOUND: '요청한 리포트 양식을 찾을 수 없습니다',
    R2_TEMPLATE_DELETE_FAILED:
        '요청한 리포트 양식 삭제에 실패했습니다. 존재하지 않거나 이미 삭제된 양식입니다.',
    R2_TEMPLATE_UPDATE_FAILED_NO_TARGET:
        '요청한 리포트 양식 수정에 실패했습니다. 존재하지 않거나 이미 삭제된 양식입니다.',
    INVALID_PARAM: '입력 포멧이 잘못되었습니다.',
    R2_TEMPLATE_UPDATE_FAILED_ALREADY_EXIST:
        '요청한 정보로 리포트 양식을 수정할 수 없습니다. 해당 경로에 지정한 파일명을 가진 양식파일이 이미 존재합니다.',
    R2_TEMPLATE_CREATE_FAILED_ALREADY_EXIST:
        '요청한 정보로 리포트 양식을 생성할 수 없습니다. 해당 경로에 지정한 파일명을 가진 양식파일이 이미 존재합니다.',
};
