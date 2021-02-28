---
title: "NestJS 백엔드 학습 메모 .04"
categories: 
  - NestJS
last_modified_at: 2021-02-28T13:00:00+09:00
---

- nestJS 구조 변경

    ⇒ 현재에는 app.module에 MoviesController, MoviesService 가 입력되어 있다.

    ⇒ 그러나 nestJS는 원래 여러 개의 모듈을 가지는 프레임워크이며, 각 모듈에 맞는 Controller, Service를 알맞게 넣어주도록 구조를 정리해 줄 생각이다.

    (ex: app.module 에는 AppController, AppService, movie.module 에는 MoviesController, MoviesService 이런 형식)

    ⇒ `nest generate module` (nest g mo 로도 가능합니다.) 으로 새로운 모듈을 생성해 줍니다.

    ⇒ 모듈 이름도 입력을 해주고 나면 

    app.module.ts

    ```jsx
    import { Module } from '@nestjs/common';
    import { MoviesController } from './movies/movies.controller';
    import { MoviesService } from './movies/movies.service';
    import { MoviesModule } from './movies/movies.module';

    @Module({
      imports: [MoviesModule],
      controllers: [MoviesController],
      providers: [MoviesService],
    })
    export class AppModule {}
    ```

    app.module에 MoviesModule이 추가 되었음을 볼 수 있습니다. 이제 app.module 의 controller와 providers의 movies 들을 정리해줍니다.

    ⇒ 정리 결과

    app.module.ts

    ```jsx
    import { Module } from '@nestjs/common';
    import { MoviesModule } from './movies/movies.module';

    @Module({
      imports: [MoviesModule],
      controllers: [],
      providers: [],
    })
    export class AppModule {}
    ```

    movies.module.ts

    ```jsx
    import { Module } from '@nestjs/common';
    import { MoviesController } from './movies.controller';
    import { MoviesService } from './movies.service';

    @Module({
        controllers: [MoviesController],
        providers: [MoviesService],
    })
    export class MoviesModule {}
    ```

    ⇒ 이런 방식으로 app.module은 루트 모듈의 역할을 하게 됩니다. 이렇게 app 모듈을 통해서 연결하는 방식으로 구조를 한다면 app 모듈 하나로 모든 걸 생성할 수 있게 됩니다.

    ⇒ 이제 비어버린 app.module의 controller와 providers에 들어갈 것을 만들어 줍니다.

    `nest g co` 으로 새로운 컨트롤러를 생성해 줍니다. app.module에 들어갈 것이기 때문에 이름은 app 이라고 생성했습니다. 그리고 루트 controller의 역할을 하도록 해 놓았습니다.

    app.controllr.ts 

    ```jsx
    import { Controller, Get } from '@nestjs/common';

    @Controller('')
    export class AppController {
        @Get()
        home() {
            return 'Welcom to my Movie API';
        }
    }
    ```

- Injection 주입 springboot의 생성자 주입과 비슷한 기능 인 것 같습니다. ( 조금 이해하기 위해 공부 해야 합니다. )

    ⇒ 각각의 module 에서 주입을 해주고 있어 클래스를 불러오는 것 만으로 사용이 가능하게 됩니다..?

    ```tsx
    ...
    @Module({
        controllers: [MoviesController],
        providers: [MoviesService],
    })
    ...
    ```

- NestJS는 express 위에서 작동하고 있기 때문에 필요한 경우 express의 몇 기능을 사용할 수 있습니다.

    movies.controller.ts

    ```tsx
    ...
    @Get()//비워놓으면 라우터를 의미합니다. ('/')
        getAll(@Req() Req, @Res() res): Movie[]{
            return this.moviesService.getAll(); //위에서 constructor 한 Service 덕분에 getAll()을 사용할 수 있습니다.
        }
    ...
    ```

    ⇒ 위와 같이 사용이 가능합니다. 다만 권장하지는 않습니다. NestJS 는 express, Fastify 프레임워크 선택해서? 사용이 가능한데, 맞지 않을 수 있기 때문?