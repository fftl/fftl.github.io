---
layout: post
title: "[programmers]두 정수 사이의 합 (java)"
categories: JAVA_PS
comments: true
---
=> [두 정수 사이의 합](https://programmers.co.kr/learn/courses/30/lessons/12912){: target="_blank"}

level1 의 문제 입니다. 두 수를 주고 작은수부터 큰수까지의 모든 정수를 더하는 문제입니다.

```java
class Solution {
    public long solution(int a, int b) {
        long answer = 0;
        int big, small; //작은수 큰수를 담아줄 big small 입니다.
        //a와 b중 큰수를 big에 작은수를 small에 담아줍니다.
        if(a>b){
            big = a;
            small = b;
        } else {
            big = b;
            small =a;
        }
        //작은수 부터 큰수까지 증가하는? for문을 반복합니다.
        for(int i=small; i<=big; i++){
            answer += i; //해당 수들을 answer에 담아줍니다.
        }
        //끝!
        return answer;
    }
}
```