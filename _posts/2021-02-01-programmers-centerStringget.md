---
layout: post
title: "[programmers]가운데 글자 가져오기 (java)"
categories: JAVA_PS
comments: true
---
=> [가운데 글자 가져오기](https://programmers.co.kr/learn/courses/30/lessons/12903){: target="_blank"}

level1 의 문제 입니다. 홀수일 경우, 짝수인 경우 각각에 맞는 숫자들을 가져오면 됩니다.

```java
class Solution {
    public String solution(String s) {
        String answer = "";
        int size = s.length(); //String의 길이를 확인합니다.
        int harf = size/2;     //길이의 절반을 구해 중간 값을 찾습니다.
        
        if(size%2 != 0 ){ //홀수인지 짝수인지를 판별하여 가져옵니다.
            answer = s.substring(harf, harf+1); //홀수라면 가운데 한글자
        } else {
            answer = s.substring(harf-1, harf+1); //짝수라면 가운데 두글자 
        }
        
        //끝!
        return answer;
    }
}
```