(async function loadSupportEmail(){
  try{
    const { data, error } = await supabaseClient
      .from('settings')
      .select('support_email')
      .eq('id', 1)
      .single();
    if(error || !data || !data.support_email) return;

    document.querySelectorAll('.support-email').forEach(el => {
      el.textContent = data.support_email;
      if(el.tagName === 'A') el.href = 'mailto:' + data.support_email;
    });
  } catch(e){}
})();
