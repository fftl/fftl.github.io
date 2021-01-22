---
layout: post
title: "[programmers]K번째수 (java)"
categories: SpringBoot
comments: true
---
=> [K번째수](https://programmers.co.kr/learn/courses/30/lessons/42748){: target="_blank"}

```java
import java.util.*;

class Solution {
    public int[] solution(int[] array, int[][] commands) {
        //k번째 수를 구해야 하는 횟수를 cL에 담아줍니다.
        int cL = commands.length;
        //cL의 크기를 가지는 배열을 선업합니다.
        int[] answer = new int[cL];
        
        //cL의 크기만큼 반복하는 for문을 시작합니다.
        for(int i=0; i<cL; i++){
            
            //이번에 구할 k번째 수의 정보를 가진 cmd를 만들어 줍니다.
            int[] cmd = commands[i];
            //cmd[0] 과 cmd[1]의 차를 이용하여 새로만들어질 배열의 크기를 찾아
            //배열을 선언해줍니다.
            int[] newArray = new int[cmd[1]-(cmd[0]-1)];
            //아래의 for문과 관계없이 증가할 수 있는 index 를 선언합니다.
            int index = 0;
            
            //cmd[0] 부터 cmd[1]까지의 수를 newArray에 담아줍니다.
            for(int j=cmd[0]-1; j<cmd[1]; j++){
                newArray[index]=array[j];
                index++;
            }
            
            //방금전에 생성한 newArray를 정렬해줍니다.
            Arrays.sort(newArray);
            
            //정렬해준 newArray에서 cmd[2]를 이용해 k번째 수를 찾아
            //answer에 담아줍니다.
            answer[i] = newArray[cmd[2]-1];
        }
        
        //끝!
        return answer;
    }
}
```