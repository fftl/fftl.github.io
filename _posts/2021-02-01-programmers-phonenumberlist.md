---
layout: post
title: "[programmers]전화번호 목록 (java)"
categories: JAVA_PS
comments: true
---
=> [전화번호 목록](https://programmers.co.kr/learn/courses/30/lessons/42577){: target="_blank"}

level2 의 문제 입니다. 조금 어려워서 검색을 하였습니다. startsWith라는 기능이 있다는 것을 알게 되었고 이를 사용하면 쉽게 풀 수 있는 문제였습니다.

```java
class Solution {
    public boolean solution(String[] phone_book) {
        //정답의 형태인 boolean 값 입니다.
        boolean answer = true;
        
        //phone_book의 길이를 담아주었습니다.
        int len = phone_book.length;
        
        //phone_book만큼 반복하는 for문 입니다.
        for(int i=0; i<len; i++){
            //리스트의 모든 값을 서로 비교하기 위해 다시 반복해줍니다.
            for(int j=0; j<len; j++){
                //phone_book의 인덱스가 같다면 값이 같으므로 비교 의미가 없으니 
                //그냥 넘어가 줍니다.
                if(i == j){
                    continue;
                }
                //만약 비교 기준의 숫자의 길이가 더 작다면 
                // 이번 숫자의 앞부분과 비교를 해봅니다.
                if(phone_book[j].length() > phone_book[i].length()){
                    //startsWith를 이용해 phone_book[j]의 
                    //시작부분이 phone_book[i]로 시작한다면(접두어라면)
                    //true를 아니라면 false를 리턴합니다.
                    if(phone_book[j].startsWith(phone_book[i])){
                        //접두어 이므로 false리턴
                        return false;
                    }
                }
            }
        }
        //접두어가 되는 경우가 없다면 true리턴
        return answer;
    }
}
```