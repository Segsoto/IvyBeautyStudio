(function(){
  const root = document.documentElement;
  const navToggle = document.querySelector('[data-nav-toggle]');
  const mobilePanel = document.querySelector('.mobile-nav-panel');
  const themeButtons = document.querySelectorAll('[data-theme-toggle]');
  const STORAGE_KEY = 'ivy-theme';

  function applyTheme(theme){
    root.setAttribute('data-theme', theme);
    themeButtons.forEach((button)=>{
      button.setAttribute('aria-label', theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');
      button.innerHTML = theme === 'dark'
        ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>'
        : '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="12" cy="12" r="4.5"/><path d="M12 2v2.5M12 19.5V22M4.93 4.93l1.77 1.77M17.3 17.3l1.77 1.77M2 12h2.5M19.5 12H22M4.93 19.07l1.77-1.77M17.3 6.7l1.77-1.77"/></svg>';
    });
  }

  let savedTheme = null;
  try { savedTheme = localStorage.getItem(STORAGE_KEY); } catch (e) {}
  const systemDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(savedTheme || (systemDark ? 'dark' : 'light'));

  themeButtons.forEach((button)=>{
    button.addEventListener('click', ()=>{
      const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      try { localStorage.setItem(STORAGE_KEY, next); } catch (e) {}
    });
  });

  function setMenu(open){
    if(!navToggle || !mobilePanel) return;
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    mobilePanel.classList.toggle('is-open', open);
    document.body.classList.toggle('menu-open', open);
  }

  if(navToggle && mobilePanel){
    setMenu(false);
    navToggle.addEventListener('click', ()=>{
      const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
      setMenu(!isOpen);
    });
    mobilePanel.querySelectorAll('a').forEach((link)=>link.addEventListener('click', ()=>setMenu(false)));
    window.addEventListener('resize', ()=>{ if(window.innerWidth >= 768) setMenu(false); });
    document.addEventListener('keydown', (e)=>{ if(e.key === 'Escape') setMenu(false); });
  }

  const observer = new IntersectionObserver((entries)=>{
    entries.forEach((entry)=>{ if(entry.isIntersecting){ entry.target.classList.add('is-visible'); observer.unobserve(entry.target); } });
  }, {threshold:0.18});
  document.querySelectorAll('.reveal').forEach((el)=>observer.observe(el));
})();