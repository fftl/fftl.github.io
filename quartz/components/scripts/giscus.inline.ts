console.log('👀 Giscus 테마 동기화 시작');

function setGiscusTheme(theme) {
  console.log('🎨 테마 변경:', theme);
  const iframe = document.querySelector('iframe.giscus-frame');
  if (!iframe) {
    console.log('❌ iframe 없음');
    return;
  }
  console.log('✅ iframe 찾음');
  const giscusTheme = theme === 'dark' ? 'dark' : 'light';
  iframe.contentWindow.postMessage(
    { giscus: { setConfig: { theme: giscusTheme } } },
    'https://giscus.app'
  );
  console.log('✉️ postMessage 전송:', giscusTheme);
}

function initGiscusTheme() {
  console.log('🚀 초기화');
  const theme = document.documentElement.getAttribute('saved-theme') || 'light';
  console.log('📌 현재 테마:', theme);
  
  let attempts = 0;
  const checkIframe = setInterval(() => {
    attempts++;
    const iframe = document.querySelector('iframe.giscus-frame');
    if (iframe) {
      console.log('✅ iframe 발견! (시도:', attempts, ')');
      clearInterval(checkIframe);
      setTimeout(() => setGiscusTheme(theme), 500);
    }
  }, 100);
  
  setTimeout(() => clearInterval(checkIframe), 10000);
}

const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.attributeName === 'saved-theme') {
      const newTheme = document.documentElement.getAttribute('saved-theme');
      console.log('🔔 테마 변경 감지:', newTheme);
      if (newTheme) setGiscusTheme(newTheme);
    }
  });
});

observer.observe(document.documentElement, {
  attributes: true,
  attributeFilter: ['saved-theme'],
});

console.log('👂 감지 활성화');
initGiscusTheme();