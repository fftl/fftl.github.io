---
date: 2025-12-04
---

**Nginx 설치부터 SSL 설정까지 단계별로 진행하겠습니다.**

---

## 1. Nginx 설치

bash

```bash
# 패키지 업데이트
sudo apt update

# Nginx 설치
sudo apt install nginx -y

# 설치 확인
nginx -v

# Nginx 시작 및 자동 시작 설정
sudo systemctl start nginx
sudo systemctl enable nginx

# 상태 확인
sudo systemctl status nginx
```

---

## 2. 방화벽 설정

bash

```bash
# Lightsail 콘솔에서도 포트 개방 필요하지만, 서버 내부 방화벽도 설정

# UFW 방화벽 사용 시
sudo ufw allow 'Nginx Full'  # 80, 443 포트 모두 허용
sudo ufw status

# 또는 개별 포트 허용
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
```

**Lightsail 콘솔에서도 확인:**

- Networking 탭 → Firewall
- HTTP (80), HTTPS (443) 포트가 열려있어야 함

---

## 3. 기본 동작 테스트

bash

```bash
# 브라우저에서 접속
http://yourname.duckdns.org

# 또는 curl로 확인
curl http://yourname.duckdns.org
```

Nginx 기본 페이지가 보이면 성공!

---

## 4. Certbot 설치 (Let's Encrypt SSL)

bash

```bash
# Certbot 및 Nginx 플러그인 설치
sudo apt install certbot python3-certbot-nginx -y

# 설치 확인
certbot --version
```

---

## 5. SSL 인증서 발급

bash

```bash
# 자동으로 Nginx 설정까지 해줌
sudo certbot --nginx -d yourname.duckdns.org

# 진행 중 입력 사항:
# - 이메일 입력 (인증서 만료 알림용)
# - 약관 동의 (Y)
# - 리다이렉트 설정: 2 선택 (HTTP → HTTPS 자동 리다이렉트)
```

**자동 갱신 확인:**

bash

```bash
# Certbot은 자동으로 cron 설정됨
sudo certbot renew --dry-run

# 정상이면 성공 메시지 출력
```