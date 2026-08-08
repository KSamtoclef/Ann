window.ANN_COMMENTS={
  storageKey:'ann_comments_v1',
  read(){try{return JSON.parse(localStorage.getItem(this.storageKey)||'[]')}catch(e){return[]}},
  write(list){try{localStorage.setItem(this.storageKey,JSON.stringify(list.slice(0,80)))}catch(e){}},
  render(targetId){
    const target=document.getElementById(targetId);if(!target)return;
    const items=this.read();
    const initials=n=>(n||'Guest').split(/\s+/).map(x=>x[0]).join('').slice(0,2).toUpperCase()||'G';
    target.innerHTML=`<div class="comment-box"><div class="comment-head"><strong>Comments</strong></div><div class="comment-list">${items.length?items.map(c=>`<div class="comment"><div class="avatar">${initials(c.name)}</div><div class="comment-body"><b>${this.escape(c.name||'Guest')}</b><p>${this.escape(c.text)}</p><div class="comment-meta">${this.age(c.ts)}</div></div></div>`).join(''):'<div class="comment" style="border:0"><div class="comment-body"><p>No comments yet.</p></div></div>'}</div><div class="comment-form"><input data-comment-input placeholder="Write a comment…"><button data-comment-send>Post</button></div></div>`;
    target.querySelector('[data-comment-send]')?.addEventListener('click',()=>{const input=target.querySelector('[data-comment-input]');const text=input?.value.trim();if(!text)return;const list=this.read();list.unshift({name:'Guest',text:text.slice(0,180),ts:Date.now()});this.write(list);this.renderAll()});
  },
  renderAll(){['landingComments','registrationComments','shareComments','finalComments'].forEach(id=>this.render(id))},
  escape(v){return String(v||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]))},
  age(ts){const s=Math.max(0,Math.floor((Date.now()-(ts||Date.now()))/1000));if(s<60)return'now';const m=Math.floor(s/60);if(m<60)return`${m}m`;return`${Math.floor(m/60)}h`}
};
