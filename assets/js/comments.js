window.ANN_COMMENTS={
  storageKey:'ann_real_comments_v2',
  read(){try{return JSON.parse(localStorage.getItem(this.storageKey)||'[]')}catch(e){return[]}},
  write(list){try{localStorage.setItem(this.storageKey,JSON.stringify(list.slice(0,100)))}catch(e){}},
  esc(v){return String(v||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]))},
  initials(n){return String(n||'Guest').split(/\s+/).map(x=>x[0]).join('').slice(0,2).toUpperCase()||'G'},
  age(ts){const s=Math.max(0,Math.floor((Date.now()-(ts||Date.now()))/1000));if(s<60)return'1m';const m=Math.floor(s/60);if(m<60)return`${m}m`;return`${Math.floor(m/60)}h`},
  render(){
    const root=document.getElementById('commentList');if(!root)return;
    const items=this.read();
    root.innerHTML=items.map((c,i)=>`<div class="comment${c.reply?' reply':''}"><div class="avatar">${this.initials(c.name)}</div><div class="single-container"><span class="user">${this.esc(c.name||'Guest')}</span><span class="text">${this.esc(c.text)}</span></div><div class="buttons"><span class="time">${this.age(c.ts)}</span><span class="dot"> · </span><span class="action liked">Like</span> · <span class="action">Reply</span></div></div>`).join('');
  },
  add(text){const list=this.read();list.unshift({name:'Guest',text:text.slice(0,180),ts:Date.now(),reply:false});this.write(list);this.render()},
  init(){
    this.render();
    const input=document.getElementById('commentInput');
    input?.addEventListener('keydown',e=>{if(e.key==='Enter'&&input.value.trim()){this.add(input.value.trim());input.value=''}});
  }
};
