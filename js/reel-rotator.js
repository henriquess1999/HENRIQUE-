// Rotates visible iframe reels in the `.reel-carousel` container.
(function(){
  const ROTATE_INTERVAL_MS = 12000; // time each reel stays visible

  function startRotator(){
    const frames = Array.from(document.querySelectorAll('.reel-frame'));
    if(!frames.length) return;

    let idx = 0;
    frames.forEach((f,i)=>{
      f.classList.remove('active');
      f.style.display = 'none';
    });

    frames[0].classList.add('active');
    frames[0].style.display = 'block';

    setInterval(()=>{
      frames[idx].classList.remove('active');
      frames[idx].style.display = 'none';
      idx = (idx + 1) % frames.length;
      frames[idx].classList.add('active');
      frames[idx].style.display = 'block';
    }, ROTATE_INTERVAL_MS);
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', startRotator);
  } else {
    startRotator();
  }
})();
