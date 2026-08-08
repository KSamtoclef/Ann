window.ANN_SHARING={
  key:'ann_share_progress_v2',
  width:Number(localStorage.getItem('ann_share_progress_v2')||0),
  sequence:[50,65,70,80,85,87,88,90,91,92,93,94,95,96,98,100],
  open(){
    const C=window.ANN_CONFIG;
    const page=location.href.split('#')[0];
    const text=`${C.shareMessage}\n${page}`;
    window.location.href=`https://wa.me/?text=${encodeURIComponent(text)}`;
    this.advance();
  },
  advance(){
    const current=this.width;
    const next=this.sequence.find(v=>v>current)||100;
    this.width=next;
    try{localStorage.setItem(this.key,String(this.width))}catch(e){}
    return this.width;
  },
  reset(){this.width=0;try{localStorage.removeItem(this.key)}catch(e){}}
};
