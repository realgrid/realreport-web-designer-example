import express from 'express';
import multer from 'multer';
import { reportTemplateRepository } from '@lib/repository/reportTemplateRepository';
import { InvalidParameter } from '@lib/errors/error';
import { pageHandler } from '@lib/handler/handler';
import { toFormatDate } from '@lib/utils/date';

const consoleRouter = express.Router();
const upload = multer();

/**
 * 리포트 양식 목록 페이지 핸들러
 */
consoleRouter.get(
    '/',
    pageHandler(async function (req, res) {
        const r2List = await reportTemplateRepository.findMany();

        res.render('index', {
            r2List: r2List.map((r2) => ({
                ...r2,
                createdAt: toFormatDate(r2.createdAt),
                updatedAt: toFormatDate(r2.updatedAt),
            })),
        });
    })
);

/**
 * 리포트 양식 상세 조회 페이지
 */
consoleRouter.get(
    '/detail/:reportId',
    pageHandler(async function (req, res) {
        const reportId = Number(req.params.reportId);
        const r2 = await reportTemplateRepository.findOneById({ reportId });

        res.render('detail', {
            r2: {
                ...r2,
                createdAt: toFormatDate(r2.createdAt),
                updatedAt: toFormatDate(r2.updatedAt),
            },
        });
    })
);

/**
 * 리포트 양식 생성 페이지 핸들러
 */
consoleRouter.get(
    '/create',
    pageHandler(async function (req, res) {
        res.render('create');
    })
);

/**
 * 리포트 양식 생성 요청 처리 핸들러
 *
 * - 업로드한 R2파일의 내용을 읽어서 DB에 저장함
 */
consoleRouter.post(
    '/create',
    upload.single('r2data'),
    pageHandler(async function (req, res) {
        const { name, path } = req.body;
        const r2data = req.file;

        if (!name || !path || !r2data) {
            throw new InvalidParameter();
        }

        const r2dataText = Buffer.from(r2data.buffer).toString('utf-8');

        const r2Template = await reportTemplateRepository.create({
            path,
            name,
            r2Data: r2dataText,
        });

        res.redirect(`/reports/detail/${r2Template.id}`);
    })
);

/**
 * 리포트 양식 삭제 요청 처리 핸들러
 *
 * - 지정한 리포트 양식을 삭제함
 * - 완료 후 리포트 양식 목록페이지로 리다이렉션 시킴
 */
consoleRouter.post(
    '/delete/:reportId',
    pageHandler(async function (req, res) {
        const reportId = Number(req.params.reportId);

        await reportTemplateRepository.deleteById({
            reportId,
        });

        res.redirect(`/`);
    })
);

/**
 * 리포트 양식 수정 페이지
 */
consoleRouter.get(
    '/update/:reportId',
    pageHandler(async function (req, res) {
        const reportId = Number(req.params.reportId);
        const r2 = await reportTemplateRepository.findOneById({ reportId });

        res.render('update', {
            r2: {
                ...r2,
            },
        });
    })
);

/**
 * 리포트 양식 수정 요청 처리 핸들러
 */
consoleRouter.post(
    '/update/:reportId',
    pageHandler(async function (req, res) {
        const reportId = Number(req.params.reportId);
        const updateInput = req.body;

        const r2 = await reportTemplateRepository.updateById({
            reportId,
            ...updateInput,
        });

        res.redirect(`/reports/detail/${r2.id}`);
    })
);

/**
 * 리포트 양식 다운로드 페이지
 */
consoleRouter.get(
    '/download/:reportId',
    pageHandler(async function (req, res) {
        const reportId = Number(req.params.reportId);
        const r2 = await reportTemplateRepository.findOneById({ reportId });

        const filename = r2.name + '.r2';

        res.setHeader(
            'Content-disposition',
            `attachment; filename=${encodeURIComponent(filename)}`
        );
        res.setHeader('Content-type', 'text/plain');
        res.charset = 'UTF-8';

        res.write(Buffer.from(JSON.stringify(r2.r2Data)));

        res.end();
    })
);

export { consoleRouter };
