---
date: 2025-12-27
---

## Oracle에서 '와 "의 차이

**' (작은따옴표) - 문자열 값**

sql

```sql
WHERE NAME = 'Lucy'           -- 문자열 'Lucy'
WHERE ANIMAL_TYPE = 'Dog'     -- 문자열 'Dog'
WHERE PRICE = '1000'          -- 문자열 '1000' (비추천, 숫자는 따옴표 없이)
```

**" (큰따옴표) - 식별자 (컬럼명, 테이블명)**

sql

```sql
SELECT "name" FROM ANIMAL_INS           -- 'name'이라는 컬럼 (소문자 그대로)
SELECT "ANIMAL_ID" FROM "animal_ins"    -- 대소문자 정확히 지정
```

## Oracle에서 "를 언제 사용하나?

**1. 대소문자를 구분해야 할 때**

**큰따옴표 없이 (일반적):**

sql

```sql
CREATE TABLE animal_ins (
    animal_id VARCHAR2(10)
);

-- Oracle이 자동으로 대문자로 변환
-- 실제로는 ANIMAL_INS, ANIMAL_ID로 저장됨

SELECT animal_id FROM animal_ins;  -- 정상 작동
SELECT ANIMAL_ID FROM ANIMAL_INS;  -- 정상 작동 (같음)
SELECT Animal_Id FROM Animal_Ins;  -- 정상 작동 (같음)
```

**큰따옴표 사용:**

sql

```sql
CREATE TABLE "animal_ins" (
    "animal_id" VARCHAR2(10)
);

-- 대소문자 그대로 저장됨

SELECT "animal_id" FROM "animal_ins";  ✅ 정상
SELECT animal_id FROM animal_ins;      ❌ 에러! (ANIMAL_INS를 찾음)
SELECT ANIMAL_ID FROM ANIMAL_INS;      ❌ 에러!
```

**2. 예약어를 컬럼명으로 쓸 때**

sql

```sql
-- 예약어를 컬럼명으로 (비추천하지만 가능)
CREATE TABLE users (
    "SELECT" VARCHAR2(10),    -- SELECT는 예약어지만 "로 감싸면 가능
    "FROM" VARCHAR2(10)
);

SELECT "SELECT", "FROM" 
FROM users;
```

**3. 공백이나 특수문자가 있을 때**

sql

```sql
CREATE TABLE products (
    "product name" VARCHAR2(50),     -- 공백 포함
    "price-discount" NUMBER          -- 하이픈 포함
);

SELECT "product name", "price-discount"
FROM products;
```

## 실무에서는 어떻게?

**Oracle 실무 권장사항:**

sql

```sql
-- ✅ 추천: 큰따옴표 없이 사용
CREATE TABLE animal_ins (
    animal_id VARCHAR2(10),
    name VARCHAR2(50)
);

SELECT animal_id, name 
FROM animal_ins 
WHERE name = 'Lucy';

-- ❌ 비추천: 굳이 큰따옴표 사용
SELECT "ANIMAL_ID", "NAME"
FROM "ANIMAL_INS"
WHERE "NAME" = "Lucy";  -- 에러! Lucy는 문자열이니 '사용
```

**정리:**

sql

```sql
-- 올바른 사용
SELECT animal_id, name          -- 식별자: 따옴표 없음
FROM animal_ins 
WHERE name = 'Lucy';            -- 문자열: 작은따옴표

-- 틀린 사용
WHERE name = "Lucy"             ❌ "Lucy"라는 컬럼을 찾음
WHERE "name" = Lucy             ❌ Lucy라는 컬럼을 찾음
```

### 마무리

결과적으로 일반적인 상황에서는 큰따옴표를 사용하지 않으나, 테이블이나 컬럼 생성시 대소문자의 구분이 필요할 때에만 명시하여 사용합니다. 큰따옴표를 사용할 경우 예약어도 사용할 수 있습니다.