---
title: "[프로그래머스]크레인 인형뽑기 게임 (java)"
categories: 
  - Algorithm
last_modified_at: 2021-01-17T13:00:00+09:00
---

=> [크레인 인형뽑기 게임](https://programmers.co.kr/learn/courses/30/lessons/64061){: target="_blank"}

문제를 처음 읽어볼 때 문제가 길기도 하고 막 그림까지 있으니까 어려워 보이긴 했지만 천천히 읽어보니 생각보다 쉬워서 왜 level1에 있는 문제인지 알 수 있었다.

```java
import java.util.*;

class Solution {
    public int solution(int[][] board, int[] moves) {
        int answer = 0;
        //바구니를 다루기 편하게 ArrayList로 생성했습니다.
        ArrayList<Integer> basket = new ArrayList<Integer>();
        
        //moves의 갯수만큼만 반복하면 되기 때문에 moves.length 로 실행
        for(int i=0; i<moves.length; i++){
            //크레인 위치를 num에 담았습니다. moves 값과 index의 1 차이 때문에 -1 했습니다.
            int num = moves[i]-1; 
            
            for(int j=0; j<board.length; j++){
                //만약 해당 라인에서 0이 아닌 값이 나온다면
                if(board[j][num] != 0){ 
                    //바구니에 인형을 넣어준다.
                    basket.add(board[j][num]); 
                    //인형이 있던 자리에 비었다고 표시해준다.
                    board[j][num] = 0; 
                    break;
                }
                
            }
            //바구니에 인형이 하나 들었거나 비었을 경우는 제외해줍니다.
            if(basket.size()==1 || basket.size()==0){ 
                    continue;
                    
                    //실제 비교
                } else { 
                    //바구니의 마지막 인덱스(이번에 뽑은 인형의 인덱스)
                    int size = basket.size()-1;
                    //이번에 뽑은 인형과 바구니 맨위에 있는 인형이 같을 경우
                    if(basket.get(size) == basket.get(size-1)){
                        //두개의 인형을 바구니에서 삭제해주고
                        basket.remove(size);
                        basket.remove(size-1);
                        
                        //사라진 두개의 인형을 answer에 추가해줍니다.
                        answer = answer+2;
                    } else {
                        continue;
                    }
                }

        }
        //끝!
        return answer;
    }
}

```