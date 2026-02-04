---
created: 2026-02-04T10:54:04+09:00
modified: 2026-02-04T16:23:55+09:00
---
## 이 글에서 다룰 것
---
- 데이터 파이프라인 구축 계획
- 최초 데이터 수집

## 데이터 파이프라인 구축 계획
---
데이터를 로우데이터, 분석데이터를 각각 나누어 저장하여, 데이터를 보존할 생각입니다. 

이전에 데이터를 수집해보았을 때, 데이터의 가공이 필요함을 느꼈고, 수집한 데이터에 바로 insert, delete를 통해 가공을 하고 보니, 이상 값이 발생했을 때, 가공 과정이 잘못된 것인지, 로우데이터 때부터 그런 데이터인 것인지 확인하기가 굉장히 번거로워 졌습니다.

때문에 꼭 데이터를 수집하고 분석하는데 활용하기 위해서는 '수집한 원본 데이터를 꼭 남기는 습관을 가져야겠다.' 생각하게 되었습니다.

### 파이프라인 계획
1. 최초 데이터 Jupyter Notebook을 통한 수집
2. 배치 데이터로 지속적인 데이터 수집
	![[가구평균 전력 사용량 API - 02-1770173752334.png|400x400]]


### 최초 데이터 수집 (가구평균 전력사용량) 수집
---
시도, 시군구까지의 데이터를 수집할 수 있는 **가구평균 전력사용량 API**를 통해 각 지역별, 기간별 전력 사용량을 수집해보겠습니다.

api를 호출해보며 테스트를 해본 결과 가장 과거의 데이터는 2013년 5월부터 제공이 되는 것으로 확인했습니다. 
![[RegionPulse - 01-1768289533696.png|300x300]]![[RegionPulse - 01-1768289714123.png|300x300]]![[RegionPulse - 01-1768289780112.png|300x300]]

따라서 2013년 5월 이후의 지역별 전력 사용량 및 전기요금 데이터를 수집해보기로 했습니다. 해당 API에서 수집할 수 있는 정보는 다음과 같습니다.

![[RegionPulse - 01-1768290323915.png]]

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
		
