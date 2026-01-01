---
created: 2025-12-24T13:40:57
modified: 2026-01-01T23:51:39+09:00
---
![[Case Study1 - 대니의 식당-1766537395680.png]]

url - https://8weeksqlchallenge.com/case-study-1/
## 소개

대니는 일본 음식을 정말 좋아해서 2021년 초, 다소 위험한 도전을 감행하기로 결심하고 자신이 가장 좋아하는 세 가지 음식인 스시, 카레, 라멘을 파는 아담하고 예쁜 식당을 열었습니다.

대니의 식당이 경영난을 극복할 수 있도록 여러분의 도움이 절실히 필요합니다. 몇 달간의 운영 기간 동안 기본적인 데이터는 수집했지만, 그 데이터를 어떻게 활용해야 할지 전혀 모르고 있습니다.

## 문제 제기

대니는 데이터를 활용하여 고객에 대한 몇 가지 간단한 질문, 특히 방문 패턴, 지출 금액, 그리고 가장 좋아하는 메뉴 항목에 대한 답을 찾고자 합니다. 고객과의 이러한 심층적인 관계를 통해 그는 단골 고객에게 더욱 향상되고 개인화된 경험을 제공할 수 있을 것입니다.

그는 이러한 분석 결과를 바탕으로 기존 고객 충성도 프로그램을 확장할지 여부를 결정할 계획입니다. 또한, 그의 팀이 SQL을 사용하지 않고도 데이터를 쉽게 검토할 수 있도록 기본적인 데이터 세트를 생성하는 데 도움이 필요합니다.

대니는 개인 정보 보호 문제로 인해 전체 고객 데이터의 일부만 제공했습니다. 하지만 그는 여러분이 이 예시만으로도 그의 질문에 답하는 데 도움이 될 만한 완벽한 SQL 쿼리를 작성할 수 있기를 바랍니다!

대니는 이번 사례 연구를 위해 세 가지 핵심 데이터 세트를 여러분과 공유했습니다.

- `sales`
- `menu`
- `members`

아래에서 엔티티 관계도와 예시 데이터를 확인할 수 있습니다.

## 엔티티 관계 다이어그램

![[Case Study1 - 대니의 식당-1766537428909.png]]



이제 이 상황에서 주어지는 질문은 다음과 같습니다.

## 사례 연구 질문

다음 사례 연구 질문 각각은 단일 SQL 문을 사용하여 답변할 수 있습니다.

1. 각 고객이 레스토랑에서 쓴 총 금액은 얼마입니까?
2. 각 고객은 해당 레스토랑을 며칠 동안 방문했습니까?
3. 각 고객이 메뉴에서 가장 먼저 구매한 항목은 무엇이었습니까?
4. 메뉴에서 가장 많이 판매된 품목은 무엇이며, 전체 고객이 해당 품목을 몇 번이나 구매했습니까?
5. 각 고객에게 가장 인기 있었던 제품은 무엇이었습니까?
6. 회원 가입 후 고객이 가장 먼저 구매한 상품은 무엇이었습니까?
7. 고객이 회원이 되기 직전에 구매한 품목은 무엇입니까?
8. 회원이 되기 전에 각 회원이 구매한 품목의 총액은 얼마입니까?
9. 만약 1달러를 쓸 때마다 10포인트가 적립되고, 초밥을 주문할 경우 포인트가 2배로 계산된다면, 고객 한 명당 총 몇 포인트를 적립하게 될까요?
10. 고객이 프로그램에 가입한 후 첫 주 동안(가입일 포함) 모든 품목에 대해 2배의 포인트를 적립받습니다. 스시뿐만 아니라 모든 품목에 적용됩니다. 1월 말에 고객 A와 B는 각각 얼마의 포인트를 보유하게 될까요?

```sql
-- USE dannys_diner;

/* --------------------
   Case Study Questions
   --------------------*/


-- 1. 각 고객이 레스토랑에서 쓴 총 금액은 얼마입니까?
select m.customer_id, sum(price) as total_cost
from 
  dannys_diner.members m 
  join dannys_diner.sales s on m.customer_id = s.customer_id
  join dannys_diner.menu mn on s.product_id = mn.product_id
group by m.customer_id
order by total_cost desc;


-- 2. 각 고객은 해당 레스토랑을 며칠 동안 방문했습니까?
select m.customer_id, count(*) as visit_count
from dannys_diner.members m join dannys_diner.sales s on m.customer_id = s.customer_id
group by m.customer_id
order by visit_count desc;


-- 3. 각 고객이 메뉴에서 가장 먼저 구매한 항목은 무엇이었습니까? X
with first_date as (
	select customer_id, min(order_date) AS date
	from dannys_diner.sales
	group by customer_id
	order by customer_id
)
SELECT s.CUSTOMER_ID, m.PRODUCT_NAME 
FROM sales s JOIN first_date f ON s.CUSTOMER_ID = f.customer_id AND s.ORDER_DATE= f.`date`
JOIN menu m ON s.PRODUCT_ID = m.PRODUCT_ID 
ORDER BY s.customer_id;

-- 4. 메뉴에서 가장 많이 판매된 품목은 무엇이며, 전체 고객이 해당 품목을 몇 번이나 구매했습니까?
WITH top_sale AS (
	SELECT s.product_id, count(*) AS cnt
	FROM sales s 
	GROUP BY s.product_id
	ORDER BY cnt DESC
	LIMIT 1
)
SELECT m.PRODUCT_NAME, ts.CNT 
FROM menu m JOIN top_sale ts ON m.PRODUCT_ID = ts.PRODUCT_ID;

-- 5. 각 고객에게 가장 인기 있었던 제품은 무엇이었습니까? X
WITH get_rank AS
(
SELECT 
	customer_id, 
	product_id, 
	count(*) AS top_buy,
	rank() over(partition BY customer_id ORDER BY count(*) DESC) AS `rank`
FROM sales
GROUP BY customer_id, product_id
)
SELECT g.customer_id, m.product_name, g.top_buy
FROM get_rank g JOIN menu m ON g.product_id = m.product_id
WHERE g.`rank` = 1
ORDER BY g.customer_id;

-- 6. 회원 가입 후 고객이 가장 먼저 구매한 상품은 무엇이었습니까? X
WITH first_date AS (
  SELECT 
    s.customer_id, 
    MIN(s.order_date) AS first_order_date
  FROM sales s 
  JOIN members m ON s.customer_id = m.customer_id
  WHERE s.order_date >= m.join_date
  GROUP BY s.customer_id
)
SELECT 
  f.customer_id,
  mn.product_name,
  f.first_order_date
FROM first_date f
JOIN sales s 
  ON f.customer_id = s.customer_id 
  AND f.first_order_date = s.order_date
JOIN menu mn 
  ON s.product_id = mn.product_id
ORDER BY f.customer_id;

-- 7. 고객이 회원이 되기 직전에 구매한 품목은 무엇입니까?
WITH last_order AS
(
SELECT s.CUSTOMER_ID, max(s.order_date) AS last_order
FROM members m JOIN sales s ON m.customer_id = s.customer_id
WHERE s.order_date < m.join_date
GROUP BY s.customer_id
)
SELECT lo.CUSTOMER_ID, lo.LAST_ORDER, m.product_name
FROM last_order lo JOIN sales s 
ON lo.customer_id = s.customer_id AND lo.last_order = s.order_date
JOIN menu m 
ON s.product_id = m.product_id
ORDER BY lo.last_order;

-- 8. 회원이 되기 전에 각 회원이 구매한 품목의 총액은 얼마입니까?
SELECT s.CUSTOMER_ID, sum(mn.PRICE) AS total_price
FROM members m 
JOIN sales s ON m.customer_id = s.customer_id
JOIN menu mn ON s.product_id = mn.product_id
WHERE s.order_date < m.join_date
GROUP BY s.customer_id;

-- 9. 만약 1달러를 쓸 때마다 10포인트가 적립되고, 초밥을 주문할 경우 포인트가 2배로 계산된다면, 고객 한 명당 총 몇 포인트를 적립하게 될까요?
SELECT s.customer_id, sum(CASE
	WHEN mn.product_id = 1 THEN price * 10 * 2
	ELSE price * 10
END) AS total_price
FROM sales s JOIN menu mn ON s.product_id = mn.product_id
GROUP BY s.customer_id
ORDER BY total_price desc;

SELECT *
FROM sales; 

-- 10. 고객이 프로그램에 가입한 후 첫 주 동안(가입일 포함) 모든 품목에 대해 2배의 포인트를 적립받습니다. 스시뿐만 아니라 모든 품목에 적용됩니다. 1월 말에 고객 A와 B는 각각 얼마의 포인트를 보유하게 될까요?
SELECT 
  s.customer_id,
  m.join_date,
  SUM(
    CASE
      WHEN s.order_date >= m.join_date 
       AND s.order_date <= m.join_date + INTERVAL 6 DAY
        THEN mn.price * 10 * 2
            WHEN mn.product_name = 'sushi'
        THEN mn.price * 10 * 2
      ELSE mn.price * 10
    END
  ) AS total_points
FROM sales s
JOIN members m ON s.customer_id = m.customer_id
JOIN menu mn ON s.product_id = mn.product_id
WHERE s.order_date BETWEEN '2021-01-01' AND '2021-01-31'
GROUP BY s.customer_id, m.join_date
ORDER BY s.customer_id;

```

## 보너스 질문

### 모든 것에 참여하세요

다음 질문들은 대니와 그의 팀이 SQL을 사용하여 기본 테이블을 조인할 필요 없이 신속하게 인사이트를 도출하는 데 사용할 수 있는 기본 데이터 테이블을 생성하는 것과 관련이 있습니다.

제공된 데이터를 사용하여 다음 표의 출력 결과를 다시 생성하십시오.

|customer_id|order_date|product_name|price|member|
|---|---|---|---|---|
|A|2021-01-01|curry|15|N|
|A|2021-01-01|sushi|10|N|
|A|2021-01-07|curry|15|Y|
|A|2021-01-10|ramen|12|Y|
|A|2021-01-11|ramen|12|Y|
|A|2021-01-11|ramen|12|Y|
|B|2021-01-01|curry|15|N|
|B|2021-01-02|curry|15|N|
|B|2021-01-04|sushi|10|N|
|B|2021-01-11|sushi|10|Y|
|B|2021-01-16|ramen|12|Y|
|B|2021-02-01|ramen|12|Y|
|C|2021-01-01|ramen|12|N|
|C|2021-01-01|ramen|12|N|
|C|2021-01-07|ramen|12|N|
### 모든 것의 순위를 매기세요

대니는 고객 제품에 대한 추가 정보도 필요로 `ranking`하지만, 비회원 구매에 대한 순위 정보는 의도적으로 필요하지 않으므로, `ranking`고객이 아직 로열티 프로그램에 가입하지 않은 경우 해당 레코드에는 null 값이 있을 것으로 예상합니다.

|customer_id|order_date|product_name|price|member|ranking|
|---|---|---|---|---|---|
|A|2021-01-01|curry|15|N|null|
|A|2021-01-01|sushi|10|N|null|
|A|2021-01-07|curry|15|Y|1|
|A|2021-01-10|ramen|12|Y|2|
|A|2021-01-11|ramen|12|Y|3|
|A|2021-01-11|ramen|12|Y|3|
|B|2021-01-01|curry|15|N|null|
|B|2021-01-02|curry|15|N|null|
|B|2021-01-04|sushi|10|N|null|
|B|2021-01-11|sushi|10|Y|1|
|B|2021-01-16|ramen|12|Y|2|
|B|2021-02-01|ramen|12|Y|3|
|C|2021-01-01|ramen|12|N|null|
|C|2021-01-01|ramen|12|N|null|
|C|2021-01-07|ramen|12|N|null|
