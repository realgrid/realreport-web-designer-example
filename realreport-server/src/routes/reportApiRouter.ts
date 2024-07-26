import { reportTemplateRepository } from '@src/lib/repository/reportTemplateRepository';
import express from 'express';
import { apiHandler } from '../lib/handler/handler';
import { ReportTemplate } from '../schema/reportTemplate';
import {
    ReportTreeSource,
    ReportGroupSource,
    ReportTemplateListItem,
} from '../lib/types/reportTreeSource';

const reportApiRouter = express.Router();

/**
 * 리포트 양식 목록조회 API 핸들러
 */
reportApiRouter.get(
    '/reports',
    apiHandler(async function (req, res) {
        const r2Templates = await reportTemplateRepository.findMany({
            limit: 1000,
        });

        res.send({
            r2Templates: toTree(r2Templates),
        });
    })
);

/**
 * 리포트 양식 생성 API 핸들러
 */
reportApiRouter.post(
    '/reports',
    apiHandler(async function (req, res) {
        const { path, name, r2Data } = req.body;

        const reportTemplate = await reportTemplateRepository.create({
            path,
            name,
            r2Data: JSON.stringify(r2Data),
        });

        res.send(reportTemplate);
    })
);

/**
 * 리포트 양식 단건 조회
 */
reportApiRouter.get(
    '/reports/:reportId',
    apiHandler(async function (req, res) {
        const reportId = Number(req.params.reportId);

        const reportTemplate = await reportTemplateRepository.findOneById({
            reportId,
        });

        res.send({ reportTemplate });
    })
);

/**
 * 리포트 양식 삭제 API 핸들러
 */
reportApiRouter.delete(
    '/reports/:reportId',
    apiHandler(async function (req, res) {
        const reportId = Number(req.params.reportId);

        const isRemoved = await reportTemplateRepository.deleteById({
            reportId,
        });

        res.send({ success: isRemoved });
    })
);

/**
 * 리포트 양식 수정 API 핸들러
 */
reportApiRouter.patch(
    '/reports/:reportId',
    apiHandler(async function (req, res) {
        const reportId = Number(req.params.reportId);
        const updateInput = req.body;

        const updatedReportTemplate = await reportTemplateRepository.updateById(
            {
                reportId,
                ...updateInput,
            }
        );

        res.send({ updatedReportTemplate });
    })
);

export { reportApiRouter };

export type ReportTreeSourceType = 'group' | 'report';

/**
 * ReportTemplateListItem 배열을 리얼리포트 웹 디자이너에서 요구하는 형태로 만들어서 반환하는 함수
 *
 * @param r2List 양식 목록
 * @returns 리얼리포트 웹 디자이너에서 요구하는 형태의 리포트 양식 구조
 */
function toTree(r2List: ReportTemplateListItem[]): ReportTreeSource {
    const result: ReportTreeSource = [];

    for (const r2 of r2List) {
        /**
         * current는 그룹 및 리포트를 추가할 그룹을 가리키는 포인터
         *
         * 루트 그룹인 result부터 시작
         */
        let current = result;

        const pathSegments = r2.path.split('/').filter((v) => v);

        /**
         * 해당 파일을 위한 그룹 정보 설정
         *
         * 그룹이 없으면 생성, 있으면 그걸 사용
         */
        for (const pathSegment of pathSegments) {
            let targetGroup = current.find(
                (treeItem) =>
                    treeItem.type === 'group' && treeItem.name === pathSegment
            ) as ReportGroupSource | undefined;

            /**
             * 이미 그룹 정보가 존재하면, current를 옮기고 다음 루프로 이동
             */
            if (targetGroup) {
                current = targetGroup.children;
                continue;
            }

            targetGroup = {
                type: 'group',
                name: pathSegment,
                children: [],
            };

            current.push(targetGroup);
            current = targetGroup.children;
        }

        current.push({
            type: 'report',
            id: String(r2.id),
            name: r2.name,
        });
    }

    return result;
}
