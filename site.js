/* Unicâmbio — shared nav + footer injection + common interactions */


const UNI_NAV = `
<div class="topbar">
  <div class="topbar-inner">
    <span>Linha de Apoio: <a href="tel:800506066" class="phone">800 50 60 66</a> · das 9h às 19h</span>
    <div class="topbar-right">
      <span class="hide-sm">Fora de Portugal: <a href="tel:+351300509120" class="phone">(+351) 300 509 120</a></span>
      <a href="contactos.html" class="hide-sm">info@unicambio.pt</a>
      <a href="denuncias.html" class="hide-sm" style="color:var(--yellow);">Denúncias</a>
    </div>
  </div>
</div>
<nav class="nav">
  <div class="nav-inner">
    <a href="index.html" class="logo">
      <span class="logo-mark">U</span>
      <span>Unicâmbio</span>
    </a>
    <div class="nav-links">
      <div class="has-menu">
        <button data-nav="servicos">Serviços <svg width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1l4 4 4-4" stroke="currentColor" stroke-width="1.3"/></svg></button>
        <div class="menu">
          <a href="cambios.html">Câmbios</a>
          <a href="reserva.html">Reserva de Moeda</a>
          <a href="western-union.html">Western Union</a>
          <a href="ouro.html">Compra de Ouro</a>
          <a href="credito.html">Crédito Pessoal</a>
          <a href="taxfree.html">Tax Free</a>
          <a href="sim.html">Cartões SIM</a>
          <a href="https://unimoney.pt" target="_blank">Wallet Unimoney ↗</a>
        </div>
      </div>
      <div class="has-menu">
        <button data-nav="wu">Western Union <svg width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1l4 4 4-4" stroke="currentColor" stroke-width="1.3"/></svg></button>
        <div class="menu">
          <a href="western-union.html">Western Union</a>
          <a href="western-union.html#quickpay">Quick Pay WU</a>
          <a href="western-union.html#mobile">WU Mobile</a>
        </div>
      </div>
      <a href="balcoes.html" data-nav="balcoes">Balcões</a>
      <div class="has-menu">
        <button data-nav="sobre">Sobre Nós <svg width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1l4 4 4-4" stroke="currentColor" stroke-width="1.3"/></svg></button>
        <div class="menu">
          <a href="quem-somos.html">Quem Somos</a>
          <a href="quem-somos.html#compliance">Compliance</a>
          <a href="quem-somos.html#institucional">Informação Institucional</a>
          <a href="quem-somos.html#imprensa">Imprensa</a>
          <a href="quem-somos.html#carreiras">Trabalhar na Unicâmbio</a>
          <a href="contactos.html">Contactos</a>
        </div>
      </div>
      <a href="blog.html" data-nav="blog">Blog</a>
      <a href="empresas.html" data-nav="empresas">Empresas</a>
    </div>
    <div class="nav-cta">
      <span class="lang-toggle"><span class="active">PT</span> · <span>EN</span></span>
      <a href="reserva.html" class="btn btn-primary btn-sm">Reservar Moeda</a>
      <button class="burger" aria-label="Menu">
        <svg width="16" height="12" viewBox="0 0 16 12" fill="none"><path d="M1 1h14M1 6h14M1 11h14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
      </button>
    </div>
  </div>
</nav>
`;

const UNI_FOOTER = `
<footer class="footer">
  <div class="container">
    <div class="footer-top">
      <div>
        <a href="index.html" class="logo">
          <span class="logo-mark">U</span>
          <span>Unicâmbio</span>
        </a>
        <p class="footer-tag">A sua casa de câmbios de confiança desde 1992.</p>
        <div class="footer-socials">
          <a href="https://www.instagram.com/unicambio.pt/" aria-label="Instagram" target="_blank">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1.5" y="1.5" width="11" height="11" rx="3" stroke="currentColor" stroke-width="1.2"/><circle cx="7" cy="7" r="2.5" stroke="currentColor" stroke-width="1.2"/><circle cx="10" cy="4" r="0.6" fill="currentColor"/></svg>
          </a>
          <a href="https://www.facebook.com/Unicambio/" aria-label="Facebook" target="_blank">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M8 5V3.5c0-.5.5-1 1-1h1V1H8.5C7 1 6 2 6 3.5V5H4.5v1.5H6V13h2V6.5h1.5L10 5H8z" fill="currentColor"/></svg>
          </a>
        </div>
      </div>
      <div class="footer-col">
        <h4>Serviços</h4>
        <a href="cambios.html">Câmbios</a>
        <a href="reserva.html">Reserva de Moeda</a>
        <a href="western-union.html">Western Union</a>
        <a href="ouro.html">Compra de Ouro</a>
        <a href="credito.html">Crédito Pessoal</a>
        <a href="taxfree.html">Tax Free</a>
        <a href="sim.html">Cartões SIM</a>
        <a href="https://unimoney.pt" target="_blank">Wallet Unimoney ↗</a>
      </div>
      <div class="footer-col">
        <h4>Empresa</h4>
        <a href="quem-somos.html">Quem Somos</a>
        <a href="parcerias.html">Parcerias</a>
        <a href="empresas.html">Empresas</a>
        <a href="quem-somos.html#imprensa">Imprensa</a>
        <a href="quem-somos.html#carreiras">Trabalhar na Unicâmbio</a>
        <a href="contactos.html">Contactos</a>
        <a href="blog.html">Blog</a>
      </div>
      <div class="footer-col">
        <h4>Documentos</h4>
        <a href="files/precario.pdf" target="_blank" rel="noopener noreferrer">Preçário (PDF) ↗</a>
        <a href="files/comissoes.pdf" target="_blank" rel="noopener noreferrer">Informação sobre Comissões ↗</a>
        <a href="privacidade.html">Política de Privacidade</a>
        <a href="acessibilidade.html">Acessibilidade</a>
        <a href="informacoes-legais.html">Informações Legais</a>
      </div>
      <div class="footer-col">
        <h4>Apoio ao Cliente</h4>
        <a href="contactos.html">Contactos</a>
        <a href="https://www.livroreclamacoes.pt/inicio" target="_blank" rel="noopener noreferrer">Livro de Reclamações ↗</a>
        <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer">Plataforma ODR (UE) ↗</a>
        <a href="resolucao-conflitos.html">Resolução de Conflitos</a>
        <a href="fraude.html">Reporte de Fraude</a>
        <a href="denuncias.html">Canal de Denúncias</a>
        <a href="mudanca-conta.html">Serviço de Mudança de Conta</a>
      </div>
    </div>
    <p class="footer-legal-text">Unicâmbio — Instituição de Pagamento, S.A., autorizada e regulada pelo Banco de Portugal, registo nº 824. Capital Social: 2.000.000€. Sede: Aeroporto de Lisboa, Rua C, Edifício 124, 5º Piso, 1700-008 Lisboa. NIF: 502 870 206.</p>
    <div class="footer-bottom">
      <span>© 2026 Unicâmbio. Todos os direitos reservados.</span>
      <span>PT · EN</span>
    </div>
  </div>
</footer>
`;

const COOKIE_BANNER = `<div id="cookie-banner" style="position:fixed;bottom:0;left:0;right:0;z-index:9999;background:#0d1929;border-top:1px solid rgba(255,209,0,.15);padding:14px 24px;display:flex;align-items:center;justify-content:space-between;gap:16px;box-shadow:0 -4px 24px rgba(0,0,0,.3);font-size:13px;line-height:1.5;"><p style="margin:0;color:rgba(255,255,255,.7);max-width:800px;">Este site utiliza recursos externos (Google Fonts, mapas Leaflet) que transmitem o seu endereço IP a servidores de terceiros. Consulte a nossa <a href="privacidade.html" style="color:#FFD100;text-decoration:underline;">Política de Privacidade</a>.</p><button onclick="document.getElementById('cookie-banner').remove();localStorage.setItem('uni_notice','1')" style="background:#FFD100;color:#000;border:none;padding:9px 18px;border-radius:8px;font-weight:700;cursor:pointer;white-space:nowrap;flex-shrink:0;font-size:13px;">Aceitar e Fechar</button></div>`;

function initNav(activeKey) {
  const navHost = document.getElementById('site-nav');
  if (navHost) navHost.innerHTML = UNI_NAV;
  const footerHost = document.getElementById('site-footer');
  if (footerHost) footerHost.innerHTML = UNI_FOOTER;
  if (!localStorage.getItem('uni_notice')) {
    document.body.insertAdjacentHTML('beforeend', COOKIE_BANNER);
  }
  if (activeKey) {
    const link = document.querySelector(`[data-nav="${activeKey}"]`);
    if (link) link.classList.add('active');
  }
  // FAQ accordion
  document.querySelectorAll('.faq-question').forEach(q => {
    q.addEventListener('click', () => q.closest('.faq-item').classList.toggle('open'));
  });
  // Scroll reveal
  const io = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.section-head, .card, .vp, .post-card, .stat, .block, .cta-band h2, .tl-cell')
    .forEach(el => { el.classList.add('reveal'); io.observe(el); });
}

window.initNav = initNav;
