---
date: 2025-12-06
---


## 성능 관점에서 비교

**DB에서 처리가 유리한 경우 (대부분)**

1. **네트워크 비용 절감**

java

```java
// 방법1: Java에서 처리 - 10만 건 전송
List<Order> orders = orderRepository.findAll(); // 10만 건
List<Order> filtered = orders.stream()
    .filter(o -> o.getAmount() > 10000)
    .collect(toList()); // 결과: 100건

// 방법2: SQL에서 처리 - 100건만 전송
List<Order> filtered = orderRepository.findByAmountGreaterThan(10000); 
// SELECT * FROM orders WHERE amount > 10000
```

방법1은 DB→애플리케이션 간 10만 건을 전송하지만, 방법2는 100건만 전송합니다. 네트워크 비용이 100배 차이나요.

2. **메모리 사용량** 10만 건의 데이터를 Java 힙 메모리에 올리면 OutOfMemoryError 위험이 있습니다. DB는 이미 대용량 데이터 처리에 최적화되어 있어요.
3. **인덱스 활용**

sql

```sql
-- 인덱스를 탄다
SELECT * FROM orders WHERE user_id = 123 AND status = 'PAID';

-- vs Java 처리
List<Order> all = findAll(); // Full Scan
all.stream().filter(o -> o.getUserId() == 123 && o.getStatus().equals("PAID"))
```

DB는 인덱스를 활용해 빠르게 찾지만, Java는 전체를 메모리에 올려서 순회해야 합니다.

## 그럼 Java에서 처리하는 게 나은 경우는?

**1. 이미 메모리에 있는 데이터**

java

```java
// 한 번의 쿼리로 가져온 데이터를 여러 방식으로 가공
List<Order> orders = orderRepository.findByUserId(userId); // 100건
Map<String, List<Order>> byStatus = orders.stream()
    .collect(groupingBy(Order::getStatus));
long totalAmount = orders.stream()
    .mapToLong(Order::getAmount)
    .sum();
```

이미 가져온 데이터라면 추가 쿼리 없이 Java에서 처리하는 게 맞습니다.

**2. 복잡한 비즈니스 로직**

java

```java
// 복잡한 할인 정책 (외부 API 호출, 다양한 조건)
orders.stream()
    .map(order -> {
        double discount = discountService.calculate(order); // 외부 로직
        return order.applyDiscount(discount);
    })
```

DB로는 표현하기 어려운 복잡한 로직은 Java에서 처리해야죠.

**3. 소량 데이터 (수십~수백 건)**

java

```java
// 10건 정도라면 어디서 처리해도 큰 차이 없음
List<User> users = userRepository.findTop10ByOrderByCreatedDateDesc();
```

## 실무 가이드라인

**DB에서 처리가 유리**

- 필터링 (WHERE)
- 정렬 (ORDER BY)
- 집계 (SUM, COUNT, GROUP BY)
- 조인 (JOIN)
- 페이징
- 중복 제거 (DISTINCT)

**Java에서 처리가 유리**

- 이미 가져온 데이터의 추가 가공
- 외부 API 호출이 필요한 로직
- DB로 표현 불가능한 복잡한 비즈니스 규칙
- DTO 변환, 응답 포맷팅

## 실제 예시

**나쁜 예:**

java

```java
// 전체 주문을 가져와서 Java에서 필터링
List<Order> allOrders = orderRepository.findAll(); // 100만 건
List<OrderDTO> result = allOrders.stream()
    .filter(o -> o.getCreatedDate().isAfter(startDate))
    .filter(o -> o.getStatus() == OrderStatus.COMPLETED)
    .map(OrderDTO::from)
    .collect(toList());
```

**좋은 예:**

java

```java
// DB에서 필터링해서 가져오기
List<Order> filteredOrders = orderRepository
    .findByCreatedDateAfterAndStatus(startDate, OrderStatus.COMPLETED); // 1000건
List<OrderDTO> result = filteredOrders.stream()
    .map(OrderDTO::from) // DTO 변환은 Java에서
    .collect(toList());
```
