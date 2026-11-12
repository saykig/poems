// Localized motion in the September painting; the original remains the fallback.
export function startLivingArt() {
 const reduce=matchMedia('(prefers-reduced-motion: reduce)');
 let motionEnabled=!reduce.matches;
 const control=document.createElement('button');control.type='button';control.textContent=motionEnabled?'Pause artwork':'Play artwork';control.setAttribute('aria-pressed',String(motionEnabled));control.style.cssText='position:fixed;right:24px;bottom:18px;z-index:60;padding:8px 14px;border:1px solid #ffffff40;border-radius:4px;background:#243a52;color:#f5eedb;font:14px Georgia;display:none';document.body.append(control);control.onclick=()=>{motionEnabled=!motionEnabled;control.textContent=motionEnabled?'Pause artwork':'Play artwork';control.setAttribute('aria-pressed',String(motionEnabled));};
 const overlay=document.createElement('canvas'); overlay.setAttribute('aria-hidden','true');
 overlay.style.cssText='position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:50'; document.body.append(overlay);
 const ctx=overlay.getContext('2d'); let active=null, renderer=null, last=0, elapsed=0;
 const leaves=Array.from({length:9},(_,i)=>({phase:i/9,size:5+i%4,seed:i*2.399}));
 function setup(img) {
  const canvas=document.createElement('canvas'); canvas.setAttribute('aria-hidden','true');
  canvas.style.cssText='position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:1';
  const gl=canvas.getContext('webgl',{alpha:false,antialias:false}); if(!gl){
   const c=document.createElement('canvas');c.setAttribute('aria-hidden','true');c.style.cssText=canvas.style.cssText;c.width=img.naturalWidth;c.height=img.naturalHeight;const x=c.getContext('2d');img.parentElement.append(c);
   return {canvas:c,draw(t){const w=c.width,h=c.height;x.drawImage(img,0,0,w,h);
    // Thin strips with zero displacement at region boundaries preserve anchors.
    for(const region of [[.04,.10,.20,.54],[.31,.05,.20,.55],[.55,.08,.19,.43],[.875,.725,.036,.052]]){
     const [rx,ry,rw,rh]=region;const hair=ry>.7;for(let y=0;y<rh*h;y+=2){const f=y/(rh*h),shift=Math.sin(f*Math.PI)*Math.sin(t*.8+rx*13+f)*(hair?3.0:5.0);x.drawImage(img,rx*w,ry*h+y,rw*w,2,rx*w+shift,ry*h+y,rw*w,2);}
    }
   },destroy(){c.remove();}};
  }
  const shader=(type,source)=>{const s=gl.createShader(type);gl.shaderSource(s,source);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(s));return s;};
  const p=gl.createProgram();
  gl.attachShader(p,shader(gl.VERTEX_SHADER,'attribute vec2 a; varying vec2 uv; void main(){uv=vec2((a.x+1.0)*.5,(1.0-a.y)*.5);gl_Position=vec4(a,0.,1.);}'));
  gl.attachShader(p,shader(gl.FRAGMENT_SHADER,`precision mediump float; varying vec2 uv; uniform sampler2D image; uniform float time;
  void main(){vec2 q=uv; vec3 c=texture2D(image,q).rgb;
   float edge=smoothstep(0.,.035,q.x)*(1.-smoothstep(.965,1.,q.x));
   float green=smoothstep(.015,.10,c.g-c.r*.8)*(1.-smoothstep(.55,.68,q.y));
   float sway=sin(time*.8+q.x*18.+q.y*5.)*.0045+sin(time*1.3+q.x*35.)*.0012;
   q.x+=sway*green*edge*smoothstep(.02,.16,q.y);
   vec2 h=(uv-vec2(.892,.746))/vec2(.023,.033);
   float hair=(1.-smoothstep(.5,1.,length(h)))*(1.-smoothstep(.15,.32,max(c.r,max(c.g,c.b))));
   q.x+=hair*.0035*sin(time*.8+1.); q.y+=hair*.00045*sin(time*.8);
   gl_FragColor=texture2D(image,clamp(q,vec2(.001),vec2(.999)));}`));
  gl.linkProgram(p);if(!gl.getProgramParameter(p,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(p));gl.useProgram(p);
  const b=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);
  const a=gl.getAttribLocation(p,'a');gl.enableVertexAttribArray(a);gl.vertexAttribPointer(a,2,gl.FLOAT,false,0,0);
  const tex=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,tex);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,img);
  const time=gl.getUniformLocation(p,'time');img.parentElement.append(canvas);
  return {canvas,draw(t){const d=Math.min(devicePixelRatio,2),w=Math.round(img.clientWidth*d),h=Math.round(img.clientHeight*d);if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;gl.viewport(0,0,w,h);}gl.uniform1f(time,t);gl.drawArrays(gl.TRIANGLES,0,6);},destroy(){canvas.remove();gl.deleteTexture(tex);gl.deleteBuffer(b);gl.deleteProgram(p);gl.getExtension('WEBGL_lose_context')?.loseContext();}};
 }
 function frame(now){requestAnimationFrame(frame);if(now-last<33)return;const dt=Math.min((now-last)/1000,.05);last=now;
  const page=document.querySelector('.artwork-page[data-poem-id="september"][aria-hidden="false"]');
  control.style.display=page&&!document.querySelector('#experience').hidden?'block':'none';
  const allowed=page&&!document.hidden&&motionEnabled&&!document.querySelector('#experience').hidden&&!document.body.dataset.artTurning;
  if(!allowed){overlay.style.display='none';if(renderer)renderer.canvas.style.visibility='hidden';return;}
  const img=page.querySelector('img');if(!img?.complete||!img.naturalWidth)return;
  if(active!==img){renderer?.destroy();active=img;try{renderer=setup(img);}catch(e){console.warn('Artwork motion unavailable',e);renderer=null;}}
  elapsed+=dt;if(renderer){renderer.canvas.style.visibility='visible';renderer.draw(elapsed);}
  overlay.style.display='block';const d=Math.min(devicePixelRatio,2);if(overlay.width!==Math.round(innerWidth*d)||overlay.height!==Math.round(innerHeight*d)){overlay.width=Math.round(innerWidth*d);overlay.height=Math.round(innerHeight*d);}ctx.setTransform(d,0,0,d,0,0);ctx.clearRect(0,0,innerWidth,innerHeight);
  const r=img.getBoundingClientRect();
  for(const l of leaves){const progress=(elapsed/19+l.phase)%1;const x=r.left+r.width*.82-progress*(r.left+r.width*.82+40);const y=r.top+r.height*(.22+.37*(l.seed%1))+progress*80+Math.sin(progress*9+l.seed)*24;const alpha=Math.min(progress*8,(1-progress)*8,1)*.72;
   ctx.save();ctx.translate(x,y);ctx.rotate(Math.sin(elapsed*.7+l.seed)*.8+progress*5);ctx.scale(1,.45+.35*Math.abs(Math.sin(elapsed+l.seed)));ctx.globalAlpha=alpha;ctx.fillStyle=['#8fa66b','#aac482','#708e55'][Math.floor(l.seed)%3];ctx.beginPath();ctx.moveTo(-l.size*1.5,0);ctx.quadraticCurveTo(0,-l.size,l.size*1.5,0);ctx.quadraticCurveTo(0,l.size,-l.size*1.5,0);ctx.fill();ctx.strokeStyle='#d0d7a0';ctx.lineWidth=.4;ctx.beginPath();ctx.moveTo(-l.size,0);ctx.lineTo(l.size,0);ctx.stroke();ctx.restore();
  }
 }
 requestAnimationFrame(frame);
}
