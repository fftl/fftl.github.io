---
created: 2025-12-23T23:58:52
modified: 2026-01-26T15:35:15+09:00
---
## 시험 과목
- 데이터 모델링의 이해
- SQL 기본 및 활용
- SQL 고급 활용 및 튜닝

여러 교재를 이용해 학습을 진행해보고 있습니다.

### 친절한 SQL 튜닝
- [[친절한 SQL 튜닝, 인덱스]]
- [[친절한 SQL 튜닝, 조인]]
- [[친절한 SQL 튜닝, 소트]]
- [[친절한 SQL 튜닝, DML]]
- [[친절한 SQL 튜닝, Lock과 트랜잭션, 옵티마이저]]

### 자주 사용하는 힌트 목록

최적화 목표
```sql
ALL_ROWS - 전체 처리속도 최적화
FIRST_ROWS(N) - 최초 N건 응답속도 최적화
```

액세스 방식
```SQL
FULL - TABLE FULL SCAN으로 유도
INDEX - INDEX SCAN으로 유도
INDEX_DESC - INDEX를 역순으로 스캔하도록 유도
INDEX_FFS - INDEX FAST FULL SCAN으로 유도
INDEX_SS - INDEX SKIP SCAN으로 유도
```

조인 순서
```SQL
ORDERED - FROM 절에 나열된 순서대로 조인
LEADING - LEADING 힌트 괄호에 기술한 순서대로 조인 (예, LEADING(T1 T2))
SWAP_JOIN_INPUTS - 해시 조인 시, BUILD INPUT을 명시적으로 선택 (예, SWAP_JOIN_INPUTS(T1))
```

조인 방식
```SQL
USE_NL - NL 조인으로 유도
USE_MERGE - 소트 머지 조인으로 유도
USE_HASH - 해시 조인으로 유도
NL_SJ - NL 세미조인으로 유도
MERGE_SJ - 소트 머지 세미조인으로 유도
HASH_SJ - 해시 세미조인으로 유도
```

서브쿼리 팩토링
```SQL
MATERIALIZE - WITH 문으로 정의한 집합을 물리적으로 생성하도록 유도 
(예, WITH /*+ MATERIALIZE */ T AS (SELECT ...))
INLINE - WITH 문으로 정의한 집합을 물리적으로 생성하지 않고 INLINE으로 처리하도록 유도
(예, WITH /*+ INLINEW */ T AS (SELECT ...))
```

쿼리 변환
```SQL
MERGE - 뷰 머징 유도
NO_MERGE - 뷰 머징 방지 
UNNEST - 서브쿼리 Unnesting 유도
NO_UNNEST - 서브쿼리 Unnesting 방지
PUSH_PRED - 조인조건 Pushdown 유도
NO_PUSH_PRED - 조인조건 Pushdown 방지
USE_CONCAT - OR 또는 IN-List 조건을 OR-Expansion으로 유도
NO_EXPAND - OR 또는 IN-List 조건에 대한 OR-Expansion 방지
```

병렬 처리
```SQL
PARALLEL - 테이블 스캔 또는 DML을 병렬 방식으로 처리하도록 유도
(예, PARALLEL(T1 2) PARALLEL(T2 2))
PARALLEL_INDEX - 인덱스 스캔을 병렬방식으로 처리하도록 유도
PQ_DISTRIBUTE - 병렬 수행 시 데이터 분배 방식 결정
(예, PQ_DISTRIBUTE(T1 HASH HASH))
```

기타
```SQL
APPEND - Direct-Path Insert로 유도
DRIVING_SITE - DB Link Remote 쿼리에 대한 최적화 및 실행 주체 지정(Local 또는 Remote)
PUSH_SUBQ - 서브쿼리를 가급적 빨리 필터링하도록 유도
NO_PUSH_SUBQ - 서브쿼리를 가급적 늦게 필터링하도록 유도
```

---
### SQL 튜닝 정리

- 조인하는 두 테이블의 크기 차이가 크다면 hash join이 유용하다.
- discinct문은 해당 조건을 만족하는 모든 row를 확인하기 때문에, 가능한 상황이라면 in exists 문으로 변환한다.
- 튜닝을 고려할 때, 무조건 조인, 인덱스 최적화를 고민하기보다 데이터의 크기를 보고 full scan 또한 고려해보면 좋다.
- 소트 생략은 부분범위 처리와 동음이의어라고 생각해도 무방하다. 소트 연산을 생략하려는 목적이 전체 결과 집합 중 앞쪽 일부를 빨리 출력하는데 있기 때문이다.
- 공유 가능 SQL
	- `"SELECT * FROM CUSTOMER WHERE LOGIN_ID = '" + login_id + "'";`
	- `"SELECT * FROM CUSTOMER WHERE LOGIN_ID = ?";`
	- 위 두 개의 쿼리는 전혀 다른 성능을 낼 수 있다. 쿼리 자체가 고유한 아이디를 가진다고 봐도 되는 오라클에서는, 첫번째의 경우 해당 쿼리문을 이용해 100명의 customer를 조회한다고 했을 때, 100개의 새로운 쿼리가 생성되어 라이브러리 캐시에 저장된다고 생각하면 된다. 하지만 하단의 바인드 변수를 사용할 경우 `SELECT * FROM CUSTOMER WHERE LOGIN_ID = :login_id` 와 같인 쿼리문 하나만이 있는 것을 알 수 있다.