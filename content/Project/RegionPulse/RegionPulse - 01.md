# 프로젝트 기획
프로젝트의 큰 틀은 잡았으니, 이제 구체적인 기획을 진행하려고 합니다.
- [[#사용할 데이터 API 확인 및 수집]]
- [[#프로젝트 사용 기술 정리 및 환경 세팅]]
- [[#법정동 데이터 수집]]

## 사용할 데이터 API 확인 및 수집
사용할 데이터 수집입니다.
- [행정표준코드관리시스템](https://www.code.go.kr/stdcode/regCodeL.do)
	- 기초 정보가 될 법정동 코드를 수집합니다.
- [공공데이터포털](https://www.data.go.kr/index.do)
	- 지역별 인구자료와 지역별로 특성을 확인할 수 있는 데이터는 해당사이트에서 수집할 예정입니다.
	- [행정안전부_지역별(행정동) 성별 연령별 주민등록 인구수](https://www.data.go.kr/data/15097972/fileData.do)
	- [경찰청_범죄 발생 지역별 통계](https://www.data.go.kr/data/3074462/fileData.do)
	- [소상공인시장진흥공단_상가(상권)정보](https://www.data.go.kr/data/15083033/fileData.do)
- [전력데이터 개방 포털 시스템](https://bigdata.kepco.co.kr/cmsmain.do?scode=S01&pcode=000493&pstate=L&redirect=Y)
	- 해당 사이트에서 제공하는 API를 통해 시군구 코드와 가구평균 전력 사용량을 수집할 예정입니다.
	- [가구평균 전력사용량 API](https://bigdata.kepco.co.kr/cmsmain.do?scode=S01&pcode=000493&pstate=house&redirect=Y)

일단 지역별 인구와 연관지을 수 있을만한 데이터를 간단하게 골라보았고, 우선적으로 가구평균 전력 사용량에 대해 파악해보려고 합니다.
## 프로젝트 사용 기술 정리 및 환경 세팅
- Backend: FastAPI, SQLAlchemy 
- Database: MySQL 
- Visualization: D3.js, ECharts 
- Deploy: Github Actions, AWS Lightsail

## 법정동 데이터 수집
각종 지역 데이터를 수집하는 만큼 그 기반이 되는 법정동 데이터를 수집합니다.

![[RegionPulse - 01-1766928829865.png]]

데이터는 폐지되지 않은 현존 데이터만 수집할 예정이며, csv파일로 업데이트 되는 만큼 [코드변경안내](https://www.code.go.kr/bbsmng/dataBbsL.do)에 공지가 업데이트 될 경우, 새로운 csv파일을 받아 실행시키면 새로 업데이트되는 형식으로 구성해볼 예정입니다.

데이터베이스에는 sido, sgg, umd, ri 테이블을 통해 각각 저장할 예정입니다. 
