---
title: "[프로그래머스]기능개발 (java)"
categories: 
  - Algorithm
last_modified_at: 2021-02-07T13:00:00+09:00
---
=> [기능개발](https://programmers.co.kr/learn/courses/30/lessons/42586){: target="_blank"}

- 각 진행률, 스피드, 그리고 답도 다루기 쉽도록 ArrayList를 사용하여 만들어 주었습니다.
- count를 만들어 이번 차례에 100퍼센트를 넘긴 작업의 갯수를 담아주었습니다.

=> pros와 spes를 remove 해주면서 크기가 바뀌게 되는데, 그것을 고려하지 않고 pros.size() 만큼 반복하게 두어서 한참 고생했던 경험이 있습니다. 리스트의 크기를 반복크기로 설정 할 경우
크기를 잘 생각해봐야 겠다고 깨달았습니다.
```java
import java.util.*;
class Solution {
    public ArrayList<Integer> solution(int[] pro, int[] spe) {
        //각 진행률, 스피드, 그리고 답도 다루기 쉽도록 ArrayList를 사용하여 만들어 주었습니다.
        ArrayList<Integer> answer = new ArrayList<>();
        ArrayList<Integer> pros = new ArrayList<>();
        ArrayList<Integer> spes = new ArrayList<>();
        int len = pro.length;
        //값을 각각 채워줍니다.
        for(int a : pro){
            pros.add(a);
        }
        for(int a : spe){
            spes.add(a);
        }
        
        while(true){
            //이번 반복에서 완료된 작업 개수를 담아줍니다.
            int count = 0; 
            if( pros.get(0) >= 100 ){           //첫번째 작업이 진행률 100 이상일 때.
                int forLen = pros.size();       //이전에 끝난 작업은 삭제했기 때문에 크기가 매번 달라져 새로 할당해 줍니다.
                for(int i=0; i<forLen; i++){
                    if( pros.get(0) >= 100 ){
                        count++;                //완료 작업 개수 증가
                        pros.remove(0);         //완료된 작업의 진행률 삭제
                        spes.remove(0);         //완료된 작업의 속도 삭제
                    } else {
                        break;                  //진행률이 100이 안되는 작업이 나오면 바로 멈춰줍니다.
                    }
                }
                answer.add(count);              //이번에 진행된 작업을 답의 배열에 추가해줍니다.
            } else {
                for(int i=0; i<pros.size(); i++){        //첫번째 작업이 진행률 100이 안된다면,
                    pros.set(i, pros.get(i)+spes.get(i));  //모든 작업의 진행률을 각각 증가시켜줍니다.
                }
            }
            
            //만약 pros가 모두 삭제되어 크기가 0이 되었다면 while 을 종료해줍니다.
            if(pros.size() == 0){
                break;
            }
            
        }
        //끝!!
        return answer;
    }
}
```