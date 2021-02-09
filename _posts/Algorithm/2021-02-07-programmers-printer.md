---
title: "[프로그래머스]프린터 (java)"
categories: 
  - Algorithm
last_modified_at: 2021-02-07T13:00:00+09:00
---
=> [프린터](https://programmers.co.kr/learn/courses/30/lessons/42587){: target="_blank"}

- 내가 요청한 문서의 인덱스 target을 선언 해주고, 인쇄 대기목록은 다루기 쉽게 ArrayList로 만들어 줍니다. 
- target이 가장 앞일 때, 아닐 때를 구분하여 알고리즘이 달라집니다.
- 맨 앞의 인쇄물 보다 우선순위가 높은 것이 뒤에 없다면 remove 해버리고, 아니라면 remove 한뒤 맨뒤에 추가 해주는 방식으로 계속 반복하여 답을 찾아내는 방식입니다.

=> 다만 문제의 분류가 스택/큐 로 되어있는데, 스택이나 큐를 많이 사용해보지 않아서 스택이나 큐를 사용해서 풀었을 때 더 효율적일지 아직은 모르겠습니다.

```java
import java.util.*;

class Solution {
    public int solution(int[] pri, int loc) {
        //변수 할당!!
        int answer = 1;
        int target = loc;
        int len = pri.length;
        ArrayList<Integer> arr = new ArrayList<Integer>();
        
        for(int a : pri){
            arr.add(a);
        }
        
        while(true){
            //타겟이 맨 첫번째 숫자라면(이번에 인쇄될 기회가 옴)
            if(target == 0){
                boolean key = false;
                for(int i=1; i<arr.size(); i++){
                    if(arr.get(0) < arr.get(i)){ //만약 뒤의 순서에 우선순위가 높은 것이 있다면..
                        key = true;
                    }
                }
                if(key){//우선순위에 밀려 뽑히지 못함.
                    target = arr.size()-1; //타겟의 인덱스가 맨 뒤로 감을 표현
                    arr.add(arr.get(0)); //첫번째 수를 맨 뒤에 추가
                    arr.remove(0); //첫번째 수를 삭제
                } else { //드디어 뽑힘!
                    break;
                }
            } else { //타겟의 순서가 아니라면
                boolean key = false;
                for(int i=1; i<arr.size(); i++){
                    if(arr.get(0) < arr.get(i)){ //만약 뒤의 순서에 우선순위가 높은 것이 있다면..
                        key = true;
                    }
                }
                if(key){                 //우선순위에 밀려 뽑히지 못함.
                    target -= 1;         //타겟의 인덱스가 하나 앞으로 옴,
                    arr.add(arr.get(0)); //첫번째 수를 맨 뒤에 추가
                    arr.remove(0);       //첫번째 수를 삭제
                } else {                 //프린트가 됨
                    target -= 1;         //타겟의 인덱스가 하나 앞으로 옴,
                    arr.remove(0);
                    answer++;
                }
            }
            
        }
        return answer;
    }
}
```