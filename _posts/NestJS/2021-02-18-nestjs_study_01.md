---
title: "NestJS 백엔드 학습 메모 .01"
categories: 
  - NestJS
last_modified_at: 2021-02-18T13:00:00+09:00
---
 <div><img src="https://camo.githubusercontent.com/5f54c0817521724a2deae8dedf0c280a589fd0aa9bffd7f19fa6254bb52e996a/68747470733a2f2f6e6573746a732e636f6d2f696d672f6c6f676f2d736d616c6c2e737667" width="300" height="200"></div>
[Nest.JS github](https://github.com/nestjs/nest)

node.js 를 이용한 express 기반의 framework. 굉장히 자유로운 express 보다는 구조가 정해져 있기 때문에 자유도는 적지만 더욱 안정적이고 남들이 보기도 쉬운 코딩을 할 수 있도록 도와준다.

⇒ 공부를 하다보니 springboot와 굉장히 비슷한 점이 많다고 느끼고 있습니다!?

- nestjs 는 전체가 typescript를 이용하고 있다.
- restapi를 만들 것이기 때문에 insomnia 라는 restapi 를 사용할 것이다.

- 시작하기

    ⇒ `npm i -g @nestjs/cli` 으로 netsjs 를 설치합니다.

    ⇒ `nest` 로 설치되었는지 확인, 사용 가능 한 명령어 목록이 나타나면 성공

    ⇒ 프로젝트를 시작할 디렉토리로 이동하여 `nest new` 로 프로젝트 생성

    ⇒ 이름과, 설치 방식을 선택하면 자동으로 프로젝트가 생성됩니다.

    ⇒ `npm run start:dev`  NestJS 실행! 

    ⇒ nest.js 의 구조

    ⇒ main.ts 는 무조건 존재해야 합니다. 이름도 변경되어서는 안됩니다.

    ⇒ 기본 설정 된  하는 일은 3000포트로 서버를 연결 시켜줍니다!

    ⇒ app.module.ts 에 가보면 @Module, app.controller.ts 에 가보면 @Controller 등이 있는데 이는 spring boot의 

    어노테이션과 비슷한 역할로 보입니다.

    ⇒ 생성된 구조는 service, module, controller 가 있는데 springboot와 비슷하게 이해 할 수 있을 것 같습니다.

    ⇒ nest.js는 main.ts에서 모든 걸 시작합니다.

    ⇒ AppModule 을 생성하는 등, 모듈을 생성해줍니다.

    ⇒ controller의 역할은 url을 가져오고 함수를 실행하는 역할 , //spring의 controller와 사용 방식도 유사하다. express의 라우터,

    ⇒ @Get @Controller, @Post 등을 사용.

    ⇒ service가 필요한 이유, service는 비즈니스 로직을 실행하는 역할

    ⇒ Controller를 비즈니스 로직과 구분을 짓기 위함, 각각에 역할을 확실하게 구분하기 위함

    ⇒ AppModule 에서는 우리가 하는 모든 걸 import 하게 됨


이 학습은 노마드코더 [NestJS로 API 만들기](https://nomadcoders.co/nestjs-fundamentals/lobby) 강의를 따라하며 학습했습니다.

제가 따라 작성한 github 코드는 [https://github.com/fftl/hi-nest](https://github.com/fftl/hi-nest) 입니다.