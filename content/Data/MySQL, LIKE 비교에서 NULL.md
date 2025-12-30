[[Case Study2 - Pizza Runner(진행중)]]의 문제를 풀이하던 중 발견한 특성입니다.

# 개요
`각 배달원이 성공적으로 배송한 주문 건수는 몇 건입니까?` 라는 요구사항이 있었고, 다음과 같은 테이블에서 조회를 해야 하는 상황이었습니다.

SQL
```SQL
SELECT *
FROM runner_orders;
```

RESULT
![[MySQL, null의 특수성-1766799836497.png]]

문제의 해결 방법으로는 cancellation의 값에 Restaurant Cancellation, Customer Cancellation과 같이 취소 사유가 적여있는 경우 배송이 안된 것이므로, 해당 `Cancellation` 라는 키워드가 적혀지 않은 배송의 개수를 세는 것을 목표로 했습니다.

그래서 먼저 LIKE를 통해 배달이 성공된 건수를 확인하기 위해 다음 쿼리를 실행해 보았습니다.

SQL
```sql
SELECT *
FROM runner_orders
WHERE cancellation NOT LIKE '%Cancellation%' or cancellation is NULL
```

RESULT
![[MySQL, null의 특수성-1766800041327.png]]

예상한 대로라면 Restaurant Cancellation, Customer Cancellation의 사유가 있는, 6번, 9번 order를 제외하고 8개의 주문이 나와야 했지만 5개의 결과만 나오고 있었습니다.

문자열을 통해 넣은 null 말고 실제 NULL을 통해 비어있는 order들은 `cancellation NOT LIKE '%Cancellation%'`를 통해 걸러지고 있는 것으로 보였습니다.

# 이유
[mysql docs](https://dev.mysql.com/doc/refman/8.0/en/string-comparison-functions.html#operator_like)을 확인해보면, null 이 들어가서 확인할 수 있었습니다.

![[MySQL, NULL의 특수성-1766801487863.png]]

위를 보면 NULL 값의 데이터만 두 개 가지고 있는 테이블에 `SELECT COUNT(*) FROM foo WHERE bar NOT LIKE '%baz%';` 쿼리를 실행시키는 경우가 저의 문제오 같은 경우 입니다. 2개의 결과를 예상하지만 실제로는 0개의 결과를 반환합니다. 그 이유는 **This is because NULL NOT LIKE expr always returns NULL, regardless of the value of expr.** 라고 설명됩니다. NULL은 NOT LIKE에서 항상 NULL을 반환합니다. 

where 조건에서는 true에 해당하는 row를 반환하는데 NULL의경우 true도 false도 아닌 unknown이라는 특수한 값을 가지고 있기 때문입니다.

# 결과

따라서 처음의 문제였던 Cancellation가 포함되어 있지 않은 order를 전부 선택하기 위해서는 몇 가지 방법이 존재합니다.

1. where절에 NULL도 확인하는 조건을 넣기
```sql
SELECT *
FROM runner_orders
WHERE cancellation NOT LIKE '%Cancellation%' or cancellation is NULL;
```

2. update문을 데이터 정제하기
```sql
UPDATE runner_orders
SET cancellation = NULL
WHERE cancellation = '' 
   OR cancellation = 'null'
   OR cancellation IS NULL;
```

등이 있습니다. 생각해보기로는 입력 데이터가 공백, 'null', NULL 등 통일되어 있지 않은 상황이라면 update를 통해 생각한 저 세가지 방법 말고도 다양하게 입력될 가능성이 높다고 생각합니다. 따라서 1번 방법을 통해 Cancellation가 포함되지 않은 모든 컬럼을 선택하는 방법을 선택하기로 했습니다.