function setGiscusTheme(theme) {
  console.log('🎨 setGiscusTheme 호출됨:', theme)
  
  const iframe = document.querySelector('iframe.giscus-frame')
  if (!iframe) {
    console.log('❌ Giscus iframe을 찾을 수 없음')
    return
  }
  
  console.log('✅ Giscus iframe 찾음')
  
  const giscusTheme = theme === 'dark' ? 'dark' : 'light'
  console.log('🔄 Giscus 테마 변경 시도:', giscusTheme)
  
  iframe.contentWindow?.postMessage(
    { giscus: { setConfig: { theme: giscusTheme } } },
    'https://giscus.app'
  )
  
  console.log('✉️ postMessage 전송 완료')
}

function initGiscusTheme() {
  console.log('🚀 initGiscusTheme 시작')
  
  const theme = document.documentElement.getAttribute('saved-theme') || 'light'
  console.log('📌 현재 테마:', theme)
  
  let attempts = 0
  const checkIframe = setInterval(() => {
    attempts++
    const iframe = document.querySelector('iframe.giscus-frame')
    
    if (iframe) {
      console.log('✅ iframe 발견! (시도 횟수:', attempts, ')')
      clearInterval(checkIframe)
      setTimeout(() => setGiscusTheme(theme), 500)
    } else {
      console.log('⏳ iframe 대기 중... (시도:', attempts, ')')
    }
  }, 100)
  
  setTimeout(() => {
    clearInterval(checkIframe)
    console.log('⏱️ 타임아웃: iframe을 찾지 못함')
  }, 10000)
}

console.log('👀 Giscus 테마 동기화 스크립트 로드됨')

const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.attributeName === 'saved-theme') {
      const newTheme = document.documentElement.getAttribute('saved-theme')
      console.log('🔔 테마 변경 감지:', newTheme)
      if (newTheme) setGiscusTheme(newTheme)
    }
  })
})

observer.observe(document.documentElement, {
  attributes: true,
  attributeFilter: ['saved-theme'],
})

console.log('👂 테마 변경 감지 시작')

document.addEventListener('DOMContentLoaded', () => {
  console.log('📄 DOM 로드 완료')
  initGiscusTheme()
})