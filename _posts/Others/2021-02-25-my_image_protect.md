---
title: "Jekyll blog 이미지 복사금지하기"
categories: 
  - Others
last_modified_at: 2021-02-25T13:00:00+09:00
---

Jekyll blog 새내기인데, 블로그 작업 중 문득 sidebar에 있는 제 사진이 걱정이 되었습니다. 제 얼굴이기도 하고 괜히 누가 복사해서 마음대로 사용하지 않을까 하는 걱정이었습니다.

물론 캡쳐를 하는 것 까지는 어쩔 수 없겠지만 다른이름으로 저장하는 등 접근하는 것은 막아보고자 생각을 했습니다. 그래서 구글링을 조금 해 보았고 금방 답을 찾았습니다.

[https://muksteem.tistory.com/18](https://muksteem.tistory.com/18)

위의 블로그에서 방법을 찾아 내었습니다. 

- 크롬 개발자도구를 이용하여 제 블로그의 sidebar의 이미지를 탐색 해보면 아래와 같이 나옵니다.
  (개발자 도구에서 나타나는 저 "/assets/fftl.jpg" 링크는 막을 방법이 없을까?)

<center><img src="https://user-images.githubusercontent.com/69035612/109108972-e31bde00-7777-11eb-97fe-19474e802d6e.png"></center>

- 위의 과정을 통해 이미지는 author__avatar class 를 이용?한 다는 것을 알았습니다. 이제 제 github.io 프로젝트내에서 이 class를 검색했습니다. ( 저는 Intellij를 사용하는데 ctrl + alt + F를 이용하면 프로젝트 전체에서 검색할 수 있습니다. )

<center><img src="https://user-images.githubusercontent.com/69035612/109109505-c9c76180-7778-11eb-8296-eedf42030e38.png"></center>

- 그렇게 찾아낸 파일에 들어가서 img 부분에 `pointer-events: none;` 를 추가해 주면 끝입니다.

<center><img src="https://user-images.githubusercontent.com/69035612/109109783-4bb78a80-7779-11eb-8d1e-393aa4539b3e.png"></center>

- 그럼 현재 블로그의 왼쪽 제 프로필 이미지와 같이 '이미지를 다른이름으로 저장' 같은 것이 불가능해 지는 것을 확인 할 수 있을 것 입니다.

 
