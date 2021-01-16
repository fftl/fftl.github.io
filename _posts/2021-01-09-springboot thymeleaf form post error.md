---
layout: post
title: "Springboot thymeleaf form post error..?"
categories: SpringBoot
comments: true
---

springboot jpa 를 사용하는데 구글에서의 많은 자료들이 Entity 에서는 setter 를 사용하지 않는 것이 좋다는 의견을 많이 내고 있습니다. jpa 사용시에 Entity는 DB와 직결되는 만큼 예상치 못한 값이 들어가게 될 경우 큰 문제가 발생할 수도 있기 때문입니다. 따라서 Entity class와 유사한 Dto class를 만들어 Dto를 거친 데이터의 이동을 하도록 권장하고 있습니다.

그래서 저는 Dto를 생성했고, Dto 에서 @Builder 를 이용해 Dto로 받은 객체를 Entity로 변환하는 작업을 사용하고 있었습니다. 그런데 아무리 작업을 해도 PostMapping 와 @ModelAttribute 를 이용해 Dto 로 입력을 받았는데 자꾸 null 값만 들어오고 있었습니다.

나의 thymeleaf 문법이 잘못되었는지, Dto를 잘못 만들었는지 많은 고민과 테스트를 했으나 결론은 Dto에도 setter를 선언해 주지 않았더니 @ModelAttribute에서 setter를 이용해 Dto 객체에 값이 할당되어야 하는데 그것을 못하고 있었던 것입니다. 저 과정에서 setter를 이용해 할당을 하는 것을 이제야 깨달았습니다.
