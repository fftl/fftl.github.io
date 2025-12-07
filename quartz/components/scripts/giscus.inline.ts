function setGiscusTheme(theme) {
  const iframe = document.querySelector('iframe.giscus-frame');
  if (!iframe) return;
  
  const giscusTheme = theme === 'dark' ? 'dark' : 'light';
  iframe.contentWindow.postMessage(
    { giscus: { setConfig: { theme: giscusTheme } } },
    'https://giscus.app'
  );
}

function initGiscusTheme() {
  const savedTheme = document.documentElement.getAttribute('saved-theme');
  const localTheme = localStorage.getItem('theme');
  const theme = savedTheme || localTheme || 'light';
  
  let attempts = 0;
  const checkIframe = setInterval(() => {
    attempts++;
    const iframe = document.querySelector('iframe.giscus-frame');
    if (iframe) {
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
      if (newTheme) setGiscusTheme(newTheme);
    }
  });
});

observer.observe(document.documentElement, {
  attributes: true,
  attributeFilter: ['saved-theme'],
});

initGiscusTheme();