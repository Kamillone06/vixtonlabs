/* ============================================================
   Pulls "services" and "works" rows from Supabase and renders
   them into any page that has a matching container element.
   If Supabase isn't reachable yet (e.g. keys not set up), falls
   back to placeholder content so the site never looks broken.
   ============================================================ */

const FALLBACK_SERVICES = [
  { title: "Business Automation", description: "Custom workflows that connect your tools and cut out repetitive manual work.", tags: ["Zapier/Make", "APIs", "Internal tools"] },
  { title: "AI Chatbots", description: "Conversational assistants trained on your business, wired into your site or WhatsApp.", tags: ["AI", "NLP", "Support"] },
  { title: "Websites", description: "Fast, modern, responsive websites built around what your business actually needs.", tags: ["React", "SEO", "Hosting"] },
  { title: "Apps", description: "Mobile and web apps from first sketch to app-store-ready product.", tags: ["iOS", "Android", "Web"] },
  { title: "Student Projects", description: "Final-year and academic projects, built properly and explained clearly.", tags: ["Guidance", "Code", "Docs"] },
];

const FALLBACK_WORKS = [
  { title: "Sample Project One", category: "Automation", description: "A short description of a project you've shipped goes here — add real ones from the admin panel.", image_url: "" },
  { title: "Sample Project Two", category: "Chatbot", description: "Swap this out with real client or personal work once your admin panel is connected.", image_url: "" },
  { title: "Sample Project Three", category: "Website", description: "Everything on this page is editable from admin.vixtonlabs.tech once Supabase is connected.", image_url: "" },
];

function escapeHtml(str){
  const div = document.createElement('div');
  div.textContent = str || '';
  return div.innerHTML;
}

function renderServices(list, container){
  container.innerHTML = list.map((s, i) => `
    <div class="card reveal reveal-delay-${(i % 3)}">
      <div class="num">${String(i + 1).padStart(2, '0')}</div>
      <h3>${escapeHtml(s.title)}</h3>
      <p>${escapeHtml(s.description)}</p>
      <div class="tags">${(s.tags || []).map(t => `<span>${escapeHtml(t)}</span>`).join('')}</div>
    </div>
  `).join('');
  // re-run reveal observer on newly injected nodes
  container.querySelectorAll('.reveal').forEach(el => {
    if('IntersectionObserver' in window){
      const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => { if(entry.isIntersecting){ entry.target.classList.add('is-visible'); io.unobserve(entry.target); } });
      }, { threshold: 0.15 });
      io.observe(el);
    } else el.classList.add('is-visible');
  });
}

function renderWorks(list, container){
  container.innerHTML = list.map((w, i) => `
    <div class="work-card reveal reveal-delay-${(i % 3)}">
      <div class="thumb">
        ${w.image_url ? `<img src="${escapeHtml(w.image_url)}" alt="${escapeHtml(w.title)}">` : 'PREVIEW IMAGE'}
      </div>
      <div class="info">
        <div class="eyebrow">${escapeHtml(w.category || 'Project')}</div>
        <h3>${escapeHtml(w.title)}</h3>
        <p>${escapeHtml(w.description)}</p>
      </div>
    </div>
  `).join('');
  container.querySelectorAll('.reveal').forEach(el => {
    if('IntersectionObserver' in window){
      const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => { if(entry.isIntersecting){ entry.target.classList.add('is-visible'); io.unobserve(entry.target); } });
      }, { threshold: 0.15 });
      io.observe(el);
    } else el.classList.add('is-visible');
  });
}

async function loadServices(){
  const container = document.querySelector('[data-services]');
  if(!container) return;
  try{
    const { data, error } = await supabaseClient
      .from('services')
      .select('*')
      .order('sort_order', { ascending: true });
    if(error || !data || !data.length) throw error || new Error('empty');
    renderServices(data, container);
  } catch(e){
    renderServices(FALLBACK_SERVICES, container);
  }
}

async function loadWorks(){
  const container = document.querySelector('[data-works]');
  if(!container) return;
  try{
    const { data, error } = await supabaseClient
      .from('works')
      .select('*')
      .order('sort_order', { ascending: true });
    if(error || !data || !data.length) throw error || new Error('empty');
    renderWorks(data, container);
  } catch(e){
    renderWorks(FALLBACK_WORKS, container);
  }
}

loadServices();
loadWorks();
