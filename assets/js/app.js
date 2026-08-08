(()=>{
  'use strict';
  const C=window.ANN_CONFIG;
  const S=window.ANN_SHARING;
  const Comments=window.ANN_COMMENTS;
  const $=id=>document.getElementById(id);
  const state={package:C.defaultPackage,phone:''};

  function show(id){
    document.querySelectorAll('.screen').forEach(el=>el.classList.toggle('active',el.id===id));
    scrollTo({top:0,behavior:'smooth'});
    Comments.renderAll();
  }

  function syncPackage(){
    $('selectedPackageText').textContent=state.package;
    $('sharePackageText').textContent=state.package;
    $('finalPackageText').textContent=state.package;
    $('startBtn').textContent=`GET ${state.package} NOW`;
  }

  document.querySelectorAll('[data-package]').forEach(btn=>{
    btn.addEventListener('click',()=>{
      state.package=btn.dataset.package;
      document.querySelectorAll('[data-package]').forEach(x=>x.classList.toggle('selected',x===btn));
      syncPackage();
    });
  });

  $('startBtn').addEventListener('click',()=>{
    show('processing');
    let pct=0;
    const total=C.processingMs;
    const step=100;
    const inc=100/(total/step);
    const timer=setInterval(()=>{
      pct=Math.min(100,pct+inc);
      $('loadBar').style.width=`${pct}%`;
      $('loadPercent').textContent=`${Math.round(pct)}%`;
      if(pct>=100){
        clearInterval(timer);
        setTimeout(()=>show('registration'),250);
      }
    },step);
  });

  $('phoneInput').addEventListener('input',e=>{
    e.target.value=e.target.value.replace(/\D/g,'').slice(0,11);
  });

  $('activateBtn').addEventListener('click',()=>{
    const phone=$('phoneInput').value.trim();
    const ok=/^\d{10,11}$/.test(phone);
    $('phoneError').classList.toggle('show',!ok);
    if(!ok)return;
    state.phone=phone;
    show('share');
    updateShare();
  });

  function updateShare(){
    const pct=Math.min(100,Math.round((S.progress/C.requiredShares)*100));
    $('sharePercent').textContent=`${pct}%`;
    $('shareBar').style.width=`${pct}%`;
    $('shareCount').textContent=`${S.progress} of ${C.requiredShares} shares completed`;
    $('finishBtn').disabled=S.progress<C.requiredShares;
  }

  $('shareBtn').addEventListener('click',()=>S.open());
  $('finishBtn').addEventListener('click',()=>{
    if(S.progress>=C.requiredShares)show('final');
  });

  function handleReturn(){
    if(S.returned())updateShare();
  }
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)handleReturn()});
  window.addEventListener('focus',handleReturn);

  $('finalBtn').addEventListener('click',()=>{
    if(C.finalUrl)location.href=C.finalUrl;
  });

  syncPackage();
  Comments.renderAll();
})();
