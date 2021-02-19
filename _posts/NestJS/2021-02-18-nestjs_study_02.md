---
title: "Nest.js 백엔드 학습 메모 .02"
categories: 
  - NestJS
last_modified_at: 2021-02-18T13:00:00+09:00
---
 <div><img src="https://camo.githubusercontent.com/5f54c0817521724a2deae8dedf0c280a589fd0aa9bffd7f19fa6254bb52e996a/68747470733a2f2f6e6573746a732e636f6d2f696d672f6c6f676f2d736d616c6c2e737667" width="300" height="200"></div>
[Nest.JS github](https://github.com/nestjs/nest)

- 처음부터 만들어보기

⇒ NestJS는 유용한 cli를 많이 가지고 있어 commend 로 거의 모든 것을 생성할 수 있다. ( generate )

⇒ Controller 생성하기

⇒ `nest generate controller` ( nest g co 로 줄여서 사용할 수 있습니다. )

⇒ ex) `nest g co` 를 입력하면, controller name을 입력하라고 합니다.  입력하고 나면 controller가 생성되며 module에도 자동으로 import 됩니다!!

⇒ controller.ts 와 controller.spec 파일 두 가지가 생성되는데 spec은 테스트 파일입니다.

⇒ Controller 작성하기

```tsx
@Controller('movies') //이부분이 springboot의 requestMapping 역할
export class MoviesController {

    @Get()//비워놓으면 라우터를 의미합니다. ('/')
    getAll(){
        return 'This will return all movies';
    }

    @Get('/:id') //id값을 받는다 ('/1'), ('/2') ...
    getOne(){
        return "This will return one movie";
    }
    
}
```

⇒ nestJS 에서는 필요한 값이 있으면 요청해야 합니다. ( springboot @requestParam 과 유사한 듯 합니다. ) 

```tsx
@Get('/:id') //id값을 받는다 ('/1'), ('/2') ...
    getOne(@Param('id') movieId: string){ //url 에 있는 값을 가져오기 위해 Param을 사용합니다. url 에 있는 이름과 같은 이름으로 'id'를 받아줘야 합니다. 
        return `This will return one movie with the id : ${movieId}`;
    }
```

⇒ Body 내용 (json) 받아오는 방법

```tsx
@Post()
    create(@Body() movieData){
        return movieData;
    }

//이렇게 두가지 요청을 한번에 할 수도있다.
@Patch('/:id')
    path(@Param('id') movieId: string, @Body() updateData){
        return {
            updatedMovie: movieId,
            ...updateData,
        };
    }
```

⇒ 입력시에 @Post, 삭제시에 @Delete, 수정시에 @Put으로 (springboot 와 동일하게 사용합니다.)

⇒ 다만 전체 수정시 @Put 이고, 부분 수정시에는 @Patch 를 사용하게됩니다.

⇒ 문제점!!

```tsx
		@Get('/:id') //id값을 받는다 ('/1'), ('/2') ...
    getOne(@Param('id') movieId: string){
        return `This will return one movie with the id : ${movieId}`;
    }

    @Get('/search') 
    search(){
        return `We ar searching for a movie with a title: `;
    }
```

⇒ 위와 같이 @Get('/:id')가 상단에 위치할 경우에 그 아래에 나오는 모든 @Get 요청의 이름들이(ex: '/search') id로 취급이 되어 인식되지 못합니다. (express도 같은 문제가 있다.) 

⇒ 그러므로 @Get('/:id') 같은 요청들은 가장 하단으로 내려 주어야 합니다.

⇒ [http://127.0.0.1:3000/movies/](http://127.0.0.1:3000/movies/2)search?year=2000 같이 query argument를 받는 방법

```tsx
@Get('/search') 
    search(@Query("year") searchingYear: string){
        return `We ar searching for a movie with a after: ${searchingYear}`;
    }
```

⇒ Single-responsibility principle을 따르도록 하자

⇒ Single-responsibility principle 은 하나의 module, class 혹은 function이 하나의 기능은 꼭 책임져야 한다는 것입니다.

⇒ 서비스는 로직(function?)을 관리하는 역할

⇒ 컨트롤러는 url 매핑하며, 데이터들을 받고 서비스에 보내주는 역할

⇒ Service 생성하기

⇒ `nest generate service` (nest g s 로 줄여서 사용할 수도 있습니다.)

⇒ 이후 서비스 명을 입력하면, controller 때와 마찬가지로 ts, spec.ts 파일이 생성됩니다. 이도 마찬가지로 모듈에 알아서 import 됩니다!

⇒ 이제 할 일은 service.ts 에 데이터 베이스를 만들 것입니다.

Movie.entity.ts

```tsx
export class Movie {
    id: number;
    title: string;
    year: number;
    genres: string[];
}
```

⇒ 위와 같이 Entity를 만들어 주었다.

movies.service.ts

```tsx
import { Injectable } from '@nestjs/common';
import { Movie } from './entites/movie.entity'; //entity를 import 받았음을 보여줍니다.

@Injectable()
export class MoviesService {
    private movies: Movie[] = [];  //위에서 만든 entity를 배열의 형식으로 만들어 담아 주었습니다.

    getAll(): Movie[] {
        return this.movies;
    }

    getOne(id: string): Movie {
        return this.movies.find(movie => movie.id === parseInt(id));
        // return this.movies.find(movie => movie.id === +id); 이렇게도 int로 변경할 수 있다.
    }
}
```

⇒ 그리고 entity를 service에서 불러와 entity를 다루는 (CRUD) function들을 만들어냅니다.

⇒ 이렇게 만들어진 service는 Controller 에서 아래처럼 불러와 사용하게 됩니다.

```tsx
@Controller('movies') //이부분이 springboot의 requestMapping 역할
export class MoviesController {

    //service를 import 하는 방법
    **constructor(private readonly moviesService: MoviesService){}**

		@Get()//비워놓으면 라우터를 의미합니다. ('/')
    getAll(): Movie[]{
        return this.moviesService.getAll(); //위에서 constructor 한 Service 덕분에 getAll()을 사용할 수 있습니다.
    }

    @Get('/:id') //id값을 받는다 ('/1'), ('/2') ...
    getOne(@Param('id') movieId: string): Movie{
        return this.moviesService.getOne(movieId);
    }
    
    @Post()
    create(@Body() movieData){
        return this.moviesService.create(movieData);
    }

    @Delete('/:id')
    remove(@Param('id') movieId: string){
        return this.moviesService.deleteOne(movieId);
    }
```

이 학습은 노마드코더 [NestJS로 API 만들기](https://nomadcoders.co/nestjs-fundamentals/lobby) 강의를 따라하며 학습했습니다.

제가 따라 작성한 github 코드는 [https://github.com/fftl/hi-nest](https://github.com/fftl/hi-nest) 입니다.