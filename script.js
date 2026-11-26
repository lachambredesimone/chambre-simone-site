(() => {
  const root = document.getElementById('site-content');
  const esc = (value = '') => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const textBlock = (value = '') => String(value).split(/\n\s*\n/).map(p => `<p>${esc(p).replace(/\n/g,'<br>')}</p>`).join('');
  const val = (v, fallback = '') => v === undefined || v === null || v === '' ? fallback : v;
  const imgFrame = (src, alt, zoom=1, x=50, y=50, height=440) => src ? `<div class="photo-frame" style="--image-zoom:${Number(zoom)||1};--image-x:${Number(x)||50}%;--image-y:${Number(y)||50}%;--image-height:${Number(height)||440}px"><img src="${esc(src)}" alt="${esc(alt)}" loading="lazy"></div>` : '';
  const featureList = (items=[]) => `<ul class="feature-list">${items.map(item => `<li class="feature"><h3>${esc(item.title)}</h3><p>${esc(item.text)}</p></li>`).join('')}</ul>`;
  const sectionClass = bg => bg === 'sage' ? 'sage' : bg === 'alternate' ? 'alt' : '';

  function renderExtra(section) {
    if (section.visible === false) return '';
    const bg = sectionClass(section.background);
    const eyebrow = section.eyebrow ? `<div class="eyebrow">${esc(section.eyebrow)}</div>` : '';
    const title = section.title ? `<h2 class="section-heading">${esc(section.title)}</h2>` : '';
    const copy = textBlock(section.text || '');
    const photo = section.image ? imgFrame(section.image, section.image_alt || section.title || 'Photo de la Chambre de Simone', section.zoom, section.x, section.y, section.height) : '';
    let body = '';
    if (section.type === 'image') body = photo;
    else if (section.type === 'split') body = `<div class="two-col">${section.image_position === 'left' ? photo : `<div>${copy}</div>`}${section.image_position === 'left' ? `<div>${copy}</div>` : photo}</div>`;
    else if (section.type === 'callout') body = `<div class="quote-mark">“</div><blockquote>${copy}</blockquote>`;
    else body = `<div class="extra-inner">${copy}</div>`;
    return `<section class="extra-section ${bg} ${section.alignment === 'center' ? 'center' : ''}">${eyebrow}${title}${body}</section>`;
  }

  function applyTheme(data) {
    const theme = data.theme || {};
    const map = {page_bg:'--page-bg', hero_bg:'--hero-bg', section_bg:'--section-bg', alt_bg:'--alt-bg', room_bg:'--room-bg', text_color:'--text', heading_color:'--heading', button_bg:'--button', button_text:'--button-text'};
    Object.entries(map).forEach(([key, css]) => {
      if (theme[key] && /^#[0-9a-f]{3,8}$/i.test(theme[key])) document.documentElement.style.setProperty(css, theme[key]);
    });
  }

  function render(data) {
    applyTheme(data);
    const pillars = (data.pillars || []).map((p, i) => `<article class="pillar"><div class="symbol">${['⌕','♡','☾'][i % 3]}</div><h3>${esc(p.title)}</h3><p>${esc(p.text)}</p></article>`).join('');
    const steps = (data.night_steps || []).map((s,i) => `<article class="step"><div class="number">0${i+1}</div><h3>${esc(s.title)}</h3><p>${esc(s.text)}</p></article>`).join('');
    const gallery = (data.gallery || []).filter(g => g.image).map(g => `<figure>${imgFrame(g.image, g.caption || 'La Chambre de Simone', g.zoom, g.x, g.y, g.height || 260)}${g.caption ? `<figcaption>${esc(g.caption)}</figcaption>` : ''}</figure>`).join('');
    const email = String(data.email || '').trim();
    const phone = String(data.phone || '').trim();
    const bookingAction = email ? `<a class="button" href="mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent('Demande de séjour — La Chambre de Simone')}">Écrire à Simone</a>` : `<p class="muted">Les coordonnées de contact seront ajoutées ici prochainement.</p>`;
    const extras = (data.sections || []).map(renderExtra).join('');
    root.innerHTML = `
      <section class="hero" id="accueil">
        <div class="hero-copy"><div class="eyebrow">${esc(val(data.location,'Chambre d’hôtes insolite · Vertou, près de Nantes'))}</div><h1>${esc(data.hero_title || 'Et si, le temps d’une nuit, on prenait le temps ?')}</h1><p>${esc(data.hero_intro || '')}</p><a class="button" href="#experience">Entrez, je vous en prie</a><div class="script-note">${esc(data.hero_note || '')}</div></div>
        ${imgFrame(data.hero_image, 'Simone vous accueille dans sa chambre', data.hero_image_zoom, data.hero_image_x, data.hero_image_y, 560)}
      </section>
      <section class="section center" id="experience"><div class="eyebrow">Poussez la porte…</div><h2 class="section-heading">${esc(data.welcome_title || '')}<br><em>${esc(data.welcome_subtitle || '')}</em></h2><p class="lead">${esc(data.welcome_text || '')}</p><div class="pillars">${pillars}</div><div class="script-note">Et surtout, ne vous pressez pas. Ici, personne ne regarde sa montre !</div></section>
      <section class="quote-block"><div class="eyebrow">Un petit mot de Simone</div><div class="quote-mark">“</div><blockquote>${esc(data.simone_note || '')}</blockquote><p>${esc(data.simone_story || '')}</p></section>
      <section class="section" id="jeu"><div class="two-col"><div class="copy"><div class="eyebrow">Le jeu, sans la pression</div><h2>${esc(data.game_title || 'Une enquête qui se savoure')}</h2>${textBlock(data.game_text || '')}<p class="script-note">${esc(data.game_quote || '')}</p></div>${data.game_image ? imgFrame(data.game_image,'Quelques scènes de l’univers de Simone',1,50,50,440) : ''}</div></section>
      <section class="section sage" id="chambre"><div class="two-col"><div>${imgFrame(data.room_image,'La chambre de Simone',data.room_image_zoom,data.room_image_x,data.room_image_y,data.room_image_height)}</div><div class="copy"><div class="eyebrow">Votre petit cocon</div><h2>La chambre de Simone</h2><p>${esc(data.room_intro || '')}</p>${featureList(data.room_features || [])}<p class="muted">${esc(data.room_rules || '')}</p></div></div></section>
      <section class="family-note"><div class="copy"><div class="eyebrow">Une précision importante, en toute transparence</div><h2>${esc(data.transparency_title || '')}</h2>${textBlock(data.transparency_text || '')}</div></section>
      <section class="section center" id="sejour"><div class="eyebrow">Le temps d’une nuit</div><h2 class="section-heading">Tout est prévu… ou presque !</h2><div class="steps">${steps}</div><div class="copy" style="max-width:850px;margin:42px auto 0">${textBlock(data.location_text || '')}<p><strong>Arrivée :</strong> ${esc(data.arrival_time || 'À convenir ensemble')} · <strong>Petit-déjeuner :</strong> ${esc(data.breakfast_time || 'Le lendemain matin')} · <strong>Départ :</strong> ${esc(data.departure_time || 'À convenir')}</p></div></section>
      <section class="price-band"><div><div class="eyebrow" style="color:#f5e5d9">Une formule complète pour deux</div><h2>Vous n’avez plus qu’à profiter.</h2>${textBlock(data.package_text || '')}</div><aside><div class="eyebrow">Tarif du séjour</div><h3>${esc(data.price_week || 'À préciser')}</h3><p>Du dimanche soir au jeudi soir</p><hr><h3>${esc(data.price_weekend || 'À préciser')}</h3><p>Vendredi, samedi et veille de jour férié</p><a class="button" href="#reservation">Demander une date</a></aside></section>
      ${gallery ? `<section class="section center"><div class="eyebrow">Un aperçu de la maison</div><h2 class="section-heading">Quelques souvenirs de chez Simone</h2><div class="gallery">${gallery}</div></section>` : ''}
      ${extras}
      <section class="section" id="reservation"><div class="booking"><div class="eyebrow">À vous de jouer</div><h2 class="section-heading">Envie de venir chez Simone ?</h2><p class="lead">${esc(data.booking_intro || '')}</p><div class="booking-card"><p><strong>Votre demande de séjour</strong></p><p>Pour connaître les disponibilités ou poser une question, contactez-nous directement. La demande ne vaut pas encore réservation et aucun paiement n’est demandé à cette étape.</p><div class="contact-links">${bookingAction}${phone ? `<a class="button" href="tel:${esc(phone.replace(/[^+\d]/g,''))}">Appeler ${esc(phone)}</a>` : ''}</div></div></div></section>`;

    document.title = data.brand_name || 'La Chambre de Simone';
    const description = data.hero_intro || 'Une nuit insolite à Vertou, près de Nantes.';
    document.querySelector('meta[name="description"]')?.setAttribute('content', description);
  }

  async function start() {
    try {
      const response = await fetch('/content/site.json', {cache:'no-store'});
      if (!response.ok) throw new Error(`Le fichier de contenu ne répond pas (${response.status}).`);
      const data = await response.json();
      render(data);
    } catch (error) {
      root.innerHTML = `<div class="error-message"><h2>La maison est momentanément fermée.</h2><p>Le contenu du site n’a pas pu être chargé. Vérifiez que le dossier <strong>content/site.json</strong> est bien présent à la racine du site.</p><p class="muted">Détail technique : ${esc(error.message)}</p></div>`;
      console.error(error);
    }
  }

  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');
  toggle?.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
  });
  nav?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));
  start();
})();
