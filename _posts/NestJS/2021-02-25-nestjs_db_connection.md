---
title: "NestJS mysql db 연결하기"
categories: 
  - NestJS
last_modified_at: 2021-02-25T13:00:00+09:00
---

- 첫 번째로 MySQL 에 연결하기 위한 패키지를 설치합니다.

     `$ npm install --save @nestjs/typeorm typeorm`

- 그리고 각각 사용할 DB에 맞는 패키지를 설치 해 줍니다. (이번 같은 경우에는 mysql)

    `$ npm install mysql --save`

- 루트 디렉터리에 ormconfig.json 파일을 생성해 DB connection 정보를 입력해 줍니다.

<center><img src="https://user-images.githubusercontent.com/69035612/109106192-a3062c80-7772-11eb-89ae-7cb14bade576.png"></center>

```json
{
    "type": "mysql",
    "host": "localhost",
    "port": 3306,
    "username": "root",
    "password": "root",
    "database": "test",
    "entities": ["dist/**/*.entity{.ts,.js}"],
    "synchronize": true
  }
```
- 끝?! 테스트를 위한 Entity 파일을 만들어 봤습니다. 그러면 ormconfig.json의 `"entities": ["dist/**/*.entity{.ts,.js}"]` 부분을 통해  탐색을 하게 되고 알아서 찾아 테이블을 생성합니다.
<center><img src="https://user-images.githubusercontent.com/69035612/109106264-c92bcc80-7772-11eb-8827-60033e578595.png"></center>

```tsx
//user.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ default: true })
  isActive: boolean;

}
```
- DB를 확인해보았습니다!
<center><img src="https://user-images.githubusercontent.com/69035612/109106344-e791c800-7772-11eb-8d0a-908b45dc69fa.png"></center>   

Entity를 생성하는 부분의 문법이나 기능들에 대해서는 따로 공부가 더 필요할 것 같지만 spring boot와 JPA 를 사용하는 것과 비슷하게 느껴졌고 사용할 줄 안다면 굉장히 편리할 것 같다고 느꼈습니다.

[https://docs.nestjs.com/techniques/database#example](https://docs.nestjs.com/techniques/database#example)

Nest.js 공식 홈페이지를 참고 하였습니다.