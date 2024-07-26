import {
    ReportTemplate,
    TABLE_NAME_REPORT_TEMPLATE,
} from '@src/schema/reportTemplate';
import { getQueryBuilder, isDatabaseError } from './knexInstance';
import {
    R2TemplateCreateFailedAlreadyExist,
    R2TemplateDeleteFailed,
    R2TemplateNotFoundError,
    R2TemplateUpdateFailedAlreadyExist,
    R2TemplateUpdateFailedNoTarget,
    UnkonwnError,
} from '../errors/error';

const DEFAULT_LIMIT = 20;

const getReportTemplateQueryBuilder = () => {
    return getQueryBuilder<ReportTemplate>({
        tableName: TABLE_NAME_REPORT_TEMPLATE,
    });
};

export interface FindAllReportTemplateParam {
    limit?: number;
}

/**
 * 리포트 양식 전체 조회
 *
 * - r2Data를 제외한 모든 속성을 조회합니다.
 * @param param 조회 파라미터 객체
 * @param param.limit 조회할 레코드 행 수를 제한하는 매개변수. 기본값은 20입니다.
 * @returns 조회된 양식 목록. 양식 데이터는 r2Data를 제외한 모든 속성 정보를 포함합니다.
 */
const findMany = async ({
    limit = DEFAULT_LIMIT,
}: FindAllReportTemplateParam | undefined = {}) => {
    return getReportTemplateQueryBuilder()
        .select('id', 'path', 'name', 'createdAt', 'updatedAt')
        .orderBy('updatedAt', 'desc')
        .limit(limit);
};

export interface CreateReportTemplateParam {
    path: string;
    name: string;
    r2Data: string; // JSON.stringify
}

/**
 * 리포트 양식 생성
 *
 * @param param 생성 파라미터 객체
 * @param param.path 리포트 양식을 업로드할 폴더 경로
 * @param param.name 리포트 양식 이름
 * @param param.r2Data 리포트 양식 데이터(r2파일의 내용)
 * @returns 생성된 리포트 양식. 양식데이터는 r2Data를 제외한 모든 속성 정보를 포함합니다.
 */
const create = async ({ path, name, r2Data }: CreateReportTemplateParam) => {
    try {
        const insertResults = await getReportTemplateQueryBuilder()
            .insert({
                path,
                name,
                r2Data,
            })
            .returning(['id', 'name', 'path', 'createdAt', 'updatedAt']);

        const createdReportTemplate = insertResults[0];

        return createdReportTemplate;
    } catch (error) {
        console.error('repository error! ', error);

        /**
         * 필요한 경우 customHandler에서 원하는 예외를 발생시킬 수 있다.
         */
        if (
            isDatabaseError(error) &&
            error.constraint === 'r2_template_path_name_unique_key'
        ) {
            throw new R2TemplateCreateFailedAlreadyExist();
        }

        /**
         * DB 에러가 DB접근 계층 밖으로 전파되지 않도록 한다.
         */
        throw isDatabaseError(error) ? new UnkonwnError() : error;
    }
};

export interface FindReportTemplateParam {
    reportId: number;
}

/**
 * 리포트 양식 단건조회
 *
 * @param param 조회 파라미터 객체
 * @param param.reportId 단건조회할 리포트 양식의 아이디
 * @returns 조회된 리포트 양식. r2Data를 포함함.
 */
const findOneById = async ({ reportId }: FindReportTemplateParam) => {
    const reportTemplate = await getReportTemplateQueryBuilder()
        .select('id', 'name', 'path', 'createdAt', 'updatedAt', 'r2Data')
        .where({ id: reportId })
        .first();

    if (!reportTemplate) {
        throw new R2TemplateNotFoundError({
            message: `요청한 아이디를 가진 리포트 양식이 존재하지 않습니다. id: ${reportId}`,
        });
    }

    return reportTemplate;
};

export interface DeleteReportTemplateParam {
    reportId: number;
}

/**
 * 리포트 양식 단건 삭제
 *
 * @param param 삭제 파라미터 객체
 * @param param.reportId 삭제할 리포트 양식의 아이디
 * @returns 대상 리포트 양식을 삭제했는지 아닌지를 표현하는 boolean값.
 */
const deleteById = async ({ reportId }: DeleteReportTemplateParam) => {
    const removedCount = await getReportTemplateQueryBuilder()
        .delete()
        .where({ id: reportId });

    const isRemoved = removedCount === 1;

    if (!isRemoved) {
        throw new R2TemplateDeleteFailed();
    }

    return isRemoved;
};

export interface UpdateReportTemplateParam {
    reportId: number;
    path: string;
    name: string;
    r2Data: string; // JSON.stringify
}

/**
 * 리포트 양식 단건 수정
 *
 * @param param 수정 파라미터 객체
 * @param param.reportId 수정할 리포트 양식의 아이디.
 * @param param.path 수정할 리포트 양식의 경로. 값이 undefined인 경우 해당 필드는 수정하지 않는다.
 * @param param.name 수정할 리포트 양식의 이름. 값이 undefined인 경우 해당 필드는 수정하지 않는다.
 * @param param.r2Data 수정할 리포트 양식의 r2Data. 값이 undefined인 경우 해당 필드는 수정하지 않는다.
 * @returns 수정 후 리포트 양식의 데이터. r2Data는 제외됨
 */
const updateById = async ({
    reportId,
    name,
    path,
    r2Data,
}: UpdateReportTemplateParam) => {
    try {
        const now = new Date();
        const result = await getReportTemplateQueryBuilder()
            .update({
                name,
                path,
                r2Data,
                updatedAt: now,
            })
            .returning(['id', 'name', 'path', 'createdAt', 'updatedAt'])
            .where({ id: reportId });

        const updatedItem = result[0];

        if (!updatedItem) {
            throw new R2TemplateUpdateFailedNoTarget();
        }

        return updatedItem;
    } catch (error) {
        console.error('repository error! ', error);

        /**
         * 필요한 경우 customHandler에서 원하는 예외를 발생시킬 수 있다.
         */
        if (
            isDatabaseError(error) &&
            error.constraint === 'r2_template_path_name_unique_key'
        ) {
            throw new R2TemplateUpdateFailedAlreadyExist();
        }

        /**
         * DB 에러가 DB접근 계층 밖으로 전파되지 않도록 한다.
         */
        throw isDatabaseError(error) ? new UnkonwnError() : error;
    }
};

export const reportTemplateRepository = {
    findOneById,
    findMany,
    create,
    updateById,
    deleteById,
};
