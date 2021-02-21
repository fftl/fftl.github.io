---
title: "[프로그래머스]수박수박수박수박수박수? (java)"
categories:
  - Algorithm
last_modified_at: 2021-02-21T13:00:00+09:00
---
=> [수박수박수박수박수박수?](https://programmers.co.kr/learn/courses/30/lessons/12922){: target="_blank"}

- 레벨 1의 간단한 문제입니다.
- 입력 숫자의 갯수만큼 수, 박을 입력한 문자열을 반환하는 문제입니다.

```java
class Solution {
    public String solution(int n) {
        
        String answer = "";
        
        for(int i=0; i<n; i++){ //입력받은 숫자만큼 반복하는 for문 입니다.
            
            if(i%2==0){
                //0부터 시작하여 짝수일 경우 "수" 홀수일 경우 "박"을 answer에 이어 붙여 줍니다.
                answer = answer + "수"; 
            } else {
                answer = answer + "박";
            }
        }
        
        //끝!!
        return answer;
    }
}
```