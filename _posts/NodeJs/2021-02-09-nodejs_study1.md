---
title: "Node.js 백엔드 학습 메모 .01"
categories: 
  - NodeJs
last_modified_at: 2021-02-09T13:00:00+09:00
---

node.js는 npm을 통해서 패키지들을 다운받아 사용합니다.
npm(node package manager)

- 프로젝트를 만들 디렉토리에 들어가 `npm init` 을 하여 node 프로젝트를 생성
- `npm install express --save` # --save 는 해당 패키지를 package.json 에 기록하여 해당 package.json을 이용하면 쉽게 같은 패키지를 받을 수 있게된다!
```jsx
{
  "name": "nodeserver",
  "version": "1.0.0",
  "description": "nodeserver test",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "ISC",
  "dependencies": {
    "express": "^4.17.1" //이것처럼 추가가됨!
  }
}
```

- `vi app.js` 를 통해 app.js 생성 # vi ~ 문법은 vim 을 사용하여 파일에 접근할 때, IDE(이클립스, vsCode, intellij 등을 통해서 간편하게도 가능) 

```jsx
app.js
--top
var express = require('express') //express를 객체로 담음?
var app = express()
app.listen(3000, function () {
        console.log("start! express server on port 3000");
});
```

⇒ 생성한 뒤 디렉토리에서 `node app.js` 명령어로 실행 할 수 있다.

⇒ localhost == 127.0.0.1 ... 같다는걸 이제야 알았다....

```jsx
var express = require('express')
var app = express()
app.listen(3000, function () {
	console.log("start! express server on port 3000");
});

console.log('end of server code...')
```

이렇게 했는데 출력은 'end of  server code...' 이 먼저 나옵니다.

이는 비동기로 실행되기 때문에. start 가 비동기로 나중에 실행이 됨.

- 자동으로 파일의 변환을 감지하여 서버를 내렸다 올려주는 기능?

    ⇒ `npm install nodemon --save` ( `npm install nodemon -g` 이렇게 설치 하면, 이 피시에 해당하는 모든 node 프로젝트에 실행이 됩니다. )

    ⇒ --save 로 설치를 했더니 nodemon을 인식하지 못한다 다시 -g 로 설치를 해줍니다. ⇒ 실행성공! powershell 에서는 권한에러가 나타남, 권한을 풀어줘야 한다.

- app.get을 통해 res.send 에 보내줄 수 있다.
- 어떠한 요청도 직접 지정해주지 않는 이상 알아서 찾아서 연결해주지 않는다!
- get을 통한 페이지의 접근!

```jsx
app.js
...
app.get('/', function(req,res){
	// 경로접근의 '/' 기본경로에 해당 파일을 연결해준다!
	res.sendFile(__dirname+"/public/main.html"); //__dirname 으로 현재 루트 디렉토리를 명시할 수 있다.
})
```

- javascript 같은 static파일은 직접 연결을 해줘야 함
- 이를 express의 static 디렉토리를 정해 놓으면,  해결 가능

```jsx
app.use(express.static('public'));
```

- public 디렉토리를 static 으로 지정해주었습니다.

```jsx
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>main.html</title>
</head>
<body>
    <h1>main page</h1>
    <p>hi my friend!!</p>

    <img src="images/Steven Gerrard.jpg" width="300px;">
    <script src="main.js"></script>
</body>
</html>
```

⇒ 그리하여 해당 디렉토리 안의 images와 main.js를 간단하게 접근할 수 있습니다.