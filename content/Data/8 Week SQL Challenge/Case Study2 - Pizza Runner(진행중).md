---
created: 2025-12-30T14:06:34
modified: 2026-01-30T22:08:39+09:00
---
![[Case Study2 - Pizza Runner-1766757924383.png]]

url - https://8weeksqlchallenge.com/case-study-2/
## 소개

**전 세계적으로 매일 1억 1500만 킬로그램** 이상의 피자가 소비된다는 사실 알고 계셨나요 ? (위키피디아에 따르면 그렇다는 얘기지만요…)

대니는 인스타그램 피드를 스크롤하다가 눈길을 사로잡는 게시물을 발견했습니다. "80년대 레트로 스타일과 피자가 미래다!"

대니는 그 아이디어에 완전히 매료되었지만, 피자만으로는 새로운 피자 제국을 확장할 초기 자금을 확보할 수 없다는 것을 알고 있었습니다. 그래서 그는 또 하나의 기발한 아이디어를 떠올렸는데, 바로 피자를 _우버처럼 운영_ 하는 것이었 습니다. 그렇게 피자 러너가 탄생했습니다!

대니는 피자 배달 본부(사실은 대니의 집)에서 갓 구운 피자를 배달할 "배달원"들을 모집하는 것으로 사업을 시작했고, 고객 주문을 받을 모바일 앱을 개발하기 위해 프리랜서 개발자들에게 신용카드 한도까지 지불했습니다.

## 사용 가능한 데이터

대니는 데이터 과학자로서 수년간의 경험을 가지고 있었기 때문에 데이터 수집이 사업 성장에 매우 중요하다는 것을 잘 알고 있었습니다.

그는 데이터베이스 설계에 대한 엔티티 관계도를 작성했지만, 데이터 정리 및 기본적인 계산 적용에 추가적인 도움이 필요합니다. 이를 통해 배달원들을 더 잘 관리하고 피자 배달 서비스의 운영을 최적화할 수 있을 것입니다.

모든 데이터 세트는 `pizza_runner`데이터베이스 스키마 내에 존재합니다. 데이터 탐색 및 사례 연구 질문에 대한 답변을 시작할 때 SQL 스크립트에 해당 스키마를 반드시 포함하십시오.

![[Case Study2 - Pizza Runner-1766758006476.png|543x270]]

##### 각 테이블에 대한 자세한 설명과 sql문은 해당 링크를 참조해주세요.
https://8weeksqlchallenge.com/case-study-2/

---

## 사례 연구 질문

이 사례 연구에는 **많은** 질문이 포함되어 있으며, 다음과 같은 주요 영역별로 분류되어 있습니다.

- 피자 측정 지표
- 러너 및 고객 경험
- 원료 최적화
- 가격 및 등급
- 보너스 DML 챌린지 (DML = 데이터 조작 언어)

다음 사례 연구 질문 각각은 단일 SQL 문을 사용하여 답변할 수 있습니다.

이 사례 연구에는 여러 가지 질문이 있으니, 자유롭게 원하는 질문을 골라 풀어보세요!

하지만 SQL 쿼리를 작성하기 전에 데이터를 살펴보는 것이 좋습니다. 테이블 `null`에 있는 값과 데이터 유형을 사용하여 어떤 작업을 수행하고 싶을 수도 있습니다 !`customer_orders``runner_orders`
### A. 피자 측정 지표

1. 피자는 몇 판 주문되었나요?
2. 총 몇 건의 고유 고객 주문이 발생했습니까?
3. 각 배달원이 성공적으로 배송한 주문 건수는 몇 건입니까? - [[MySQL, LIKE 비교에서 NULL]]
4. 각 종류의 피자가 몇 개씩 배달되었나요?
5. 각 고객이 주문한 채식 메뉴와 육식 메뉴는 각각 몇 개였습니까?
6. 한 번의 주문으로 배달된 피자의 최대 개수는 몇 개였나요?
7. 각 고객별로 배달된 피자 중 잔돈이 1개 이상인 피자는 몇 개이고, 잔돈이 전혀 없는 피자는 몇 개입니까?
8. 제외된 토핑과 추가 토핑이 모두 포함된 피자는 총 몇 판이었습니까?
9. 하루 동안 시간대별로 주문된 피자의 총량은 얼마였습니까?
10. 요일별 주문량은 얼마나 되었나요?

### B. 러너와 고객 경험

1. 매주(주 시작일 기준 `2021-01-01`) 몇 명의 참가자가 등록했나요?
2. 피자 배달원이 주문을 픽업하기 위해 피자 배달원 본사에 도착하는 데 걸린 평균 시간은 몇 분이었습니까?
3. 피자 주문 개수와 주문 준비 시간 사이에 어떤 관계가 있나요?
4. 고객 한 명당 평균 이동 거리는 얼마였습니까?
5. 모든 주문에 대해 가장 긴 배송 시간과 가장 짧은 배송 시간의 차이는 얼마였습니까?
6. 각 투수별 투구 속도의 평균값은 얼마였으며, 이러한 값들에서 어떤 경향성을 발견하셨나요?
7. 각 배달원의 배송 성공률은 몇 퍼센트입니까?

### C. 원료 최적화

1. 각 피자에 기본적으로 들어가는 재료는 무엇인가요?
2. 가장 흔하게 추가되는 옵션은 무엇이었나요?
3. 가장 흔한 제외 사항은 무엇이었습니까?
4. `customers_orders`테이블의 각 레코드에 대해 다음 형식 중 하나로 주문 항목을 생성합니다 .
    - `Meat Lovers`
    - `Meat Lovers - Exclude Beef`
    - `Meat Lovers - Extra Bacon`
    - `Meat Lovers - Exclude Cheese, Bacon - Extra Mushroom, Peppers`
5. 표 에 있는 각 피자 주문에 대해 알파벳순으로 정렬된 쉼표로 구분된 재료 목록을 생성하고 `customer_orders`, `2x`관련된 재료 앞에는 모두 'a'를 추가하세요.
    - 예를 들어:`"Meat Lovers: 2xBacon, Beef, ... , Salami"`
6. 배달된 모든 피자에 사용된 각 재료의 총량을 가장 많이 사용된 순서부터 정렬하면 얼마입니까?

### D. 가격 및 등급

1. 만약 미트 러버스 피자가 12달러이고 베지테리언 피자가 10달러이며, 변경 수수료가 없다면 배달료가 없는 경우 피자 러너는 지금까지 총 얼마의 수익을 올렸을까요?
2. 피자에 추가 토핑을 넣을 때마다 1달러씩 추가 요금이 붙는다면 어떨까요?
    - 치즈 추가 시 1달러 추가됩니다.
3. 피자 배달팀은 이제 고객이 배달원을 평가할 수 있는 추가 평점 시스템을 도입하려고 합니다. 이 새로운 데이터 세트를 위한 추가 테이블을 어떻게 설계하시겠습니까? 새 테이블의 스키마를 생성하고, 각 고객 주문 건에 대한 1점에서 5점 사이의 평점 데이터를 삽입하세요.
4. 새로 생성된 표를 사용하여 모든 정보를 결합하여 성공적인 배송에 대한 다음 정보를 포함하는 표를 만들 수 있습니까?
    - `customer_id`
    - `order_id`
    - `runner_id`
    - `rating`
    - `order_time`
    - `pickup_time`
    - 주문과 픽업 사이의 시간
    - 배송 기간
    - 평균 속도
    - 피자 총 개수
5. 만약 미트 러버스 피자가 12달러, 베지테리언 피자가 10달러로 고정 가격이고 추가 요금은 없으며, 배달원 한 명당 이동 거리 1km당 0.30달러를 받는다면, 피자 배달원은 이 모든 배달을 마친 후 얼마의 돈이 남을까요?

### E. 보너스 문제

대니가 피자 종류를 확장하고 싶다면 기존 데이터 설계에 어떤 영향을 미칠까요? 모든 토핑이 포함된 새로운 피자가 피자 러너 메뉴에 추가될 `INSERT`경우 어떤 변화가 발생하는지 설명하는 글을 작성하세요.`Supreme`

## 풀이(진행중)

```sql
USE pizza_runner;
show tables;

-- 피자 측정 지표
-- 
-- 1. 피자는 몇 판 주문되었나요?
-- 주문한 order의 수를 세었습니다.
SELECT count(*)
FROM customer_orders;

-- 2. 총 몇 건의 고유 고객 주문이 발생했습니까?
-- 각 고객이 주문한 order의 수를 세었습니다.
SELECT customer_id, count(order_id)
FROM customer_orders
GROUP BY customer_id;

-- 3. 각 배달원이 성공적으로 배송한 주문 건수는 몇 건입니까?
-- runners_orders의 'cancellation'에 값이 있다면, 취소된 주문이라고 판단하였습니다.
-- 참조 - [[MySQL, LIKE 비교에서 NULL]]
SELECT runner_id, count(*)
FROM runner_orders
WHERE cancellation NOT LIKE '%Cancellation%' or cancellation is NULL
GROUP BY runner_id;

-- 4. 각 종류의 피자가 몇 개씩 배달되었나요? retry
-- '배달되었나요?' 라는 질문이기 때문에 customer_orders의 기준이 아닌,
-- 성공적으로 배달한 주문들에서 피자를 세어보겠습니다.
WITH success AS (
SELECT *
FROM runner_orders
WHERE cancellation NOT LIKE '%Cancellation%' or cancellation is NULL
)
SELECT pn.pizza_name, count(*) AS cnt
FROM success s 
JOIN customer_orders co ON s.order_id = co.order_id
JOIN pizza_names pn ON co.pizza_id = pn.pizza_id
GROUP BY pn.pizza_name
ORDER BY cnt desc;

-- 5. 각 고객이 주문한 채식 메뉴와 육식 메뉴는 각각 몇 개였습니까? retry
-- 집계함수에 case when then 사용하기
SELECT customer_id AS 고객, 
	sum(CASE WHEN pizza_id = 1 THEN 1 ELSE 0 END) AS 육식,
	sum(CASE WHEN pizza_id = 2 THEN 1 ELSE 0 END) AS 채식
FROM customer_orders co
GROUP BY customer_id
ORDER BY customer_id;

-- 6. 한 번의 주문으로 배달된 피자의 최대 개수는 몇 개였나요?
-- 배달된 피자이기 때문에 배달에 성공한 주문 중 한 주문에 가장 많은 피자가 있는 주문을 찾았습니다.
SELECT co.order_id AS 주문, count(*) AS `최대 피자 개수`
FROM customer_orders co JOIN runner_orders ro ON co.order_id = ro.order_id
WHERE cancellation NOT LIKE "%Cancellation%" OR cancellation IS NULL
GROUP BY co.order_id
ORDER BY `최대 피자 개수` DESC
LIMIT 1;

-- 7. 각 고객에게 최소 한 번의 변경이 있는 배달 피자는 몇 개이고 변경이 없는 피자는 몇 개입니까? retry
-- 배달 피자이기 때문에 성공적으로 배달된 피자이고, exclusions이나 extras에 값이 하나라도 있다면(공백, null 제외) 변경이 있는 피자, 아니라면 변경이 없는
-- 피자라고 판단했습니다. 또한 주문 단위가 아닌 피자 단위이기 때문에, 같은 주문에 포함된 피자라도 각각으로 판단했습니다.
-- in, not in 사용해보기
SELECT customer_id, sum(CASE 
	WHEN !(exclusions = 'null' OR exclusions = '' OR exclusions IS NULL) THEN 1 
	WHEN !(extras = 'null' OR extras = '' OR extras IS NULL) THEN 1
	ELSE 0
END
) AS 변경_있음,
sum(CASE 
	WHEN (exclusions = 'null' OR exclusions = '' OR exclusions IS NULL)
	AND (extras = 'null' OR extras = '' OR extras IS NULL) THEN 1
	ELSE 0
END
) AS 변경_없음
FROM customer_orders co JOIN runner_orders ro ON co.order_id = ro.order_id
WHERE (ro.cancellation NOT LIKE '%Cancellation%' OR cancellation IS NULL)
GROUP BY co.customer_id
ORDER BY co.customer_id;

-- 8. 제외된 토핑과 추가 토핑이 모두 포함된 피자는 총 몇 판이었습니까?
-- 이번에는 배달된 이라는 키워드가 없기 때문에, 그냥 모든 order(모든 피자)에서의 경우를 확인해보도록 하겠습니다.
SELECT count(*) AS `변경된 피자`
FROM customer_orders
WHERE (exclusions IS NOT NULL AND exclusions NOT IN ('', 'null')) 
	AND (extras IS NOT NULL AND extras NOT IN ('', 'null'));

-- 9. 하루 동안 시간대별로 주문된 피자의 총량은 얼마였습니까? retry
-- 시간대별로 라고 하여 0~23시 모두를 기준으로 각각의 주문 횟수를 세었습니다.
-- RECURSIVE의 사용을 익히기
WITH RECURSIVE hours AS(
	SELECT 0 AS hours 
	UNION ALL
	SELECT hours+1
	FROM hours 
	WHERE hours<23
)
SELECT h.hours AS 시간, count(order_id) AS 주문횟수
FROM hours h LEFT JOIN customer_orders co ON h.hours = hour(co.order_time)
GROUP BY h.hours
ORDER BY h.hours;

-- 10. 요일별 주문량은 얼마나 되었나요? retry
-- 모든 요일을 만들고, 각각의 요일별로 몇 건의 주문이 있는지 세어보았습니다.
-- recursive를 이용해 요일을 만들고, ETL을 통해 각각의 요일을 표현해 주는 방식을 익혀야할 것 같습니다.
WITH RECURSIVE days as(
	SELECT 1 AS days
	UNION ALL
	SELECT days+1
	FROM days
	WHERE days<7
)
SELECT 
	ELT(d.days, '일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일') AS 요일,
	count(*) 주문량
FROM days d LEFT JOIN customer_orders co ON d.days = dayofweek(co.order_time)
GROUP BY d.days
ORDER BY d.days;

-- 러너와 고객 경험
--
-- 1. 매주(주 시작일 기준 `2021-01-01`) 몇 명의 참가자가 등록했나요? retry
-- 주마다 데이터를 세는 방법, RECURSIVE와 날짜 더하기 DATE_ADD의 사용법에 대해 배웠습니다.
WITH RECURSIVE weeks AS (
  SELECT 
    DATE('2021-01-01') AS week_start,
    DATE('2021-01-07') AS week_end
  UNION ALL
  SELECT 
    DATE_ADD(week_start, INTERVAL 7 DAY),
    DATE_ADD(week_end, INTERVAL 7 DAY)
  FROM weeks
  WHERE week_start < (SELECT MAX(registration_date) FROM runners)
)
SELECT 
  week_start AS 주차시작일,
  COUNT(r.runner_id) AS 등록자수
FROM weeks w
LEFT JOIN runners r 
  ON r.registration_date >= w.week_start 
  AND r.registration_date < w.week_end
GROUP BY w.week_start
ORDER BY w.week_start;

-- 2. 피자 배달원이 주문을 픽업하기 위해 피자 배달원 본사에 도착하는 데 걸린 평균 시간은 몇 분이었습니까? retry
-- customer_order의 order_time과 runner_orders의 pickup_time의 차를 구하여 평균을 구해보았습니다.
-- timestampdiff에 대해 배웠습니다!!
SELECT avg(timestampdiff(MINUTE, order_time, pickup_time)) AS 평균소요시간
FROM customer_orders co JOIN runner_orders ro ON co.order_id = ro.order_id
WHERE pickup_time != 'null';

-- 3. 피자 주문 개수와 주문 준비 시간 사이에 어떤 관계가 있나요?
-- 피자 주문 개수와 pickup까지의 소요시간을 같이보여주어 상관관계를 보여주었습니다.
-- 대체로 피자주문수가 높을수록 평균소요시간도 높다는 것을 볼 수 있습니다.
SELECT co.order_id AS 주문번호, count(co.order_id) AS 피자주문수, avg(timestampdiff(MINUTE,order_time, pickup_time)) AS 평균소요시간
FROM customer_orders co JOIN runner_orders ro ON co.order_id = ro.order_id
WHERE pickup_time != 'null'
GROUP BY co.order_id
ORDER BY 피자주문수 DESC;

-- 4. 고객 한 명당 평균 이동 거리는 얼마였습니까? retry
-- runner가 아니라 고객이므로, runner_orders와 customer_orders를 join한 뒤 
-- customer_id로 그룹을 짓고 distance를 합쳐 평균을 구해보았습니다.
-- distance null은 제외(배달하지 않음) 제외하지 않으면 평균을 구하기 위해 나누는 횟수가 늘어남
-- distinct를 통해 같은 주문의 경우 거리를 또 세지 않도록 만들어줌
-- cast, replace, decimal의 사용법에 대해 익히자!!
WITH uniq_orders AS (
	SELECT DISTINCT order_id, customer_id
	FROM customer_orders
)
SELECT uo.customer_id, avg(CAST(REPLACE(REPLACE(ro.distance, 'km', ''), ' ', '') AS decimal(5,2)))
FROM uniq_orders uo JOIN runner_orders ro ON uo.order_id = ro.order_id
WHERE ro.pickup_time != 'null'
GROUP BY uo.customer_id;

-- 5. 모든 주문에 대해 가장 긴 배송 시간과 가장 짧은 배송 시간의 차이는 얼마였습니까? retry
-- 배송시간은 pickup 하는데 걸린 시간을 제외하고, duration 시간으로만 판단하도록 하겠습니다.
-- 괄호를 잘 보자!, 정규표현식 사용법 알아두면 좋을지도, unsigned도 알아두자.
SELECT max(CAST(REPLACE(REPLACE(REPLACE(REPLACE(duration, 'minutes', ''), 'minute', ''), 'mins', ''), ' ', '') AS UNSIGNED)) - min(CAST(REPLACE(REPLACE(REPLACE(REPLACE(duration, 'minutes', ''), 'minute', ''), 'mins', ''), ' ', '') AS unsigned))  AS 배송시간차이
FROM runner_orders
WHERE duration != 'null';

-- 아래와 같이 정규표현식으로 깔끔하게 가능!!
SELECT max(CAST(REGEXP_REPLACE(duration, '[^0-9]', '') AS UNSIGNED)) - min(CAST(REGEXP_REPLACE(duration, '[^0-9]', '') AS unsigned)) AS 배송시간차이
FROM runner_orders
WHERE duration != 'null';

-- 6. 각 배달에 대한 각 주자의 평균 속도는 얼마였으며 이러한 값에 대한 추세를 발견했습니까? retry
-- 그나마 발견할 수 있었던 추세는, 한번에 많은 피자를 실을수록 평균 속도가 낮아진다는 추세를 발견하였습니다.
-- SELECT *
-- FROM runner_orders;
-- 
-- SELECT *
-- FROM customer_orders;

WITH order_cnt AS(
	SELECT order_id, count(order_id) AS order_cnt
	FROM customer_orders
	GROUP BY order_id
)
SELECT 
  ro.runner_id, ro.order_id,
  ROUND((CAST(REGEXP_REPLACE(ro.distance, '[^0-9.]', '') AS DECIMAL(6,2)) /  CAST(REGEXP_REPLACE(ro.duration, '[^0-9]', '') AS UNSIGNED) * 60), 2) AS 평균속도_kmph,
  oc.order_cnt,
  ro.distance,
  ro.duration
FROM order_cnt oc JOIN runner_orders ro ON oc.order_id = ro.order_id
WHERE ro.distance IS NOT NULL 
  AND ro.distance != 'null'
  AND ro.duration IS NOT NULL
  AND ro.duration != 'null'
ORDER BY 평균속도_kmph desc;

-- 7. 각 배달원의 배송 성공률은 몇 퍼센트입니까? 
-- 배송 성공에 대한 기준을 정의하지 않으면 애매하긴 하지만, 캔슬되지 않고 배달이 완료되었다는 것이
-- 배송 성공이라 가정하고 문제를 풀어보겠습니다.
-- % 깔끔하게 만들기 
WITH order_cnt AS (
	SELECT runner_id, count(*) AS all_cnt
	FROM runner_orders
	GROUP BY runner_id
)
SELECT ro.runner_id, concat(round((count(order_id)*100/all_cnt), 2), '%') AS 배달성공률 
FROM order_cnt AS oc JOIN runner_orders ro ON oc.runner_id = ro.runner_id
WHERE cancellation IS NULL OR cancellation NOT LIKE '%Cancellation%'
GROUP BY runner_id;

-- 원료 최적화
-- 
-- 1. 각 피자에 기본적으로 들어가는 재료는 무엇인가요?
-- 두 개의 피자에 공통적으로 들어가는 토핑을 찾았습니다.
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
SELECT st.topping_id, pt.topping_name, count(st.topping_id)
FROM split_toppings st JOIN pizza_toppings pt ON st.topping_id = pt.topping_id 
GROUP BY st.topping_id, pt.topping_name
HAVING count(st.topping_id)>=2;

-- 2. 가장 흔하게 추가되는 옵션은 무엇이었나요?
-- 추가 옵션이므로 extras에 가장 자주 나온 옵션을 찾아냅니다.
WITH RECURSIVE extra_toppings AS(
	SELECT 
		order_id,
		TRIM(substring_Index(extras, ',', 1)) AS topping_id,
		extras,
		1 AS pos
	FROM customer_orders
	WHERE extras IS NOT NULL and extras NOT IN ('', 'null')
	UNION ALL
	SELECT 
		order_id,
		TRIM(substring_index(substring_Index(extras, ',', pos+1), ',', -1)) AS topping_id,
		extras,
		pos+1 AS pos
	FROM extra_toppings
	WHERE pos < length(extras) - length(REPLACE(extras, ',' , '')) + 1
)
SELECT et.topping_id, pt.topping_name, count(*) AS 추가횟수
FROM extra_toppings et JOIN pizza_toppings pt ON et.topping_Id = pt.topping_id
GROUP BY et.topping_id, pt.topping_name
ORDER BY 추가횟수 DESC
LIMIT 1;

-- 3. 가장 흔한 제외 사항은 무엇이었습니까?
-- 위와 마찬가지로 exclusions에서 가장 많이 등장한 토핑을 찾아보았습니다.
-- 한 주문에 피자가 여러개 있는 경우에 같은 제거 요청이 있는 경우가 있엇습니다.
-- 한 사람이 먹는 피자에서 제외한건, 흔하다기보다는 그 분의 취향일 수 있으니, 중복은 제외하도록 하겠습니다.
WITH RECURSIVE exclusion_toppings AS(
	SELECT 
		order_id,
		trim(substring_index(exclusions, ',', 1)) AS topping_id,
		exclusions,
		1 AS pos
	FROM customer_orders
	WHERE exclusions IS NOT NULL AND exclusions NOT IN ('', 'null')
	UNION ALL
	SELECT
		order_id,
		trim(substring_index(substring_index(exclusions, ',', 1+pos), ',', -1)) AS topping_id,
		exclusions,
		1+pos AS pos
	FROM exclusion_toppings
	WHERE pos < length(exclusions)-length(REPLACE(exclusions, ',', ''))+1
),
uniq_exclusions AS (
	SELECT DISTINCT order_id, topping_id
	FROM exclusion_toppings
)
SELECT ue.topping_id, pt.topping_name, count(*) AS 제외횟수
FROM uniq_exclusions ue JOIN pizza_toppings pt ON ue.topping_id = pt.topping_id
GROUP BY ue.topping_id, pt.topping_name
ORDER BY 제외횟수 DESC
LIMIT 1;

-- 4. `customers_orders`테이블의 각 레코드에 대해 다음 형식 중 하나로 주문 항목을 생성합니다. retry
-- 문제 이해부터 쉽지 않았고, 수 많은 with를 이용해 내가 원하는 방식대로 데이터를 정재해 나아가고, 이제 그 cte를 적절한 join으로 합쳐서
-- 내가 원하는 결과물을 출력해내야 한다..
--     - `Meat Lovers`
--     - `Meat Lovers - Exclude Beef`
--     - `Meat Lovers - Extra Bacon`
--     - `Meat Lovers - Exclude Cheese, Bacon - Extra Mushroom, Peppers`
WITH RECURSIVE exclude_topping AS
(
	SELECT 
		order_id,
		trim(substring_index(exclusions, ',', 1)) AS topping_id,
		exclusions,
		1 AS pos
	FROM customer_orders
	WHERE exclusions IS NOT NULL AND exclusions NOT IN ('', 'null')
	UNION ALL
	SELECT
		order_id,
		trim(substring_index(substring_index(exclusions, ',', pos+1), ',', -1)) AS topping_id,
		exclusions,
		1+pos AS pos
	FROM exclude_topping
	WHERE pos< LENGTH(exclusions) - LENGTH(REPLACE(exclusions, ',', ''))+1
),
extra_topping AS
(
	SELECT 
		order_id,
		trim(substring_index(extras, ',', 1)) AS topping_id,
		extras,
		1 AS pos
	FROM customer_orders
	WHERE extras IS NOT NULL AND extras NOT IN ('', 'null')
	UNION ALL
	SELECT
		order_id,
		trim(substring_index(substring_index(extras, ',', pos+1), ',', -1)) AS topping_id,
		extras,
		1+pos AS pos
	FROM extra_topping
	WHERE pos< LENGTH(extras) - LENGTH(REPLACE(extras, ',', ''))+1
),
uniq_exclude as(
	SELECT DISTINCT order_id, topping_id
	FROM exclude_topping
	ORDER BY order_id
),
exclude_with_name AS(
	SELECT ue.order_id, pt.topping_name
	FROM uniq_exclude ue JOIN pizza_toppings pt ON ue.topping_id = pt.topping_id
),
uniq_extra as(
	SELECT DISTINCT order_id, topping_id
	FROM extra_topping g
	ORDER BY order_id
),
extra_with_name AS(
	SELECT ue.order_id, pt.topping_name
	FROM uniq_extra ue JOIN pizza_toppings pt ON ue.topping_id = pt.topping_id
),
exclude_summary as(
	SELECT order_id,
		group_concat(topping_name ORDER BY topping_name SEPARATOR ', ') AS excluded_toppings
	FROM exclude_with_name
	group BY order_id
),
extra_summary as(
	SELECT order_id,
		group_concat(topping_name ORDER BY topping_name SEPARATOR ', ') AS extra_toppings
	FROM extra_with_name
	group BY order_id
)
SELECT 
    co.order_id,
    CASE 
        WHEN es.excluded_toppings IS NULL AND exs.extra_toppings IS NULL 
            THEN pn.pizza_name
        WHEN es.excluded_toppings IS NOT NULL AND exs.extra_toppings IS NULL 
            THEN CONCAT(pn.pizza_name, ' - Exclude ', es.excluded_toppings)
        WHEN es.excluded_toppings IS NULL AND exs.extra_toppings IS NOT NULL 
            THEN CONCAT(pn.pizza_name, ' - Extra ', exs.extra_toppings)
        ELSE 
            CONCAT(pn.pizza_name, ' - Exclude ', es.excluded_toppings, ' - Extra ', exs.extra_toppings)
    END AS order_description
FROM customer_orders co
JOIN pizza_names pn ON co.pizza_id = pn.pizza_id
LEFT JOIN exclude_summary es ON co.order_id = es.order_id
LEFT JOIN extra_summary exs ON co.order_id = exs.order_id
ORDER BY co.order_id;

-- 5. 각 주문마다 "실제로 들어간 모든 재료"를 알파벳순으로 나열하되, 2개 이상 들어간 재료는 2x 표시를 붙여라
--     - 예를 들어:`"Meat Lovers: 2xBacon, Beef, ... , Salami"`
-- 각 주문마다 라는 키워드 때문에 한 주문에 여러개의 피자를 시켰어도, 각각의 피자를 판단하기로 했습니다.
-- retry
WITH RECURSIVE 
numbered_orders AS (-- 1단계: 각 행에 고유 ID 부여 
    SELECT 
        ROW_NUMBER() OVER (ORDER BY order_id, pizza_id, order_time) AS row_num,
        order_id,
        customer_id,
        pizza_id,
        exclusions,
        extras,
        order_time
    FROM customer_orders
),
base_toppings_raw AS (-- 2단계: 기본 재료 분리 (pizza_recipes)
    SELECT 
        no.row_num,
        no.pizza_id,
        TRIM(SUBSTRING_INDEX(pr.toppings, ',', 1)) AS topping_id,
        pr.toppings,
        1 AS pos
    FROM numbered_orders no
    JOIN pizza_recipes pr ON no.pizza_id = pr.pizza_id
    UNION ALL
    SELECT 
        row_num,
        pizza_id,
        TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(toppings, ',', pos + 1), ',', -1)),
        toppings,
        pos + 1
    FROM base_toppings_raw
    WHERE pos < LENGTH(toppings) - LENGTH(REPLACE(toppings, ',', '')) + 1
),
excluded_toppings_raw AS (-- 3단계: 제외 재료 분리 (exclusions)
    SELECT 
        row_num,
        TRIM(SUBSTRING_INDEX(exclusions, ',', 1)) AS topping_id,
        exclusions,
        1 AS pos
    FROM numbered_orders
    WHERE exclusions IS NOT NULL AND exclusions NOT IN ('', 'null')
    UNION ALL
    SELECT 
        row_num,
        TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(exclusions, ',', pos + 1), ',', -1)),
        exclusions,
        pos + 1
    FROM excluded_toppings_raw
    WHERE pos < LENGTH(exclusions) - LENGTH(REPLACE(exclusions, ',', '')) + 1
),
extra_toppings_raw AS (-- 4단계: 추가 재료 분리 (extras)
    SELECT 
        row_num,
        TRIM(SUBSTRING_INDEX(extras, ',', 1)) AS topping_id,
        extras,
        1 AS pos
    FROM numbered_orders
    WHERE extras IS NOT NULL AND extras NOT IN ('', 'null')
    UNION ALL
    SELECT 
        row_num,
        TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(extras, ',', pos + 1), ',', -1)),
        extras,
        pos + 1
    FROM extra_toppings_raw
    WHERE pos < LENGTH(extras) - LENGTH(REPLACE(extras, ',', '')) + 1
),
final_toppings AS (-- 5단계: 최종 재료 = (기본 - 제외) + 추가
    SELECT  -- 기본 재료에서 제외 재료 빼기
        bt.row_num,
        bt.topping_id
    FROM base_toppings_raw bt
    LEFT JOIN excluded_toppings_raw et 
        ON bt.row_num = et.row_num 
        AND bt.topping_id = et.topping_id
    WHERE et.topping_id IS NULL  -- 제외 목록에 없는 것만
    UNION ALL
    SELECT -- 추가 재료 더하기
        row_num,
        topping_id
    FROM extra_toppings_raw
),
topping_counts AS (-- 6단계: 재료별 개수 세기
    SELECT 
        row_num,
        topping_id,
        COUNT(*) AS quantity
    FROM final_toppings
    GROUP BY row_num, topping_id
),
topping_with_names AS (-- 7단계: 재료 이름으로 변환 + 2x 표시
    SELECT 
        tc.row_num,
        CASE 
            WHEN tc.quantity > 1 
            THEN CONCAT(tc.quantity, 'x', pt.topping_name)
            ELSE pt.topping_name
        END AS topping_display
    FROM topping_counts tc
    JOIN pizza_toppings pt ON tc.topping_id = pt.topping_id
),
ingredient_list AS (-- 8단계: 재료들을 문자열로 합치기
    SELECT 
        row_num,
        GROUP_CONCAT(topping_display ORDER BY topping_display SEPARATOR ', ') AS ingredients
    FROM topping_with_names
    GROUP BY row_num
)
SELECT -- 9단계: 최종 결과 
    no.order_id,
    no.customer_id,
    no.pizza_id,
    CONCAT(pn.pizza_name, ': ', il.ingredients) AS order_description
FROM numbered_orders no
JOIN pizza_names pn ON no.pizza_id = pn.pizza_id
JOIN ingredient_list il ON no.row_num = il.row_num
ORDER BY no.order_id, no.row_num;

-- 6. 배달 완료된 모든 피자에 사용된 각 재료의 총 개수를 구하고, 가장 많이 사용된 순서대로 정렬하라
-- 문제에 대한 이해를 조금 더 잘해야할 것 같다.
WITH RECURSIVE number_order as( -- 주문이 같은 피자를 구별하기 위해 row num 생성 목록
	SELECT 
		ROW_NUMBER() OVER (ORDER BY order_id, pizza_id, order_time) AS row_num,
		order_id,
		customer_id,
		pizza_id,
		exclusions,
		extras,
		order_time
	FROM customer_orders
),
deliver_order AS( -- cancellation이 포함된 취소주문 제거한 목록 만들기
	SELECT *
	FROM runner_orders
	WHERE cancellation NOT LIKE '%Cancellation%' or cancellation IS NULL
),
success_pizza AS( -- 배달에 성공한 피자만 가져오기
	SELECT n.*
	FROM number_order n JOIN deliver_order d ON n.order_id = d.order_id
),
base_pizza_topping as( -- 각 피자마다 가지고 있는 기본 피자 토핑을 구해주었습니다.
	SELECT  
		pizza_id,
		trim(substring_index(toppings, ',', 1)) AS topping_id,
		toppings,
		1 AS pos
	FROM pizza_recipes
	UNION ALL
	SELECT
		pizza_id,
		trim(substring_index(substring_index(toppings, ',', pos+1), ',', -1)) AS topping_id,
		toppings,
		pos+1
	FROM base_pizza_topping
	WHERE pos < LENGTH(toppings) - LENGTH(REPLACE(toppings, ',', '')) + 1
),
exclusive_toppings AS(
	SELECT 
		row_num,
		order_id,
		customer_id,
		pizza_id,
		trim(substring_index(exclusions, ',', 1)) AS topping_id,
		exclusions,
		1 AS pos
	FROM success_pizza
	WHERE exclusions IS NOT NULL AND exclusions NOT IN ('', 'null')
	UNION ALL
	SELECT
		row_num,
		order_id,
		customer_id,
		pizza_id,
		trim(substring_index(substring_index(exclusions, ',', pos+1), ',', -1)) AS topping_id,
		exclusions,
		pos+1 AS pos
	FROM exclusive_toppings
	WHERE pos < LENGTH(exclusions) - LENGTH(REPLACE(exclusions, ',', '')) + 1
),
extra_toppings AS(
	SELECT 
		row_num,
		order_id,
		customer_id,
		pizza_id,
		trim(substring_index(extras, ',', 1)) AS topping_id,
		extras,
		1 AS pos
	FROM success_pizza
	WHERE extras IS NOT NULL AND extras NOT IN ('', 'null')
	UNION ALL
	SELECT 
		row_num,
		order_id,
		customer_id,
		pizza_id,
		trim(substring_index(substring_index(extras, ',', pos+1), ',', -1)) AS topping_id,
		extras,
		pos+1 AS pos
	FROM extra_toppings
	WHERE pos < LENGTH(extras)-LENGTH(REPLACE(extras, ',', '')) +1	
),
exclusive_cnt AS(
	SELECT row_num, count(topping_id) AS exclusive_cnt
	FROM exclusive_toppings
	GROUP by row_num
),
extra_cnt AS(
	SELECT row_num, count(topping_id) AS extra_cnt
	FROM extra_toppings 
	GROUP BY row_num
),
base_pizza_cnt AS(
	SELECT pizza_id, count(*) AS base_cnt
	FROM base_pizza_topping
	GROUP BY pizza_id
)
SELECT
    bpt.topping_id,
    pn.topping_name,
    COUNT(*) - COALESCE(SUM(CASE WHEN et.topping_id IS NOT NULL THEN 1 ELSE 0 END), 0) 
            + COALESCE(SUM(CASE WHEN ext.topping_id IS NOT NULL THEN 1 ELSE 0 END), 0) AS 총사용횟수
FROM success_pizza sp
    JOIN base_pizza_topping bpt ON sp.pizza_id = bpt.pizza_id
    LEFT JOIN exclusive_toppings et ON sp.row_num = et.row_num AND bpt.topping_id = et.topping_id
    LEFT JOIN extra_toppings ext ON sp.row_num = ext.row_num
    LEFT JOIN pizza_toppings pn ON bpt.topping_id = pn.topping_id
GROUP BY bpt.topping_id, pn.topping_name
ORDER BY 총사용횟수 DESC

-- SELECT 
-- 	sp.order_id AS 주분번호,
-- 	sp.row_num AS 피자번호,
-- 	bc.base_cnt - coalesce(ecc.exclusive_cnt, 0) + coalesce(etc.extra_cnt, 0) AS 총재료개수
-- FROM success_pizza sp
-- 	LEFT JOIN base_pizza_cnt bc ON sp.pizza_id = bc.pizza_id
-- 	LEFT JOIN exclusive_cnt ecc ON sp.row_num = ecc.row_num
-- 	LEFT JOIN extra_cnt etc ON sp.row_num = etc.row_num
-- ORDER BY 총재료개수 DESC;

-- 가격 및 등급
-- 
-- 1. Meat Lovers 피자가 $12, Vegetarian 피자가 $10이고, 변경 사항(exclusions/extras)에 대한 추가 비용이 없다면, 현재까지 Pizza Runner가 벌어들인 총 금액은?
-- 배달에 성공한 피자들을 구하고, 피자 개수 * 금액을 해주면 될 것 같다.

-- 배달에 성공한 주문
WITH success_deliver AS(
	SELECT *
	FROM runner_orders
	WHERE cancellation IN ('', 'null') OR cancellation IS NULL
),
each_pizza_cost as(
SELECT pizza_id,
	CASE 
		WHEN pizza_id = 1 THEN count(*)*12
		ELSE count(*)*10
	END  AS cost
FROM customer_orders co JOIN success_deliver sd ON co.order_id = sd.order_id
GROUP BY pizza_id
)
SELECT sum(cost) AS value
FROM each_pizza_cost;

-- 2. 피자에 추가되는 extras마다 $1씩 추가 비용이 발생한다면 총 매출은?
--     - 특히 치즈 추가 또한 $1
-- 배달 성공한 피자 리스트를 구하고, extras 가 존재하는 경우 각각 요소들을 나누어 줍니다.
WITH success_deliver AS(
	SELECT *
	FROM runner_orders
	WHERE cancellation IN ('', 'null') OR cancellation IS NULL
)
SELECT 
	ROW_NUMBER() OVER (ORDER BY co.order_id), co.order_id
FROM customer_orders co JOIN success_deliver sd ON co.order_id = sd.order_id;

-- extras의 count와 기존 피자 가격 
-- 3. 고객이 배달 runner를 평가할 수 있는 ratings 시스템을 추가하려고 한다. 새로운 테이블의 스키마를 설계하고, 성공한 각 주문에 대해 1~5점 사이의 평점 데이터를 직접 생성해 삽입하라.
-- 4. 3번에서 생성한 테이블을 활용해, 성공적인 배달에 대한 다음 정보를 모두 포함하는 결과 테이블을 만들어라:
--     - `customer_id`
--     - `order_id`
--     - `runner_id`
--     - `rating`
--     - `order_time`
--     - `pickup_time`
--     - 주문과 픽업 사이의 시간
--     - 배송 기간
--     - 평균 속도
--     - 피자 총 개수
-- 5. Meat Lovers $12, Vegetarian $10 고정 가격(extras 비용 없음)이고, 각 runner에게 이동 거리 1km당 $0.30을 지급한다면, 배달 후 Pizza Runner에 남는 순이익은?
```
