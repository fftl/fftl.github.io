---
date: 2025-12-10
---

## JOIN의 기본 개념

**JOIN이란?**

- 두 개 이상의 테이블을 연결해서 데이터를 조회
- 공통된 컬럼(키)을 기준으로 연결

**예시 테이블:**

```
ANIMAL_INS (보호소 입소)
- ANIMAL_ID (PK)
- NAME
- DATETIME (입소일)

ANIMAL_OUTS (입양)
- ANIMAL_ID (FK)
- NAME
- DATETIME (입양일)
```

## 1. INNER JOIN (내부 조인)

**양쪽 테이블에 모두 존재하는 데이터만 조회**

### ANSI 표준 (추천)

sql

```sql
SELECT A.ANIMAL_ID, A.NAME, A.DATETIME AS 입소일, O.DATETIME AS 입양일
FROM ANIMAL_INS A
INNER JOIN ANIMAL_OUTS O ON A.ANIMAL_ID = O.ANIMAL_ID;
```

### Oracle 전통 방식

sql

````sql
SELECT A.ANIMAL_ID, A.NAME, A.DATETIME AS 입소일, O.DATETIME AS 입양일
FROM ANIMAL_INS A, ANIMAL_OUTS O
WHERE A.ANIMAL_ID = O.ANIMAL_ID;
```

**결과:** 입소도 하고 입양도 간 동물만 조회

**비교:**
```
ANIMAL_INS          ANIMAL_OUTS        결과 (INNER JOIN)
A001 Lucy           A001 Lucy     →    A001 Lucy (매칭)
A002 Max            A003 Bella    →    A003 Bella (매칭)
A003 Bella
````

## 2. LEFT (OUTER) JOIN (왼쪽 외부 조인)

**왼쪽 테이블의 모든 데이터 + 오른쪽에서 매칭되는 것**

### ANSI 표준 (추천)

sql

```sql
SELECT A.ANIMAL_ID, A.NAME, A.DATETIME AS 입소일, O.DATETIME AS 입양일
FROM ANIMAL_INS A
LEFT JOIN ANIMAL_OUTS O ON A.ANIMAL_ID = O.ANIMAL_ID;
```

### Oracle 전통 방식

sql

````sql
SELECT A.ANIMAL_ID, A.NAME, A.DATETIME AS 입소일, O.DATETIME AS 입양일
FROM ANIMAL_INS A, ANIMAL_OUTS O
WHERE A.ANIMAL_ID = O.ANIMAL_ID(+);  -- (+) 기호가 오른쪽에
```

**결과:** 입소한 모든 동물 (입양 안 간 동물은 입양일이 NULL)

**비교:**
```
ANIMAL_INS          ANIMAL_OUTS        결과 (LEFT JOIN)
A001 Lucy           A001 Lucy     →    A001 Lucy (매칭)
A002 Max            A003 Bella    →    A002 Max, NULL (왼쪽만)
A003 Bella                        →    A003 Bella (매칭)
````

## 3. RIGHT (OUTER) JOIN (오른쪽 외부 조인)

**오른쪽 테이블의 모든 데이터 + 왼쪽에서 매칭되는 것**

### ANSI 표준

sql

```sql
SELECT A.ANIMAL_ID, A.NAME, A.DATETIME AS 입소일, O.DATETIME AS 입양일
FROM ANIMAL_INS A
RIGHT JOIN ANIMAL_OUTS O ON A.ANIMAL_ID = O.ANIMAL_ID;
```

### Oracle 전통 방식

sql

```sql
SELECT A.ANIMAL_ID, A.NAME, A.DATETIME AS 입소일, O.DATETIME AS 입양일
FROM ANIMAL_INS A, ANIMAL_OUTS O
WHERE A.ANIMAL_ID(+) = O.ANIMAL_ID;  -- (+) 기호가 왼쪽에
```

**실무에서는 거의 안 씀** (LEFT JOIN으로 바꾸면 됨)

## 4. FULL (OUTER) JOIN (완전 외부 조인)

**양쪽 테이블의 모든 데이터**

### ANSI 표준 (전통 방식은 복잡함)

sql

```sql
SELECT A.ANIMAL_ID, A.NAME, A.DATETIME AS 입소일, O.DATETIME AS 입양일
FROM ANIMAL_INS A
FULL JOIN ANIMAL_OUTS O ON A.ANIMAL_ID = O.ANIMAL_ID;
```

**결과:** 입소한 모든 동물 + 입양 간 모든 동물 (매칭 안 되면 NULL)

## 5. CROSS JOIN (교차 조인)

**모든 조합 생성 (카테시안 곱)**

sql

```sql
-- ANSI 표준
SELECT A.ANIMAL_TYPE, O.NAME
FROM ANIMAL_INS A
CROSS JOIN ANIMAL_OUTS O;

-- Oracle 전통
SELECT A.ANIMAL_TYPE, O.NAME
FROM ANIMAL_INS A, ANIMAL_OUTS O;
```

**결과:** A 테이블 행 × B 테이블 행 (매우 많은 결과!)

**주의:** 실수로 JOIN 조건 빼먹으면 CROSS JOIN됨!

## 6. SELF JOIN (자기 자신과 조인)

**같은 테이블끼리 조인**

sql

```sql
-- 같은 날 입소한 다른 동물 찾기
SELECT A1.ANIMAL_ID, A1.NAME, A2.ANIMAL_ID, A2.NAME
FROM ANIMAL_INS A1
INNER JOIN ANIMAL_INS A2 
    ON TO_CHAR(A1.DATETIME, 'YYYY-MM-DD') = TO_CHAR(A2.DATETIME, 'YYYY-MM-DD')
    AND A1.ANIMAL_ID < A2.ANIMAL_ID;  -- 중복 제거
```

## Oracle 전통 방식의 (+) 기호

**규칙:**

- **(+)는 NULL이 생기는 쪽에 붙임**
- LEFT JOIN: 오른쪽에 (+)
- RIGHT JOIN: 왼쪽에 (+)

sql

```sql
-- LEFT JOIN (왼쪽 기준)
WHERE A.ANIMAL_ID = O.ANIMAL_ID(+)
-- 의미: O 테이블에 없어도 A는 모두 조회 (O가 NULL 가능)

-- RIGHT JOIN (오른쪽 기준)
WHERE A.ANIMAL_ID(+) = O.ANIMAL_ID
-- 의미: A 테이블에 없어도 O는 모두 조회 (A가 NULL 가능)
```

## 실전 예제

### 1. 입양 간 동물 조회 (INNER JOIN)

sql

```sql
-- 입소도 하고 입양도 간 동물
SELECT I.ANIMAL_ID, I.NAME, I.DATETIME AS 입소일, O.DATETIME AS 입양일
FROM ANIMAL_INS I
INNER JOIN ANIMAL_OUTS O ON I.ANIMAL_ID = O.ANIMAL_ID
ORDER BY I.ANIMAL_ID;
```

### 2. 아직 입양 못 간 동물 (LEFT JOIN + NULL 체크)

sql

```sql
-- 입소했지만 입양 안 간 동물
SELECT I.ANIMAL_ID, I.NAME, I.DATETIME AS 입소일
FROM ANIMAL_INS I
LEFT JOIN ANIMAL_OUTS O ON I.ANIMAL_ID = O.ANIMAL_ID
WHERE O.ANIMAL_ID IS NULL
ORDER BY I.ANIMAL_ID;
```

### 3. 입양일이 입소일보다 빠른 동물 (데이터 오류)

sql

```sql
SELECT I.ANIMAL_ID, I.NAME
FROM ANIMAL_INS I
INNER JOIN ANIMAL_OUTS O ON I.ANIMAL_ID = O.ANIMAL_ID
WHERE O.DATETIME < I.DATETIME
ORDER BY I.DATETIME;
```

### 4. 입양 기간 계산

sql

```sql
SELECT I.ANIMAL_ID, 
       I.NAME,
       I.DATETIME AS 입소일,
       O.DATETIME AS 입양일,
       O.DATETIME - I.DATETIME AS 보호기간일수
FROM ANIMAL_INS I
INNER JOIN ANIMAL_OUTS O ON I.ANIMAL_ID = O.ANIMAL_ID
ORDER BY 보호기간일수 DESC;
```

### 5. 3개 테이블 JOIN

sql

```sql
-- 입소 -> 입양 -> 재입소 (가상 예제)
SELECT I1.ANIMAL_ID, 
       I1.NAME,
       I1.DATETIME AS 첫입소,
       O.DATETIME AS 첫입양,
       I2.DATETIME AS 재입소
FROM ANIMAL_INS I1
INNER JOIN ANIMAL_OUTS O ON I1.ANIMAL_ID = O.ANIMAL_ID
LEFT JOIN ANIMAL_INS I2 ON O.ANIMAL_ID = I2.ANIMAL_ID 
                        AND I2.DATETIME > O.DATETIME
ORDER BY I1.ANIMAL_ID;
```

## 여러 조건으로 JOIN

### 1. 복합 조건 JOIN

sql

```sql
-- ID가 같고, 이름도 같은 경우만
SELECT I.ANIMAL_ID, I.NAME
FROM ANIMAL_INS I
INNER JOIN ANIMAL_OUTS O 
    ON I.ANIMAL_ID = O.ANIMAL_ID 
    AND I.NAME = O.NAME;
```

### 2. 범위 조건 JOIN

sql

```sql
-- 입소 후 7일 이내 입양
SELECT I.ANIMAL_ID, I.NAME, O.DATETIME - I.DATETIME AS 일수
FROM ANIMAL_INS I
INNER JOIN ANIMAL_OUTS O 
    ON I.ANIMAL_ID = O.ANIMAL_ID
    AND O.DATETIME BETWEEN I.DATETIME AND I.DATETIME + 7;
```

### 3. 부등호 JOIN

sql

```sql
-- 자신보다 입소일이 빠른 동물들
SELECT A1.ANIMAL_ID, A1.NAME, COUNT(A2.ANIMAL_ID) AS 선배수
FROM ANIMAL_INS A1
LEFT JOIN ANIMAL_INS A2 ON A2.DATETIME < A1.DATETIME
GROUP BY A1.ANIMAL_ID, A1.NAME
ORDER BY A1.ANIMAL_ID;
```

## JOIN과 집계 함수

### 1. JOIN 후 GROUP BY

sql

```sql
-- 동물 종류별 입양 건수
SELECT I.ANIMAL_TYPE, COUNT(*) AS 입양건수
FROM ANIMAL_INS I
INNER JOIN ANIMAL_OUTS O ON I.ANIMAL_ID = O.ANIMAL_ID
GROUP BY I.ANIMAL_TYPE
ORDER BY I.ANIMAL_TYPE;
```

### 2. JOIN 후 조건부 집계

sql

```sql
-- 동물 종류별 평균 보호 기간
SELECT I.ANIMAL_TYPE,
       COUNT(*) AS 입양수,
       ROUND(AVG(O.DATETIME - I.DATETIME), 1) AS 평균보호일수,
       MAX(O.DATETIME - I.DATETIME) AS 최장보호일수
FROM ANIMAL_INS I
INNER JOIN ANIMAL_OUTS O ON I.ANIMAL_ID = O.ANIMAL_ID
GROUP BY I.ANIMAL_TYPE
ORDER BY 평균보호일수 DESC;
```

## JOIN 주의사항

### 1. 1:N 관계 주의

sql

```sql
-- 한 동물이 여러 번 입양된 경우 (잘못된 데이터)
SELECT I.ANIMAL_ID, COUNT(*) AS 입양횟수
FROM ANIMAL_INS I
INNER JOIN ANIMAL_OUTS O ON I.ANIMAL_ID = O.ANIMAL_ID
GROUP BY I.ANIMAL_ID
HAVING COUNT(*) > 1;
```

### 2. NULL 처리

sql

```sql
-- LEFT JOIN 후 NULL 체크
SELECT I.ANIMAL_ID, 
       I.NAME,
       NVL(O.DATETIME, SYSDATE) AS 입양일,  -- NULL이면 오늘 날짜
       CASE 
           WHEN O.ANIMAL_ID IS NULL THEN '미입양'
           ELSE '입양완료'
       END AS 상태
FROM ANIMAL_INS I
LEFT JOIN ANIMAL_OUTS O ON I.ANIMAL_ID = O.ANIMAL_ID;
```

### 3. 중복 제거

sql

```sql
-- 같은 이름을 가진 입소/입양 동물 (ID는 다름)
SELECT DISTINCT I.NAME
FROM ANIMAL_INS I
INNER JOIN ANIMAL_OUTS O ON I.NAME = O.NAME
ORDER BY I.NAME;
```

## 성능 최적화

### 1. 인덱스 활용

sql

```sql
-- JOIN 키에 인덱스가 있으면 빠름
CREATE INDEX IDX_ANIMAL_ID ON ANIMAL_OUTS(ANIMAL_ID);

SELECT I.ANIMAL_ID, I.NAME
FROM ANIMAL_INS I
INNER JOIN ANIMAL_OUTS O ON I.ANIMAL_ID = O.ANIMAL_ID;
-- ANIMAL_ID에 인덱스 있으면 빠른 조회
```

### 2. WHERE vs JOIN 조건

sql

```sql
-- ❌ 느림: 모든 조합 생성 후 필터링
SELECT I.ANIMAL_ID, I.NAME
FROM ANIMAL_INS I, ANIMAL_OUTS O
WHERE I.ANIMAL_ID = O.ANIMAL_ID
  AND I.ANIMAL_TYPE = 'Dog';

-- ✅ 빠름: 필터링 후 조인
SELECT I.ANIMAL_ID, I.NAME
FROM ANIMAL_INS I
INNER JOIN ANIMAL_OUTS O ON I.ANIMAL_ID = O.ANIMAL_ID
WHERE I.ANIMAL_TYPE = 'Dog';
```

## 실무 활용 예제

### 주문-상품 조인

sql

```sql
-- 주문 내역과 상품 정보
SELECT O.ORDER_ID,
       O.ORDER_DATE,
       P.PRODUCT_NAME,
       P.PRICE,
       O.QUANTITY,
       P.PRICE * O.QUANTITY AS 금액
FROM ORDERS O
INNER JOIN PRODUCTS P ON O.PRODUCT_ID = P.PRODUCT_ID
WHERE O.ORDER_DATE >= SYSDATE - 30
ORDER BY O.ORDER_DATE DESC;
```

### 회원-주문 통계

sql

```sql
-- 회원별 주문 통계
SELECT U.USER_ID,
       U.NAME,
       COUNT(O.ORDER_ID) AS 주문수,
       NVL(SUM(O.AMOUNT), 0) AS 총주문금액,
       NVL(MAX(O.ORDER_DATE), TO_DATE('1900-01-01', 'YYYY-MM-DD')) AS 최근주문일
FROM USERS U
LEFT JOIN ORDERS O ON U.USER_ID = O.USER_ID
GROUP BY U.USER_ID, U.NAME
ORDER BY 총주문금액 DESC;
```

## 정리

**JOIN 종류:**

|JOIN|설명|사용 시기|
|---|---|---|
|INNER JOIN|양쪽 모두 있는 것만|확실히 매칭되는 것만|
|LEFT JOIN|왼쪽 모두 + 오른쪽 매칭|기준 테이블 모두 보기|
|RIGHT JOIN|오른쪽 모두 + 왼쪽 매칭|거의 안 씀|
|FULL JOIN|양쪽 모두|드물게 사용|
|CROSS JOIN|모든 조합|특수한 경우|

**ANSI vs Oracle 전통:**

sql

```sql
-- ANSI (추천)
FROM A INNER JOIN B ON A.ID = B.ID
FROM A LEFT JOIN B ON A.ID = B.ID

-- Oracle 전통 (SQLP에서 나올 수 있음)
FROM A, B WHERE A.ID = B.ID
FROM A, B WHERE A.ID = B.ID(+)  -- LEFT JOIN
```

**실무 팁:**

- ANSI 표준 사용 추천 (가독성, 이식성)
- LEFT JOIN이 가장 많이 씀
- JOIN 키에 인덱스 필수
- 1:N 관계 주의