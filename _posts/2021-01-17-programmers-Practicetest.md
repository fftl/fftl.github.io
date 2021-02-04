---
title: "[프로그래머스]모의고사 (java)"
categories: 
  - Algorithm
last_modified_at: 2021-01-17T13:00:00+09:00
---
=> [모의고사](https://programmers.co.kr/learn/courses/30/lessons/42840){: target="_blank"}

프로그래머스 level1의 모의고사 문제입니다. 생각보다 쉬울줄 알았는데, 조금 해맸습니다. 각각 정답의 갯수를 구했는데, 비교해서 1, 2, 3을 넣는거에서 왜 그리 해맸는지.. 굉장히 단순무식하게 풀었습니다.

다른 분들의 풀이를 보니 개선할 점이 많이 보여 참고하여 다시 풀어봐야할 것 같습니다.
```java
import java.util.*;

class Solution {
    public ArrayList<Integer> solution(int[] answers) {
        //각 학생의 찍기 방식을 만들어 줍니다.
        int[] student1 = {1,2,3,4,5};
        int[] student2 = {2,1,2,3,2,4,2,5};
        int[] student3 = {3,3,1,1,2,2,4,4,5,5};
        
        //문제의 index 역할을 해줄 num1 입니다.
        int num1 = 0;
        //정답의 갯수를 담아줄 numT1 입니다.
        int numT1 = 0;
        //index 가 answer의 개수를 넘으면 종료 라고 했으나 거의 밑의 break가 실행되어 멈춥니다. 
        while(num1<answers.length){
            //학생 1의 찍기방식을 반복해줍니다.
            for(int i=0; i<student1.length; i++){
                //학생의 찍기와 문제의 답을 비교해서 정답일 경우 numT1을 증가시킵니다.
                if(student1[i] == answers[num1]){
                    numT1++;
                }
                //문제의 인덱스는 무조건 증가합니다.
                num1++;
                //위의 while 에서 조건을 걸어 놓았으나 for문이 끝나기 전까지 num1 이 계속 증가하기 때문에
                //여기서도 num1의 값을 체크해주어 적절히 멈춰줍니다.
                if(num1 >= answers.length){
                    break;
                }
            }
        }
        
        //num1 ~ 와 내용 동일
        int num2 = 0;
        int numT2 = 0;
        while(num2<answers.length){
            for(int i=0; i<student2.length; i++){
                if(student2[i] == answers[num2]){
                    numT2++;
                }
                num2++;
                if(num2 >= answers.length){
                    break;
                }
                
            }
        }
        
        //num1 ~ 와 내용 동일
        int num3 = 0;
        int numT3 = 0;
        while(num3<answers.length){
            for(int i=0; i<student3.length; i++){
                if(student3[i] == answers[num3]){
                    numT3++;
                }
                num3++;
                if(num3 >= answers.length){
                    break;
                }
            }
        }
        //----------------------------------------------각각 채점이 끝났습니다.
        
        //점수중의 최댓값을 구해 max에 담아줍니다.
        int max = numT1;
        if(max<numT2){
            max = numT2; 
        }
        if(max<numT3){
            max = numT3;
        }
        
        //입력?을 쉽게 하기위해 ArrayList를 생성했습니다.
        ArrayList<Integer> answer = new ArrayList<Integer>();
        
        //각 점수들과 최대값을 비교해 학생의 번호를 answer에 담아주었습니다.
        if(numT1 == max){answer.add(1);}
        if(numT2 == max){answer.add(2);}
        if(numT3 == max){answer.add(3);}

        //끝!
        return answer;
    }
}
```