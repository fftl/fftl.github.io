# 조인
### NL(Nested Loops) 조인
조인의 기본인 NL조인으로 인덱스를 이용한 조인이기 때문에, 인덱스 부분을 알고있다면 이해하기 어렵지 않다.
```
<C, JAVA>
for(i=0; i<100; i++){ --outer loop
	for(i=0; i<100; i++){ --inner loop
		run..
	}
}

<PL/SQL>
for outer in 1..100 loop
	for inner in 1..100 loop
		dbms_output.put_line(outer || ':' || inner)
	end loop;
end loop;
```
NL조인은 위의 중첩 루프문과 같은 수행구조를 사용한다. 위의 예를 실제 sql로 풀어보면 다음과 같이 데이터에 액세스 하는 것을 예상할 수 있다.
```
begin
	for outer in (select 사원번호, 사원명 from 사원 where 입사일자 >= '19960101')
	loop -- outer loop
		for inner in (select 고객명, 전화번호 from 고객 where 관리사원번호 >= outer.사원번호)
		loop -- inner loop
			dbms_output.put_line(outer.사원명 || ':' || inner.고객명 || ':' || inner.전화번호);
		end loop;
	end loop;
end
```

일반적으로 NL조인은 Outer와 Inner 양쪽모두 index를 이용한다. Outer 쪽 테이블은 사이즈가 크지 않다면 인덱스를 이용하지 않을 수 있다. Table full scan을 하더라도 한번만 확인하면 되기 때문이다. 하지만 Inner쪽 테이블의 경우 인덱스를 해야한다. 그렇지 않으면 outer의 size X inner의 size 번을 table full scan을 반복하기 때문이다.

결국 NL조인은 인덱스를 이용한 조인 방식이라고 할 수 있다.

