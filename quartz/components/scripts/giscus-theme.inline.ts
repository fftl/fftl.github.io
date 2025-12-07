function setGiscusTheme(theme) {
  const iframe = document.querySelector('iframe.giscus-frame')
  if (!iframe) return

  const giscusTheme = theme === 'dark' ? 'dark' : 'light'
  iframe.contentWindow?.postMessage(
    { giscus: { setConfig: { theme: giscusTheme } } },
    'https://giscus.app'
  )
}

// 초기 테마 적용 (iframe 로딩 대기)
function initGiscusTheme() {
  const theme = document.documentElement.getAttribute('saved-theme') || 'light'
  const checkIframe = setInterval(() => {
    const iframe = document.querySelector('iframe.giscus-frame')
    if (iframe) {
      clearInterval(checkIframe)
      setTimeout(() => setGiscusTheme(theme), 500)
    }
  }, 100)
  
  // 10초 후 타임아웃
  setTimeout(() => clearInterval(checkIframe), 10000)
}

// 테마 변경 감지
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.attributeName === 'saved-theme') {
      const newTheme = document.documentElement.getAttribute('saved-theme')
      if (newTheme) setGiscusTheme(newTheme)
    }
  })
})

observer.observe(document.documentElement, {
  attributes: true,
  attributeFilter: ['saved-theme'],
})

// 페이지 로드 시 실행
document.addEventListener('DOMContentLoaded', initGiscusTheme)