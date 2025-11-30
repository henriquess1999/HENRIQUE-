// Remove background similar to the corner color from small logo images using canvas.
// Works best for local images (no CORS). It replaces the image src with a PNG data URL.
(function(){
  function averageCornerColor(ctx, w, h, sample=6){
    const pixels = ctx.getImageData(0,0,w,h).data;
    // sample small square in each corner
    const getPixel = (x,y) => {
      const i = (y*w + x)*4; return [pixels[i], pixels[i+1], pixels[i+2]];
    };
    const areas = [
      {sx:0, sy:0},
      {sx:w-sample, sy:0},
      {sx:0, sy:h-sample},
      {sx:w-sample, sy:h-sample}
    ];
    let r=0,g=0,b=0,count=0;
    areas.forEach(a=>{
      for(let yy=0; yy<sample; yy++){
        for(let xx=0; xx<sample; xx++){
          const px = getPixel(Math.max(0,Math.min(w-1,a.sx+xx)), Math.max(0,Math.min(h-1,a.sy+yy)));
          r+=px[0]; g+=px[1]; b+=px[2]; count++;
        }
      }
    });
    return [r/count, g/count, b/count];
  }

  function colorDistance(c1, c2){
    const dr = c1[0]-c2[0], dg=c1[1]-c2[1], db=c1[2]-c2[2];
    return Math.sqrt(dr*dr+dg*dg+db*db);
  }

  function processImage(img, options){
    options = Object.assign({tolerance:55, minAlpha:12, pad:8}, options||{});
    if(!img || img.dataset.logoFixed) return;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    function run(){
      const w = img.naturalWidth, h = img.naturalHeight;
      if(!w||!h) return;
      canvas.width = w; canvas.height = h;
      ctx.clearRect(0,0,w,h);
      ctx.drawImage(img,0,0,w,h);
      let imgData;
      try{
        imgData = ctx.getImageData(0,0,w,h);
      }catch(e){ console.warn('logo-fix: cannot access image data (CORS or tainted) for', img.src); return; }
      const bg = averageCornerColor(ctx,w,h, Math.max(4, Math.floor(Math.min(w,h)/20)));
      const data = imgData.data;
      const tol = options.tolerance;
      for(let i=0;i<data.length;i+=4){
        const r=data[i], g=data[i+1], b=data[i+2], a=data[i+3];
        if(a===0) continue;
        const dist = colorDistance([r,g,b], bg);
        const brightness = (r*0.299 + g*0.587 + b*0.114);
        if(dist < tol && brightness > options.minAlpha){
          data[i+3] = 0;
        }
      }
      ctx.putImageData(imgData,0,0);

      // compute bounding box of non-transparent pixels to crop margins
      const out = ctx.getImageData(0,0,w,h).data;
      let minX=w, minY=h, maxX=0, maxY=0, found=false;
      for(let y=0;y<h;y++){
        for(let x=0;x<w;x++){
          const idx = (y*w + x)*4;
          if(out[idx+3] > 10){
            found = true;
            if(x<minX) minX=x; if(y<minY) minY=y;
            if(x>maxX) maxX=x; if(y>maxY) maxY=y;
          }
        }
      }

      let finalCanvas = document.createElement('canvas');
      let fctx = finalCanvas.getContext('2d');
      if(found){
        // add padding but clamp to canvas
        minX = Math.max(0, minX - options.pad);
        minY = Math.max(0, minY - options.pad);
        maxX = Math.min(w-1, maxX + options.pad);
        maxY = Math.min(h-1, maxY + options.pad);
        const cw = maxX - minX + 1;
        const ch = maxY - minY + 1;
        // target max width to keep layout predictable (increase for high-res logos)
        const targetMax = 800;
        const scale = Math.min(1, targetMax / cw);
        finalCanvas.width = Math.round(cw * scale);
        finalCanvas.height = Math.round(ch * scale);
        // draw cropped area into temp canvas
        const temp = document.createElement('canvas');
        temp.width = cw; temp.height = ch;
        const tctx = temp.getContext('2d');
        const cropped = ctx.getImageData(minX,minY,cw,ch);
        tctx.putImageData(cropped,0,0);
        // apply slight contrast/saturate filter when drawing to final canvas
        fctx.filter = 'contrast(1.12) saturate(1.25)';
        fctx.drawImage(temp, 0, 0, finalCanvas.width, finalCanvas.height);
      }else{
        // nothing found, use original but apply filter
        finalCanvas.width = w; finalCanvas.height = h;
        fctx.filter = 'contrast(1.12) saturate(1.25)';
        fctx.drawImage(canvas, 0, 0);
      }

      try{
        const dataUrl = finalCanvas.toDataURL('image/png');
        img.src = dataUrl;
        img.dataset.logoFixed = '1';
      }catch(e){ console.warn('logo-fix: failed to export dataURL', e); }
    }
    if(img.complete) run(); else img.onload = run;
  }

  window.addEventListener('load', function(){
    // Only process local project logo to avoid CORS issues
    ['.header-logo-img', '.footer-logo-img'].forEach(sel=>{
      document.querySelectorAll(sel).forEach(img=>{
        // only process if image source is local (same origin) or already downloaded
        try{
          const url = new URL(img.src, location.href);
          if(url.origin === location.origin){ processImage(img); }
        }catch(e){ /* ignore */ }
      });
    });
  });
})();
