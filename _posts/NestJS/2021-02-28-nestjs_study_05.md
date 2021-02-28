---
title: "NestJS 백엔드 학습 메모 .05"
categories: 
  - NestJS
last_modified_at: 2021-02-28T13:00:00+09:00
---

- Testing in Nest

    ⇒ 주로 jest 를 사용하게 됩니다. jest는 자바스크립트를 아주 쉽게 테스팅하는 npm 패키지 입니다.

    ⇒ NestJS 에서 cli 를 통해 파일을 생성하게 되면 ~.spec.ts 파일이 함께 생성되는데 이 파일이 해당 파일을 테스트 하기 위한 파일입니다. 이 ~.spec.ts 가 있는 파일들을  jest가 찾아내어 테스트를 진행하게 됩니다.

    ⇒ `npm run test:cov` 를 실행하면 프로젝트의 모든 spec.ts 를 찾아내어 각각의 파일이 얼마나 테스팅 되었는지 알려줍니다.

    ⇒ `npm run test:watch` 를 통해서 테스트를 진행할 수 있습니다.

    ⇒ 유닛테스트( Unit Testing )

    ⇒ function 하나 하나를 따로 테스팅하는 방식, ex) getAll() 을 테스트한다, getOne() 을 테스트한다 등등

    movies.service.spec.ts

    ```tsx
    import { Test, TestingModule } from '@nestjs/testing';
    import { MoviesService } from './movies.service';

    describe('MoviesService', () => {
      let service: MoviesService;

      //beforeEach 테스트를 진행하기 전에 실행됨
      beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
          providers: [MoviesService],
        }).compile();

        service = module.get<MoviesService>(MoviesService);
      });

      it('should be defined', () => { //it 은 하나의 테스트라고 볼 수 있습니다.
        expect(service).toBeDefined();
      });

      it("should be 4", () =>{
        expect(2+2).toEqual(4);
      });

    });
    ```

    ⇒ 테스트에 성공하면 아래처럼 나오고

  <center><img src="https://user-images.githubusercontent.com/69035612/109421573-4bd6b500-7a1b-11eb-92e9-3fcf46ec9d3b.png"></center>

    ⇒ 테스트에 실패하면 아래처럼 어떤 테스트가 실패 했는지, 기대 값이 얼마였는지, 현재 값이 얼마여서 실패 했는지 상세하게 나타내 줍니다.
  
  <center><img src="https://user-images.githubusercontent.com/69035612/109421695-b38d0000-7a1b-11eb-9082-923c439eea59.png"></center>
  
    ⇒ 테스팅 코드 작성

    movies.service.spec.ts

    ```tsx
    import { NotFoundException } from '@nestjs/common';
    import { Test, TestingModule } from '@nestjs/testing';
    import { MoviesService } from './movies.service';

    describe('MoviesService', () => {
      let service: MoviesService;

      //beforeEach 테스트를 진행하기 전에 실행됨
      beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
          providers: [MoviesService],
        }).compile();

        service = module.get<MoviesService>(MoviesService);
      });

      it('should be defined', () => {
        expect(service).toBeDefined();
      });

      describe("getAll", () =>{
        it("should return an Array", () =>{

          //상단에 service = module.get<MoviesService>(MoviesService); 부분에서 MoviesService를 이미 가져와서 바로 getAll()을 실행해 볼수 있다.
          const result = service.getAll(); 

          expect(result).toBeInstanceOf(Array); //result 의 인스턴스가 Array인지 확인한다.
        })
      })

      describe("getOne", () =>{ 

        it("should return a movie", () => {
          //getOne을 테스트 하기 위해서는 하나라도 movie 객체가 있어야 한다
          //테스트 용으로 생성해 줍니다.
          service.create({
            title: 'Test Movie',
            genres: ['test'],
            year: 2000,
          });

          const movie = service.getOne(1); //id:1 을 통해 가져온 movie
          expect(movie).toBeDefined(); //id가 정의 되어 있는지 확인(빈값이 아닌지?)
          expect(movie.id).toEqual(1); //위에서 가져온 movie의 id가 1이 맞는지 확인
        });

        //404 에러가 잘 작동하는지 테스트
        it("should throw 404 error", () => {
          try{
            service.getOne(999); //없는 id의 movie를 가져오게 한뒤
          } catch(e){
            expect(e).toBeInstanceOf(NotFoundException); //에러가 발생하면
            expect(e.message).toEqual("Movie with ID: 999 not found.") //에러메시지도 확인합니다.
          }
        });
      });

      describe("deleteOne", ()=>{
        it("delete a movie", () =>{
          service.create({
            title: 'Test Movie',
            genres: ['test'],
            year: 2000,
          });
          const allMovies = service.getAll().length; //movie 하나를 삭제하기전 전체리스트의 크기와
          service.deleteOne(1);
          const afterDelete = service.getAll().length; //movie 하나를 삭제한 뒤의 리스트 크기를 비교해

          expect(afterDelete).toBeLessThan(allMovies); //이전 것의 크기다 더 작다면 통과입니다.
        });
        it('should return a 404', () => {
          try{
            service.deleteOne(999);
          } catch(e){
            expect(e).toBeInstanceOf(NotFoundException);
            expect(e.message).toEqual("Movie with ID: 999 not found.")
          }
        })
      })

      describe("create", () => {
        it("should create a movie", () => {
          const beforeCreate = service.getAll().length;//create 하기 전 전체리스트 크기
          service.create({
            title: 'Test Movie',
            genres: ['test'],
            year: 2000,
          });
          const afterCreate = service.getAll().length;  //create 한 후 전체리스트 크기
          console.log(beforeCreate, afterCreate);
          expect(afterCreate).toBeGreaterThan(beforeCreate); //이후의 크기가 더 크다면 성공입니다.
        })
      })

      describe("update", () => {
        it("should update a movie", ()=>{
          service.create({
            title: 'Test Movie',
            genres: ['test'],
            year: 2000,
          });
          service.update(1, {title: 'Updated Test'}); //테스트 movie의 title을 Updated Test로 변경
          const movie = service.getOne(1);
          expect(movie.title).toEqual('Updated Test'); //해당 movie의 title이 Updated Test와 동일한지 확인
        })

        it('should throw a NotFoundException', () => {
          try{
            service.update(999, {title: 'Updated Test'});
          } catch(e){
            expect(e).toBeInstanceOf(NotFoundException);
            expect(e.message).toEqual("Movie with ID: 999 not found.")
          }
        })
      })
    });
    ```

    ⇒ end-to-end테스트( E2E Testing )

    ⇒ 모든 시스템을 테스팅 하는 것, 사용자의 관점에서 사용자가 취할만한 액션들을 처음부터 끝까지 테스트 하는 것 입니다.

    ⇒ `npm run test:e2e` 으로 테스트를 실행합니다.

    ⇒ e2e test의 app도 실제 어플리케이션과 동일하게 작동하도록 설정을 해줘야 확실한 테스트가 가능합니다. (ex: useGlobalPipes...)

    app.e2e-spec.ts

    ```tsx
    import { Test, TestingModule } from '@nestjs/testing';
    import { ValidationPipe } from '@nestjs/common';
    import { INestApplication } from '@nestjs/common';
    import * as request from 'supertest';
    import { AppModule } from './../src/app.module';

    describe('AppController (e2e)', () => {
      let app: INestApplication;

      beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
          imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(new ValidationPipe({
          whitelist: true,
          forbidNonWhitelisted:true,
          transform: true,          //dto를 지나는 데이터들을 각각 설정해놓은 타입으로 변경해줍니다. 굉장히 편리한듯 합니다.
        }));

        await app.init();
      });

      it('/ (GET)', () => {
        return request(app.getHttpServer())
          .get('/')
          .expect(200)
          .expect('Welcom to my Movie API');
      });

      describe('/movies', ()=>{
        it('GET', () =>{
          return request(app.getHttpServer())
          .get('/movies')
          .expect(200)
          .expect([]);
        })

        it('POST 201', () => {
          return request(app.getHttpServer())
          .post('/movies')
          .send({
            title:"TEST",
            year: 2000,
            genres: ['test'],
          })
          .expect(201);
        })

        it('POST 400', () => {
          return request(app.getHttpServer())
          .post('/movies')
          .send({
            title:"TEST",
            year: 2000,
            genres: ['test'],
            other:"thing",
          })
          .expect(400);
        })
      })

      it('DELETE', ()=>{
        return request(app.getHttpServer()).delete('/movies').expect(404);
      })

      describe('/movies/:id', ()=>{
        it("GET 200", ()=>{
          return request(app.getHttpServer()).get("/movies/1").expect(200);
        });
        it("GET 404", ()=>{
          return request(app.getHttpServer()).get("/movies/999").expect(404);
        });
        it('PATCH', ()=>{
          return request(app.getHttpServer()).patch('/movies/1').send({title:"Updated Test"}).expect(200);
        });
        it("DELETE", ()=>{
          return request(app.getHttpServer()).delete('/movies/1').expect(200);
        });
      });
    });
    ```