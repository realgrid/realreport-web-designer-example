import express from 'express';
import { pageHandler } from '../lib/handler/handler';

const homeRouter = express.Router();

/**
 * 홈 라우터
 *
 * - 리포트 양식 목록페이지로 리다이렉션됨
 */
homeRouter.get(
    '/',
    pageHandler(async function (req, res) {
        res.redirect('/reports');
    })
);

export { homeRouter };
