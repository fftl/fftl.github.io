## 기본 집계 함수

### COUNT - 개수 세기

sql

````sql
SELECT CAR_TYPE,
       COUNT(*) AS 전체개수,
       COUNT(OPTIONS) AS 옵션있는개수,
       COUNT(DISTINCT DAILY_FEE) AS 고유가격개수
FROM CAR_RENTAL_COMPANY_CAR
GROUP BY CAR_TYPE;
```

**결과 예시:**
```
CAR_TYPE  전체개수  옵션있는개수  고유가격개수
SUV       3        3            2
세단      1        1            1
트럭      1        1            1
````

### SUM - 합계

sql

````sql
SELECT CAR_TYPE,
       COUNT(*) AS 차량수,
       SUM(DAILY_FEE) AS 총일일요금,
       SUM(DAILY_FEE * 30) AS 월간총수익예상
FROM CAR_RENTAL_COMPANY_CAR
GROUP BY CAR_TYPE;
```

**결과 예시:**
```
CAR_TYPE  차량수  총일일요금  월간총수익예상
SUV       3      52000      1560000
세단      1      16000      480000
트럭      1      35000      1050000
````

### AVG - 평균

sql

````sql
SELECT CAR_TYPE,
       COUNT(*) AS 차량수,
       AVG(DAILY_FEE) AS 평균일일요금,
       ROUND(AVG(DAILY_FEE), 0) AS 평균요금반올림
FROM CAR_RENTAL_COMPANY_CAR
GROUP BY CAR_TYPE;
```

**결과 예시:**
```
CAR_TYPE  차량수  평균일일요금    평균요금반올림
SUV       3      17333.333...   17333
세단      1      16000          16000
트럭      1      35000          35000
````

### MAX / MIN - 최댓값 / 최솟값

sql

````sql
SELECT CAR_TYPE,
       COUNT(*) AS 차량수,
       MAX(DAILY_FEE) AS 최고요금,
       MIN(DAILY_FEE) AS 최저요금,
       MAX(DAILY_FEE) - MIN(DAILY_FEE) AS 가격편차
FROM CAR_RENTAL_COMPANY_CAR
GROUP BY CAR_TYPE;
```

**결과 예시:**
```
CAR_TYPE  차량수  최고요금  최저요금  가격편차
SUV       3      22000    14000    8000
세단      1      16000    16000    0
트럭      1      35000    35000    0
````

## 통계 관련 집계 함수

### STDDEV - 표준편차

sql

```sql
SELECT CAR_TYPE,
       COUNT(*) AS 차량수,
       AVG(DAILY_FEE) AS 평균,
       STDDEV(DAILY_FEE) AS 표준편차
FROM CAR_RENTAL_COMPANY_CAR
GROUP BY CAR_TYPE;
```

### VARIANCE - 분산

sql

```sql
SELECT CAR_TYPE,
       COUNT(*) AS 차량수,
       VARIANCE(DAILY_FEE) AS 분산
FROM CAR_RENTAL_COMPANY_CAR
GROUP BY CAR_TYPE;
```

## 문자열 집계 함수

### LISTAGG - 문자열 합치기 (Oracle 11g 이상)

sql

````sql
SELECT CAR_TYPE,
       COUNT(*) AS 차량수,
       LISTAGG(CAR_ID, ', ') WITHIN GROUP (ORDER BY CAR_ID) AS 차량ID목록
FROM CAR_RENTAL_COMPANY_CAR
GROUP BY CAR_TYPE;
```

**결과 예시:**
```
CAR_TYPE  차량수  차량ID목록
SUV       3      2, 3, 5
세단      1      1
트럭      1      4
````

**응용 예제:**

sql

```sql
-- 각 차량 종류별 옵션 요약
SELECT CAR_TYPE,
       COUNT(*) AS 차량수,
       LISTAGG(DISTINCT DAILY_FEE, ', ') WITHIN GROUP (ORDER BY DAILY_FEE) AS 가격대
FROM CAR_RENTAL_COMPANY_CAR
GROUP BY CAR_TYPE;
```

## 여러 집계 함수 조합

**실전 예제 1: 종합 통계**

sql

```sql
SELECT CAR_TYPE,
       COUNT(*) AS 차량수,
       SUM(DAILY_FEE) AS 총요금,
       AVG(DAILY_FEE) AS 평균요금,
       MAX(DAILY_FEE) AS 최고요금,
       MIN(DAILY_FEE) AS 최저요금,
       MAX(DAILY_FEE) - MIN(DAILY_FEE) AS 가격차이
FROM CAR_RENTAL_COMPANY_CAR
GROUP BY CAR_TYPE
ORDER BY 평균요금 DESC;
```

**실전 예제 2: 동물 보호소**

sql

```sql
-- 동물 종류별 통계
SELECT ANIMAL_TYPE,
       COUNT(*) AS 총마리수,
       COUNT(NAME) AS 이름있는수,
       COUNT(*) - COUNT(NAME) AS 이름없는수,
       MIN(DATETIME) AS 가장오래된입소일,
       MAX(DATETIME) AS 가장최근입소일
FROM ANIMAL_INS
GROUP BY ANIMAL_TYPE;
```

**실전 예제 3: 주문 통계**

sql

```sql
-- 상품별 판매 통계
SELECT PRODUCT_ID,
       COUNT(*) AS 주문건수,
       SUM(QUANTITY) AS 총판매량,
       AVG(QUANTITY) AS 평균주문량,
       SUM(QUANTITY * PRICE) AS 총매출,
       AVG(QUANTITY * PRICE) AS 평균주문금액
FROM ORDERS
GROUP BY PRODUCT_ID
ORDER BY 총매출 DESC;
```

## HAVING절과 함께 사용

**집계 결과로 필터링:**

sql

```sql
-- 평균 요금이 20000원 이상인 차종만
SELECT CAR_TYPE,
       COUNT(*) AS 차량수,
       AVG(DAILY_FEE) AS 평균요금
FROM CAR_RENTAL_COMPANY_CAR
GROUP BY CAR_TYPE
HAVING AVG(DAILY_FEE) >= 20000;
```

sql

```sql
-- 차량이 2대 이상이고 최고요금이 20000 이상인 차종
SELECT CAR_TYPE,
       COUNT(*) AS 차량수,
       MAX(DAILY_FEE) AS 최고요금
FROM CAR_RENTAL_COMPANY_CAR
GROUP BY CAR_TYPE
HAVING COUNT(*) >= 2 
   AND MAX(DAILY_FEE) >= 20000;
```

## 조건부 집계 (CASE와 조합)

**특정 조건 카운트:**

sql

````sql
SELECT CAR_TYPE,
       COUNT(*) AS 전체차량수,
       SUM(CASE WHEN DAILY_FEE >= 20000 THEN 1 ELSE 0 END) AS 고가차량수,
       SUM(CASE WHEN DAILY_FEE < 20000 THEN 1 ELSE 0 END) AS 저가차량수,
       AVG(CASE WHEN DAILY_FEE >= 20000 THEN DAILY_FEE END) AS 고가평균요금
FROM CAR_RENTAL_COMPANY_CAR
GROUP BY CAR_TYPE;
```

**결과 예시:**
```
CAR_TYPE  전체차량수  고가차량수  저가차량수  고가평균요금
SUV       3          1          2          22000
세단      1          0          1          NULL
트럭      1          1          0          35000
````

## 실무 활용 예제

### 1. 월별 매출 통계

sql

```sql
SELECT TO_CHAR(ORDER_DATE, 'YYYY-MM') AS 월,
       COUNT(*) AS 주문건수,
       COUNT(DISTINCT USER_ID) AS 구매고객수,
       SUM(AMOUNT) AS 총매출,
       AVG(AMOUNT) AS 평균주문금액,
       MAX(AMOUNT) AS 최고주문금액,
       MIN(AMOUNT) AS 최저주문금액
FROM ORDERS
WHERE ORDER_DATE >= TO_DATE('2024-01-01', 'YYYY-MM-DD')
GROUP BY TO_CHAR(ORDER_DATE, 'YYYY-MM')
ORDER BY 월;
```

### 2. 고객별 구매 이력

sql

```sql
SELECT USER_ID,
       COUNT(*) AS 총구매횟수,
       SUM(AMOUNT) AS 총구매금액,
       AVG(AMOUNT) AS 평균구매금액,
       MAX(AMOUNT) AS 최고구매금액,
       MAX(ORDER_DATE) AS 최근구매일,
       ROUND(SUM(AMOUNT) / COUNT(*), 0) AS 건당평균
FROM ORDERS
GROUP BY USER_ID
HAVING COUNT(*) >= 3  -- 3회 이상 구매 고객
ORDER BY 총구매금액 DESC;
```

### 3. 상품 카테고리별 분석

sql

```sql
SELECT CATEGORY,
       COUNT(*) AS 상품수,
       COUNT(DISTINCT BRAND) AS 브랜드수,
       SUM(STOCK) AS 총재고량,
       AVG(PRICE) AS 평균가격,
       MAX(PRICE) AS 최고가,
       MIN(PRICE) AS 최저가,
       LISTAGG(PRODUCT_NAME, ', ') WITHIN GROUP (ORDER BY PRICE DESC) AS 상품목록
FROM PRODUCTS
GROUP BY CATEGORY
ORDER BY 평균가격 DESC;
```

### 4. 동물 보호소 입소 분석

sql

```sql
SELECT EXTRACT(YEAR FROM DATETIME) AS 연도,
       EXTRACT(MONTH FROM DATETIME) AS 월,
       ANIMAL_TYPE,
       COUNT(*) AS 입소수,
       COUNT(CASE WHEN INTAKE_CONDITION = 'Normal' THEN 1 END) AS 정상입소,
       COUNT(CASE WHEN INTAKE_CONDITION = 'Injured' THEN 1 END) AS 부상입소,
       COUNT(CASE WHEN INTAKE_CONDITION = 'Sick' THEN 1 END) AS 질병입소
FROM ANIMAL_INS
GROUP BY EXTRACT(YEAR FROM DATETIME), 
         EXTRACT(MONTH FROM DATETIME), 
         ANIMAL_TYPE
ORDER BY 연도, 월, ANIMAL_TYPE;
```

## 집계 함수 전체 정리

|함수|설명|예시|
|---|---|---|
|COUNT(*)|행 개수|5|
|COUNT(컬럼)|NULL 제외 개수|4|
|COUNT(DISTINCT 컬럼)|고유값 개수|3|
|SUM(컬럼)|합계|100000|
|AVG(컬럼)|평균|20000|
|MAX(컬럼)|최댓값|35000|
|MIN(컬럼)|최솟값|14000|
|STDDEV(컬럼)|표준편차|4242.64|
|VARIANCE(컬럼)|분산|18000000|
|LISTAGG(컬럼, 구분자)|문자열 합치기|'1, 2, 3'|

## 주의사항

**1. SELECT 절에 집계함수 없는 컬럼은 GROUP BY에 있어야 함**

sql

```sql
-- ❌ 에러
SELECT CAR_TYPE, CAR_ID, COUNT(*)
FROM CAR_RENTAL_COMPANY_CAR
GROUP BY CAR_TYPE;  -- CAR_ID가 GROUP BY에 없음

-- ✅ 정상
SELECT CAR_TYPE, COUNT(*)
FROM CAR_RENTAL_COMPANY_CAR
GROUP BY CAR_TYPE;
```

**2. WHERE vs HAVING**

sql

```sql
-- WHERE: 그룹화 전 필터링 (개별 행)
WHERE DAILY_FEE >= 20000

-- HAVING: 그룹화 후 필터링 (집계 결과)
HAVING AVG(DAILY_FEE) >= 20000
```

**3. NULL 처리**

sql

```sql
-- COUNT(*)는 NULL 포함
-- COUNT(컬럼)은 NULL 제외
-- AVG, SUM도 NULL 제외

SELECT CAR_TYPE,
       COUNT(*) AS 전체,
       COUNT(OPTIONS) AS 옵션있음,
       AVG(DAILY_FEE) AS 평균  -- NULL 제외하고 계산
FROM CAR_RENTAL_COMPANY_CAR
GROUP BY CAR_TYPE;
```

## 정리

**GROUP BY와 함께 사용할 수 있는 것들:**

1. **COUNT** - 개수
2. **SUM** - 합계
3. **AVG** - 평균
4. **MAX/MIN** - 최댓값/최솟값
5. **STDDEV/VARIANCE** - 표준편차/분산
6. **LISTAGG** - 문자열 합치기
7. **CASE WHEN과 조합** - 조건부 집계

**실무에서 가장 많이 쓰는 조합:**

sql

```sql
SELECT 그룹컬럼,
       COUNT(*) AS 개수,
       SUM(금액) AS 합계,
       AVG(금액) AS 평균,
       MAX(금액) AS 최대,
       MIN(금액) AS 최소
FROM 테이블
GROUP BY 그룹컬럼;
```