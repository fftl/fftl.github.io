---
title: "[프로그래머스]신규 아이디 추천 (java)"
categories:
  - Algorithm
last_modified_at: 2021-02-07T13:00:00+09:00
---
=> [신규 아이디 추천](https://programmers.co.kr/learn/courses/30/lessons/72410){: target="_blank"}

- 카카오 블라인드 채용 문제였습니다. 레벨이 1인데 문제가 길어서 어려워 보이긴 했지만, 주어진 단계 조건대로 구현을 해내면 되는 생각보다 간단한 문제였습니다.

```java
import java.util.*;

class Solution {
  public String solution(String new_id) {

    //제거되어야 할 특수문자를 배열로 만들어 주었습니다.
    String[] special = {"~", "!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "=", "+", "[", "{", "]", "}",
      ":", "?", ",", "<", ">", "/"};
    String answer = new_id.toLowerCase(); //1단계 완료!! LowerCase 를 이용하면 모든문자를 소문자로 변경할 수 있습니다.

    for (String spe : special) {
      if (answer.contains(spe)) { //만약 answer가 이 특수문자를 가지고 있다면, 제거해줍니다.
        answer = answer.replaceAll("\\" + spe, "");
      }
    } //2단계 완료!!
    System.out.println("2단계: " + answer);

    while (answer.contains("..")) {
      answer = answer.replace("..", ".");
    } //3단계 완료!! 왜 replaceAll은 왜 안될까..?
    System.out.println("3단계: " + answer);

    while (true) {
      int key = 0;
      if (answer.length() != 0) {
        if (answer.startsWith(".")) {
          answer = answer.substring(1);
        } else {
          key++;
        }
        if (answer.endsWith(".")) {
          answer = answer.substring(0, answer.length() - 1);
        } else {
          key++;
        }
        if (key == 2) {
          break;
        }
      } else {
        break;
      }
    } //4단계 완료!! 시간이 너무 오래걸리는것 같긴하다..
    System.out.println("4단계: " + answer);

    if (answer.length() == 0) {
      answer = "a";
    } //5단계 완료!!
    System.out.println("5단계: " + answer);

    if (answer.length() >= 16) {             //만약 16글자 이상이면
      answer = answer.substring(0, 15); //15글자까지만 잘라준다음
      if (answer.endsWith(".")) {         //그 마지막 글자가 . 이면
        answer = answer.substring(0, answer.length() - 1); //또 제거해줍니다.
      }
    } //6단계 완료!!
    System.out.println("6단계: " + answer);

    if (answer.length() <= 2) {
      while (answer.length() < 3) {
        answer += answer.charAt(answer.length() - 1);
      }
    } //7단계 완료!!
    System.out.println("7단계: " + answer);

    return answer;
  }
}
```