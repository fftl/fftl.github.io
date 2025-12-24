![[Case Study1 - 대니의 식당-1766537395680.png]]

![[Case Study1 - 대니의 식당-1766537413767.png]]

![[Case Study1 - 대니의 식당-1766537428909.png]]

https://8weeksqlchallenge.com/case-study-1/ - 챌린지 링크

이제 이 상황에서 주어지는 질문은 다음과 같습니다.

```sql
USE dannys_diner;

  

/* --------------------

Case Study Questions

--------------------*/

  

  

-- 1. 각 고객이 레스토랑에서 쓴 총 금액은 얼마입니까?

-- select m.customer_id, sum(price) as total_cost

-- from

-- dannys_diner.members m

-- join dannys_diner.sales s on m.customer_id = s.customer_id

-- join dannys_diner.menu mn on s.product_id = mn.product_id

-- group by m.customer_id

-- order by total_cost desc;

  

  

-- 2. 각 고객은 해당 레스토랑을 며칠 동안 방문했습니까?

-- select m.customer_id, count(*) as visit_count

-- from dannys_diner.members m join dannys_diner.sales s on m.customer_id = s.customer_id

-- group by m.customer_id

-- order by visit_count desc;

  

  

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

  

-- 6. 회원 가입 후 고객이 가장 먼저 구매한 상품은 무엇이었습니까?

-- 7. 고객이 회원이 되기 직전에 구매한 품목은 무엇입니까?

-- 8. 회원이 되기 전에 각 회원이 구매한 품목의 총액은 얼마입니까?

-- 9. 만약 1달러를 쓸 때마다 10포인트가 적립되고, 초밥을 주문할 경우 포인트가 2배로 계산된다면, 고객 한 명당 총 몇 포인트를 적립하게 될까요?

-- 10. 고객이 프로그램에 가입한 후 첫 주 동안(가입일 포함) 모든 품목에 대해 2배의 포인트를 적립받습니다. 스시뿐만 아니라 모든 품목에 적용됩니다. 1월 말에 고객 A와 B는 각각 얼마의 포인트를 보유하게 될까요?
```



