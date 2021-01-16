---
layout: post
title: "JPA 영속성 컨텍스트란?"
categories: SpringBoot
comments: true
---

# 영속성 컨텍스트

### 엔티티 매니저 팩토리와 엔티티 매니저

- 엔티티 매니저 팩토리는 고객의 요청이 올때마다 엔티티매니저를 생성한다. 그러면 이 엔티티매니저는 내부적으로 데이터베이스 커넥션을 사용하여 디비를 사용하게 됩니다.

### 영속성 컨텍스트는 무엇인가?

- JPA를 이해하는데 가장 중요한 용어, 엔티티를 영구 저장하는 환경 이라는 뜻
- EntityManager.persist(entity); 는 DB에 저장하는 것이 아니라 entity를 영속화 한다는 뜻. 영속성 컨텍스트에 넣는다.
- 영속성 컨텍스트는 논리적인 개념, 눈에 보이지 않는다. 엔티티 매니저를 통해서 영속성 컨텍스트에 접근한다.
- EntityManager 를 생성하면 영속성 컨텍스트(PersistenceContext)가 생성이 된다.

- **엔티티의 생명주기**
    - 비영속, 영속성 컨텍스트와 전혀 관계가 없는 새로운 상태
    - 영속, 영속성 컨텍스트에 관리되는 상태
    - 준영속, 영속성 컨텍스트에 저장되었다가 분리된 상태
    - 삭제, 삭제된 상태

- **비영속**
    - Member member = new Member(); 를 이용한 영속성과 관계 없음.
    - em.persist(member); 가 실행될 경우 영속상태가 됩니다. em의 영속성 컨텍스트에 의해 관리가 됩니다. 이 상태가 DB에 저장된 상태는 아님. ⇒ 이후 commit(); 이 실행되면 그때 영속성 컨텍스트에 있는 애가 디비에 날라가게 됩니다.
    - em.detach(member); ⇒ (준영속) 영속성 컨텍스트에 관리되던 member를 지우는 것
    - em.remove(member); ⇒ 실제 DB삭제를 요청하는 상태

- **영속성 컨텍스트의 이점**
    - 1차 캐시, 동일성(identity)보장
    - 트랜잭션을 지원하는 쓰기 지연(transactional write-behind)
    - 변경 감지(Dirty Checking), 지연로딩(Lazy Loding)

- **엔티티 조회, 1차 캐시**
    - 영속성 컨텍스트는 내부에 1차 캐시를 가지고 있다. 이 1차 캐시를 영속성 컨텍스트라고 생각해도 됨
    - em.find(Member.class, 100L) 을 실행 했을 때, 만약 1차 캐시에 이 정보가 이미 들어 있다면 select 문이 실행이 되지 않아도 내용을 출력할 수 있다. 만약 1차 캐시에 정보가 없을 때에 DB에 select문을 실행하게 된다.
    - Member member1 = em.find(Member.class, 100L)

        Member member2 = em.find(Member.class, 100L)

        member1 == member2 는 true 값이 나온다. java collection 처럼 영속 엔티티의 동일성을 보장해줍니다. 1차 캐시에서 같은 값을 가져오는 것 이기 때문에 . 같은 트랜잭션 안에서 실행된다고 보면 됨

- **트랜잭션을 지원하는 쓰기 지연**

```java
EntityManager em = emf.createEntityManager();
EntityTransaction transaction = em.getTransaction();
//엔티티 매니저는 데이터 변경시 트랜잭션을 시작해야 하낟.
transaction.begin();

em.persist(memberA);
em.persist(memberB)
//여기까지는 Insert sql이 디비에 보내지지 않는다.
```

⇒ em.persist(memberA); 가 실행되면 1차캐시에 memberA가 입력되게 됩니다.

⇒ 동시에 Insert sql을 생성해서 쓰기지연 sql 저장소에 쌓이게 됩니다.

⇒ 그리고 em.persist(memberB); 가 실행돼도 동일하게 1차 캐시에 memberB 에 입력되며 Insert sql이 생성되어 쓰기지연 sql 저장소에 쌓입니다.

⇒ 이것은 commit이 되는 순간 쌓여있던 sql이 db에 저장이 되게 됩니다. 이런 방식으로 한번에 모았다가 보낼 수 있습니다.

- **엔티티 수정( 변경 감지, update )**

```java
Member member = em.find(Member.class, 105L);
member.setName("leedongmin"); //여기까지만 해도 update sql이 실행이 됩니다. ( 엔티티를 가져와서 값을 변경해준다. )

//em.persist(member); 수정을 하기 위함이라면 persist를 실행하지 않아도 된다( 사용하지 말라고 한다. )
```

⇒ 이렇게 동작하는 이유는 commit이 실행되면 flush()가 실행됨, 

⇒ 엔티티와 스냅샷 비교 ( 최초로 1차 캐시에 그 값이 들어온 상태를 저장해서(스냅샷) 그 뒤에 커밋할 때의 시점의 상태와 비교를 시작합니다. )

⇒ 만약 비교 후 변경이 되었을 때 쓰기지연 SQL저장소에 update sql도 저장되어 실행되게 됩니다.

⇒ em.remove(memberA) //삭제 이것도 commit 시점에 실행이 되게 됩니다.

- **플러시**
    - **영속성 컨텍스트의 변경 내용을 데이터베이스에 반영( 쌓여있던 sql 을 실제 DB에 보내줌 )**

        ⇒ 변경감지 발생

        ⇒ 수정된 엔티티 쓰기지연 SQL저장소에 등록 ( update문 등록 )

        ⇒ 쓰기지연 sql저장소의 쿼리를 데이터베이스에 전송

    - **영속성 컨텍스트를 플러시하는 방법 ( 직접 작성하는 일이 많지는 않을 것, 하지만 알아는 놓자, 테스트에 필요할지도 )**

        ⇒ em.flush() - 직접호출

        ⇒ 트랜잭션 커밋 - 플러시 자동 호출

        ⇒ JPQL 쿼리 실행 - 플러시 자동 호출

    ```java
    Member member = new Member(200L, "member200");
    em.persist(member);

    em.flush(); //여기서 먼저 insert sql이 실행이 됩니다. 강제로 DB에 저장을 해버림
    						//flush를 한다고 1차캐시의 데이터가 지워지는 것이 아닙니다. 쓰기지연 SQL저장소에 있던 쌓여있던 sql들만 DB에 날리게 됨

    tx.commit();
    ```

    - JPQL 쿼리 실행시 플러시가 자동으로 호출되는 이유

    ```java
    em.persist(memberA);
    em.persist(memberB);
    em.persist(memberC);

    //중간에 JPQL 실행
    query = em.createQuery("select m from Member m", Member.class);
    //JPQL이 실행되면 그동안 쌓여있던 SQL저장소 sql들이 DB에 날아간뒤 실행 
    List<Member> members = query.getResultList();
    ```

    - FlushModeType.AUTO - 커밋이나 쿼리를 실행할 때 플러시 (기본값)
    - FlushModeType.COMMIT - 커밋할 때만 플러시 ( 가끔 유용하게 사용될 수도 있다. 가급적 손대지 않아도 됨 )

플러시는!

- 영속성 컨텍스트를 비우지 않음
- 영속성 컨텍스트의 변경내용을 데이터베이스에 동기화
- 트랜잭션이라는 작업 단위가 중요 → 커밋 직전에만 동기화 하면 됨

준영속 상태

- 영속 → 준영속
- 영속 상태의 엔티티가 영속성 컨텍스트에서 분리(detached)
- 영속성 컨텍스트가 제공하는 기능을 사용 못함

( 여기서 영속성 상태는 persist나 find 등을 통해 1차 캐시에 들어와있는 엔티티의 상태 ) 

- 준영속 상태로 만드는 방법
    ⇒ em.detach(entity) - 특정 엔티티만 준영속 상태로 전환
    ⇒ em.clear() - 영속성 컨텍스트를 완전히 초기화
    ⇒ em.close() - 영속성 컨텍스트를 종료 (당연히 완전 종료)

```java
Member member = em.find(Member.class, 150L); //이렇게 가져온 member는 상태는 영속상태가 됨
member.setName("AAAA");

em.detach(member); //이렇게 하면 member만 준영속 상태가 됨 (특정할 수 있다)
em.clear(); //이걸 실행하면 영속성 컨텍스트의 모든 내용을 지워버림

tx.commit();//이걸 실행해도 setName을 해서 준비중이던 update가 무효화가 됩니다.
```

[https://www.inflearn.com/course/ORM-JPA-Basic/dashboard](https://www.inflearn.com/course/ORM-JPA-Basic/dashboard)

이 글은 inflearn에서 김영한님의 자바 ORM 표준 JPA 프로그래밍 - 기본편 강의를 공부하며 기록한 내용입니다.