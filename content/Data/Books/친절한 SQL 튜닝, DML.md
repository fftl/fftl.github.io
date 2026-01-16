---
created: 2026-01-08T16:43:14+09:00
modified: 2026-01-15T16:52:08+09:00
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
	- Lock은 DML 성능에 매우 크고 직접적인 영향을 미친다. [[Lock]]을 필요 이상으로 자주, 길게 사용하거나 레벨을 높일수록 DML 성능은 느려진다. 그렇다고 Lock을 너무 적게, 짧게 사용하거나 필요한 레벨 이하로 낮추면 데이터 품질이 나빠진다. 
	- 동시성 제어(Concurrency Control)란, 동시에 실행되는 트랜잭션 수를 최대화(고성능)하면서도 입력, 수정, 삭제, 검색 시 데이터 무결성을 유지(고품질)하기 위해 노력하는 것을 말한다.

- 커밋과 DML 성능
	- 커밋은 DML과 별개로 실행하지만, DML을 끝내려면 커밋까지 완료해야 하므로 서로 밀접한 관련이 있다.
	- 특히 DML이 Lock에 의해 블로킹(Blocking)된 경우, 커밋은 DML 성능과 직결된다. DML을 완료할 수 있게 Lock을 푸는 열쇠가 바로 커밋이기 때문이다.
	- 모든 DBMS가 Fast Commit을 구현하고 있다. 구현방식은 서로 다르지만 갱신한 데이터가 아무리 많아도 커밋만큼은 빠르게 처리한다는 점은 같다.

	1. DB 버퍼캐시
		DB에 접속한 사용자 대신 모든 일을 처리하는 **서버 프로세스**는 버퍼 캐시를 통해 데이터를 읽고 쓴다. 버퍼캐시에서 변경된 블록(Dirty 블록)을 모아 주기적으로 데이터파일에 일괄 기록하는 작업은 DBWR(Database Writer) 프로세스가 맡는다. 
	2. Redo 로그버퍼
		버퍼캣는 휘발성이므로 DBWR 프로세스가 Dirty 블록들을 데이터 파일에 반영할 때 까지 불안한 상태라고 생각할 수 있다. 하지만 버퍼캐시에 가한 변경사항을 Redo 로그에도 기록해두었기 때문에 안심해도 된다. 버퍼캐시 데이터가 유실되더라도 Redo 로그를 이용해 언제든 복구할 수 있기 때문이다. 여기서 말하는 Redo 로그도 파일이다. 오라클은 Redo 로깅의 성능 문제를 해결하기 위해 로그버퍼를 이용한다. Redo 로그 파일에 기록하기 전에 먼저 로그버퍼에 기록하는 방식이다. 그리고 로그버퍼에 기록한 내용은 나중에 LGWR(Log Writer) 프로세스가 Redo 로그 파일에 일괄 기록한다.
	3. 트랜잭션 데이터 저장 과정
		1. ![[친절한 SQL 튜닝, DML-1768050367074.jpg]]
			1. DML 문을 실행하면 Redo 로그버퍼에 변경사항을 기록한다.
			2. 버퍼블록에서 데이터를 변경(레코드 추가/수정/삭제)한다. 물론, 버퍼캐시에서 블록을 찾지 못하면, 데이터 파일에서 읽는 작업부터 한다.
			3. 커밋한다. 
			4. LGWR 프로세스가 Redo 로그버퍼 내용을 로그파일에 일괄 저장한다.
			5. DBWR 프로세스가 변경된 버퍼블록들을 데이터파일에 일괄 저장한다.
		2. 오라클은 데이터를 변경하기 전에 항상 로그부터 기록한다. 버퍼블록의 데이터 변경 전에 Redo 로그버퍼에 로그를 기록하거나, DBWR 프로세스가 Drity 블록을 디스크에 기록하기 전에 LGWR 프로세스가 Redo 로그파일에 로그버퍼를 저장하는 이유이기도 하다. 이를 '**Write Ahead Logging**'이라고 부른다.
	4. '커밋=저장 버튼'
		문서를 작성할 때 워드프로세서는 사용자가 입력한 내용을 메모리에 기록하며, 저장 버튼을 눌러야 비로소 디스크 파일에 저장한다. 워드 프로세서가 저장을 완료할 떄 까지 사용자는 작업을 계속할 수 없다. 즉, Sync 방식이다. 다음은 문서 저장과 관련해 안 좋은 습관 몇 가지를 나열해본다.
			1. 문서 작성을 모두 완료할 때까지 저장 버튼을 한 번도 누르지 않는다.
			2. 너무 자주, 수시로 저장 버튼을 누른다.
			3. 습관적으로 저장 버튼을 연속해서 두 번씩 누른다.
		커밋은 저장 버튼을 누르는 것과 같다. 서버 프로세스가 그때까지 한 작업을 디스크에 기록하라는 명령어인 셈이다.

- 데이터베이스 Call과 성능
	- SQL은 아래 세 단계로 나누어 실행된다.
		- Parse Call : SQL 파싱과 최적화를 수행하는 단계다. SQL과 실행계획을 라이브러리 캐시에서 찾으면, 최적화 단계는 생략할 수 있다.
		- Execute Call : 말 그대로 SQL을 실행하는 단계다. DML은 이 단계에서 모든 과정이 끝나지만, SELECT 문은 Fetch 단계를 거친다.
		- Fetch Call : 데이터를 읽어서 사용자에게 결과 집합을 전송하는 과정으로 SELECT 문에서만 나타난다. 전송할 데이터가 많을 때는 Fetch Call 이 여러 번 발생한다.
	- Call이 어디서 발생하느냐에 따라 User Call과 Recursive Call로 나눌 수도 있다.  ![[친절한 SQL 튜닝, DML-1768053018559.jpg]]
	- User Call은 네트워크를 경유해 DBMS 외부로부터 인입되는 Call이다.
	- Recursive Call은 DBMS 내부에서 발생하는 Call이다. SQL파싱과 최적화 과정에서 발생하는 데이터 딕셔너리 조회, PL/SQL로 작성한 사용자 정의 함수/프로시저/트리거에 내장된 SQL을 발생하는 Call이 여기 해당한다.
	- 데이터베이스 Call이 많으면 성능은 느릴 수 밖에 없다. 특히 내부에서 발생하는 Recursive Call보다 User Call이 성능에 미치는 영향이 훨씬 크다.
	- 같은 결과를 보이더라도, Call의 횟수를 줄일 수 있는 **One SQL**으로 구현하면 수행 시간을 많이 아낄 수 있다. 아래 구문 활용법을 잘 익혀두면 좋다.
		- Insert Into Select
		- 수정가능 조인 뷰
		- Merge 문

- Array Processing 활용
	- 실무에서 절차적 프로그램을 One SQL로 구현하는 일은 절대 쉽지 않다. 복잡한 업무 로직을 포함하는 경우가 많기 때문이다. 그럴 때 Array Processing 기능을 활용하면 One SQL로 구현하지 않고도 Call 부하를 획기적으로 줄일 수 있다.

- 인덱스 및 제약 해제를 통한 대량 DML 튜닝
	- 인덱스와 무결성 제약 조건은 DML 성능에 큰 영향을 끼친다. 그렇다고 온라인 트랜잭션 처리 시스템에서 이들 기능을 해제할 순 없다. 그렇다고 온라인 트랜잭션 처리 시스템에서 이들 기능을 해제할 순 없다. 반면, **동시 트랜잭션 없이 대량 데이터를 적재하는 배치 프로그램**에서는 이들 기능을 해제함으로써 큰 성능 개선 효과를 얻을 수 있다.
		- 배치 프로그램이라고 꼭 동시 트랜잭션이 없는 것은 아님, 위에서 말하는 것은 유저 서비스와 분리되어 있는 DB를 말하는 것 같음.
	- PK 제약과 인덱스 해제 1 - PK 제약에 Unique 인덱스를 사용한 경우
		- ```sql
			  truncate table target; 
			  alter table target modify constraint target_pk disable drop index;
		   ```
		- 테이블 데이터를 지우고, PK 제약을 해제, 그리고 index도 해제 합니다.
		- 이 상태에서 데이터를 입력할 경우 그렇지 않은 것보다 획기적인 성능 차이를 보여줍니다.
	- PK 제약과 인덱스 해제 2 - PK 제약에 Non-Unique 인덱스를 사용한 경우
		- 1번 테스트에서는 PK 인덱스를 비활성화 하며 아예 Drop까지 해버렸다. PK 인덱스는 Unusable 상태에서 데이터를 입력할 수 없기 때문이다.
		- 따라서 PK로 인해 자동으로 생성되는 Unique 인덱스를 사용하지 말고, 직접 Non-Unique 인덱스를 생성하여 사용하게 될 경우, **PK 제약을 비활성화(KEEP INDEX)한 후** 인덱스를 Unusable 상태로 변경하면 Insert 작업을 할 수 있게 된다. **이후 REBUILD를 통해 DROP & CREATE보다 빠르게 인덱스를 재생성할 수 있다.**

- 수정가능 조인 뷰
	- PK 제약을 설정하면 키-보존 테이블(Key-Preserved Table) 하지 않는다면 비 키-보존 테이블(Non Key-Preserved Table)이 된다
		- 키-보존 테이블이란 조인된 결과 집합을 통해서도 중복 값 없이 Unique하게 식별이 가능한 테이블을 말한다. Unique한 1쪽 집합과 조인되는 테이블이어야 조인된 결과집합을 통한 식별이 가능하다. 단적으로 말해 키 보존 테이블이란, 뷰에 rowid를 제공하는 테이블을 말한다.
	- ORA-01779 오류 회피
		- 정리 필요.

- MERGE문 활용
	- DW(Data Warehouse)에서 가장 흔히 발생하는 오퍼레이션은 기간계 시스템에서 가져온 신규 트랜잭션 데이터를 반영함으로써 두 시스템 간 데이터를 동기화 하는 작업이다. 이 때 데이터 적재 작업을 효과적으로 지원하기 위해 오라클 9i에서 MERGE 문이 도입됐다.
		1. 전일 발생한 변경 데이터를 시스템으로부터 추출
			1. ```sql
			create table customer_delta
			as
			select * from customer
			where mod_dt >= trunc(sysdate)-1
			and mod_dt < trunc(sysdate);
			```
			
		2. CUSTOMER_DELTA 테이블을 DW 시스템으로 전송
		3. DW 시스템으로 적재
			1. ```sql
			merge into customer t using customer_delta s on(t.cust_id = s.cust_id)
			when matched then update
				set t.cust_nm = s.cust_nm, t.email = s.email, ...
			when not matched then insert
				(cust_id, cust_nm, email, tel_no, region, addr, reg_dt) values
				(s.cust_id, s.cust_nm, s.email, s.tel_no, s.region, s.addr, s.reg_dt);
			```
			
		- MERGE문은 Customer_delta 테이블을 기준으로 Customer 테이블과 Left Outer 방식으로 조인해서 성공하면 UPDATE, 실패하면 UNSERT 한다. MERGE문을 UPSERT(UPDATE + INSERT)라고도 부르는 이유다.
	- 여러 활용
		- ON 절에 기술한 조인문 외에 아래와 같이 추가로 조건절을 기술할 수도 있다.
			- ```sql
				merge into customer t using customer_delta s on(t.cust_id = s.cust_id)
				when matched then update
					set t.cust_nm = s.cust_nm, t.email = s.email, ...
					where reg_dt >= to_date('20000101', 'yyyymmdd')
				when not matched then insert
					(cust_id, cust_nm, email, tel_no, region, addr, reg_dt) values
					(s.cust_id, s.cust_nm, s.email, s.tel_no, s.region, s.addr, s.reg_dt)
					where reg_dt < trunc(sysdate);
			```
			
		- 이미 저장된 데이터를 조건에 따라 지우는 기능도 제공한다.
			- ```sql
				merge into customer t using customer_delta s on(t.cust_id = s.cust_id)
				when matched then update
					set t.cust_nm = s.cust_nm, t.email = s.email, ...
					delete where t.withdraw_dt is not null -- 탈퇴일시가 null이 아닌 레코드 삭제
				when not matched then insert
					(cust_id, cust_nm, email, tel_no, region, addr, reg_dt) values
					(s.cust_id, s.cust_nm, s.email, s.tel_no, s.region, s.addr, s.reg_dt);
			```
			

## Direct Path I/O 활용
- 온라인 트랜잭션은 기준성 데이터, 특정 고객, 특정 상품 등을 반복적으로 읽기 때문에 버퍼캐시가 성능 향상에 도움을 준다. 반면 정보계 시스템이나 배치 프로그램에서 사용하는 SQL은 주로 대량 데이터를 처리하기 때문에 버퍼캐시를 경유하는 경우 I/O매커니즘이 오히려 성능을 떨어뜨릴 수 있다. 그래서 오라클은 버퍼캐시를 경유하지 않고 곧바로 데이터 블록을 읽고 쓸 수 있는 Direct Path I/O 기능을 제공한다.

- Direct Path I/O 기능이 작동하는 경우
	- **병렬 쿼리로 Full Scan을 수행할 때**
	- **병렬 DML을 수행할 때(Direct Path Read, Direct Path Insert)**
	- **Direct Path Insert를 수행할 때**
	- Temp 세그먼트 블록들을 읽고 쓸 때
	- direct 옵션을 지정하고 export를 수행할 때
	- nocache 옵션을 지정한 LOB 컬럼을 읽을 때
- 위 경우 중 1~3번이 가장 중요하고 활용도가 높다.

- 병렬 쿼리
	- 쿼리문에 parallel 또는 parallel_index 힌트를 사용하면, 지정한 수치만큼 병렬 프로세스가 떠서 동시에 작업을 진행한다.
		- ```sql
			select /*+ full(t) parallel(t 4) */ * from big_table t;
			  
			select /*+ index_ffs(t big_table_x1)  parallel_index(t big_table_x1 4) */ count(*) from big_table t;
		   ```
	- 위처럼 병렬도를 4로 지정하면, 성능이 네 배 빨라지는 것이 아니라 수십 배 빨라진다. 바로 Direct Path I/O 때문인데, 버퍼캐시를 탐색하지 않고, 디스크로부터 버퍼캐시에 적재하는 부담도 없으니 빠른 것이다. 참고로 Order by, Group by, 해시 조인, 소트 머지 조인 등을 처리할 때는 힌트로 지정한 병렬도보다 두 배 많은 프로세스가 사용된다.
- Direct Path Insert
	- 일반적인 INSERT가 느린 이유는 다음과 같이 많은 과정을 거쳐야 하기 때문이다.
		1. 데이터를 입력할 수 있는 블록을 Freelist에서 찾는다. (테이블 [[HWM(High-Water-Mark)]] 아래쪽에 있는 블록 중 데이터 입력이 가능한(여유공간이 있는) 블록을 목록으로 관리하는데, 이를 'Freelist'라고 한다.)
		2. Freelist에서 할당받은 블록을 버퍼캐시에서 찾는다.
		3. 버퍼캐시에 없으면, 데이터파일에서 읽어 버퍼캐시에 적재한다.
		4. INSERT 내용을 Undo 세그먼트에 기록한다.
		5. INSERT 내용을 Redo 로그에 기록한다.
	- Direct Path Insert 방식을 사용하면, 훨씬 더 빠르게 데이터를 입력할 수 있다. 그 방법은 다음과 같다.
		- INSERT ... SELECT 문에 append 힌트 사용
		- parallel 힌트를 이용해 병렬 모드로 INSERT
		- direct 옵션을 지정하고 SQL*Loader(sqlldr)로 데이터 적재
		- CTAS(create table ... as select)문 수행
	- 위와 같은 방법들을 사용하면 Direct Path Insert 방식이 빠른 이유는 다음과 같습니다.
		1. Freelist를 참조하지 않고 HWM 바깥 영역에 데이터를 순차적으로 입력한다.
		2. 블록을 버퍼캐시에서 탐색하지 않는다.
		3. 버퍼캐시에 적재하지 않고, 데이터파일에 직접 기록한다.
		4. Undo 로깅을 안 한다.
		5. Redo 로깅을 안 하게 할 수 있다. 테이블을 아래와 같이 nologging 모드로 전환한 상태에서 Direct Path Insert 하면 된다.
			after table t NOLOGGING;
	- 참고로 Direct Path Insert가 아닌 일반 INSERT 문을 로깅하지 않게 하는 방법은 없다.
- Direct Path Insert 를 사용할 때 주의할 점
	- 첫째, 이 방식을 사용하면 성능은 비교할 수 없이 빨라지지만, Exclusive 모드 TM Lock이 걸린다는 사실입니다. 따라서 커밋 하기 전까지 다른 트랜잭션은 해당 테이블에 DML을 수행하지 못합니다.
	- 둘째, Freelist를 조회하지 않고 HWM 바깥 영역에 입력하므로 테이블에 여유 공간이 있어도 재활용하지 않는다는 사실입니다.

- 병렬 DML
	- 병렬 쿼리와 병렬 DDL은 기본적으로 활성화되어 있어 언제든 바로 병렬처리 가능하다. 반면 병렬 DML은 기본적으로 비활성화 되어있다. 따라서 DML을 병렬로 처리하려면 아래처럼 활성화해야 한다.
		- ```sql
			  alter session enable parallel dml;
			```
	- 그러고나서 아래와 같이 힌트를 사용하면 DML을 병렬로 사용이 가능하다.
		- ```SQL
			insert /*+ parallel(c 4) */ into 고객 c
			select /*+ full(o) parallel(o 4) */ * from 외부가입 고객 o;
			
			update /*+ full(c) parallel(c 4) */ 고객 c set 고객상태코드 = 'WD'
			where 최종거래일시 < '20100101';
			
			delete /*+ full(c) parallel(c 4) */ from 고객 c
			where 탈퇴일시 < '20100101';
			```
	- 힌트를 제대로 기술했는데, 병렬 DML을 활성화 하지 않았으면, 대상 레코드를 찾는 작업 까지는 병렬로 진행하지만, 추가/변경/삭제는 QC가 혼자 담당하므로 병목이 생긴다.
	- QC란 'Query Coordinator'의 줄임말이다. SQL을 병렬로 실행하면 병렬도로 지정한 만큼 또는 두 배로 병렬 프로세스를 띄워 동시에 작업을 진행하는데, 이때 최초 DB에 접속해서 SQL을 수행한 프로세스는 Query Coordinator 역할을 맡는다. 단 병렬로 처리할 수 없거나 병렬로 처리하도록 지정하지 않은 작업은 Query Coordinator가 직접 처리한다.
	- 병렬 DML을 사용하면 테이블에 Exclusive 모드 TM Lock이 걸린다는 사실을 꼭 기억하자. 트랜잭션이 빈번한 주간에 이 옵션을 사용하는 것은 절대 금물이다.

- 병렬 DML이 잘 동작하는지 확인하는 방법
	- 다음과 같이 UPDATE가 PX COORDINATOR 아래쪽에 나타나기 시작하면 병렬 프로세스로 처리하고 있는 것이다. ![[친절한 SQL 튜닝, DML-1768514102819.jpg]]
	- 반면 다음과 같이 UPDATE 아래 PX COORDINATOR가 나타나면 UPDATE를 QC가 처리한다고 파악할 수 있다. ![[친절한 SQL 튜닝, DML-1768514095353.jpg]]

## 파티션을 활용한 DML 튜닝
파티션을 이용하면 대량 추가/변경/삭제 작업을 빠르게 처리할 수 있다.

### 테이블 파티션
- 파티셔닝은 테이블 또는 인덱스 데이터를 특정 컬럼(파티션 키) 값에 따라 별도 세그먼트에 나눠서 저장하는 것을 말한다.
- 파티션이 필요한 이유를 관리적 측면과 성능적 측면으로 나눠 짧게 요약하면 아래와 같다.
	- 관리적 측면 : 파티션 단위 백업, 추가, 삭제, 변경 -> 가용성 향상
	- 성능적 측면 : 파디션 단위 조회 및 DML, 경합 또는 부하 분산

파티션에는 **Range, 해시, 리스트** 세 종류가 있다.


- Range 파티션
	- 오라클 8 버전부터 제공된 가장 기초적인 방식으로 주로 날짜 컬럼을 기준으로 파티셔닝한다. 아래는 주문 테이블을 주문 일자 기준으로 분기별 Range 파티셔닝 하는 방법을 예시하고 있다.
		- ![[친절한 SQL 튜닝, DML-1768514556862.jpg]]
	- 위와 같이 파티셔닝을 해놓으면, 저장할 때도, 파티션 키에 따른 분할 저장이 가능하고, 읽을 때도 검색 조건을 만족하는 파티션만 골라 읽을 수 있어. Full Scan 방식으로 조회할 때 성능이 크게 향상한다. 또한 보관 주기 정책이 있다면, 해당 정책에 따른 과거 데이터를 백업하게 삭제하는 등의 관리 작업도 효율적이고 빠르게 수행할 수 있다.
	- 파티션 테이블에 대한 SQL 성능 향상 원리는 파티션 Pruning(=Elimination)에 있다. 파티션 Pruning은 SQL 하드 파싱이나 실행 시점에 조건절을 분석해서 읽지 않아도 되는 파티션 세그먼트를 액세스 대상에서 제외하는 기능이다.
	- 파티션도 클러스터, IOT와 마찬가지로 관련 있는 데이터가 흩어지지 않고 물리적으로 인접하도록 저장하는 클러스터링 기술에 속한다. 클러스터와 다른 점은 세그먼트 단위로 모아서 저장한다는 것이다.

> 클러스터는 데이터를 블록 단위로 모아 저장한다.
> IOT는 데이터를 정렬된 순서로 저장하는 구조다.

- 해시 파티션
	- 해시 파티션은 Range 파티션에 이어 오라클 8i 버전부터 제공하기 시작했다. 파티션 키 값을 해시 함수에 입력해서 반환받은 값이 같은 데이터를 같은 세그먼트에 저장하는 방식이다. 파티션 개수만 사용자가 결정하고, 데이터를 분산하는 알고리즘은 오라클 내부 해시함수가 결정한다.
	- 아래는 고객ID 기준으로 고객 테이블을 해시 파티셔닝 하는 방법을 예시한다.
		- ```sql 
			  create table 고객 (고객ID varchar2(5), 고객명 varchar2(10), ...)
			  partition by hash(고객ID) partitions 4;
		  ```
	- 검색할 떄는 조건절 비교값에 똑같은 해시 함수를 적용함으로써 읽을 파티션을 결정한다.
	- 해시 알고리즘 특성상 등치(=) 조건 또는 IN-List 조건으로 검색할 때만 파티션 Pruning이 작동한다.

- 리스트 파티션
	- 오라클 9i 버전부터 제공하기 시작한 리스트 파티션은, 사용자가 정의한 그루핑 기준에 따라 데이터를 분할하는 저장 방식이다. 아래는 지역 분류 기준으로 인터넷 매물 테이블을 리스트 파티셔닝 하는 방법을 예시한다.
		- ![[친절한 SQL 튜닝, DML-1768515284654.jpg]]
	- Range 파티션에선 값의 순서에 따라 저장할 파티션이 결정되지만, 리스트 파티션에서는 순서와 상관 없이 불연속적인 값의 목록에 의해 결정된다.

### 인덱스 파티션
테이블 파티션과 인덱스 파티션은 구분돼야 한다. 인덱스 파티션은 테이블 파티션과 맞물려 다양한 구성이 존재한다. 다양한 인덱스 파티션 구성을 이해하기 위해 우선 테이블 파티션을 다음과 같이 구분한다.

- 비파티션 테이블(Non-Partitioned Table)
- 파티션 테이블(Partitioned Table)

인덱스도 테이블처럼 파티션 여부에 따라 파티션 인덱스와 비파티션 인덱스로 나뉘고, 파티션 인덱스는 각 파티션이 커버하는 테이블 파티션 범위에 따라 로컬과 글로벌로 나뉜다.

- 로컬 파티션 인덱스(Local Partitioned Index)
- 글로벌 파티션 인덱스(Global Partitioned Index)
- 비파티션 인덱스(Non-Partitioned Index)

로컬 파티션 인덱스는 각 테이블 파티션과 인덱스 파티션이 서로 1:1 대응 관계가 되도록 **오라클이 자동으로 관리하는 파티션 인덱스**를 말한다. 그 외의 파티션 인덱스는 '전부' 글로벌 파티션 인덱스이며, 테이블 파티션과 독립적인 구성(파티션 키, 파티션 기준값 정의)을 갖는다.

- 로컬 파티션 인덱스
	- `create index 주문_x01 on 주문 (주문일자, 주문금액) LOCAL;`
	- 로컬 파티션 인덱스는 테이블 파티션 속성을 그대로 상속받아, 파티션 키 또한 동일하게 만들어집니다. 
	- 로컬 파티션 인덱스는 테이블과 정확히 1:1 대응 관계를 갖도록 오라클이 파티션을 자동으로 관리해줍니다. 테이블 파티션 구성을 변경하더라도 인덱스를 재생성할 필요가 없습니다.

- 글로벌 파티션 인덱스
	- ```sql
		  create index 주문_x03 on 주문 (주문금액, 주문일자) GLOBAL
		  partition by range(주문금액)(
			  partition P_01 values less than ( 100000 )
			  , ...
		  )
	  ```
	- 글로벌 파티션 인덱스는 파티션을 테이블과 다르게 구성한 인덱스입니다. 구체적으로 파티션 유형이 다르거나, 파티션 키가 다르거나, 파티션 기준값 정의가 다른 경우입니다. 비파티션 테이블이라도 인덱스는 파티셔닝 할 수 있습니다.
	- 글로벌 파티션 인덱스는 테이블 파티션 구성을 변경(drop, exchange, split 등)하는 순간 Unusable 상태로 바뀌므로 곧바로 인덱스를 재생성해 줘야 한다.
	- 로컬 파티션 인덱스처럼, 테이블과 인덱스가 정확히 1:1 관계가 되도록 DB 관리자가 파티션을 직접 구성할 수도 있지만, 그렇다고 그것이 로컬 파티션이 되는 것은 아니다. 모양이 로컬 파티션일 뿐, 오라클이 자동으로 관리해주지도 않는, 그냥 글로벌 파티션이다.

- 비파티션 인덱스
	- 비파티션 인덱스는 말 그대로 파티셔닝 하지 않은 인덱스다. 지금까지 일반 인덱스를 생성한 것과 같이 생성하면 된다.
	- `create index 주문_x04 on 주문 (고객ID, 배송일자);`
	- 비파티션 인덱스는 테이블 파티션 구성을 변경하는 순간 Unusable 상태로 바뀌므로 곧바로 인덱스를 재생성해줘야 한다.

- Prefixed vs. Nonprefixed
	- 파티션 인덱스를 Prefixed와 Nonprefixed로 나눌 수도 있다. 이는 인덱스 파티션 키 컬럼이 인덱스 구성상 왼쪽 선두 컬럼에 위치하는지에 따른 구분이다.
		- Prefixed : 인덱스 파티션 키 컬럼이 인덱스 키 컬럼 왼쪽 선두에 위치한다.
		- Nonprefixed : 인덱스 파티션 키 컬럼이 왼쪽 선두에 위치하지 않거나, 파티션 키가 아예 인덱스 컬럼에 속하지 않을 때, 여기로 분류된다.
	- 글로벌 파티션 인덱스는 Prefixed 파티션만 지원되므로 결과적으로 세 개의 파티션 인덱스가 있고, 비파티션 인덱스를 포함해 아래 네 가지 유형으로 최종 정리할 수 있다. 
		- 로컬 Prefixed 파티션 인덱스
		- 로컬 Nonprefixed 파티션 인덱스
		- 글로벌 Prefixed 파티션 인덱스
		- 비파티션 인덱스

- 중요한 인덱스 파티션 제약
	- 인덱스 파티션과 관련해 반드시 기억해야할 중요한 제약이 있다.
		> **Unique 인덱스를 파티셔닝하려면, 파티션 키가 모두 인덱스 구성 컬럼이어야 한다.**
		
	- 추가 이해 필요

### 파티션을 활용한 대량 UPDATE 튜닝
인덱스가 DML 성능에 큰 영향을 미치므로 대량 데이터를 입력/수정/삭제할 때는 인덱스를 Drop 하거나 Unusable 상태로 변경하고서 작업하는 방법을 많이 활용한다. 손익분기점은 5% 정도로 본다. 즉 **입력/수정/삭제하는 데이터 비중이 5%를 넘는다면, 인덱스를 그대로 둔 상태에서 작업하기보다 인덱스 없이 작업한 후에 재생성하는게 더 빠르다는 뜻이다.**

### 파티션을 활용한 대량 DELETE 튜닝
아래와 같이 간단한 삭제문이더라도, 인덱스를 실시간으로 관리하려면 어마어마한 시간이 소요된다.
```sql 
delete from 거래 where 거래일자 < '20150101';
```

그렇다고 초대용량 테이블 인덱스를 모두 Drop 했다가 다시 생성하기도 만만치 않다. UPDATE는 변경 대상 컬럼을 포함하는 인덱스만 재생성하면 되지만, DELETE는 모든 인덱스를 재생성해야 한다.

> **DELETE가 느린 이유**
> 
> 1. 테이블 레코드 삭제
> 2. 테이블 레코드 삭제에 대한 Undo Logging
> 3. 테이블 레코드 삭제에 대한 Redo Logging
> 4. 인덱스 레코드 삭제
> 5. 인덱스 레코드 삭제에 대한 Undo Logging
> 6. 인덱스 레코드 삭제에 대한 Redo Logging
> 7. Undo(2번과 5번)에 대한 Redo Logging
> 
> 특히, 각 인덱스 레코드를 찾아서 삭제해주는 작업에 대한 부담이 크다. 건건히 수직적 탐색 과정을 거쳐 대상 레코드를 찾아야 하기 때문이다.

- 파티션 Drop을 이용한 대량 데이터 삭제
	- 테이블이 삭제 조건절(거래일자 <'20150101') 컬럼 기준으로 파티셔닝되어 있고, 인덱스도 다행이 로컬 파티션이라면, 아래와 같이 간단한 문장 하나로 대량 데이터를 순식간에 삭제할 수 있다.
		- ```sql
			  alter table 거래 drop partition p201412;
		  ```
	  - 오라클 11g 부터는 다음과 같이 지정할 수도 있다.
		  - ```sql
			    alter table 거래 drop partition for('20141201');
		    ```

- 파티션 Truncate를 이용한 대량 데이터 삭제
