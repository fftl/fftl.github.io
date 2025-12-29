# 소트
소트는 기본적으로 PGA에 할당한 Sort Area에서 이루어진다. 메모리 공간인 Sort Area가 다 차면, 디스크 Temp 테이블스페이스를 활용한다. Sort Area에서 작업을 완료할 수 있다면 메모리 소트(또는 Internal Sort) 디스크 공간까지 사용해야 하면 디스크 소트(또는 External Sort)라고 한다.

소트 연산은 메모리 집약적일 뿐만 아니라 CPU 집약적이기도 하다. 처리할 데이터량이 많을 때는 디스크 I/O가 발생하는 것도 문제지만, **부분범위 처리를 불가능하게 함으로써 OLTP 환경에서 애플리케이션 성능을 저하시키는 주요인**이 되기도 한다.

## 소트 오퍼레이션
소트를 발생시키는 오퍼레이션의 종류에 대해 알아본다.

### 1. Sort Aggregate
전체 로우를 대상으로 집계를 수행할 때 나타난다. 'Sort'라는 표현을 사용하지만 실제로 데이터를 정렬하진 않는다. Sort Area를 사용한다는 의미로 이해하면 된다. 

> 정렬하지 않고 집계 값을 구하는 방식
> 1. Sort Area에 찾고자 하는 집계 함수의 개수 만큼만 변수를 할당한다. (sum(sal), min(sal) 이라면 두 개)
> 2. 탐색하고자 하는 테이블의 첫 번째 레코드에서 읽은 sal 값을 각각의 변수에 저장한다.
> 3. 테이블을 읽어가면서 sum의 경우 값을 누적, min, max의 경우 더 크거나 더 작은 값이 나오면 교체, count라면 sal값이 null이 아닐 경우 1씩 증가 시킵니다.
> 4. 레코드를 모두 읽고 나면 원하는 값을 구할 수 있습니다.


### 2. Sort Order By
Sort Order By는 우리가 알고 있는 Order By를 사용할 때 나타난다. 

### 3. Sort Group By
Sort Group By는 소팅 알고리즘을 사용해 그룹별 집계를 수행할 때 나타난다. 그룹으로 좁혀지는 요소가 많지 않다면 Sort Area가 클 필요가 없다. 부서를 Group으로 했고 부서가 4개 뿐이라면 4개에 대해 Aggregate에서 한 것과 같이 찾고자 하는 만큼의 변수만 생성해주면 되기 때문이다.

오라클 10gR2에서 도입된 Hash Group By 방식도 알아주면 좋다. Group By 절 뒤에 Order By 절을 명시하지 않으면 이제 대부분 Hash Group By 방식으로 처리하기 때문이다.

Hash Group By는 읽는 레코드마다 Group By 컬럼의 해시 갑승로 해시 버킷을 찾아 그룹별로 집계항목을 갱신하는 방식을 사용한다. 위와 동일하게 부서(그룹 개수)개수가 많지 않다면 temp 테이블 스페이스를 쓸 일이 전혀 없다.

++ Sort Group By는 정렬이 보장되지 않는다. **정렬된 그룹핑 결과를 얻고자 한다면, 실행계획에 설령 'Sort Group By'라고 표시되더라도 반드시 Order By를 명시해야 한다.**

```sql
-- 병렬처리 끄기
ALTER SESSION DISABLE PARALLEL QUERY;
ALTER SESSION DISABLE PARALLEL DML;

-- 병렬처리 켜기
ALTER SESSION ENABLE PARALLEL QUERY;
ALTER SESSION ENABLE PARALLEL DML;
```
### 4. Sort Unique
서브쿼리 Unnesting을 진행할 때 서브쿼리가 n:m 에서 m을 차지하고 있을 때(다수 쪽, n쪽이어도 조인 컬럼에 unique 인덱스가 없으면), 메인 쿼리와 조인하기 전에 중복 레코드를 제거해야 한다. 이 때 Sort Unique 오퍼레이션이 나타난다. 반대로 PK/Unique 제약 또는 Unique 인덱스를 통해 Unnesting 된 서브쿼리의 유일성이 보장된다면 생략된다.

Union, Minus, Intersect와 같은 집합 연산자를 사용할 때에도, Distinct 연산자를 사용해도 Sort Unique 오퍼레이션이 나타난다. 오라클 10gR2부터는 Distinct 연산에도 Order By를 생략하면 기본으로는 Hash Unique 방식을 사용한다. 

### 5. Sort Join
Sort Join 오퍼레이션은 소트 머지 조인을 수행할 때 나타난다.

### 6. Window Sort
Window Sort는 윈도우 함수를 수행할 때 나타난다.

## 소트가 발생하지 않도록 SQL 작성
SQL 작성할 때 불필요한 소트가 발생하지 않도록 주의해야 한다. Union, Minus, Distinct 연산자는 중복 레코드를 제거하기 위한 소트 연산을 발생시키므로 꼭 필요한 경우에만 사용하고, 성능이 느리다면 소트 연산을 피할 방법이 있는지 찾아봐야 한다.

### 1. Union vs Union All
SQL에 Union을 사용하면 옵티마이저는 상단과 하단 두 집합간 중복을 제거하려고 소트 작업을 수행한다. 반면, Union All은 중복을 확인하지 않고 두 집합을 단순히 결합하므로 소트 작업을 수행하지 않는다. 따라서 될 수 있으면 Union All을 사용해야 한다. 

### 2. Exists 활용
중복 레코드를 제거할 목적으로 Distinct 연산자를 종종 사용하는데, 이 연산자를 사용하면 조건에 해당하는 데이터를 모두 읽어서 중복을 제거해야 한다. 부분범위 처리는 당연히 불가능하고, 모든 데이터를 읽는 과정에 많은 I/O가 발생한다.

이럴 때 **EXISTS를** 사용하면 좋다.

```sql
select DISTINCT p.상품번호, p.상품명, p.상품가격 ...
from 상품 p, 계약 c
where p.상품유형코드 = :psclscd
and c.상품번호 = p.상품번호
and c.계약일자 between :dt1 and dt2
and c.계약구분코드 = :ctpcd
```

위와 같은 쿼리를 아래와 같이 바꿔보자.

```sql
select p.상품번호, p.상품명, p.상품가격 ...
from 상품 p
where p.상품유형코드 = :psclscd
and EXISTS (select 'x' from 계약 c
	where c.상품번호 = p.상품번호
	and c.계약일자 between :dt1 and dt2
	and c.계약구분코드 = :ctpcd
)
```

Exists 서부쿼리는 데이터 존재 여부만 확인하면 되기 때문에 조건절을 만족하는 데이터를 모두 읽지 않는다.

Distinct. Minus 연산자를 사용한 쿼리는 대부분 Exists 서브쿼리로 변환 가능하다.

### 3. 조인 방식 변경
