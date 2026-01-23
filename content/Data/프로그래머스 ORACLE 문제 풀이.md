---
created: 2025-12-05T16:08:50
modified: 2026-01-22T16:51:33+09:00
---
### 개요

SQLP를 공부하는 과정에서 대부분의 교재나 실행 계획등이 ORACLE로 제공된다는 이야기를 들었고, ORACLE의 문법에 익숙해지기 위해 ORACLE을 이용한 문제 풀이를 진행하고 있습니다.

### 다시 풀어 볼 문제
문제 이름 앞의 숫자는 풀어본 횟수입니다.

- 2_[동명 동물 수 찾기](https://school.programmers.co.kr/learn/courses/30/lessons/59041)
	- group by, having
	- Count(\*) - 모든 행 세기
	- Count(name) - name 컬럼이 null 아닌 컬럼의 개수만 세기
- 2_[이름에 el이 들어가는 동물 찾기](https://school.programmers.co.kr/learn/courses/30/lessons/59047)
	- 와일드 카드 % 사용
	- UPPER(name)을 통해 대문자로 변환 가능
	- LOWER(name)을 통해 소문자로 변환 가능
- 2_[DATETIME에서 DATE로 형 변환](https://school.programmers.co.kr/learn/courses/30/lessons/59414)
	- 날짜 형태 변환
	- TO_CHAR(DATETIME, 'YYYY-MM-DD') 를 통해 원하는 형식의 날짜로 변환 가능
	- mysql 에서는 date_format(datetime, '%Y-%m-%d') 를 사용합니다.
		```
			YYYY -- 4자리 연도 (2018)
			YY   -- 2자리 연도 (18)
			MM   -- 2자리 월 (01-12)
			DD   -- 2자리 일 (01-31)
			HH24 -- 24시간 (00-23)
			HH   -- 12시간 (01-12)
			MI   -- 분 (00-59)
			SS   -- 초 (00-59)
		```
- 2_[카테고리 별 상품 개수 구하기](https://school.programmers.co.kr/learn/courses/30/lessons/131529)
	- 문자열 자르기
	- SUBSTRING(NAME, 1, 2)
	- substr(name, 1, 2)
- 2_[중성화 여부 파악하기](https://school.programmers.co.kr/learn/courses/30/lessons/59409)
	- CASE, THEN, ELSE, END
	- WHEN LEFT(sex_upon_intake, 1) IN ('N', 'S') 
        THEN 'O'
        ELSE 'X'
    - 위처럼 LEFT를 가지고 첫 글자만 비교할 수도 있음
- 2_[진료과별 총 예약 횟수 출력하기](https://school.programmers.co.kr/learn/courses/30/lessons/132202)
	- 날짜 비교하기
		- WHERE TO_CHAR(APNT_YMD, 'YYYY-MM') = '2022-05'
	- 다중 기준 정렬
		- ORDER BY COUNT(*), 진료과코드;
	- 별칭에 '(작은따옴표)는 사용 불가
- 2_[입양 시각 구하기(1)](https://school.programmers.co.kr/learn/courses/30/lessons/59412)
	- 날짜 비교하기
	- EXTRACT(HOUR FROM DATETIME)을 통해 날짜 요소 숫자로 추출
	- BETWEEN 9 AND 19을 통해 9시~19시만 골라내기
- 2_[조건에 맞는 도서와 저자 리스트 출력하기](https://school.programmers.co.kr/learn/courses/30/lessons/144854)
	- [[SQL의 JOIN]] 문제
	- ```
	  FROM BOOK B, AUTHOR A
	  WHERE B.AUTHOR_ID = A.AUTHOR_ID
	  ```
- 2_[성분으로 구분한 아이스크림 총 주문량](https://school.programmers.co.kr/learn/courses/30/lessons/133026)
  - GROUP BY를 여러개, 즉 여러 단계 GROUP BY할 때에는 SELECT에도 동일한 개수의 COLUMN이 있어야 함
- 2_[오랜 기간 보호한 동물(1)](https://school.programmers.co.kr/learn/courses/30/lessons/59044)
	- 정렬 후 상위 N개 구하기
	- ORACLE 실행 순서는 FROM - WHERE - ORDER BY
	- 하나의 쿼리에서 FETCH FIRST를 하지 않는 이상 정렬되지 않은 상태에서 WHERE조건을 찾게 됨 -> 서브쿼리 사용
	- 상위 N개 구하기 ROWNUM <= 3;
- 2_[조건에 맞는 사용자와 총 거래금액 조회하기](https://school.programmers.co.kr/learn/courses/30/lessons/164668)
	- WHERE은 GROUP 짓기 전의 필터
	- GROUP을 이루고 난 뒤의 필터는 HAVING - 집계 함수 사용 가능
- 2_[식품분류별 가장 비싼 식품의 정보 조회하기](https://school.programmers.co.kr/learn/courses/30/lessons/131116)
	- 서브쿼리 활용
	- 여러 조건으로 값 찾기 WHERE(CATEGORY, PRICE) IN ( SUB QUARY ... )
- 2_[가격대 별 상품 개수 구하기](https://school.programmers.co.kr/learn/courses/30/lessons/131530)
	- **문자열 자르기? 어렵다!! 다시!**
- 2_[조건에 맞는 사용자 정보 조회하기](https://school.programmers.co.kr/learn/courses/30/lessons/164670)
	- 풀긴 했지만, 다시 보면 좋을 듯
- 2_[취소되지 않은 진료 예약 조회하기](https://school.programmers.co.kr/learn/courses/30/lessons/132204)
	- 3중 JOIN
	- ``` SQL
	  SELECT A.APNT_NO, P.PT_NAME, A.PT_NO, A.MCDP_CD, D.DR_NAME, A.APNT_YMD 
	  FROM APPOINTMENT A, PATIENT P, DOCTOR D 
	  WHERE A.PT_NO = P.PT_NO 
		  AND A.MDDR_ID = D.DR_ID 
		  AND TRUNC(A.APNT_YMD) = DATE '2022-04-13' 
		  AND A.MCDP_CD = 'CS' 
		  AND A.APNT_CNCL_YN = 'N' 
	  ORDER BY A.APNT_YMD;
	  ```
	- YYYY-MM-DD 와 날짜를 비교할 때에는 날짜형을 TRUNC로 감싸면 깔끔
- 2_[자동차 대여 기록에서 대여중 / 대여 가능 여부 구분하기](https://school.programmers.co.kr/learn/courses/30/lessons/157340)
	- **다시!!**
	- [[문제 풀이 피드백, 157340]]
- 2_[자동차 평균 대여 기간 구하기](https://school.programmers.co.kr/learn/courses/30/lessons/157342)
	- **다시!!**
- 2_[조회수가 가장 많은 중고거래 게시판의 첨부파일 조회하기](https://school.programmers.co.kr/learn/courses/30/lessons/164671)
	- [[문제 풀이 피드백, 164671]] 
	- 서브쿼리 보다는 JOIN을 활용하기
- 2_[저자 별 카테고리 별 매출액 집계하기](https://school.programmers.co.kr/learn/courses/30/lessons/144856)
	- 다중 조인, 다중 GROUP BY
	- 얼레벌레 풀어낸 느낌 다시 풀어보자.
- 2_[서울에 위치한 식당 목록 출력하기](https://school.programmers.co.kr/learn/courses/30/lessons/131118)
	- 서브쿼리를 이용해 풀어냄, 다른 풀이가 있을까?
- 2_[년, 월, 성별 별 상품 구매 회원 수 구하기](https://school.programmers.co.kr/learn/courses/30/lessons/131532)
	- DISTINCT **문제를 상세히 읽어야 할 것 같다.**
- 2_[대여 횟수가 많은 자동차들의 월별 대여 횟수 구하기](https://school.programmers.co.kr/learn/courses/30/lessons/151139)
	- 문제 이해를 잘 해야 할 것 같다.
- 2_[우유와 요거트가 담긴 장바구니](https://school.programmers.co.kr/learn/courses/30/lessons/62284)
	- **다시!!**
- 2_[오프라인/온라인 판매 데이터 통합하기](https://school.programmers.co.kr/learn/courses/30/lessons/131537)
	- UNION ALL 사용법 익히기
- [입양 시각 구하기(2)](https://school.programmers.co.kr/learn/courses/30/lessons/59413)
	- WITH 사용법
	- LEVEL이란?
- [자동차 대여 기록 별 대여 금액 구하기](https://school.programmers.co.kr/learn/courses/30/lessons/151141?language=oracle)
	- CAST(REPLACE(DURATION_TYPE, '일 이상', '') AS NUMBER) 이런식으로 글자를 잘라낼 수 있음
	- 다시 풀어볼 것
	- 
- [특정 기간동안 대여 가능한 자동차들의 대여비용 구하기](https://school.programmers.co.kr/learn/courses/30/lessons/157339?language=mysql)
	- not exists, round, 사용법을 다시 고민해보자.
- [상품을 구매한 회원 비율 구하기](https://school.programmers.co.kr/learn/courses/30/lessons/131534)
	- 구조를 잘 생각해봐야 할 것 같다.
---

## Oracle 문자열 함수 정리

### SUBSTR - 문자열 자르기 (가장 중요!)

**기본 문법:**

sql

```sql
SUBSTR(문자열, 시작위치, 길이)
SUBSTR(문자열, 시작위치)  -- 길이 생략하면 끝까지
```

**예제:**

sql

```sql
SELECT SUBSTR('A1000011', 1, 2) FROM DUAL;  -- A1 (1번째부터 2글자)
SELECT SUBSTR('A1000011', 3, 4) FROM DUAL;  -- 0000 (3번째부터 4글자)
SELECT SUBSTR('A1000011', 3) FROM DUAL;     -- 000011 (3번째부터 끝까지)
SELECT SUBSTR('A1000011', -4) FROM DUAL;    -- 0011 (뒤에서 4글자)
```

**음수 인덱스:**

sql

```sql
-- 뒤에서부터 셀 수 있음
SELECT SUBSTR('A1000011', -4, 4) FROM DUAL;  -- 0011 (뒤에서 4번째부터 4글자)
SELECT SUBSTR('HELLO', -3, 2) FROM DUAL;     -- LL (뒤에서 3번째부터 2글자)
```

### LENGTH - 길이

sql

```sql
SELECT LENGTH('HELLO') FROM DUAL;         -- 5
SELECT LENGTH(PRODUCT_CODE) FROM PRODUCT; -- 8
```

### CONCAT - 문자열 연결 (2개만 가능)

sql

```sql
SELECT CONCAT('Hello', ' World') FROM DUAL;  -- Hello World
SELECT CONCAT(NAME, '님') FROM ANIMAL_INS;   -- Lucy님
```

**3개 이상 연결은 || 연산자 사용:**

sql

```sql
SELECT 'Hello' || ' ' || 'World' FROM DUAL;      -- Hello World
SELECT NAME || '(' || ANIMAL_TYPE || ')' FROM ANIMAL_INS;  -- Lucy(Dog)
```

### UPPER / LOWER - 대소문자 변환

sql

```sql
SELECT UPPER('hello') FROM DUAL;  -- HELLO
SELECT LOWER('HELLO') FROM DUAL;  -- hello
SELECT UPPER(NAME) FROM ANIMAL_INS;
```

### TRIM / LTRIM / RTRIM - 공백 제거

sql

```sql
SELECT TRIM('  hello  ') FROM DUAL;   -- 'hello'
SELECT LTRIM('  hello') FROM DUAL;    -- 'hello  '
SELECT RTRIM('hello  ') FROM DUAL;    -- 'hello'
```

### REPLACE - 문자열 치환

sql

```sql
SELECT REPLACE('Hello World', 'World', 'Oracle') FROM DUAL;  -- Hello Oracle
SELECT REPLACE(PRODUCT_CODE, 'A1', 'B2') FROM PRODUCT;
```

### INSTR - 문자열 위치 찾기

sql

```sql
SELECT INSTR('HELLO', 'L') FROM DUAL;        -- 3 (첫 번째 L의 위치)
SELECT INSTR('HELLO', 'L', 1, 2) FROM DUAL;  -- 4 (두 번째 L의 위치)
SELECT INSTR('HELLO', 'X') FROM DUAL;        -- 0 (없으면 0)
```

### LPAD / RPAD - 문자 채우기

sql

```sql
SELECT LPAD('123', 5, '0') FROM DUAL;   -- 00123 (왼쪽에 0 채우기)
SELECT RPAD('123', 5, '0') FROM DUAL;   -- 12300 (오른쪽에 0 채우기)
SELECT LPAD(ANIMAL_ID, 10, '0') FROM ANIMAL_INS;  -- ID를 10자리로
```

## Oracle 날짜 함수 정리


**TO_CHAR - 날짜를 문자로**

sql

```sql
SELECT TO_CHAR(SYSDATE, 'YYYY-MM-DD') FROM DUAL;           -- 2024-12-05
SELECT TO_CHAR(DATETIME, 'YYYY-MM-DD') FROM ANIMAL_INS;    -- 날짜만
SELECT TO_CHAR(DATETIME, 'HH24:MI:SS') FROM ANIMAL_INS;    -- 시간만
```

**TO_DATE - 문자를 날짜로**

sql

```sql
SELECT TO_DATE('2024-12-05', 'YYYY-MM-DD') FROM DUAL;
```

**EXTRACT - 날짜 요소 추출**

sql

```sql
SELECT EXTRACT(YEAR FROM DATETIME) FROM ANIMAL_INS;   -- 연도
SELECT EXTRACT(MONTH FROM DATETIME) FROM ANIMAL_INS;  -- 월
SELECT EXTRACT(DAY FROM DATETIME) FROM ANIMAL_INS;    -- 일
```
```sql
SELECT SYSDATE , EXTRACT(HOUR FROM CAST(SYSDATE AS TIMESTAMP)) AS hour_part , EXTRACT(MINUTE FROM CAST(SYSDATE AS TIMESTAMP)) AS minute_part , EXTRACT(SECOND FROM CAST(SYSDATE AS TIMESTAMP)) AS second_part FROM dual
```
## TRUNC

날짜 초기화

``` SQL 
DATETIME -> 2018-12-13 22:10:59
TRUNC(DATETIME, 'DD') -> 2018-12-13 00:00:00
TRUNC(DATETIME, 'HH24') -> 2018-12-13 22:00:00
TRUNC(DATETIME, 'MI') -> 2018-12-13 22:10:00
-- 설정한 위치 뒤의 값들을 00으로 초기화 시킵니다.
-- 월의 경우 01-01로 초기화 합니다.
```

숫자 자르기
``` SQL
NUM -> 1234.56
TRUNC(NUM, 1) -> 1234.5
TRUNC(NUM, 2) -> 1234.56
TRUNC(NUM, -1) -> 1230
TRUNC(NUM, -2) -> 1200
```
## 실전 팁

**1. SUBSTR vs SUBSTRING**

sql

```sql
SUBSTR     ✅ Oracle에서 사용
SUBSTRING  ❌ Oracle에서 안 됨 (MySQL용)
```

**2. 문자열 연결**

sql

```sql
CONCAT('A', 'B')        ✅ 2개만 가능
'A' || 'B' || 'C'       ✅ 여러 개 가능 (추천)
```

**3. DUAL 테이블**

sql

```sql
-- Oracle에서 함수 테스트할 때
SELECT SUBSTR('TEST', 1, 2) FROM DUAL;  -- 반드시 FROM DUAL 필요
```

**4. 인덱스는 1부터 시작**

sql

```sql
SUBSTR('HELLO', 1, 2)  -- HE (1번째부터)
SUBSTR('HELLO', 0, 2)  -- HE (0도 1로 취급됨)
```

## SQLP 관점에서 중요한 것들

**문자열 함수 성능:**

- `SUBSTR`은 인덱스를 못 탐
- 가능하면 `LIKE 'A1%'` 같은 방식이 더 빠를 수 있음
- 하지만 GROUP BY에서는 SUBSTR 불가피

sql

```sql
-- 성능 비교
WHERE SUBSTR(PRODUCT_CODE, 1, 2) = 'A1'  -- 인덱스 안 탐
WHERE PRODUCT_CODE LIKE 'A1%'            -- 인덱스 탐 가능
```
