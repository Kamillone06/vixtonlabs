/* ============================================================
   Admin dashboard logic.
   Requires a signed-in Supabase user (checked on load).
   Handles add / edit / delete for "services" and "works",
   and read / delete for "messages".
   ============================================================ */

// ---- auth guard ----
(async function guard(){
  const { data: { session } } = await supabaseClient.auth.getSession();
  if(!session){
    window.location.href = 'index.html';
  }
})();

document.getElementById('logout-btn').addEventListener('click', async () => {
  await supabaseClient.auth.signOut();
  window.location.href = 'index.html';
});

// ---- view switching ----
const navLinks = document.querySelectorAll('.sidebar nav a');
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    navLinks.forEach(l => l.classList.remove('active'));
    link.classList.add('active');
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.getElementById('view-' + link.dataset.view).classList.add('active');
  });
});

/* ============================================================
   SERVICES
   ============================================================ */
const servicesForm = document.getElementById('services-form');
const servicesTableBody = document.querySelector('#services-table tbody');
const servicesEmpty = document.getElementById('services-empty');
const servicesSubmitBtn = document.getElementById('services-submit-btn');
const servicesCancelBtn = document.getElementById('services-cancel-btn');
const servicesFormTitle = document.getElementById('services-form-title');

async function loadServicesTable(){
  const { data, error } = await supabaseClient.from('services').select('*').order('sort_order', { ascending: true });
  servicesTableBody.innerHTML = '';
  if(error || !data || !data.length){
    servicesEmpty.style.display = 'block';
    return;
  }
  servicesEmpty.style.display = 'none';
  data.forEach(s => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${escapeHtml(s.title)}</td>
      <td>${s.sort_order ?? 0}</td>
      <td class="actions">
        <button class="btn btn-small" data-edit="${s.id}">Edit</button>
        <button class="btn btn-small btn-danger" data-delete="${s.id}">Delete</button>
      </td>`;
    servicesTableBody.appendChild(tr);
  });

  servicesTableBody.querySelectorAll('[data-edit]').forEach(btn => {
    btn.addEventListener('click', () => {
      const row = data.find(s => String(s.id) === btn.dataset.edit);
      document.getElementById('service-id').value = row.id;
      document.getElementById('service-title').value = row.title || '';
      document.getElementById('service-description').value = row.description || '';
      document.getElementById('service-tags').value = (row.tags || []).join(', ');
      document.getElementById('service-sort').value = row.sort_order ?? 0;
      servicesFormTitle.textContent = 'Edit service';
      servicesSubmitBtn.textContent = 'Save changes';
      servicesCancelBtn.style.display = 'inline-flex';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });
  servicesTableBody.querySelectorAll('[data-delete]').forEach(btn => {
    btn.addEventListener('click', async () => {
      if(!confirm('Delete this service?')) return;
      await supabaseClient.from('services').delete().eq('id', btn.dataset.delete);
      loadServicesTable();
    });
  });
}

function resetServicesForm(){
  servicesForm.reset();
  document.getElementById('service-id').value = '';
  servicesFormTitle.textContent = 'Add a service';
  servicesSubmitBtn.textContent = 'Add service';
  servicesCancelBtn.style.display = 'none';
}
servicesCancelBtn.addEventListener('click', resetServicesForm);

servicesForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = document.getElementById('service-id').value;
  const payload = {
    title: document.getElementById('service-title').value,
    description: document.getElementById('service-description').value,
    tags: document.getElementById('service-tags').value.split(',').map(t => t.trim()).filter(Boolean),
    sort_order: Number(document.getElementById('service-sort').value) || 0,
  };
  if(id){
    await supabaseClient.from('services').update(payload).eq('id', id);
  } else {
    await supabaseClient.from('services').insert(payload);
  }
  resetServicesForm();
  loadServicesTable();
});

/* ============================================================
   WORKS
   ============================================================ */
const worksForm = document.getElementById('works-form');
const worksTableBody = document.querySelector('#works-table tbody');
const worksEmpty = document.getElementById('works-empty');
const worksSubmitBtn = document.getElementById('works-submit-btn');
const worksCancelBtn = document.getElementById('works-cancel-btn');
const worksFormTitle = document.getElementById('works-form-title');

async function loadWorksTable(){
  const { data, error } = await supabaseClient.from('works').select('*').order('sort_order', { ascending: true });
  worksTableBody.innerHTML = '';
  if(error || !data || !data.length){
    worksEmpty.style.display = 'block';
    return;
  }
  worksEmpty.style.display = 'none';
  data.forEach(w => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${escapeHtml(w.title)}</td>
      <td>${escapeHtml(w.category || '')}</td>
      <td>${w.sort_order ?? 0}</td>
      <td class="actions">
        <button class="btn btn-small" data-edit="${w.id}">Edit</button>
        <button class="btn btn-small btn-danger" data-delete="${w.id}">Delete</button>
      </td>`;
    worksTableBody.appendChild(tr);
  });

  worksTableBody.querySelectorAll('[data-edit]').forEach(btn => {
    btn.addEventListener('click', () => {
      const row = data.find(w => String(w.id) === btn.dataset.edit);
      document.getElementById('work-id').value = row.id;
      document.getElementById('work-title').value = row.title || '';
      document.getElementById('work-category').value = row.category || '';
      document.getElementById('work-description').value = row.description || '';
      document.getElementById('work-image').value = row.image_url || '';
      document.getElementById('work-sort').value = row.sort_order ?? 0;
      worksFormTitle.textContent = 'Edit project';
      worksSubmitBtn.textContent = 'Save changes';
      worksCancelBtn.style.display = 'inline-flex';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });
  worksTableBody.querySelectorAll('[data-delete]').forEach(btn => {
    btn.addEventListener('click', async () => {
      if(!confirm('Delete this project?')) return;
      await supabaseClient.from('works').delete().eq('id', btn.dataset.delete);
      loadWorksTable();
    });
  });
}

function resetWorksForm(){
  worksForm.reset();
  document.getElementById('work-id').value = '';
  worksFormTitle.textContent = 'Add a project';
  worksSubmitBtn.textContent = 'Add project';
  worksCancelBtn.style.display = 'none';
}
worksCancelBtn.addEventListener('click', resetWorksForm);

worksForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = document.getElementById('work-id').value;
  const payload = {
    title: document.getElementById('work-title').value,
    category: document.getElementById('work-category').value,
    description: document.getElementById('work-description').value,
    image_url: document.getElementById('work-image').value,
    sort_order: Number(document.getElementById('work-sort').value) || 0,
  };
  if(id){
    await supabaseClient.from('works').update(payload).eq('id', id);
  } else {
    await supabaseClient.from('works').insert(payload);
  }
  resetWorksForm();
  loadWorksTable();
});

/* ============================================================
   MESSAGES
   ============================================================ */
const messagesTableBody = document.querySelector('#messages-table tbody');
const messagesEmpty = document.getElementById('messages-empty');

async function loadMessages(){
  const { data, error } = await supabaseClient.from('messages').select('*').order('created_at', { ascending: false });
  messagesTableBody.innerHTML = '';
  if(error || !data || !data.length){
    messagesEmpty.style.display = 'block';
    return;
  }
  messagesEmpty.style.display = 'none';
  data.forEach(m => {
    const tr = document.createElement('tr');
    const date = m.created_at ? new Date(m.created_at).toLocaleDateString() : '';
    tr.innerHTML = `
      <td>${escapeHtml(m.name)}</td>
      <td>${escapeHtml(m.email)}</td>
      <td>${escapeHtml(m.phone || '')}</td>
      <td>${escapeHtml(m.service || '')}</td>
      <td style="max-width:260px;">${escapeHtml(m.message)}</td>
      <td>${date}</td>
      <td><button class="btn btn-small btn-danger" data-delete="${m.id}">Delete</button></td>`;
    messagesTableBody.appendChild(tr);
  });
  messagesTableBody.querySelectorAll('[data-delete]').forEach(btn => {
    btn.addEventListener('click', async () => {
      if(!confirm('Delete this message?')) return;
      await supabaseClient.from('messages').delete().eq('id', btn.dataset.delete);
      loadMessages();
    });
  });
}

function escapeHtml(str){
  const div = document.createElement('div');
  div.textContent = str || '';
  return div.innerHTML;
}

/* ============================================================
   SETTINGS (support email)
   ============================================================ */
const settingsForm = document.getElementById('settings-form');
const supportEmailInput = document.getElementById('support-email-input');
const settingsStatus = document.getElementById('settings-status');

async function loadSettings(){
  const { data, error } = await supabaseClient.from('settings').select('support_email').eq('id', 1).single();
  if(!error && data){
    supportEmailInput.value = data.support_email || '';
  }
}

settingsForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  settingsStatus.textContent = 'Saving...';
  const { error } = await supabaseClient
    .from('settings')
    .update({ support_email: supportEmailInput.value })
    .eq('id', 1);
  if(error){
    settingsStatus.textContent = 'Could not save — try again.';
    settingsStatus.style.color = 'var(--danger)';
  } else {
    settingsStatus.textContent = 'Saved — the site will show this on next load.';
    settingsStatus.style.color = 'var(--ok)';
  }
});

loadServicesTable();
loadWorksTable();
loadMessages();
loadSettings();
