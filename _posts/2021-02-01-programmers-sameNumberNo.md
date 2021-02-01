---
layout: post
title: "[programmers]같은 숫자는 싫어 (java)"
categories: JAVA_PS
comments: true
---
=> [같은 숫자는 싫어](https://programmers.co.kr/learn/courses/30/lessons/12906){: target="_blank"}

level1 의 문제 입니다. 첫번째 수를 arrayList에 넣어주고 그수와 다음 들어갈 수를 계속해서 비교하여 답 List를 찾아내었습니다.

```java
import java.util.*;

public class Solution {
    public ArrayList<Integer> solution(int []arr) {
        int[] answer = {}; //기본으로 있엇는데 사용하지 않았다.. 지울걸..
        //답을 담아줄 arrayList를 선언하였습니다.
        ArrayList<Integer> dab = new ArrayList<Integer>();
        
        //arr 배열만큼 반복해주는 for문입니다.
        for(int i=0; i<arr.length; i++){
            //첫번째 수는 무조건 넣어줘야 하므로 if를 통해 넣었습니다.
            if(i == 0 ){
                dab.add(arr[i]);    
            } else {
                //만약 arrayList의 가장 마지막 인덱스에 있는 수와
                //다음에 들어갈 수가 같다면 넣지않고 넘어갑니다. 
                if(dab.get(dab.size()-1) == arr[i]){
                    continue; 
                } else {
                    //같은수가 아니라면 넣어줍니다.
                    dab.add(arr[i]);
                }
            }
        }
        
        //끝!
        return dab;
    }
}
```