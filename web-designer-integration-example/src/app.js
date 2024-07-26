let designer;

function initDesigner() {
    /**
     * 리얼리포트 웹 디자이너 옵션을 지정합니다.
     * - 옵션에서 제공되는 Callback을 활용해서 리소스 서버의 정보를 받아와 처리하는 핸들러를 구성합니다.
     * {@link https://real-report.com/docs/api/types/TypesReportDesigner#ireportdesigneroptions}
     */
    const designerOptions = {
        showAssetPanel: true,
        showDataPanel: true,
        showScriptPanel: true,
        getReportListCallback: reportListCallbackHandler,
        getReportCallback: reportCallbackHandler,
        saveReportCallback: saveReportCallbackHandler,
    };

    /**
     * 리얼리포트 웹 디자이너 객체를 생성합니다.
     * {@link https://real-report.com/docs/api/ReportDesigner#생성자}
     */
    designer = new RealReport.ReportDesigner('realreport-designer', designerOptions);

    /**
     * New 메뉴에서 사용할 리포트 양식 템플릿을 지정합니다.
     * {@link https://real-report.com/docs/api/ReportDesigner#setreporttemplates}
     */
    designer.setReportTemplates([
        {
            category: 'General',
            templates: [
                {
                    name: 'Blank Form',
                    thumbnail: './assets/reports/blank.png',
                    file: './assets/reports/blank.json',
                    description: '리포트 헤더만 존재하는 비어 있는 리포트입니다.',
                },
            ],
        },
    ]);

    /**
     * 리얼리포트 웹 디자이너에서 사용할 폰트를 등록합니다.
     * {@link https://real-report.com/docs/api/ReportDesigner#registerfonts}
     */
    designer
        .registerFonts(
            [
                {
                    name: 'Pretendard',
                    source: './assets/fonts/Pretendard-Regular.otf',
                    fontWeight: 'normal',
                },
                {
                    name: 'Pretendard',
                    source: './assets/fonts/Pretendard-Bold.otf',
                    fontWeight: 'bold',
                },
            ],
            'Pretendard'
        )
        .then(() => {
            /**
             * 웹 디자이너에서 폰트 로드가 완료된 후에 blankReport 양식을 웹 디자이너에 로드합니다.
             * {@link https://real-report.com/docs/api/ReportDesigner#loadreport}
             */
            designer.loadReport(blankReport);
        });
}

/**
 * 리얼리포트 웹 디자이너에서 Open 메뉴 클릭 시 목록을 조회하기 위한 Callback Handler
 * {@link https://real-report.com/docs/api/ReportDesigner#getreportlistcallback}
 */
async function reportListCallbackHandler() {
    // 리포트 양식 목록을 제공하는 사용자 코드
    const { r2Templates } = await fetchApi('http://localhost:3000/api/v1/reports');

    return r2Templates;
}

/**
 * Open 메뉴에서 선택한 양식 정보를 가져오기 위한 Callback Handler
 * {@link https://real-report.com/docs/api/ReportDesigner#getreportcallback}
 */
async function reportCallbackHandler(reportId) {
    // 리포트 양식을 제공하는 사용자 코드
    const { reportTemplate } = await fetchApi(`http://localhost:3000/api/v1/reports/${reportId}`);

    return {
        id: reportId,
        source: reportTemplate.r2Data,
    };
}

/**
 * 리얼리포트 웹 디자이너에서 Save 메뉴 클릭 시 현재 수정한 양식 정보를 저장하기 위한 Callback Handler
 * {@link https://real-report.com/docs/api/ReportDesigner#savereportcallback}
 */
async function saveReportCallbackHandler(report, reportId) {
    try {
        // 현재 수정중인 양식에 reportId가 설정되어있지 않다면 리소스 서버에 새로운 양식을 업로드합니다.
        if (!reportId) {
            const { id } = await fetchApi(`http://localhost:3000/api/v1/reports`, 'POST', {
                path: '/',
                name: 'new report',
                r2Data: report,
            });

            return {
                reportId: id,
                message: '새로운 양식이 등록되었습니다.',
            };
        } else {
            const { updatedReportTemplate } = await fetchApi(
                `http://localhost:3000/api/v1/reports/${reportId}`,
                'PATCH',
                {
                    r2Data: report,
                }
            );
            return {
                reportId: updatedReportTemplate.id,
                message: '양식이 수정되었습니다.',
            };
        }
    } catch (error) {
        throw new Error(error.message);
    }
}

async function fetchApi(url, method = 'GET', body) {
    const response = await fetch(url, {
        headers: {
            'Content-Type': 'application/json',
        },
        method,
        body: body ? JSON.stringify(body) : null,
    });

    const jsonData = await response.json();

    if (response.status > 400) {
        throw new Error(jsonData.message || '알 수 없는 에러가 발생하였습니다.');
    }

    return jsonData;
}
