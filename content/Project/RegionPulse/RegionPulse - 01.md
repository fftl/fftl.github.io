---
created: 2025-12-29T07:38:45+09:00
modified: 2026-01-27T11:58:18+09:00
---
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

### 법정동 데이터 입력
- 처음에는 법정동코드의 개수를 기준으로 분류를 진행해보려 했습니다. 10자리를 기준으로 앞의 2개는 시도, 그 다음 2개는 시군구 ... 이런 방식을 생각했습니다. 하지만 테스트를 하는 과정에서 예외가 많다는 것을 발견하고 다른 방법을 찾아야 한다고 생각했습니다. 
	-  처음 고려한 방식입니다. ![[RegionPulse - 01-1767944253541.png]] 
	- 발견한 예외입니다.
	- ![[RegionPulse - 01-1767943582099.png]] 세종특별자치시의 경우 level 2이지만 code의 유형이 달라져버립니다.
	- ![[RegionPulse - 01-1767944091108.png]] 충청북도 증평군의 경우 level 2인데 혼자만 5번째 자리까지 코드를 사용하여 단위를 글자수로 나누는 방법도 사용하기 불안하게 만듭니다.
	- 위와 같이 자리 수를 이용해 분류를 만드는 일은 쉽지 않을 것 같다고 생각했습니다.


- 다음으로는 공백의 개수를 기준으로 level을 나누고 dict에 현재 레벨의 법정동코드, 부모코드를 입력하며 받아내고, 해당 dict를 통해 다음 레벨별의 부모를 탐색하는 방식을 이용해 데이터를 만들어 입력하였습니다.
	- ![[RegionPulse - 01-1768236201307.png]]

### 가구평균 전력사용량 수집
시도, 시군구까지의 데이터를 수집할 수 있는 **가구평균 전력사용량 API**를 통해 각 지역별, 기간별 전력 사용량을 수집해보겠습니다.

api를 호출해보며 테스트를 해본 결과 가장 과거의 데이터는 2013년 5월부터 제공이 되는 것으로 확인했습니다. 
![[RegionPulse - 01-1768289533696.png|300x300]]![[RegionPulse - 01-1768289714123.png|300x300]]![[RegionPulse - 01-1768289780112.png|300x300]]

따라서 2013년 5월 이후의 지역별 전력 사용량 및 전기요금 데이터를 수집해보기로 했습니다. 해당 API에서 수집할 수 있는 정보는 다음과 같습니다.

![[RegionPulse - 01-1768290323915.png]]

얻을 수 있는 데이터를 확인해보니, **행정안전부_지역별(행정동) 성별 연령별 주민등록 인구수**를 통해 인구 데이터를 파악하지 않더라도, **가구수의 이동과 지역별 전력 사용량의 변화를 예측할 수 있다**는 사실을 알게 되었습니다. 그리고 파악해보니, **행정안전부_지역별(행정동) 성별 연령별 주민등록 인구수**의 경우 2022년 12월 부터 데이터를 제공해서 생각보다 많은 기간의 데이터를 파악하기에는 문제가 있었습니다.

여러 데이터의 연관관계를 통해서 가치를 추출해내기 위해서는 시작단계에서 데이터의 정보를 확실히 확인해놓고 진행하는 것이 좋을 것 같다는 생각을 했습니다. 일단은 **가구평균 전력사용량 API**만을 이용해 **매 해 지역별 최고 전력 사용량의 지역을 찾아보는 작업**을 진행해보도록 하겠습니다.

```python
import time
from requests.exceptions import Timeout, ConnectionError, RequestException

all_data = []
failed_requests = []
success_count = 0

for year in range(2013, 2026):
    for month in range(1, 13):
        if (year == 2013 and month < 5) or (year == 2025 and month > 10):
            continue
        
        month_str = f'{month:02d}'
        for r in region:
            params = {
                'year' : str(year),
                'month' : str(month_str),
                'metroCd' : r[:2],
                'apiKey' : os.getenv('ELECTRIC_API_KEY')
             }
            
            try:
                response = requests.get(url, params=params, timeout=15)
                print(f"{response.url}")
                response.raise_for_status()
                result = response.json()
                if 'data' in result and result['data']:
                    all_data.extend(result['data'])
                    success_count += 1
                    print(f"✓ {year}-{month_str} {r[:2]}: {len(result['data'])}건")
                    
            except (ConnectionError, Timeout):
                # 연결 실패 - 조용히 기록만 하고 계속
                failed_requests.append(f"{year}-{month_str}-{r[:2]}")
                print(f"✗ {year}-{month_str} {r[:2]}: 연결 실패 (무시)")
                
            except Exception as e:
                # 기타 예외
                failed_requests.append(f"{year}-{month_str}-{r[:2]}")
                print(f"✗ {year}-{month_str} {r[:2]}: {type(e).__name__}")
            
            time.sleep(5)  # 현재 설정 유지

print(f"\n=== 수집 결과 ===")
print(f"✓ 성공: {success_count}개 요청, {len(all_data)}건 데이터")
print(f"✗ 실패: {len(failed_requests)}개 요청")
print(f"성공률: {success_count/(success_count+len(failed_requests))*100:.1f}%")
```

시간을 들여 현재 제공되고 있는, 2013월 5월 ~ 2025년 10월 전국 데이터 수집 완료! 이제 해당 데이터를 DB에 넣고, 이것저것 해볼 수 있을 것 같다.
![[RegionPulse - 01-1768322350660.png]]

### DB에 입력
DB에 입력을 완료하였다.
![[RegionPulse - 01-1768324281524.png]]

일단 해당 데이터를 통해 확인해 볼 수 있는 궁금증들을 한번 작성해 보자.
- 2013년에 비해 2025년 기준 가장 가구 수가 많이 증가한 지역 (2025년 10월 기준)
	- **문제 발생**
		- ![[RegionPulse - 01-1768326402588.png]]
		- 2013년에서 2025년으로 시간이 흐르며 강원도가 강원특별자치도, 전라북도가 전북특별자치도로 지명이 변경되어 있었습니다. 따라서 원활하게 join이 안되고 있었습니다.
	- 해결
		- ![[RegionPulse - 01-1768329595028.png]]
		- sd_name, sgg_name의 기준을 만들어 최신으로 사용해야 할 이름을 추가할 수 있도록 만들었습니다.
	- **문제 발생**
		- 2016년 6월 이후로 부천시로 합쳐서 통계 ![[RegionPulse - 01-1768331380779.png]]
		- 2023년 12월 이후로 다시 원미구, 소사구, 오정구로 분류 ![[RegionPulse - 01-1768331458691.png]]
		- 2025년 3월 이후로 가구수가 1~2인 부천시 데이터 발생 ![[RegionPulse - 01-1768331257464.png]]
		- 데이터를 살펴보던 중 경기도 부천시에 가구 수가 2인 것을 발견하고 이상함을 감지했습니다. 경기도 부천시를 전부 찾아보니, 기간에 따라 원미구, 소사구, 오정구 분류되어 제공되다가 다시 부천시로 통합, 다시 분류된 데이터로 제공이 되었고, 최근에는 1~2 가구수를 가진 부천시 데이터가 나타나기 시작했습니다.
		- 사실 이런 데이터의 경우 지시를 받을 수 있는 입장이라면 물어보고 처리 방법에 대해 주어진대로 해결하면 되겠지만, 주체적으로 프로젝트를 진행하는 입장에서 처리 방법을 고민하는 것이 쉽지 않은 것 같습니다. 
		- house_cnt를 기준으로 오름차순을 진행해본 결과, 이런 이상값이 나오는 경우는 2025년 이후의 부천시 밖에 없는 것을 확인했습니다. ![[RegionPulse - 01-1768331870389.png]]
		- 부천시만 해결하면 되기에 부천시를 기준으로 고민을 해보자면, 중간에 부천시로 통합된 기간의 데이터를 분리할 수는 없으니, 같은 달의 소사구, 원미구, 오정구를 합쳐 부천시 데이터로 합치는 것이 합리적일 것이라 생각했습니다.

---

해볼 만한 일
- Airflow를 통해 주기적으로 새로 생성되는 데이터(2025-10 이후 데이터)가 생성된 것을 확인하고, 생성되었다면 자동적으로 수집하는 데이터 파이프라인 구축하기
- 기획 조금 더 확실하게 정리하기
	- 가지고 있는 데이터를 활용하기
- 피파온라인 데이터 활용
	- https://openapi.nexon.com/ko/game/fconline/?id=2