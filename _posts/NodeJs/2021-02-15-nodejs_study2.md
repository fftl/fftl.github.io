---
title: "Node.js 백엔드 학습 메모 .02"
categories: 
  - NodeJs
last_modified_at: 2021-02-15T13:00:00+09:00
---

- post를 통한 데이터 통신

app.js

```jsx
...
app.post('/email_post', function(req,res){
	// 경로접근의 '/' 기본경로에 해당 파일을 연결해준다!
	res.sendFile(__dirname+"/public/main.html"); //__dirname 으로 현재 루트 디렉토리를 명시할 수 있다.
})
```

⇒ get 방식은 `req.param('email')` 같은 형식으로 데이터를 받아 올 수 있지만 post는 불가능하다.

⇒ post 방식은 body-parser 란 라이브러리를 이용해 데이터를 통신 할 수 있다. `npm install body-parser --save` 로 설치한다.

```jsx
var express = require('express')
var app = express()						//express 불러오기
var bodyParser = require('body-parser') //body-parser 불러오기

app.listen(4000, function () {
	console.log("start! express server on port 4000");
});

app.use(express.static('public'));
app.use(bodyParser.json()) //json 방식을 사용하고 싶다면,
app.use(bodyParser.urlencoded({extended:true})) //클라이언트와 서버는 데이터를 전송할 때 인코딩을 거치기 때문에 인코딩을 처리 하기 위해 사용.**

app.get('/', function(req,res){
	// 경로접근의 '/' 기본경로에 해당 파일을 연결해준다!
	res.sendFile(__dirname+"/public/main.html"); //__dirname 으로 현재 루트 디렉토리를 명시할 수 있다.
})

//get방식!
app.get('/main', function(req,res){
	// 경로접근의 '/' 기본경로에 해당 파일을 연결해준다!
	res.sendFile(__dirname+"/public/main.html"); //__dirname 으로 현재 루트 디렉토리를 명시할 수 있다.
})

//post방식!
app.post('/email_post', function(req,res){
	//get : req.param('email');
	console.log(req.body)
	console.log(req.body.email)
	res.send("<h1>welcome" + req.body.email + "</h1>")
	res.send("post resposne")
})
```

- 만들어진 html 파일에 적절한 데이터를 넣어주는? 방법

⇒ `npm install ejs --save`  ejs 설치하기

email.ejs

```jsx
...
<body>
    <h1>Welcome !! <%= email %></h1> //ejs 문법?
    <p>정말로 반가워요!</p>
</body>
...
```

app.js

```jsx
...
app.set('view engine', 'ejs') //ejs는 불러올필요 없음, view engine은 ejs를 사용할래 라는 의미

app.get('/', function(req,res){
	// 경로접근의 '/' 기본경로에 해당 파일을 연결해준다!
	res.sendFile(__dirname+"/public/main.html"); //__dirname 으로 현재 루트 디렉토리를 명시할 수 있다.
})

//get방식!
app.get('/main', function(req,res){
	// 경로접근의 '/' 기본경로에 해당 파일을 연결해준다!
	res.sendFile(__dirname+"/public/main.html"); //__dirname 으로 현재 루트 디렉토리를 명시할 수 있다.
})

//post방식!
app.post('/email_post', function(req,res){
	//get : req.param('email');
	console.log(req.body)

	// console.log(req.body.email)
	// res.send("<h1>welcome" + req.body.email + "</h1>")
	// res.send("post resposne")

	res.render('email.ejs', {'email' : req.body.email}) //ejs 사용법 email.ejs 파일안의 <%= email %> 부분에 email 에 해당하는 값을 넣어줘!
})
```

- json 을 이용한 ajax 처리!

    form.html

    ```jsx
    ...
    <button class="ajaxsend">ajaxsend</button>

        <script>
            document.querySelector('.ajaxsend').addEventListener('click', function(){
                var inputdata = document.forms[0].elements[0].value;        //0번째 form에서의 0번째 element 즉 email이 됩니다.
                sendAjax('http://127.0.0.1:4000/ajax_send_email', inputdata)  //아래에서 만들어준 sendAjax function을 실행합니다.
            })

    				function sendAjax(url, data){
                var data = {'email' : data};
                data = JSON.stringify(data);
                var xhr = new XMLHttpRequest(); //?
                xhr.open('POST', url);                                   //url의 주소로 POST 통신을 합니다.
                xhr.setRequestHeader('Content-Type', "application/json") //ajax json 통신을 할 때 이게 필요합니다.
                xhr.send(data); //data 를 전송합니다.
                xhr.addEventListener('load', function(){ //정상적으로 로드가 되었을 경우에!
                    var result = JSON.parse(xhr.responseText); //ajax_send_email 에서 보내준 responseData를 받아왔습니다.
                    if(result.result != "ok") return;
                    document.querySelector(".result").innerHTML = result.email;
                })
            }
        </script>
    ```

    app.js

    ```jsx
    ...
    app.post('/ajax_send_email', function(req, res){
    	console.log(req.body.email);									//여기서의 console.log 는 서버에 찍힙니다.
    	//check validation about input value => select db
    	var responseData = {'result': 'ok', 'email': req.body.email};
    	res.json(responseData);
    });
    ```
  
- mysql 사용하기
  ⇒ `npm install mysql --save` 클라이언트에 mysql 모듈을 설치해줍니다.
  
- router 처리하기
  ⇒ router를 사용하여 기능별로 분배 해주면 app.js가 깔끔해집니다. (controller 라고 볼 수 있습니다.)

- router 리팩토리
  ⇒ 현재 까지 배운 지식으로는 router를 사용하기 위해서는 require 를 이용해 일일이 연결을 해줘야 했습니다. 이를 간편하게 하기 위해서 라우팅을 도와주는 미들웨어를 만들어 사용할 수 있습니다.
  
- database crud
  ⇒ insert 를 한 뒤에 rows 를 이용하면 결과 값을 가져올 수 있습니다.  
  
- passport? 세션을 통한 로그인 하기