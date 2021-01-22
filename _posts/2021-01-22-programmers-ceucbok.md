---
layout: post
title: "[programmers]체육복 (java)"
categories: SpringBoot
comments: true
---
=> [체육복](https://programmers.co.kr/learn/courses/30/lessons/42862){: target="_blank"}

```java
class Solution {
    public int solution(int n, int[] lost, int[] reserve) {
        //잃어버린 학생의 수
        int lC = lost.length;
        //여분의 체육복을 가진 학생의 수
        int rC = reserve.length;
        //전체 학생 수 - 잃어버린 학생의 수를 이용해 현재 학생의 수를 구해놓았다.
        int nowStd = n-lC;
        
        //잃어버린 학생의 수만큼 반복한다.
        for(int i=0; i<lC; i++){
            //잃어버린 학생의 수와 여분의 학생의 수를 비교한다.
            for(int j=0; j<rC; j++){
                //만약 여벌의 체육복을 가져왔지만 체육복을 도난당해서
                //다른학생에게 빌려줄 수 없는 학생을 먼저 찾아냅니다.
                if(lost[i] == reserve[j]){
                    //빌려주고, 빌려받은 학생은 존재할 수 없는 수를 이용하여
                    //예외처리를 해줍니다.
                    lost[i] = -1;
                    reserve[j] = 100;
                    //현재 학생수를 증가시켜줍니다.
                    nowStd++;
                    break;
                }
            }
        }
        
        //위와 마찬가지로 다시 반복합니다.
        for(int i=0; i<lC; i++){
            for(int j=0; j<rC; j++){
                //이번에는 바로 앞번호, 뒷번호 즉 빌려줄수 있는 학생을 찾아냅니다.
                if(lost[i] == reserve[j]+1||lost[i] == reserve[j]-1){
                    //빌려주는게 가능할 경우, 빌려준 학생과 빌려받은 학생을
                    //존재할 수 없는 수를 이용해 예외처리 해줍니다.
                    lost[i] = -1;
                    reserve[j]=100;
                    //현재 학생수를 증가시켜줍니다.
                    nowStd++;
                    break;
                }
            }
        }
        //끝!
        return nowStd;
    }
}
```