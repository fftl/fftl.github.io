---
created: 2025-12-31T11:21:13
modified: 2026-01-01T23:46:19+09:00
---
SQL 문제를 풀던 중 한 row에 '1, 2, 3, 4' 와 같이 여러 데이터가 ','로 구분되어 들어가 있는 것을 보게 되었습니다. 저는 해당 데이터에서 각각의 요소의 개수를 세어야 했기 분리해야만 했는데 그 방법을 알지 못해 claude에 물어보았습니다.

# 방법
가장 대표적인 방법은 RECURSIVE 재귀를 사용하는 것이었습니다. 이전에도 사용해보긴 했지만, 이번의 코드를 보고 제가 그동안 제대로 이해하고 있지 않았다는 사실을 알게되었습니다.

```sql
WITH RECURSIVE split_toppings AS (
    SELECT 
        pizza_id,
        TRIM(SUBSTRING_INDEX(toppings, ',', 1)) AS topping_id,
        toppings,
        1 AS pos
    FROM pizza_recipes
    UNION ALL
    SELECT 
        pizza_id,
        TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(toppings, ',', pos + 1), ',', -1)) AS topping_id,
        toppings,
        pos + 1
    FROM split_toppings
    WHERE pos < LENGTH(toppings) - LENGTH(REPLACE(toppings, ',', '')) + 1
)
SELECT pizza_id, topping_id
FROM split_toppings
ORDER BY pizza_id, pos;
```

# 이해해보기
이번에는 제대로 이해해보기로 자세히 살펴보았습니다. 
```sql
WITH RECURSIVE split_toppings AS (
    SELECT 
        pizza_id,
        TRIM(SUBSTRING_INDEX(toppings, ',', 1)) AS topping_id,
        toppings,
        1 AS pos
    FROM pizza_recipes
    UNION ALL
    SELECT 
        pizza_id,
        TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(toppings, ',', pos + 1), ',', -1)) AS topping_id,
        toppings,
        pos + 1
    FROM split_toppings
    WHERE pos < LENGTH(toppings) - LENGTH(REPLACE(toppings, ',', '')) + 1
)
```

- 먼저 구조로는 SELECT ~, UNION ALL, SELECT ~ 이렇게 세 가지가 있습니다. 
- 첫번째 SELECT문은 반복문의 기틀을 마련한다고 볼 수 있습니다. 반복이 될 첫번째 데이터를 만듭니다.
- 다음 UNION ALL은 첫번째 SELECT와 재귀의 결과인 다음 SELECT의 데이터를 계속 합쳐주는 역할을 합니다.
- 두번째 SELEC문은 반복을 하는 부분이며 WHERE 절에 적어 놓은 조건을 만족할 때 까지 반복합니다. 또한 매번 직전에 생성된 row를 기준으로 데이터가 실행되기 때문에 pos가 2, 3, 4 ... 이렇게 증가하며 반복되는 것이 가능합니다.

## 예시

##### 첫번째 SELECT문으로 생성되는 데이터

| pizza_id | topping_id | toppings | pos |
| -------- | ---------- | -------- | --- |
| 1        | 1          | 1, 2, 3  | 1   |
##### UNION ALL을 이용해 합치기 시작
##### 두번째 SELECT문의 반복

- 위의 첫번째 행을 참조해 pos+1 즉 pos가 2가 되고 두번째 토핑을 찾아냄

| pizza_id | topping_id | toppings | pos |
| -------- | ---------- | -------- | --- |
| 1        | 1          | 1, 2, 3  | 1   |
| 1        | 2          | 1, 2, 3  | 2   |
- 직전에 생성된 두번째 행을 참조해 pos+1 즉 pos가 3이 되고 세번째 토핑을 찾아냄

| pizza_id | topping_id | toppings | pos |
| -------- | ---------- | -------- | --- |
| 1        | 1          | 1, 2, 3  | 1   |
| 1        | 2          | 1, 2, 3  | 2   |
| 1        | 3          | 1, 2, 3  | 3   |
