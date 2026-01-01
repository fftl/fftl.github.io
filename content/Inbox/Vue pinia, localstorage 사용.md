---
date: 2025-11-28
---

``` typescript
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    username: localStorage.getItem('username') || '',
    accessToken: localStorage.getItem('accessToken') || '',
    refreshToken: localStorage.getItem('refreshToken') || '',
  }),

  actions: {
    setToken(access: string, refresh: string, username: string) {
      this.accessToken = access
      this.refreshToken = refresh
      this.username = username
      localStorage.setItem('accessToken', access)
      localStorage.setItem('refreshToken', refresh)
      localStorage.setItem('username', username)
    },

    clearTokens() {      
	  this.accessToken = ''
      this.refreshToken = ''
      this.username = ''
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('username')
    },
  },
})
```

## Pinia만 쓰면? 
- 새로고침하면 로그인 풀림 

## localStorage만 쓰면? 
- 값이 바뀔 때마다 수동으로 읽어야 함
- Vue의 반응형 시스템 활용 못 함 

## 둘 다 쓰면?
- Pinia: 빠른 읽기 + 자동 UI 업데이트
- localStorage: 새로고침해도 로그인 유지

위처럼 일일이 추가해서 사용해도 좋지만 `pinia-plugin-persistedstate`를 이용하면 더 깔끔하게 상태관리를 할 수 있습니다.

``` typescript
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    username: '',
    accessToken: '',
    refreshToken: '',
  }),

  actions: {
    setToken(access: string, refresh: string, username: string) {
      this.accessToken = access
      this.refreshToken = refresh
      this.username = username
    },
    clearTokens() {
      this.accessToken = ''
      this.refreshToken = ''
      this.username = ''
    },
  },
  persist: true,
})

```