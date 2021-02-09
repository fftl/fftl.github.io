---
title: "[프로그래머스]하샤드 수 (java)"
categories: 
  - Algorithm
last_modified_at: 2021-02-07T13:00:00+09:00
---
=> [하샤드 수](https://programmers.co.kr/learn/courses/30/lessons/12947){: target="_blank"}

- 입력 받은 수를 %10을 반복하여 각각의 자리수를 가져와 ArrayList 에 입력해줍니다.
- ArrayList에 담긴 숫자들을 모두 더한 sum을 만들어 줍니다.
- input(처음 입력 받은 수) % sum(각 자리수의 합) 의 값으로 true,false를 가려냅니다.

```java
import java.util.*;

class Solution {
    public boolean solution(int x) {
        ArrayList<Integer> numbers = new ArrayList<>();
        int input = x;
        int sum = 0;
        
        //입력 받은 수를 %10을 반복하여 각각의 자리수를 가져와 ArrayList 에 입력해줍니다.
        while(x>0){
            numbers.add(x%10);
            x = x/10;
        }
        
        //ArrayList에 담긴 숫자들을 모두 더한 sum을 만들어 줍니다.
        for(int i=0; i<numbers.size(); i++){
            sum += numbers.get(i);
        }
        
        //input(처음 입력 받은 수) % sum(각 자리수의 합) 의 값으로 true,false를 가려냅니다.
        if(input%sum == 0) return true;
        
        //끝!!
        return false;
    }
}
```