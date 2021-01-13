---
layout: post
title: "Spring Boot RestApi response 방식에 대한 고민 (ResponseEntity 간단사용)"
categories: SpringBoot
---

요즘 친구들과 미니 프로젝트를 진행중 입니다. 저는 SpringBoot, SpringSecurity, Jwt를 이용한 rest api를 만들고 있습니다.

많은 기능을 가지고 있는 것은 아니지만 Spring Security와 Jwt를 이용한 인증을 사용해보기위해 꽤 많은 시간을 삽질하였던 것 같습니다. 물론 그렇다고 완벽하게
이해한 것도 아닙니다. (아직은 아래 블로그의 소스 가져다가 조금씩 변형해서 사용하는 정도)

(정말 많이 참고하고 공부가 된 블로그, 너무 감사하구있습니다.)
<a href="https://daddyprogrammer.org/post/636/springboot2-springsecurity-authentication-authorization/">https://daddyprogrammer.org/post/636/springboot2-springsecurity-authentication-authorization/</a>

암튼 어찌저찌 회원가입, 로그인, 인증되는 부분을 만들었는데, 문제가 생기는 부분이 어떠한 방식으로 Exception 처리와 return(결과) 을 할 것인가 였습니다.

위의 자료에서는 ResponseService를 만들어 단순 성공,실패일 경우, 단일건 조회일 경우, 다중건 조회 일 경우의 메소드를 각각 만들어 놓고 사용하고 있었습니다.
그래서 객체 조회가 있을 시에 (T data) 보여줄 데이터를 일괄적으로 관리하여 편하게 사용할 수 있도록 되어 있습니다.
<center><img src="https://user-images.githubusercontent.com/69035612/104259519-ece9ca80-54c4-11eb-8ff6-40257b5c3b3c.png" width="80%"></center>

결과를 보면 data에 담겨서 한번에 나타납니다.
<center><img src="https://user-images.githubusercontent.com/69035612/104261591-39370980-54c9-11eb-91f0-ec40f2e9d2a4.png" ></center>

조금의 시간을 들여 이해를 하는데 성공하였으나, 저와 client 작업을 하는 친구와 맞춰놓은 방식은 아래 결과처럼 한번에? 쭉 나오는 방식 이었습니다.
<center><img src="https://user-images.githubusercontent.com/69035612/104261970-f6c1fc80-54c9-11eb-9c11-0981b12c4dc1.png"></center>

물론 위의 방식이 더 입력 방식도 효율적이고 받을 때도 편할 수 있겠지만, 일단 협의 해놓은 대로 구현을 해보고 싶었습니다. 공부도 되고 나중에 다시 바꿔도 되니까요.

그래서 검색을 통해 ResponseEntity 라는 기능을 찾았습니다. 이 ResponseEntity는 반환타입이 다양한 restapi에서 상태코드와 응답메시지 등을 간편하게 담아 전달할 수 있는 기능정도로 알면 될 것 같습니다.
ResponseEntity도 조금만 더 코딩을 잘한다면 위의 방법 못지않게 편하고 효율적으로 할 수 있겠지만, 일단 맞춰놓은 회의 날짜까지 완성해야 하기에 원초적으로 사용해 보았습니다.
<center><img src="https://user-images.githubusercontent.com/69035612/104262368-d181be00-54ca-11eb-8757-5e2a56194f60.png"></center>
<center><img src="https://user-images.githubusercontent.com/69035612/104262166-6932dc80-54ca-11eb-959f-0f63d74cfdcd.png"></center>

이렇게 사용하여 조금전의 이미지 처럼 한번에 쭉? 나오는 형식으로 결과를 보낼 수 있었습니다.

혼자서 공부할 때와는 다르게 함께 미니 프로젝트를 진행하니 책임감을 가지고 더 많이 공부를 하게 되는 것 같아 긍정적인 기분입니다.


