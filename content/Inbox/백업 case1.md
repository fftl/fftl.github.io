---
date: 2025-12-24
---

```
/* --------------------
   Case Study Questions
   --------------------*/


-- 1. 각 고객이 레스토랑에서 쓴 총 금액은 얼마입니까?
-- select m.customer_id, sum(price) as total_cost
-- from 
--   dannys_diner.members m 
--   join dannys_diner.sales s on m.customer_id = s.customer_id
--   join dannys_diner.menu mn on s.product_id = mn.product_id
-- group by m.customer_id
-- order by total_cost desc;


-- 2. 각 고객은 해당 레스토랑을 며칠 동안 방문했습니까?
-- select m.customer_id, count(*) as visit_count
-- from dannys_diner.members m join dannys_diner.sales s on m.customer_id = s.customer_id
-- group by m.customer_id
-- order by visit_count desc;


-- 3. 각 고객이 메뉴에서 가장 먼저 구매한 항목은 무엇이었습니까?
select m.customer_id, s.product_id, min(s.order_date)
from dannys_diner.members m join dannys_diner.sales s on m.customer_id = s.customer_id
group by m.customer_id, s.product_id;

  SELECT 
    s.customer_id,
    s.product_id,
    s.order_date,
    m.product_name,
    ROW_NUMBER() OVER (PARTITION BY s.customer_id ORDER BY s.order_date) AS rn
  FROM dannys_diner.sales s
  JOIN dannys_diner.menu m ON s.product_id = m.product_id;
-- 4. 메뉴에서 가장 많이 판매된 품목은 무엇이며, 전체 고객이 해당 품목을 몇 번이나 구매했습니까?
-- 5. 각 고객에게 가장 인기 있었던 제품은 무엇이었습니까?
-- 6. 회원 가입 후 고객이 가장 먼저 구매한 상품은 무엇이었습니까?
-- 7. 고객이 회원이 되기 직전에 구매한 품목은 무엇입니까?
-- 8. 회원이 되기 전에 각 회원이 구매한 품목의 총액은 얼마입니까?
-- 9. 만약 1달러를 쓸 때마다 10포인트가 적립되고, 초밥을 주문할 경우 포인트가 2배로 계산된다면, 고객 한 명당 총 몇 포인트를 적립하게 될까요?
-- 10. 고객이 프로그램에 가입한 후 첫 주 동안(가입일 포함) 모든 품목에 대해 2배의 포인트를 적립받습니다. 스시뿐만 아니라 모든 품목에 적용됩니다. 1월 말에 고객 A와 B는 각각 얼마의 포인트를 보유하게 될까요?

```