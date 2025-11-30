/*
  reel-local-loader.js
  - If local MP4 files exist at `assets/reels/reel1.mp4` ... `reel4.mp4`, this script
    replaces the Instagram iframe embeds with native <video> elements and runs a rotator.
  - Fallback: if no local files are present, existing iframes remain as-is.
*/
(function(){
  const LOCAL_PATHS = [
    'assets/reels/reel1.mp4',
    'assets/reels/reel2.mp4',
    'assets/reels/reel3.mp4',
    'assets/reels/reel4.mp4'
  ];

  const ROTATE_MS = 12000;

  async function exists(path){
    try{
      const res = await fetch(path, { method: 'HEAD' });
      return res.ok;
    } catch(e){
      return false;
    }
  }

  async function init(){
    const checks = await Promise.all(LOCAL_PATHS.map(p => exists(p)));
    if(!checks.some(Boolean)) return; // no local videos, keep iframes

    const carousel = document.getElementById('reelCarousel');
    if(!carousel) return;

    // build video elements for available files
    const videos = [];
    carousel.innerHTML = ''; // remove existing iframes

    for(let i=0;i<LOCAL_PATHS.length;i++){
      if(!checks[i]) continue;
      const src = LOCAL_PATHS[i];
      const v = document.createElement('video');
      v.className = 'reel-video';
      v.src = src;
      v.muted = true; // keep muted so autoplay works; user can unmute via controls
      v.playsInline = true;
      v.preload = 'metadata';
      v.controls = true; // make audio controls visible
      v.loop = false;
      v.setAttribute('playsinline','');
      v.style.display = 'none';
      carousel.appendChild(v);
      videos.push(v);
    }

    if(!videos.length) return;

    // show first video
    let idx = 0;
    function show(i){
      videos.forEach((vv, j) => {
        if(j === i){
          vv.classList.add('active');
          vv.style.display = 'block';
          vv.currentTime = 0;
          vv.play().catch(()=>{});
        } else {
          vv.classList.remove('active');
          vv.pause();
          vv.style.display = 'none';
        }
      });
    }

    // Create overlay unmute button
    let unmuteBtn = carousel.querySelector('.reel-unmute-btn');
    if(!unmuteBtn){
      unmuteBtn = document.createElement('button');
      unmuteBtn.type = 'button';
      unmuteBtn.className = 'reel-unmute-btn';
      unmuteBtn.setAttribute('aria-pressed','false');
      unmuteBtn.title = 'Ativar som';
      unmuteBtn.innerText = 'Ativar Som';
      carousel.appendChild(unmuteBtn);
    }

    function updateUnmuteButtonState(){
      const active = videos.find(v => v.classList.contains('active'));
      if(!active) return;
      if(active.muted){
        unmuteBtn.innerText = 'Ativar Som';
        unmuteBtn.setAttribute('aria-pressed','false');
      } else {
        unmuteBtn.innerText = 'Desativar Som';
        unmuteBtn.setAttribute('aria-pressed','true');
      }
    }

    unmuteBtn.addEventListener('click', ()=>{
      const active = videos.find(v => v.classList.contains('active'));
      if(!active) return;
      const newMuted = !active.muted;
      // toggle mute only for active video; keep others muted
      videos.forEach(vv => {
        vv.muted = true;
      });
      active.muted = newMuted;
      updateUnmuteButtonState();
      // if unmuted, ensure it plays
      if(!active.muted) active.play().catch(()=>{});
    });

    // set initial button state
    updateUnmuteButtonState();

    show(0);

    setInterval(()=>{
      idx = (idx + 1) % videos.length;
      show(idx);
    }, ROTATE_MS);

    // Add 'reduce white bands' toggle button
    let tightBtn = carousel.querySelector('.reel-tight-btn');
    if(!tightBtn){
      tightBtn = document.createElement('button');
      tightBtn.type = 'button';
      tightBtn.className = 'reel-tight-btn';
      tightBtn.title = 'Reduzir bordas brancas';
      tightBtn.innerText = 'Reduzir Bordas';
      carousel.appendChild(tightBtn);
    }

    tightBtn.addEventListener('click', ()=>{
      carousel.classList.toggle('reel--tight');
    });
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
