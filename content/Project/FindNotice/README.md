---
created: 2026-01-28T15:45:21+09:00
modified: 2026-01-28T23:15:45+09:00
---
- 본 프로젝트는 개인 학습 및 구직 활동 목적입니다 
- 데이터 재배포나 상업적 이용을 금지합니다 
- robots.txt를 준수하며 과도한 요청을 자제합니다
---
# 개요
매번 잡코리아, 사람인 등 사이트에서 지원 공고를 탐색하는 작업이 번거로워 이를 자동화 하는 프로젝트를 해보는 것이 어떨까 하여 시작하게 되었습니다. 해당 사이트들은 조건에 대한 필터링이 무척 잘되어 있지만, 필터링을 통하더라도 실제 원하는 공고들이 아닌 공고도 굉장히 많이 나타나는 경우가 많습니다. 따라서 이를 최대한 더 필터링 해서 이 확인하는 시간을 줄여보자! 라는 취지의 프로젝트입니다.

---
# 사용 기술
사용 기술은 일단 다음과 같이 생각하고 있습니다. 로그인은 캐시?, 쿠키를 통해 해결된다 생각하고, python, beautifulsoup와 pandas, MySQL, airflow 정도를 생각하고 있습니다. 프로젝트를 시작하는 단계라 이정도 생각했지만, 진행하면서 점차 다듬어 보도록 하겠습니다.

---
# 흐름
매일 오후 10시 경 저는 거의 항상 컴퓨터를 켜놓기 때문에,  local에서 작동하고 있는 airflow라도 작업을 할 수 있을 것이라 생각합니다. 따라서 오후 10시에 잡코리아, 사람인(진행상황에 맞춰 인크루트나 다른 사이트도 추가해보는 것으로 생각해볼 예정)사이트에서 제가 지정해놓은 검색어와 조건으로 검색을 진행하고, 아직 db에 없는 새로운 공고일 경우 수집하여 DB에 저장하는 배치(?)가 실행되도록 만드는 작업입니다.

즉 python을 통해 웹 사이트의 데이터를 수집하여, mysql db로 입력하는 파이프라인을 구축하는 것이 목표입니다.

---
# 데이터 수집 가능 여부 확인
먼저 크롤링을 해도 괜찮은지 확인해보기 위해, 사이트를 찾아보았습니다. 먼저 사람인의 경우 api를 통해 채용 정보를 수집할 수 있는 것으로 보여 접근이 쉬워 보였습니다.

사람인 api - https://oapi.saramin.co.kr/

잡코리아도 api를 제공하고 있긴 하지만, 개인 이용자를 위한 제공은 아닌 것 같아 크롤링을 해보는 것으로 가닥을 잡았습니다. 그래도 만약을 위해 수집한 데이터는 외부에 제공하지 않을 생각입니다.

---
# 데이터 table 생성
테이블이 여러 개 필요하진 않습니다. 하나의 테이블에 데이터를 담을 예정입니다.
- 회사명
- 공고명
- 공고주소
- 고용형태
- 모집분야
- 경력
- 시작일
- 마감일
- 근무지
### Todo
- 데이터베이스, 테이블 생성
```sql
CREATE DATABASE find_notice;

USE find_notice;

-- 테이블 생성
CREATE TABLE notice (
    id INT PRIMARY KEY AUTO_INCREMENT,
    site VARCHAR(20) NOT NULL,
    company_name VARCHAR(100) NOT NULL,
    notice_title VARCHAR(200),
    url VARCHAR(500) UNIQUE,
    start_date DATE,
    end_date DATE,
    location VARCHAR(200),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    INDEX notice_x01 (company_name),
    INDEX notice_x02 (start_date, end_date),
    INDEX notice_x03 (location)
);
```
- ~~사람인 api 정보 확인하기~~
- 아직 사람인 api 인증이 나오지 않았으므로 잡코리아 크롤링부터 진행해보도록 하겠습니다.


- selenium 사용법 되새기기

