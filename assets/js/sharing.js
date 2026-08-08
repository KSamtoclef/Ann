window.ANN_SHARING={
  opened:false,
  progress:0,
  open(){
    const C=window.ANN_CONFIG;
    this.opened=true;
    const url=location.href.split('#')[0];
    location.href=`https://wa.me/?text=${encodeURIComponent(C.shareMessage+' '+url)}`;
  },
  returned(){
    if(!this.opened)return false;
    this.opened=false;
    const max=window.ANN_CONFIG.requiredShares;
    if(this.progress<max)this.progress++;
    return true;
  }
};
