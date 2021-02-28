---
title: "NestJS passport로 authentication 적용하기"
categories: 
  - NestJS
last_modified_at: 2021-02-28T13:00:00+09:00
---

nestjs의 공식 문서를 가지고 순서대로 따라해 보았습니다. 처음에는 passport를 사용하여 인증을 구현한 뒤 jwt 까지 사용하는 과정이었습니다.

일단 `nest new` 를 이용하여 프로젝트를 만든 뒤 해당 경로에 들어가서 시작 하시길 바라겠습니다.

  

**첫번째로** passport 에 필요한 패키지들을 설치해 줍니다.

`$ npm install --save @nestjs/passport passport passport-local`

`$ npm install --save-dev @types/passport-local`

**두번째로** auth에 관련한 코드를 입력할 auth module과 service를 생성해 줍니다.

`$ nest g module auth`

`$ nest g service auth` 

그리고 auth를 적용할? 유저 객체의 module과 service를 생성해줍니다.

`$ nest g module users`

`$ nest g service users`

**세번째로**  UsersService 에서 테스트에 사용할 default 데이터를 입력하고 username을 이용해 User를 탐색하는 findOne()을 생성해 주었습니다.

그리고 해당 UserService 를 외부에서 사용할 수 있도록 UsersModule에 에 exports UserService를 추가해줍니다.

```tsx
users/users.service.ts

import { Injectable } from '@nestjs/common';

// This should be a real class/interface representing a user entity
export type User = any;

@Injectable()
export class UsersService {
  private readonly users = [
    {
      userId: 1,
      username: 'john',
      password: 'changeme',
    },
    {
      userId: 2,
      username: 'maria',
      password: 'guess',
    },
  ];

  async findOne(username: string): Promise<User | undefined> {
    return this.users.find(user => user.username === username);
  }
}
```

```tsx
users/users.module.ts

import { Module } from '@nestjs/common';
import { UsersService } from './users.service';

@Module({
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
```

**네번째로**  AuthService 에 validateUser를 만들어 아이디와 비밀번호를 입력 받아 데이터 안에 해당 user 가 존재하는지 확인할 수 있도록 합니다.

그리고 auth.module 에서는 usersmodule을 import 하여 사용할 수 있도록 해놓습니다.

```tsx
auth/auth.service.ts

import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
}
```

`여기서는 비밀번호를 문자열 그대로 입력했지만 실제 운용하는 APP에서는 bcrypt 등을 이용한 암호화를 꼭 하시기 바랍니다`

```tsx
auth/auth.module.ts

import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule],
  providers: [AuthService],
})
export class AuthModule {}
```

**다섯째로** auth에 local.strategy를 만들어 passportStrategy 를 이용해 passport를 사용할 수 있도록 합니다? 그리고 authModule 을 업데이트 해줍니다.

```tsx
auth/local.strategy.ts

import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(username: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
```

```tsx
auth/auth.module.ts

import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';

@Module({
  imports: [UsersModule, PassportModule],
  providers: [AuthService, LocalStrategy],
})
export class AuthModule {}
```

이제 간단한 세팅이 끝이 났습니다. app.controller에 AuthGuard 를 적용시켜? [http://localhost:3000/auth/login](http://localhost:3000/auth/login) 링크로 테스트를 진행해 볼 수 있도록 합니다.

```tsx
app.controller.ts

@Controller()
export class AppController {
  @UseGuards(AuthGuard('local'))
  @Post('auth/login')
  async login(@Request() req) {
    return req.user;
  }
}
```

- UsersService 에 입력해 놓았던 데이터를 보냈더니 성공
<center><img src="https://user-images.githubusercontent.com/69035612/109420171-60fc1580-7a14-11eb-9eb1-55488a7034cc.png"></center>

- 존재하지 않는 데이터를 보냈더니 권한 실패
<center><img src="https://user-images.githubusercontent.com/69035612/109420188-72452200-7a14-11eb-8cf0-d4fadfe2c9c7.png"></center>

그리고 공식 문서에서는 auth/local-auth.guard.ts 파일을 만들어 @Post('auth/login') 의 AuthGuard를 LocalAuthGuard 로 변경 해 주었습니다.

```tsx
auth/local-auth.guard.ts

import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {}
```

```tsx
app.controller.ts

@Controller()
export class AppController {
  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req) {
    return req.user;
  }
}
```

이렇게 passport 를 이용한 authentication의 설명은 마무리 입니다. 이어서 여기에 jwt 를 추가하는 것은 다음 글을 통해 진행하겠습니다.

해당 글은 [https://docs.nestjs.com/security/authentication](https://docs.nestjs.com/security/authentication) 링크인 nest 공식 문서를 따라 진행했으며 해당 코드의 github은 [https://github.com/nestjs/nest/tree/master/sample/19-auth-jwt](https://github.com/nestjs/nest/tree/master/sample/19-auth-jwt) 입니다.

감사합니다.