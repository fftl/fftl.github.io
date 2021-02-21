---
title: "[프로그래머스]문자열 내 p와 y의 개수 (java)"
categories:
  - Algorithm
last_modified_at: 2021-02-21T13:00:00+09:00
---
=> [문자열 내 p와 y의 개수](https://programmers.co.kr/learn/courses/30/lessons/12916){: target="_blank"}

- 레벨 1의 간단한 문제입니다.
- 대문자 소문자에 관계없이 p와 y의 개수를 파악한 뒤, p와 y의 개수가 같거나 두 가지 모두 0 일 때 true 아니라면 false를 반환하면 됩니다.

```java
class Solution {
    boolean solution(String s) {
        boolean answer = false;
        
        int p = 0;
        int y = 0;
        
        for(int i=0; i<s.length(); i++){ //문자열의 크기만큼 반복하는 for문 입니다.
            char a = s.charAt(i);        //각 index의 문자를 가져와 char에 담아줍니다.
            if(a == 'p' || a == 'P') p++;//이번에 가져온 a 값이 p 인지 y인지 파악해 개수를 증가시킵니다.
            if(a == 'y' || a == 'Y') y++;
        }
        
        //만약 p의 개수와 y의 개수가 같거나 두가지 모두 0이라면 true를 반환 시킵니다.
        if(p == y || (p == 0 && y ==0)){
            return true;
        }

        //아니라면 초기값인 false를 그대로 반환합니다.
        //끝!!
        return answer;
    }
}
```