---
title: "[프로그래머스]2016년 (java)"
categories: 
  - Algorithm
last_modified_at: 2021-01-22T13:00:00+09:00
---
=> [2016년](https://programmers.co.kr/learn/courses/30/lessons/12901){: target="_blank"}

```java
class Solution {
    public String solution(int a, int b) {
        String answer = "";
        //날짜들의 이름을 담을 배열 days 입니다.
        String[] days = {"FRI","SAT","SUN","MON","TUE","WED","THU"};
        //각 월들의 일수를 담은 배열 lastDay 입니다.
        int[] lastDay = {31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31};
            
        //저는 1월 1일으로부터 몇일이 지났나를 구하여 계산을 할 것이기 때문에
        //일수를 담아줄 dayNum을 선언해줍니다.
        int dayNum = 0;
        //입력받은 월인 a를 이용해 지난 월의 일수들을 모두 합해줍니다.
        for(int i=1; i<a; i++){
            dayNum = dayNum + lastDay[i-1];
        }
        
        //입력받은 일인 b를 이용해 이번달의 일수도 합해줍니다.
        //1월 1일과의 차이 임을 표현하기 위해 -1 을 더 해줬습니다.
        dayNum = dayNum + b - 1;
        
        //차수 인 dayNum의 7로 나눈 나머지 수를 구해줍니다. 
        int namuji = dayNum%7;
        
        //나머지를 이용해 days에서 요일을 구해 answr에 넣어줍니다.
        answer = days[namuji];
        
        //위의 과정들의 예시입니다.
        //ex) 2월 15일 => 31+15=46 -> 46-1=45 -> 45%7=3 -> days[3] == "MON"
        
        return answer;
    }
}
```