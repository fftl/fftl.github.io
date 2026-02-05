---
created: 2026-02-04T10:54:04+09:00
modified: 2026-02-05T10:18:00+09:00
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

### API 확인
api를 호출해보며 테스트를 해본 결과 가장 과거의 데이터는 2013년 5월부터 제공이 되는 것으로 확인했습니다. 
![[RegionPulse - 01-1768289533696.png|300x300]]![[RegionPulse - 01-1768289714123.png|300x300]]![[RegionPulse - 01-1768289780112.png|300x300]]

따라서 2013년 5월 이후의 지역별 전력 사용량 및 전기요금 데이터를 수집해보기로 했습니다. 해당 API에서 수집할 수 있는 정보는 다음과 같습니다.

![[RegionPulse - 01-1768290323915.png]]

### 테이블 생성
로우데이터를 담을 테이블이기 때문에, 제공되는 데이터를 온전하게 담을 수 있는 테이블을 생성했습니다. 만약 조회할 경우를 대비해 index 또한 생성하였습니다.
```sql
CREATE TABLE household_power(
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    sd_code TINYINT NOT NULL,
    year SMALLINT NOT NULL,
    month TINYINT NOT NULL,
    sd_name VARCHAR(15) NOT NULL,
    sgg_name VARCHAR(15) NOT NULL,
    house_cnt INT NOT NULL,
    power_usage DECIMAL(10,2) NOT NULL,
    bill MEDIUMINT NOT NULL
);

 CREATE INDEX idx_time ON household_power(year, month);
 CREATE INDEX idx_region ON household_power(sd_name, sgg_name);
```

### 데이터 수집 코드 작성
일회성 작업이기 때문에 Jupyter notebook을 통해 데이터 수집을 진행하였습니다.
