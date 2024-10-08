# 리얼리포트 웹 디자이너와 r2 리소스 서버 연동 예제 프로젝트

-   리얼리포트 웹 디자이너와 r2 리소스 서버를 연동하여 사용하는 방법을 소개하는 프로젝트입니다.

## 환경

-   Node.js 18 버전

## 설치 및 실행 방법

-   r2 리소스 서버와 연동을 위해 r2 리소스 서버 실행이 우선적으로 진행되어야 합니다.
-   r2 리소스 서버 실행방법은 `realreport-server -> README.md` 파일을 참고해주세요.

```bash
npm run start
```

## 프로젝트 구성

### 폴더 구조

```
/web-designer-intergration-example
  ├── src // 리얼리포트 리소스 서버 예제
  │    ├── assets // 정적 리소스 관련 폴더
  │    │     ├── fonts // 폰트 파일
  │    │     ├── reports // 보고서 양식 템플릿
  │    ├── lib // 리얼리포트 라이브러리 모음 폴더
  │    ├── styles // 스타일 관련 파일 모음
  │    ├── app.js // 리얼리포트 웹 디자이너 관련 코드
  │    ├── blankReport.js // 예제 페이지 진입시 빈 양식 로드용 양식 데이터 파일
  │    ├── index.html // 웹 디자이너 예제 html 페이지
```
