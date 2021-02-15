---
title: "[프로그래머스]카펫 (java)"
categories:
  - Algorithm 
last_modified_at: 2021-02-15T13:00:00+09:00
---
=> [카펫](https://programmers.co.kr/learn/courses/30/lessons/42842){: target="_blank"}

- 개인적으로 조금 약하다고 생각하는 수학적 계산이 필요한 문제였습니다.
- 펜으로 문제를 풀 듯이 하면 어려운 문제는 아닌데, 문제에서 유추해 내어야 하는 점이 익숙치 않아서 그랬던 것 같습니다.


```java
class Solution {
  public int[] solution(int brown, int yellow) {
    int[] answer = new int[2]; //가로 세로값을 담아줄 answer 입니다.
    
    //각각의 값을 초기화 시켜줬습니다.
    int width = 0;             
    int height = 0;
    int yCount = 0;
    
    //height가 가질수 있는 최솟값인 3부터 height를 대입하여 width와 yCount를 구해보고 정답이 될 수 있는지 판단합니다.
    for (height = 3; height < (brown + 4) / 2; height++) {
      width = (brown + 4) / 2 - height;      //width를 구해줍니다.
      yCount = (width - 2) * (height - 2);   //width와 height 값이 있으면 노란격자 수를 구할 수 있습니다.
      
      //문제에서 주어진 yellow 값과 이번 height의 값으로 구해진 yellow 값이 같다면 정답입니다.
      if (yCount == yellow) {
        break;
      }
    }
    
    //구해진 값을 answer에 담아줍니다.
    answer[0] = width;
    answer[1] = height;

    //끝!!
    return answer;
  }
}
```