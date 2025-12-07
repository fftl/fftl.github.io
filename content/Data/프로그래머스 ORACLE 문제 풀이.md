### 개요

SQLP를 공부하는 과정에서 대부분의 교재나 실행 계획등이 ORACLE로 제공된다는 이야기를 들었고, ORACLE의 문법에 익숙해지기 위해 ORACLE을 이용한 문제 풀이를 진행하고 있습니다.

### 풀지 못한 문제
- https://school.programmers.co.kr/learn/courses/30/lessons/59041
	- group by, having
	- Count(\*) - 모든 행 세기
	- Count(name) - name 컬럼이 null 아닌 컬럼의 개수만 세기
- https://school.programmers.co.kr/learn/courses/30/lessons/59047
	- 와일드 카드 % 사용
	- UPPER(name)을 통해 대문자로 변환 가능
	- LOWER(name)을 통해 소문자로 변환 가능
- https://school.programmers.co.kr/learn/courses/30/lessons/59414
	- 날짜 형태 변환
	- TO_CHAR(DATETIME, 'YYYY-MM-DD') 를 통해 원하는 형식의 날짜로 변환 가능
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
- https://school.programmers.co.kr/learn/courses/30/lessons/131529
	- 문자열 자르기
	- SUBSTRING(NAME, 1, 2)
- https://school.programmers.co.kr/learn/courses/30/lessons/59409
	- CASE, THEN, ELSE, END
- https://school.programmers.co.kr/learn/courses/30/lessons/132202
	- 날짜 비교하기
		- WHERE TO_CHAR(APNT_YMD, 'YYYY-MM') = '2022-05'
	- 다중 기준 정렬
		- ORDER BY COUNT(*), 진료과코드;
	- 별칭에 '(작은따옴표)는 사용 불가
- https://school.programmers.co.kr/learn/courses/30/lessons/59412
	- 날짜 비교하기
	- EXTRACT(HOUR FROM DATETIME)을 통해 날짜 요소 숫자로 추출
	- BETWEEN 9 AND 19을 통해 9시~19시만 골라내기
- https://school.programmers.co.kr/learn/courses/30/lessons/144854
	- [[JOIN]] 문제
	- ```
	  FROM BOOK B, AUTHOR A
	  WHERE B.AUTHOR_ID = A.AUTHOR_ID
	  ```
- https://school.programmers.co.kr/learn/courses/30/lessons/133026
  - GROUP BY를 여러개, 즉 여러 단계 GROUP BY할 때에는 SELECT에도 동일한 개수의 COLUMN이 있어야 함
- https://school.programmers.co.kr/learn/courses/30/lessons/59044
	- 정렬 후 상위 N개 구하기
	- ORACLE 실행 순서는 FROM - WHERE - ORDER BY
	- 하나의 쿼리에서 FETCH FIRST를 하지 않는 이상 정렬되지 않은 상태에서 WHERE조건을 찾게 됨 -> 서브쿼리 사용
	- 상위 N개 구하기 ROWNUM <= 3;
- https://school.programmers.co.kr/learn/courses/30/lessons/164668
	- WHERE은 GROUP 짓기 전의 필터
	- GROUP을 이루고 난 뒤의 필터는 HAVING - 집계 함수 사용 가능
- https://school.programmers.co.kr/learn/courses/30/lessons/131116
	- 서브쿼리 활용
	- 여러 조건으로 값 찾기 WHERE(CATEGORY, PRICE) IN ( SUB QUARY ... )
- 
	
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