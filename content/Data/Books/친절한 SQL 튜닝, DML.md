---
created: 2026-01-08T16:43:14+09:00
modified: 2026-01-08T22:59:02+09:00
---
# DML 튜닝

## 기본 DML 튜닝
- DML 성능에 영향을 미치는 요소
	- 인덱스
	- 무결성 제약
	- 조건절
	- 서브쿼리
	- Redo 로깅
	- Undo 로깅
	- Lock
	- 커밋

- 인덱스와 DML 성능
	- 인덱스는 insert, delete 할 때, 해당 row에 해당하는 인덱스를 모두 수직적 탐색을 해야하기 때문에 DML 성능에 미치는 영향이 큽니다.
	- 인덱스 개수가 DML 성능에 미치는 영향이 매우 큰 만큼, 인덱스 설계에 심혈을 기울여야 합니다.

- 무결성 제약과 DML 성능
	- 데이터 무결성 규칙으로는 다음 네 가지가 있습니다. 이들은 DBMS에서 PK, FK, Check, Not Null 같은 제약을 설정하여 데이터 무결성을 지켜낼 수 있습니다.
		- 개체 무결성
		- 참조 무결성
		- 도메인 무결성
		- 사용자 정의 무결성
	- PK, FK 제약은 Check, Not Null 제약보다 성능에 더 큰 영향을 미칩니다. Check, Not Null은 정의한 제약 조건을 준수하는지만 확인하면 되지만, PK, FK 제약은 실제 데이터를 조회 해봐야 하기 때문입니다.

- 서브쿼리와 DML 성능
	- SELECT 문과 실행계획이 다르지 않으므로, 이들 DML 문에는 조인 튜닝 원리를 그대로 적용할 수 있습니다.

- Redo 로깅과 DML 성능
	- 오라클은 데이터 파일과 던트롤 파일에 가해지는 모든 변경사항을 Redo 로그에 기록합니다. Redo 로그는 트랜잭션 데이터가 어떤 이유에서건 유실 되었을 때, 트랜잭션을 재현함으로써 유실 이전 상태로 복구하는데 사용됩니다.
	- DML을 수행할 때마다 Redo 로그를 생성해야 하므로 Redo 로깅은 DML 성능에 영향을 미칩니다. INSERT 작업에 대해 Redo 로깅 생략 기능을 제공하는 이유가 여기에 있습니다.

> Redo 로그의 용도 (400p)
> 	1. Database Recovery
> 	2. Cache Recovery ( Instance Recovery 시 roll forward 단계 )
> 	3. Fast Commit

- Undo 로깅과 DML 성능
	- 과거에는 롤백(Rollback)이라는 용어를 주로 사용했지만, 오라클은 9i부터 Undo라는 용어를 사용하고 있습니다. Redo는 트랜잭션을 재현함으로써 과거를 현재 상태로 되돌리는데 사용하고, Undo는 트랜잭션을 롤백함으로써 현재를 과거 상태로 되돌리는데 사용합니다.
	- ![[친절한 SQL 튜닝, DML-1767880872751.png]]
	- DML을 수행할 때마다 Undo를 생성해야 하므로 Undo 로깅은 DML 성능에 영향을 미칩니다. Undo를 안 남길 수는 없는데, 오라클은 그런 방법을 아예 제공하지 않기 때문입니다.

> Undo의 용도
> 	1. Transaction Rollback
> 	2. Transaction Recovery (Instance Recovery 시 rollback 단계)
> 	3. Read Consistency

- Lock과 DML 성능
	- 진행중