---
created: 2026-01-14T23:26:18+09:00
modified: 2026-01-16T22:37:14+09:00
---
## HWM(High-Water Mark) 개념 정리

### HWM이란?
테이블에서 데이터가 한 번이라도 입력되었던 블록의 최고 위치를 표시하는 경계선입니다.

### 핵심 특징
- HWM은 올라가기만 하고 자동으로 내려가지 않음
- DELETE로는 HWM이 낮아지지 않음
- TRUNCATE로만 HWM이 초기화됨

### 예시
테이블에 9,000건의 데이터를 입력했다가(예: 블록 100까지 사용) 8,000건을 삭제해도 HWM은 블록 100에 그대로 위치합니다. 

**문제점:**
- 실제 데이터: 1,000건 (블록 10정도만 사용 중)
- HWM 위치: 블록 100
- Full Table Scan 시: 블록 100까지 모두 읽음 → 비효율!

### INSERT와 HWM

**1. 일반 INSERT**
- Freelist에서 블록을 찾음
- Freelist: HWM 아래쪽 블록 중 여유 공간이 있는 블록들의 목록
- 과정:
  1. Freelist에서 블록 찾기
  2. 버퍼캐시에서 블록 검색
  3. 없으면 디스크에서 읽기
  4. INSERT 수행

**2. Direct Path INSERT**
- HWM 위쪽(미사용 영역)에 직접 삽입
- Freelist 검색 불필요
- 버퍼캐시 탐색 불필요
- 데이터파일에 직접 기록
- **훨씬 빠름!**

### HWM 조정 방법

#### 방법 1: TRUNCATE (가장 강력)
```sql
TRUNCATE TABLE 직원;
```
- 장점: HWM 완전 초기화, 매우 빠름
- 단점: **모든 데이터 삭제**, 롤백 불가
- 용도: 테이블 전체 재적재 시

#### 방법 2: ALTER TABLE MOVE (데이터 유지)
```sql
ALTER TABLE 직원 MOVE;

-- 필수! 인덱스 재생성
ALTER INDEX 직원_PK REBUILD;
ALTER INDEX 직원_이름_IDX REBUILD;
-- ... 모든 인덱스 재생성
```

**MOVE의 동작:**
1. 새로운 세그먼트(저장 공간) 할당
2. 기존 데이터를 compact하게 복사
3. HWM 재설정 (실제 데이터 크기만큼)
4. 기존 공간 해제

**MOVE의 장점:**
- HWM 재설정 (낮아짐)
- 단편화(fragmentation) 제거
- 저장 공간 회수
- Full Table Scan 성능 향상

**MOVE의 단점:** (중요!)
- 테이블 전체를 복사하므로 시간이 오래 걸림
- 테이블 락(lock) 발생 → 다른 작업 불가 (온라인 작업 불가)
- **인덱스가 UNUSABLE 상태 → 반드시 모든 인덱스 REBUILD!**
- 원본 크기만큼의 임시 공간 필요 (총 2배 공간)

#### 방법 3: SHRINK SPACE (가장 안전, 10g+)
```sql
-- 선행 조건
ALTER TABLE 직원 ENABLE ROW MOVEMENT;

-- HWM 축소
ALTER TABLE 직원 SHRINK SPACE;
```

**SHRINK의 장점:**
- 인덱스 자동 유지 (REBUILD 불필요!)
- 온라인 작업 가능 (서비스 중 실행 가능)
- 단편화 제거 + HWM 조정 동시 수행

**SHRINK의 단점:**
- 10g 이상만 지원
- ASSM(Automatic Segment Space Management) 필요
- MOVE보다 시간이 더 걸릴 수 있음

### 실무 선택 가이드
```sql
-- 상황 1: 테이블 전체 재적재
TRUNCATE TABLE 직원;  -- 가장 빠름

-- 상황 2: 데이터 유지하면서 즉시 처리 (야간 작업)
ALTER TABLE 직원 MOVE;
-- 인덱스 재생성 필수!

-- 상황 3: 서비스 중 처리 필요 (권장)
ALTER TABLE 직원 ENABLE ROW MOVEMENT;
ALTER TABLE 직원 SHRINK SPACE;
```

### SQLP 시험 체크포인트
✅ HWM은 DELETE로 내려가지 않음
✅ Full Table Scan은 HWM까지 읽음
✅ Direct Path Insert는 HWM 위에 삽입
✅ MOVE 후 반드시 인덱스 REBUILD!
✅ SHRINK는 인덱스 자동 유지