---
title: "NestJS 백엔드 학습 메모 .03"
categories: 
  - NestJS
last_modified_at: 2021-02-28T13:00:00+09:00
---

- nest.js 의 exception은 springboot 처럼 기본적으로 제공되는 exception이 있습니다.

```jsx
getOne(id: string): Movie {
        // return this.movies.find(movie => movie.id === parseInt(id));
        const movie = this.movies.find(movie => movie.id === +id); //이렇게도 int로 변경할 수 있다.
        if(!movie){
            throw new NotFoundException(`Movie with ID: ${id} not found.`); //nestjs에서 제공되는 exception
        }
        
        return movie;
    }
```

- Validation(Data의 유효성 검사)

    ⇒ nestJS에서도 Dto 를 만들어서 사용합니다. 

    create-movie.dto.ts

    ```jsx
    export class CreateMovieDTO{
        //받아야 하는 항목들을 입력해 줍니다.
        //readonly를 적어 읽기 전용임을 선언해줍니다.
        readonly title: string;
        readonly year: number;
        readonly genres: string[];
    }
    ```

    ⇒ 전달 받는 데이터 들을 Dto 타입으로 변경해서 전달 받습니다.

    movies.service.ts

    ```jsx
    ...
    create(movieData: CreateMovieDTO){
            this.movies.push({
                id: this.movies.length + 1,
                ...movieData,
            })
        }
    ...
    ```

    ⇒ 타입만 변경한다고 해서 유효성 검사가 완료 되는 것은 아닙니다. main.ts 에 파이프 라는 것을 만듭니다.

    ⇒ validation 을 적용하기 위해 패키지를 다운로드 받습니다. `npm i class-validator class-transformer`

    ⇒그리고 create-movie.dto.ts에 코드를 추가합니다.

    ```jsx
    import { IsString, IsNumber } from 'class-validator';

    export class CreateMovieDTO{

        //받아야 하는 항목들을 입력해 줍니다.
        //readonly를 적어 읽기 전용임을 선언해줍니다.
        @IsString()
        readonly title: string;

        @IsNumber()
        readonly year: number;

        @IsString({each: true})
        readonly genres: string[];
    }
    ```

    main.ts

    ```jsx
    ...
    async function bootstrap() {
      const app = await NestFactory.create(AppModule);
      app.useGlobalPipes(new ValidationPipe()); //추가되었습니다.
      await app.listen(3000);
    }
    ...
    ```

    ⇒ update를 위한 Dto도 생성해줍니다.

    update-movie.dto.ts

    ```jsx
    export class UpdateMovieDTO{

        //받아야 하는 항목들을 입력해 줍니다.
        //readonly를 적어 읽기 전용임을 선언해줍니다.
        @IsString()
        readonly title?: string;        // updateDto에서는 필수값이 아니기 때문에 ?를 붙여줍니다.

        @IsNumber()
        readonly year?: number;

        @IsString({each: true})
        readonly genres?: string[];
    }
    ```

    ⇒위 처럼 해도 되지만, nestJS 에서 제공하는 부분 타입을 사용할 수도 있습니다. 

    ⇒ `npm i @nestjs/mapped-types` 를 설치해줍니다. mapped-types는 타입을 변환 시키고 사용할 수 있게 하는 패키지 입니다.

    update-movie.dto.ts

    ```jsx
    import { PartialType } from '@nestjs/mapped-types';
    import { IsString, IsNumber } from 'class-validator';
    import { CreateMovieDTO } from './create-movie.dto';

    export class UpdateMovieDTO extends PartialType(CreateMovieDTO){ //PartialType는 기본타입이 필요합니다. (참조할 타입?)

    }
    ```

    ⇒ mapped-types 를 사용하면 이렇게 만 표현해도 위와 같은 동작을 확인할 수 있습니다.