---
layout: post
title: "[programmers]주식가격 (java)"
categories: JAVA_PS
comments: true
---
=> [주식가격](https://programmers.co.kr/learn/courses/30/lessons/42584){: target="_blank"}

level2 의 문제 입니다. 설명에 있는 그대로를 구현하면 되는 문제였던 것 같습니다.

```java
class Solution {
    public int[] solution(int[] prices) {
        //정답은 prices의 크기와 같은 값을 가지니
        //같은 크기의 배열을 생성해줍니다.
        int[] answer = new int[prices.length];
        
        //prices만큼 반복하는 for문입니다.
        for(int i=0; i<prices.length; i++){
            int times = 0;             //각가격이 떨어지지 않은 시간을 담을 times 
            //가장 마지막 주식은 무조건 0이 들어오므로 
            //if를 통해 미리 확인을하여 아래 수식이 실행되지 않도록 해줍니다.
            if(i == prices.length-1){
                times = 0;
                answer[i] = times; //마지막 index에 0 값을 넣어줌
                continue;
            }
            
            //j=i+1은 어차피 i는 뒤의 수들과만 비교를 하면 되기 때문에 
            //i+1부터 시작합니다
            for(int j=i+1; j<prices.length; j++){
                //다음시간에 주식이 같거나 크다면 떨어지지 않았으므로 1초 더해줌
                if(prices[i]<=prices[j]){
                    times += 1;
                } else {
                    //다음시간에 주식이 떨어졌어도 1초는 지난것 이므로 1초
                    //더해준 뒤 이번 가격은 탐색을 멈춰주고 answer에 담아줍니다.
                    times += 1;
                    answer[i] = times;
                    break;
                }
                //주식이 끝까지 내리지 않았을 경우에는 여기에서 answer에 
                //담아줍니다.
                answer[i] = times;
            }
        }
        //끝!
        return answer;
    }
}
```