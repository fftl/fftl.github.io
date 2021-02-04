---
title: "java @RequestParam Long 값 null, 비었는지 확인"
categories: 
  - SpringBoot
last_modified_at: 2021-01-19T13:00:00+09:00
---

요즘 restful api를 만들고 있습니다. 작업을 하는 중에 테스트를 진행하는데 빈 값을 걸러내는 테스트 중 문제가 발생하였습니다.
나머지 String 값들은 password.isEmpty() 요런 식으로 빈 값을 확인하고 있는데 하나 받는 Long 값이 문제였습니다.

<center><img src="https://user-images.githubusercontent.com/69035612/104945285-d4653d00-59fb-11eb-8447-e37a4ae11bc7.png"></center>

위의 상태로 테스트를 진행 해봤고 아래와 같이 결과가 나왔습니다.
<center><img src="https://user-images.githubusercontent.com/69035612/104945056-7afd0e00-59fb-11eb-9a2c-ce5ac877542e.png"></center>

예상한대로 결과였다면 CSignUpEmptyValueException 이 발생했어야 했지만 발생하지 않았고 그렇다고 아래에 있는 CUserNotFoundException 이 발생한 것도 아닙니다.

예상 되는 것은 userId를 빈채로 보내었지만 null값이 아닌 무슨 값이 되어 통과를 했고 findById(userId)가 실행이 되었지만 정상적으로 값을 찾아내지 못해 발생하는 오류로 파악했습니다.

이에 관해서 구글링을 조금 해봤지만 시원하게 풀리는 답은 찾지 못했고, 차선책을 찾아 해결하게 되었습니다.

아래와 같이 Long userId 의 @RequestParam 에 defaultValue = "0" 을 주었고(userId 값은 0이 올 일이 없기에 정했습니다.)
userId == 0 으로 확인을 했습니다.
<center><img src="https://user-images.githubusercontent.com/69035612/104945774-869d0480-59fc-11eb-9493-883afed2e8b7.png"></center>

그 결과 아래처럼 CSignUpEmptyValueException 이 발생하여 예상에 맞는 결과가 나타나게 되었습니다.
<center><img src="https://user-images.githubusercontent.com/69035612/104945777-88ff5e80-59fc-11eb-8f20-8fb7285f4e43.png"></center>

