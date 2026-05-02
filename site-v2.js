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
<nav class="nav" id="nav">
  <div class="nav-i">
    <div class="nav-brand">
      <a href="index.html" class="logo" style="overflow:hidden;height:48px;width:182px;display:block;flex-shrink:0;"><img src="unicambio_logo_fullhd.png" alt="Unicâmbio" style="height:182px;width:auto;display:block;margin-top:-67px;"></a>
      <a href="western-union.html" class="wu-nav-logo"><img src="https://www.unicambio.pt/images/WesternUnion.png" alt="Western Union"></a>
    </div>
    <div class="nav-links">
      <div class="nav-item">
        <a href="cambios.html">Serviços</a>
        <div class="nav-drop">
          <a href="cambios.html">Câmbio de Moeda</a>
          <a href="reserva.html#form">Reserva de Moeda</a>
          <a href="western-union.html">Western Union</a>
          <a href="ouro.html">Compra de Ouro</a>
          <a href="credito.html">Crédito Pessoal</a>
          <a href="taxfree.html">Tax Free</a>
          <a href="sim.html">Cartões SIM</a>
          <a href="https://unimoney.pt" target="_blank">Wallet Unimoney ↗</a>
        </div>
      </div>
      <div class="nav-item">
        <a href="western-union.html">Western Union</a>
        <div class="nav-drop">
          <a href="western-union.html">Enviar Dinheiro</a>
          <a href="western-union.html#quickpay">Quick Pay WU</a>
        </div>
      </div>
      <a href="balcoes.html">Balcões</a>
      <div class="nav-item">
        <a href="quem-somos.html">Sobre Nós</a>
        <div class="nav-drop">
          <a href="quem-somos.html">Quem Somos</a>
          <a href="quem-somos.html#compliance">Compliance</a>
          <a href="quem-somos.html#institucional">Informação Institucional</a>
          <a href="quem-somos.html#imprensa">Imprensa</a>
          <a href="trabalhe-connosco.html">Trabalhar na Unicâmbio</a>
          <a href="contactos.html">Contactos</a>
        </div>
      </div>
      <a href="blog.html">Blog</a>
      <a href="empresas.html">Empresas</a>
    </div>
    <div class="nav-r">
      <a href="balcoes.html" class="btn-ghost">Ver Balcões</a>
      <a href="reserva.html#form" class="btn-dark">Reservar Moeda</a>
      <button class="burger" id="burger" aria-label="Menu">
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
        <a href="index.html" style="display:block;height:48px;overflow:hidden;width:182px;flex-shrink:0;">
          <img src="unicambio_logo_fullhd.png" alt="Unicâmbio" style="height:182px;width:auto;display:block;margin-top:-67px;">
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
        <a href="trabalhe-connosco.html">Trabalhar na Unicâmbio</a>
        <a href="contactos.html">Contactos</a>
        <a href="blog.html">Blog</a>
      </div>
      <div class="footer-col">
        <h4>Legal</h4>
        <a href="#">Preçário (PDF)</a>
        <a href="#">Documento de Informação sobre Comissões</a>
        <a href="#">Política de Privacidade</a>
        <a href="#">Informações Legais</a>
        <a href="https://www.livroreclamacoes.pt/inicio" target="_blank">Livro de Reclamações ↗</a>
        <a href="#">Resolução de Conflitos</a>
        <a href="#">Canal de Denúncias</a>
        <a href="#">Reporte de Fraude</a>
        <a href="#">Serviço de Mudança de Conta</a>
        <a href="#">API PSD2</a>
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

function initNav(activeKey) {
  const navHost = document.getElementById('site-nav');
  if (navHost) navHost.innerHTML = UNI_NAV;
  const footerHost = document.getElementById('site-footer');
  if (footerHost) footerHost.innerHTML = UNI_FOOTER;
  const navEl = document.getElementById('nav');
  if (navEl) window.addEventListener('scroll', () => navEl.classList.toggle('sc', scrollY > 56), {passive:true});
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
