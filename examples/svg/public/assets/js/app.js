//   _  /._  _  r14 2018-11-06 3:09pm
//  /_|///_'/ /
Promise.create=function(){let e,t;const s=new Promise(function(s,n){e=s,t=n});return s.resolve=e,s.reject=t,s},Math.sign=function(e){return 0===(e=+e)||isNaN(e)?Number(e):e>0?1:-1},Math.degrees=function(e){return e*(180/Math.PI)},Math.radians=function(e){return e*(Math.PI/180)},Math.clamp=function(e,t,s){return Math.min(Math.max(e,Math.min(t,s)),Math.max(t,s))},Math.range=function(e,t,s,n,i,r){const o=(e-t)*(i-n)/(s-t)+n;return r?Math.clamp(o,n,i):o},Math.mix=function(e,t,s){return e*(1-s)+t*s},Math.step=function(e,t){return t<e?0:1},Math.smoothStep=function(e,t,s){const n=Math.max(0,Math.min(1,(s-e)/(t-e)));return n*n*(3-2*n)},Math.fract=function(e){return e-Math.floor(e)},Math.mod=function(e,t){return(e%t+t)%t},Array.prototype.shuffle=function(){let e,t,s=this.length;for(;0!==s;)t=Math.floor(Math.random()*s),e=this[s-=1],this[s]=this[t],this[t]=e;return this},Array.storeRandom=function(e){e.randomStore=[]},Array.prototype.random=function(e){let t=Math.floor(Math.random()*this.length);if(e&&!this.randomStore&&Array.storeRandom(this),!this.randomStore)return this[t];if(e>this.length-1&&(e=this.length),e>1){for(;~this.randomStore.indexOf(t);)t++>this.length-1&&(t=0);this.randomStore.push(t),this.randomStore.length>=e&&this.randomStore.shift()}return this[t]},Array.prototype.remove=function(e){const t=this.indexOf(e);if(~t)return this.splice(t,1)},Array.prototype.last=function(){return this[this.length-1]},String.prototype.includes=function(e){if(!Array.isArray(e))return~this.indexOf(e);for(let t=0;t<e.length;t++)if(~this.indexOf(e[t]))return!0;return!1},String.prototype.clip=function(e,t){return this.length>e?this.slice(0,e)+t:this},String.prototype.capitalize=function(){return this.charAt(0).toUpperCase()+this.slice(1)},String.prototype.replaceAll=function(e,t){return this.split(e).join(t)},Date.prototype.addDays=function(e){const t=new Date(this.valueOf());return t.setDate(t.getDate()+e),t},window.get=function(e,t={}){const s=Promise.create();return t.method="GET",window.fetch(e,t).then(function(e){if(!e.ok)return s.reject(e);e.text().then(function(e){if(e.charAt(0).includes(["[","{"]))try{s.resolve(JSON.parse(e))}catch(t){s.resolve(e)}else s.resolve(e)})}).catch(s.reject),s},window.post=function(e,t,s={}){const n=Promise.create();return s.method="POST",s.body=JSON.stringify(t),window.fetch(e,s).then(function(e){if(!e.ok)return n.reject(e);e.text().then(function(e){if(e.charAt(0).includes(["[","{"]))try{n.resolve(JSON.parse(e))}catch(t){n.resolve(e)}else n.resolve(e)})}).catch(n.reject),n},window.getURL=function(e,t="_blank"){window.open(e,t)},window.Config||(window.Config={}),window.Global||(window.Global={});class Utils{static random(e,t,s=0){if(void 0===e)return Math.random();if(e===t)return e;e=e||0,t=t||1;const n=Math.pow(10,s);return Math.round((e+Math.random()*(t-e))*n)/n}static headsTails(e,t){return this.random(0,1)?t:e}static queryString(e){const t=decodeURI(window.location.search.replace(new RegExp("^(?:.*[&\\?]"+encodeURI(e).replace(/[.+*]/g,"\\$&")+"(?:\\=([^&]*))?)?.*$","i"),"$1"));return!(!t.length||"0"===t||"false"===t)&&t}static getConstructorName(e){return e.constructor.name||e.constructor.toString().match(/function ([^(]+)/)[1]}static nullObject(e){for(let t in e)void 0!==e[t]&&(e[t]=null);return null}static cloneObject(e){return JSON.parse(JSON.stringify(e))}static mergeObject(...e){const t={};for(let s of e)Object.assign(t,s);return t}static cloneArray(e){return e.slice(0)}static basename(e,t){const s=e.split("/").last();return t?s:s.split(".")[0]}static extension(e){return e.split(".").last().split("?")[0].toLowerCase()}static base64(e){return window.btoa(encodeURIComponent(e).replace(/%([0-9A-F]{2})/g,(e,t)=>String.fromCharCode("0x"+t)))}static date(e){const t=e.split(/[^0-9]/);return new Date(t[0],t[1]-1,t[2],t[3],t[4],t[5])}static timestamp(){return(Date.now()+this.random(0,99999)).toString()}static pad(e){return e<10?"0"+e:e}static get hash(){return window.location.hash.slice(1)}}class Render{static init(){const e=this,t=[],s=200;let n=performance.now();function i(r){const o=Math.min(s,r-n);n=r,e.TIME=r,e.DELTA=o;for(let e=t.length-1;e>=0;e--){const s=t[e];if(s)if(s.fps){if(r-s.last<1e3/s.fps)continue;s(++s.frame),s.last=r}else s(r,o);else t.remove(s)}e.paused||requestAnimationFrame(i)}requestAnimationFrame(i),this.start=((e,s)=>{s&&(e.fps=s,e.last=-1/0,e.frame=-1),~t.indexOf(e)||t.unshift(e)}),this.stop=(e=>{t.remove(e)}),this.tick=(()=>{this.TIME=performance.now(),i(this.TIME)}),this.pause=(()=>{this.paused=!0}),this.resume=(()=>{this.paused&&(this.paused=!1,requestAnimationFrame(i))})}}Render.init();class Timer{static init(){const e=[],t=[];Render.start(function(s,n){for(let s=0;s<t.length;s++){const n=t[s];n.callback=null,e.remove(n)}t.length&&(t.length=0);for(let s=0;s<e.length;s++){const i=e[s];i?(i.current+=n)>=i.time&&(i.callback&&i.callback(...i.args),t.push(i)):e.remove(i)}}),this.clearTimeout=(t=>{const s=function(t){for(let s=0;s<e.length;s++)if(e[s].ref===t)return e[s];return null}(t);return!!s&&(s.callback=null,e.remove(s),!0)}),this.create=((t,s=1,...n)=>{const i={time:Math.max(1,s),current:0,ref:Utils.timestamp(),callback:t,args:n};return e.push(i),i.ref}),window.defer=this.defer=(e=>this.create(e,1))}}Timer.init();class Events{constructor(){class e{constructor(){this.events=[],this.links=[]}add(e,t,s){this.events.push({event:e,callback:t,object:s})}remove(e,t){for(let s=this.events.length-1;s>=0;s--)this.events[s].event===e&&this.events[s].callback===t&&(this.events[s].removed=!0,this.events.splice(s,1)[0]=null)}fire(e,t={}){let s=!1;const n=Utils.cloneArray(this.events);for(let i=0;i<n.length;i++)n[i].event!==e||n[i].removed||(n[i].callback(t),s=!0);return s}destroy(e){for(let t=this.events.length-1;t>=0;t--)this.events[t].object===e&&(this.events.splice(t,1)[0]=null)}link(e){~this.links.indexOf(e)||this.links.push(e)}}Events.initialized||(Events.emitter=new e,Events.VISIBILITY="visibility",Events.COMPLETE="complete",Events.PROGRESS="progress",Events.UPDATE="update",Events.LOADED="loaded",Events.ERROR="error",Events.READY="ready",Events.RESIZE="resize",Events.CLICK="click",Events.HOVER="hover",Events.FULLSCREEN="fullscreen",Events.KEYBOARD_PRESS="keyboard_press",Events.KEYBOARD_DOWN="keyboard_down",Events.KEYBOARD_UP="keyboard_up",Events.initialized=!0);const t=[];this.emitter=new e,this.add=((e,s,n)=>{if("object"!=typeof e&&(n=s,s=e,e=null),e){const i=e.events.emitter;i.add(s,n,this),i.link(this),t.push(i)}else Events.emitter.add(s,n,this)}),this.remove=((e,t,s)=>{"object"!=typeof e&&(s=t,t=e,e=null),e?e.events.emitter.remove(t,s):Events.emitter.remove(t,s)}),this.fire=((e,t={},s)=>{this.emitter.fire(e,t)||s||Events.emitter.fire(e,t)}),this.bubble=((e,t)=>{this.add(e,t,e=>this.fire(t,e))}),this.destroy=(()=>(Events.emitter.destroy(this),t.forEach(e=>e.destroy(this)),this.emitter.links.forEach(e=>{e.unlink&&e.unlink(this.emitter)}),Utils.nullObject(this))),this.unlink=(e=>{t.remove(e)})}}class Device{static init(){this.agent=navigator.userAgent.toLowerCase(),this.pixelRatio=window.devicePixelRatio,this.webcam=!!(navigator.getUserMedia||navigator.webkitGetUserMedia||navigator.mozGetUserMedia||navigator.msGetUserMedia),this.language=navigator.userLanguage||navigator.language,this.webaudio=!!window.AudioContext,this.os=(()=>this.detect(["iphone","ipad"])?"ios":this.detect(["android"])?"android":this.detect(["blackberry"])?"blackberry":this.detect(["mac os"])?"mac":this.detect(["windows"])?"windows":this.detect(["linux"])?"linux":"unknown")(),this.browser=(()=>"ios"===this.os?this.detect(["safari"])?"safari":"unknown":"android"===this.os?this.detect(["chrome"])?"chrome":this.detect(["firefox"])?"firefox":"browser":this.detect(["msie"])?"ie":this.detect(["trident"])&&this.detect(["rv:"])?"ie":this.detect(["windows"])&&this.detect(["edge"])?"ie":this.detect(["chrome"])?"chrome":this.detect(["safari"])?"safari":this.detect(["firefox"])?"firefox":"unknown")(),this.mobile=this.detect(["iphone","ipad","android","blackberry"]),this.mobile&&(this.tablet=Math.max(window.screen?screen.width:window.innerWidth,window.screen?screen.height:window.innerHeight)>1e3,this.phone=!this.tablet),this.webgl=(()=>{try{const e=["webgl","experimental-webgl","webkit-3d","moz-webgl"],t=document.createElement("canvas");let s;for(let n=0;n<e.length&&!(s=t.getContext(e[n]));n++);const n=s.getExtension("WEBGL_debug_renderer_info"),i={};return n&&(i.gpu=s.getParameter(n.UNMASKED_RENDERER_WEBGL).toLowerCase()),i.renderer=s.getParameter(s.RENDERER).toLowerCase(),i.version=s.getParameter(s.VERSION).toLowerCase(),i.glsl=s.getParameter(s.SHADING_LANGUAGE_VERSION).toLowerCase(),i.extensions=s.getSupportedExtensions(),i.detect=(e=>{if(i.gpu&&i.gpu.includes(e))return!0;if(i.version&&i.version.includes(e))return!0;for(let t=0;t<i.extensions.length;t++)if(i.extensions[t].toLowerCase().includes(e))return!0;return!1}),i}catch(e){return!1}})()}static detect(e){return this.agent.includes(e)}static vibrate(e){navigator.vibrate&&navigator.vibrate(e)}}Device.init();class Component{constructor(){this.events=new Events,this.classes=[],this.timers=[],this.loops=[]}initClass(e,...t){const s=new e(...t);return this.add(s),s}add(e){return e.destroy&&(this.classes.push(e),e.parent=this),this}delayedCall(e,t=0,...s){if(!this.timers)return;const n=Timer.create(()=>{e&&e(...s)},t);return this.timers.push(n),this.timers.length>50&&this.timers.shift(),n}clearTimers(){for(let e=this.timers.length-1;e>=0;e--)Timer.clearTimeout(this.timers[e]);this.timers.length=0}startRender(e,t){this.loops.push(e),Render.start(e,t)}stopRender(e){this.loops.remove(e),Render.stop(e)}clearRenders(){for(let e=this.loops.length-1;e>=0;e--)this.stopRender(this.loops[e]);this.loops.length=0}destroy(){if(this.classes){this.removed=!0;const e=this.parent;e&&!e.removed&&e.remove&&e.remove(this);for(let e=this.classes.length-1;e>=0;e--){const t=this.classes[e];t&&t.destroy&&t.destroy()}this.classes.length=0,this.clearRenders(),this.clearTimers(),this.events.destroy()}return Utils.nullObject(this)}remove(e){this.classes.remove(e)}}class Assets{static init(){const e={},t={};this.CDN="",this.CORS=null,this.getPath=(e=>~e.indexOf("//")?e:(this.CDN&&!~e.indexOf(this.CDN)&&(e=this.CDN+e),e)),this.createImage=((t,s,n)=>{"boolean"!=typeof s&&(n=s,s=null);const i=new Image;return i.crossOrigin=this.CORS,i.onload=n,i.onerror=n,i.src=this.getPath(t),s&&(e[t]=i),i}),this.getImage=(t=>e[t]),this.storeData=((e,s)=>(t[e]=s,t[e])),this.getData=(e=>t[e])}static loadImage(e){"string"==typeof e&&(e=this.createImage(e));const t=Promise.create();return e.onload=(()=>t.resolve(e)),e.onerror=(()=>t.resolve(e)),t}}Assets.init();class Interpolation{static init(){function e(e,i,r){return((t(i,r)*e+s(i,r))*e+n(i))*e}function t(e,t){return 1-3*t+3*e}function s(e,t){return 3*t-6*e}function n(e){return 3*e}this.convertEase=(e=>(()=>{let t;switch(e){case"easeInQuad":t=this.Quad.In;break;case"easeInCubic":t=this.Cubic.In;break;case"easeInQuart":t=this.Quart.In;break;case"easeInQuint":t=this.Quint.In;break;case"easeInSine":t=this.Sine.In;break;case"easeInExpo":t=this.Expo.In;break;case"easeInCirc":t=this.Circ.In;break;case"easeInElastic":t=this.Elastic.In;break;case"easeInBack":t=this.Back.In;break;case"easeInBounce":t=this.Bounce.In;break;case"easeOutQuad":t=this.Quad.Out;break;case"easeOutCubic":t=this.Cubic.Out;break;case"easeOutQuart":t=this.Quart.Out;break;case"easeOutQuint":t=this.Quint.Out;break;case"easeOutSine":t=this.Sine.Out;break;case"easeOutExpo":t=this.Expo.Out;break;case"easeOutCirc":t=this.Circ.Out;break;case"easeOutElastic":t=this.Elastic.Out;break;case"easeOutBack":t=this.Back.Out;break;case"easeOutBounce":t=this.Bounce.Out;break;case"easeInOutQuad":t=this.Quad.InOut;break;case"easeInOutCubic":t=this.Cubic.InOut;break;case"easeInOutQuart":t=this.Quart.InOut;break;case"easeInOutQuint":t=this.Quint.InOut;break;case"easeInOutSine":t=this.Sine.InOut;break;case"easeInOutExpo":t=this.Expo.InOut;break;case"easeInOutCirc":t=this.Circ.InOut;break;case"easeInOutElastic":t=this.Elastic.InOut;break;case"easeInOutBack":t=this.Back.InOut;break;case"easeInOutBounce":t=this.Bounce.InOut;break;case"linear":t=this.Linear.None}if(!t){const s=TweenManager.getEase(e);if(s){const e=s.split("(")[1].slice(0,-1).split(",");for(let t=0;t<e.length;t++)e[t]=parseFloat(e[t]);t=e}else t=this.Cubic.Out}return t})()),this.solve=((i,r)=>i[0]===i[1]&&i[2]===i[3]?r:e(function(i,r,o){let a=i;for(let u=0;u<4;u++){const u=(h=a,3*t(c=r,l=o)*h*h+2*s(c,l)*h+n(c));if(0===u)return a;a-=(e(a,r,o)-i)/u}var h,c,l;return a}(r,i[0],i[2]),i[1],i[3])),this.Linear={None:e=>e},this.Quad={In:e=>e*e,Out:e=>e*(2-e),InOut:e=>(e*=2)<1?.5*e*e:-.5*(--e*(e-2)-1)},this.Cubic={In:e=>e*e*e,Out:e=>--e*e*e+1,InOut:e=>(e*=2)<1?.5*e*e*e:.5*((e-=2)*e*e+2)},this.Quart={In:e=>e*e*e*e,Out:e=>1- --e*e*e*e,InOut:e=>(e*=2)<1?.5*e*e*e*e:-.5*((e-=2)*e*e*e-2)},this.Quint={In:e=>e*e*e*e*e,Out:e=>--e*e*e*e*e+1,InOut:e=>(e*=2)<1?.5*e*e*e*e*e:.5*((e-=2)*e*e*e*e+2)},this.Sine={In:e=>1-Math.cos(e*Math.PI/2),Out:e=>Math.sin(e*Math.PI/2),InOut:e=>.5*(1-Math.cos(Math.PI*e))},this.Expo={In:e=>0===e?0:Math.pow(1024,e-1),Out:e=>1===e?1:1-Math.pow(2,-10*e),InOut:e=>0===e?0:1===e?1:(e*=2)<1?.5*Math.pow(1024,e-1):.5*(2-Math.pow(2,-10*(e-1)))},this.Circ={In:e=>1-Math.sqrt(1-e*e),Out:e=>Math.sqrt(1- --e*e),InOut:e=>(e*=2)<1?-.5*(Math.sqrt(1-e*e)-1):.5*(Math.sqrt(1-(e-=2)*e)+1)},this.Elastic={In(e,t=1,s=.4){let n;return 0===e?0:1===e?1:(!t||t<1?(t=1,n=s/4):n=s*Math.asin(1/t)/(2*Math.PI),-t*Math.pow(2,10*(e-=1))*Math.sin((e-n)*(2*Math.PI)/s))},Out(e,t=1,s=.4){let n;return 0===e?0:1===e?1:(!t||t<1?(t=1,n=s/4):n=s*Math.asin(1/t)/(2*Math.PI),t*Math.pow(2,-10*e)*Math.sin((e-n)*(2*Math.PI)/s)+1)},InOut(e,t=1,s=.4){let n;return 0===e?0:1===e?1:(!t||t<1?(t=1,n=s/4):n=s*Math.asin(1/t)/(2*Math.PI),(e*=2)<1?t*Math.pow(2,10*(e-=1))*Math.sin((e-n)*(2*Math.PI)/s)*-.5:t*Math.pow(2,-10*(e-=1))*Math.sin((e-n)*(2*Math.PI)/s)*.5+1)}},this.Back={In(e){const t=1.70158;return e*e*((t+1)*e-t)},Out(e){const t=1.70158;return--e*e*((t+1)*e+t)+1},InOut(e){const t=2.5949095;return(e*=2)<1?e*e*((t+1)*e-t)*.5:.5*((e-=2)*e*((t+1)*e+t)+2)}},this.Bounce={In:e=>1-Interpolation.Bounce.Out(1-e),Out:e=>e<1/2.75?7.5625*e*e:e<2/2.75?7.5625*(e-=1.5/2.75)*e+.75:e<2.5/2.75?7.5625*(e-=2.25/2.75)*e+.9375:7.5625*(e-=2.625/2.75)*e+.984375,InOut:e=>e<.5?.5*Interpolation.Bounce.In(2*e):.5*Interpolation.Bounce.Out(2*e-1)+.5}}}Interpolation.init();class MathTween{constructor(e,t,s,n,i,r,o){const a=this;let h,c,l,u,d,m,p,f;function v(){if(!e&&!t)return!1;e.mathTween=null,TweenManager.removeMathTween(a),Utils.nullObject(a),e.mathTweens&&e.mathTweens.remove(a)}!function(){!e.multiTween&&e.mathTween&&TweenManager.clearTween(e);TweenManager.addMathTween(a),e.mathTween=a,e.multiTween&&(e.mathTweens||(e.mathTweens=[]),e.mathTweens.push(a));n=Interpolation.convertEase(n),u="function"==typeof n,h=performance.now(),h+=i,l=t,c={},t.spring&&(m=t.spring);t.damping&&(p=t.damping);for(let t in l)"number"==typeof e[t]&&(c[t]=e[t])}(),this.update=(e=>{if(d||e<h)return;f=(f=(e-h)/s)>1?1:f;const t=this.interpolate(f);r&&r(t),1===f&&(o&&o(),v())}),this.stop=(()=>{v()}),this.pause=(()=>{d=!0}),this.resume=(()=>{d=!1,h=performance.now()-f*s}),this.interpolate=(t=>{const s=u?n(t,m,p):Interpolation.solve(n,t);for(let t in c)if("number"==typeof c[t]&&"number"==typeof l[t]){const n=c[t],i=l[t];e[t]=n+(i-n)*s}return s})}}class TweenManager{static init(){const e=this,t=[];this.TRANSFORMS=["x","y","z","scale","scaleX","scaleY","rotation","rotationX","rotationY","rotationZ","skewX","skewY","perspective"],this.CSS_EASES={easeOutCubic:"cubic-bezier(0.215, 0.610, 0.355, 1.000)",easeOutQuad:"cubic-bezier(0.250, 0.460, 0.450, 0.940)",easeOutQuart:"cubic-bezier(0.165, 0.840, 0.440, 1.000)",easeOutQuint:"cubic-bezier(0.230, 1.000, 0.320, 1.000)",easeOutSine:"cubic-bezier(0.390, 0.575, 0.565, 1.000)",easeOutExpo:"cubic-bezier(0.190, 1.000, 0.220, 1.000)",easeOutCirc:"cubic-bezier(0.075, 0.820, 0.165, 1.000)",easeOutBack:"cubic-bezier(0.175, 0.885, 0.320, 1.275)",easeInCubic:"cubic-bezier(0.550, 0.055, 0.675, 0.190)",easeInQuad:"cubic-bezier(0.550, 0.085, 0.680, 0.530)",easeInQuart:"cubic-bezier(0.895, 0.030, 0.685, 0.220)",easeInQuint:"cubic-bezier(0.755, 0.050, 0.855, 0.060)",easeInSine:"cubic-bezier(0.470, 0.000, 0.745, 0.715)",easeInCirc:"cubic-bezier(0.600, 0.040, 0.980, 0.335)",easeInBack:"cubic-bezier(0.600, -0.280, 0.735, 0.045)",easeInOutCubic:"cubic-bezier(0.645, 0.045, 0.355, 1.000)",easeInOutQuad:"cubic-bezier(0.455, 0.030, 0.515, 0.955)",easeInOutQuart:"cubic-bezier(0.770, 0.000, 0.175, 1.000)",easeInOutQuint:"cubic-bezier(0.860, 0.000, 0.070, 1.000)",easeInOutSine:"cubic-bezier(0.445, 0.050, 0.550, 0.950)",easeInOutExpo:"cubic-bezier(1.000, 0.000, 0.000, 1.000)",easeInOutCirc:"cubic-bezier(0.785, 0.135, 0.150, 0.860)",easeInOutBack:"cubic-bezier(0.680, -0.550, 0.265, 1.550)",easeInOut:"cubic-bezier(0.420, 0.000, 0.580, 1.000)",linear:"linear"},Render.start(function(s){for(let n=t.length-1;n>=0;n--){const i=t[n];i.update?i.update(s):e.removeMathTween(i)}}),this.addMathTween=(e=>{t.push(e)}),this.removeMathTween=(e=>{t.remove(e)}),this.tween=((e,t,s,n,i,r,o)=>{"number"!=typeof i&&(o=r,r=i,i=0);let a=null;"undefined"!=typeof Promise&&(a=Promise.create(),r&&a.then(r),r=a.resolve);const h=new MathTween(e,t,s,n,i,o,r);return a||h}),this.clearTween=(e=>{if(e.mathTween&&e.mathTween.stop(),e.mathTweens){const t=e.mathTweens;for(let e=t.length-1;e>=0;e--){const s=t[e];s&&s.stop()}e.mathTweens=null}}),this.isTransform=(e=>~this.TRANSFORMS.indexOf(e)),this.getEase=(e=>this.CSS_EASES[e]||this.CSS_EASES.easeOutCubic),this.getAllTransforms=(e=>{const t={};for(let s=0;s<this.TRANSFORMS.length;s++){const n=this.TRANSFORMS[s],i=e[n];0!==i&&"number"==typeof i&&(t[n]=i)}return t}),this.parseTransform=(e=>{let t="";if(void 0!==e.x||void 0!==e.y||void 0!==e.z){const s=e.x||0,n=e.y||0,i=e.z||0;let r="";r+=s+"px, ",r+=n+"px, ",t+="translate3d("+(r+=i+"px")+")"}return void 0!==e.scale?t+="scale("+e.scale+")":(void 0!==e.scaleX&&(t+="scaleX("+e.scaleX+")"),void 0!==e.scaleY&&(t+="scaleY("+e.scaleY+")")),void 0!==e.rotation&&(t+="rotate("+e.rotation+"deg)"),void 0!==e.rotationX&&(t+="rotateX("+e.rotationX+"deg)"),void 0!==e.rotationY&&(t+="rotateY("+e.rotationY+"deg)"),void 0!==e.rotationZ&&(t+="rotateZ("+e.rotationZ+"deg)"),void 0!==e.skewX&&(t+="skewX("+e.skewX+"deg)"),void 0!==e.skewY&&(t+="skewY("+e.skewY+"deg)"),void 0!==e.perspective&&(t+="perspective("+e.perspective+"px)"),t}),this.interpolate=((e,t,s)=>{const n=Interpolation.convertEase(s);return e*("function"==typeof n?n(t):Interpolation.solve(n,t))}),this.interpolateValues=((e,t,s,n)=>{const i=Interpolation.convertEase(n);return e+(t-e)*("function"==typeof i?i(s):Interpolation.solve(i,s))})}}TweenManager.init();class CSSTransition{constructor(e,t,s,n,i,r){const o=this;let a,h;function c(){return!o||o.kill||!e||!e.element}function l(){c()||(o.kill=!0,e.element.style.transition="",e.willChange(null),e.cssTween=null,e=t=null,Utils.nullObject(o))}this.playing=!0,function(){const s=TweenManager.getAllTransforms(e),n=[];for(let e in t)TweenManager.isTransform(e)?(s.use=!0,s[e]=t[e],delete t[e]):("number"==typeof t[e]||~e.indexOf("-"))&&n.push(e);s.use&&(n.push("transform"),delete s.use);a=s,h=n}(),function(){if(c())return;e.cssTween&&e.cssTween.stop();e.cssTween=o;const u=function(e,t,s){let n="",i="";for(let r=0;r<h.length;r++){const o=h[r];n+=(n.length?", ":"")+o,i+=(i.length?", ":"")+o+" "+e+"ms "+TweenManager.getEase(t)+" "+s+"ms"}return{props:n,transition:i}}(s,n,i);e.willChange(u.props),Timer.create(()=>{c()||(e.element.style.transition=u.transition,e.css(t),e.transform(a),Timer.create(()=>{c()||(o.playing=!1,Timer.create(()=>{c()||e.cssTween&&!e.cssTween.playing&&l()},1e3),r&&r())},s+i))},35)}(),this.stop=l}}class Interface{constructor(e,t="div",s){if(this.events=new Events,this.classes=[],this.timers=[],this.loops=[],void 0!==e){if("string"!=typeof e&&e)this.element=e;else{if(this.name=e,this.type=t,"svg"===t){const e=s||"svg";s=!0,this.element=document.createElementNS("http://www.w3.org/2000/svg",e)}else this.element=document.createElement(t),"."!==e.charAt(0)?this.element.id=e:this.element.className=e.substr(1),this.element.style.position="absolute";s||document.body.appendChild(this.element)}this.element.object=this}}initClass(e,...t){const s=new e(...t);return this.add(s),s}add(e){return e.destroy&&(this.classes.push(e),e.parent=this),e.element?this.element.appendChild(e.element):e.nodeName&&this.element.appendChild(e),this}delayedCall(e,t=0,...s){if(!this.timers)return;const n=Timer.create(()=>{e&&e(...s)},t);return this.timers.push(n),this.timers.length>50&&this.timers.shift(),n}clearTimers(){for(let e=this.timers.length-1;e>=0;e--)Timer.clearTimeout(this.timers[e]);this.timers.length=0}startRender(e,t){this.loops.push(e),Render.start(e,t)}stopRender(e){this.loops.remove(e),Render.stop(e)}clearRenders(){for(let e=this.loops.length-1;e>=0;e--)this.stopRender(this.loops[e]);this.loops.length=0}destroy(){if(!this.classes)return;this.removed=!0;const e=this.parent;e&&!e.removed&&e.remove&&e.remove(this);for(let e=this.classes.length-1;e>=0;e--){const t=this.classes[e];t&&t.destroy&&t.destroy()}return this.classes.length=0,this.element.object=null,this.clearRenders(),this.clearTimers(),this.events.destroy(),Utils.nullObject(this)}remove(e){e.element?e.element.parentNode.removeChild(e.element):e.nodeName&&e.parentNode.removeChild(e),this.classes.remove(e)}create(e,t){const s=new Interface(e,t);return this.add(s),s}clone(){return new Interface(this.element.cloneNode(!0))}empty(){return this.element.innerHTML="",this}text(e){return void 0===e?this.element.textContent:(this.element.textContent=e,this)}html(e){return void 0===e?this.element.innerHTML:(this.element.innerHTML=e,this)}hide(){return this.element.style.display="none",this}show(){return this.element.style.display="",this}visible(){return this.element.style.visibility="visible",this}invisible(){return this.element.style.visibility="hidden",this}setZ(e){return this.element.style.zIndex=e,this}clearOpacity(){return this.element.style.opacity="",this}size(e,t=e,s){return"boolean"==typeof t&&(s=t,t=e),void 0!==e&&("string"==typeof e||"string"==typeof t?("string"!=typeof e&&(e+="px"),"string"!=typeof t&&(t+="px"),this.element.style.width=e,this.element.style.height=t):(this.element.style.width=e+"px",this.element.style.height=t+"px",s||(this.element.style.backgroundSize=e+"px "+t+"px"))),this.width=this.element.offsetWidth,this.height=this.element.offsetHeight,this}mouseEnabled(e){return this.element.style.pointerEvents=e?"auto":"none",this}fontStyle(e,t,s,n){return this.css({fontFamily:e,fontSize:t,color:s,fontStyle:n}),this}bg(e,t,s,n){return~e.indexOf(".")&&(e=Assets.getPath(e)),e.includes(["data:","."])?this.element.style.backgroundImage="url("+e+")":this.element.style.backgroundColor=e,void 0!==t&&(t="number"==typeof t?t+"px":t,s="number"==typeof s?s+"px":s,this.element.style.backgroundPosition=t+" "+s),n&&(this.element.style.backgroundSize="",this.element.style.backgroundRepeat=n),"cover"!==t&&"contain"!==t||(n="number"==typeof n?n+"px":n,this.element.style.backgroundSize=t,this.element.style.backgroundRepeat="no-repeat",this.element.style.backgroundPosition=void 0!==s?s+" "+n:"center"),this}center(e,t,s){const n={};return void 0===e?(n.left="50%",n.top="50%",n.marginLeft=-this.width/2,n.marginTop=-this.height/2):(e&&(n.left="50%",n.marginLeft=-this.width/2),t&&(n.top="50%",n.marginTop=-this.height/2)),s&&(delete n.left,delete n.top),this.css(n),this}mask(e){return this.element.style.mask=(~e.indexOf(".")?"url("+e+")":e)+" no-repeat",this.element.style.maskSize="contain",this}blendMode(e,t){return this.element.style[t?"background-blend-mode":"mix-blend-mode"]=e,this}css(e,t){if("object"!=typeof e){if(void 0===t){let t=this.element.style[e];return"number"!=typeof t&&(~t.indexOf("px")&&(t=Number(t.slice(0,-2))),"opacity"===e&&(t=isNaN(Number(this.element.style.opacity))?1:Number(this.element.style.opacity))),t||0}return this.element.style[e]=t,this}for(let t in e){let s=e[t];"string"!=typeof s&&"number"!=typeof s||("string"!=typeof s&&"opacity"!==t&&"zIndex"!==t&&(s+="px"),this.element.style[t]=s)}return this}transform(e){if(e)for(let t in e)"number"==typeof e[t]&&(this[t]=e[t]);else e=this;return this.element.style.transform=TweenManager.parseTransform(e),this}willChange(e){const t="string"==typeof e;this.element.style.willChange=e?t?e:"transform, opacity":""}backfaceVisibility(e){return this.element.style.backfaceVisibility=e?"visible":"hidden",this}enable3D(e,t,s){return this.element.style.transformStyle="preserve-3d",e&&(this.element.style.perspective=e+"px"),void 0!==t&&(t="number"==typeof t?t+"px":t,s="number"==typeof s?s+"px":s,this.element.style.perspectiveOrigin=t+" "+s),this}disable3D(){return this.element.style.transformStyle="",this.element.style.perspective="",this}transformPoint(e,t,s){let n="";return void 0!==e&&(n+="number"==typeof e?e+"px":e),void 0!==t&&(n+="number"==typeof t?" "+t+"px":" "+t),void 0!==s&&(n+="number"==typeof s?" "+s+"px":" "+s),this.element.style.transformOrigin=n,this}tween(e,t,s,n,i){"number"!=typeof n&&(i=n,n=0);let r=null;"undefined"!=typeof Promise&&(r=Promise.create(),i&&r.then(i),i=r.resolve);const o=new CSSTransition(this,e,t,s,n,i);return r||o}clearTransform(){return"number"==typeof this.x&&(this.x=0),"number"==typeof this.y&&(this.y=0),"number"==typeof this.z&&(this.z=0),"number"==typeof this.scale&&(this.scale=1),"number"==typeof this.scaleX&&(this.scaleX=1),"number"==typeof this.scaleY&&(this.scaleY=1),"number"==typeof this.rotation&&(this.rotation=0),"number"==typeof this.rotationX&&(this.rotationX=0),"number"==typeof this.rotationY&&(this.rotationY=0),"number"==typeof this.rotationZ&&(this.rotationZ=0),"number"==typeof this.skewX&&(this.skewX=0),"number"==typeof this.skewY&&(this.skewY=0),this.element.style.transform="",this}clearTween(){return this.cssTween&&this.cssTween.stop(),this.mathTween&&this.mathTween.stop(),this}attr(e,t){if("object"!=typeof e)return void 0===t?this.element.getAttribute(e):(""===t?this.element.removeAttribute(e):this.element.setAttribute(e,t),this);for(let t in e){const s=e[t];"string"!=typeof s&&"number"!=typeof s||this.element.setAttribute(t,s)}return this}convertTouchEvent(e){const t={x:0,y:0};return e?(e.touches||e.changedTouches?e.touches.length?(t.x=e.touches[0].pageX,t.y=e.touches[0].pageY):(t.x=e.changedTouches[0].pageX,t.y=e.changedTouches[0].pageY):(t.x=e.pageX,t.y=e.pageY),t):t}click(e){return this.element.addEventListener("click",t=>{if(!this.element)return!1;t.object="hit"===this.element.className?this.parent:this,t.action="click",e&&e(t)},!0),this.element.style.cursor="pointer",this}hover(e){const t=t=>{if(!this.element)return!1;t.object="hit"===this.element.className?this.parent:this,t.action="mouseout"===t.type?"out":"over",e&&e(t)};return this.element.addEventListener("mouseover",t,!0),this.element.addEventListener("mouseout",t,!0),this}bind(e,t){"touchstart"!==e||Device.mobile?"touchmove"!==e||Device.mobile?"touchend"!==e||Device.mobile||(e="mouseup"):e="mousemove":e="mousedown",this.events["bind_"+e]||(this.events["bind_"+e]=[]);const s=this.events["bind_"+e];s.push({target:this.element,callback:t});const n=e=>{const t=this.convertTouchEvent(e);e instanceof MouseEvent||(e.x=t.x,e.y=t.y),s.forEach(t=>{t.target===e.currentTarget&&t.callback(e)})};return this.events["fn_"+e]||(this.events["fn_"+e]=n,this.element.addEventListener(e,n,!0)),this}unbind(e,t){"touchstart"!==e||Device.mobile?"touchmove"!==e||Device.mobile?"touchend"!==e||Device.mobile||(e="mouseup"):e="mousemove":e="mousedown";const s=this.events["bind_"+e];return s?(s.forEach((e,n)=>{e.callback===t&&s.splice(n,1)}),this.events["fn_"+e]&&!s.length&&(this.element.removeEventListener(e,this.events["fn_"+e],!0),this.events["fn_"+e]=null),this):this}interact(e,t){return this.hit=this.create(".hit"),this.hit.css({position:"absolute",left:0,top:0,width:"100%",height:"100%",zIndex:99999}),Device.mobile?this.hit.touchClick(e,t):this.hit.hover(e).click(t),this}touchClick(e,t){const s={};let n,i,r;const o=e=>{const t=this.convertTouchEvent(e);e.touchX=t.x,e.touchY=t.y,s.x=e.touchX,s.y=e.touchY};return this.element.addEventListener("touchmove",e=>{if(!this.element)return!1;r=this.convertTouchEvent(e),i=((e,t)=>{const s=t.x-e.x,n=t.y-e.y;return Math.sqrt(s*s+n*n)})(s,r)>5},{passive:!0}),this.element.addEventListener("touchstart",t=>{if(!this.element)return!1;n=performance.now(),t.object="hit"===this.element.className?this.parent:this,t.action="over",o(t),e&&!i&&e(t)},{passive:!0}),this.element.addEventListener("touchend",s=>{if(!this.element)return!1;const r=performance.now();s.object="hit"===this.element.className?this.parent:this,o(s),n&&r-n<750&&t&&!i&&(s.action="click",t(s)),e&&(s.action="out",e(s)),i=!1},{passive:!0}),this}touchSwipe(e,t=75){const s={};let n,i,r=!1;const o=e=>{const t=this.convertTouchEvent(e);1===e.touches.length&&(n=t.x,i=t.y,r=!0,this.element.addEventListener("touchmove",a,{passive:!0}))},a=o=>{if(r){const r=this.convertTouchEvent(o),a=n-r.x,c=i-r.y;s.direction=null,s.moving=null,s.x=null,s.y=null,s.evt=o,Math.abs(a)>=t?(h(),s.direction=a>0?"left":"right"):Math.abs(c)>=t?(h(),s.direction=c>0?"up":"down"):(s.moving=!0,s.x=a,s.y=c),e&&e(s,o)}},h=()=>{n=i=r=!1,this.element.removeEventListener("touchmove",a)};return Device.mobile&&(this.element.addEventListener("touchstart",o,{passive:!0}),this.element.addEventListener("touchend",h,{passive:!0}),this.element.addEventListener("touchcancel",h,{passive:!0})),this}overflowScroll(e){const t=!!e.x,s=!!e.y,n={};(!t&&!s||t&&s)&&(n.overflow="scroll"),!t&&s&&(n.overflowY="scroll",n.overflowX="hidden"),t&&!s&&(n.overflowX="scroll",n.overflowY="hidden"),Device.mobile&&(n["-webkit-overflow-scrolling"]="touch",this.element.scrollParent=!0,this.element.preventEvent=(e=>e.stopPropagation()),this.bind("touchmove",this.element.preventEvent)),this.css(n)}removeOverflowScroll(){this.css({overflow:"hidden",overflowX:"",overflowY:"","-webkit-overflow-scrolling":""}),Device.mobile&&this.unbind("touchmove",this.element.preventEvent)}split(e=""){const t={position:"relative",display:"inline-block",width:"auto",height:"auto",margin:0,padding:0},s=[],n=this.text().split(e);this.empty()," "===e&&(e="&nbsp;");for(let i=0;i<n.length;i++)" "===n[i]&&(n[i]="&nbsp;"),s.push(this.create(".t","span").html(n[i]).css(t)),""!==e&&i<n.length-1&&s.push(this.create(".t","span").html(e).css(t));return s}}const Stage=new class extends Interface{constructor(){super("Stage");const e=this;let t;function s(){"focus"!==t&&(t="focus",Events.emitter.fire(Events.VISIBILITY,{type:"focus"}))}function n(){"blur"!==t&&(t="blur",Events.emitter.fire(Events.VISIBILITY,{type:"blur"}))}function i(e){Events.emitter.fire(Events.KEYBOARD_DOWN,e)}function r(e){Events.emitter.fire(Events.KEYBOARD_UP,e)}function o(e){Events.emitter.fire(Events.KEYBOARD_PRESS,e)}function a(t){e.size(),e.orientation=window.innerWidth>window.innerHeight?"landscape":"portrait",Events.emitter.fire(Events.RESIZE,t)}function h(e){let t=e.target;if("INPUT"===t.nodeName||"TEXTAREA"===t.nodeName||"SELECT"===t.nodeName||"A"===t.nodeName)return;let s=!0;for(;t.parentNode&&s;)t.scrollParent&&(s=!1),t=t.parentNode;s&&e.preventDefault()}e.css({overflow:"hidden"}),function(){window.addEventListener("focus",s),window.addEventListener("blur",n),window.addEventListener("keydown",i),window.addEventListener("keyup",r),window.addEventListener("keypress",o),window.addEventListener("resize",a),window.addEventListener("orientationchange",a),Device.mobile&&window.addEventListener("touchstart",h,{passive:!1});a()}(),this.allowScroll=(()=>{Device.mobile&&window.removeEventListener("touchstart",h,{passive:!1})}),this.destroy=(()=>(this.Accelerometer&&this.Accelerometer.active&&this.Accelerometer.stop(),this.Mouse&&this.Mouse.active&&this.Mouse.stop(),this.WebAudio&&this.WebAudio.active&&this.WebAudio.stop(),window.removeEventListener("focus",s),window.removeEventListener("blur",n),window.removeEventListener("keydown",i),window.removeEventListener("keyup",r),window.removeEventListener("keypress",o),window.removeEventListener("resize",a),window.removeEventListener("orientationchange",a),Device.mobile&&window.removeEventListener("touchstart",h,{passive:!1}),super.destroy()))}};class AssetLoader extends Component{constructor(e,t){Array.isArray(e)&&(e=e.map(e=>Utils.basename(e)).reduce((t,s,n)=>(t[s]=e[n],t),{})),super();const s=this;let n=Object.keys(e).length,i=0;for(let t in e)r(t,e[t]);function r(e,t){const s=Utils.extension(t);if(!s.includes(["jpg","jpeg","png","gif","svg"]))return s.includes(["mp3","m4a","ogg","wav","aif"])?window.AudioContext&&Stage.WebAudio?void Stage.WebAudio.createSound(e,t,o):o():void window.get(Assets.getPath(t),Assets.OPTIONS).then(t=>{"json"===s&&Assets.storeData(e,t),"js"===s&&window.eval(t.replace("use strict","")),o()}).catch(()=>{o()});Assets.createImage(t,o)}function o(){s.percent=++i/n,s.events.fire(Events.PROGRESS,{percent:s.percent},!0),i===n&&(s.events.fire(Events.COMPLETE,null,!0),t&&t())}this.add=((e=1)=>{n+=e}),this.trigger=((e=1)=>{for(let t=0;t<e;t++)o()})}static loadAssets(e,t){const s=Promise.create();return t||(t=s.resolve),s.loader=new AssetLoader(e,t),s}}window.AudioContext||(window.AudioContext=window.webkitAudioContext||window.mozAudioContext||window.oAudioContext);class SVG extends Interface{constructor(e="svg"){super(null,"svg",e),this.x=0,this.y=0,this.px=0,this.py=0,this.width=0,this.height=0}size(e,t=e){return this.width=e,this.height=t,this.element.setAttribute("width",e),this.element.setAttribute("height",t),this}transform(e){for(let t in e)"number"==typeof e[t]&&(this[t]=e[t]);let t="";if((this.x||this.y)&&(t+="translate("+(this.x+this.px)+" "+(this.y+this.py)+")"),void 0!==this.scale)t+="scale("+this.scale+")";else if(void 0!==this.scaleX||void 0!==this.scaleY){const e=this.scaleX||1,s=this.scaleY||1;let n="";n+=e+" ",t+="scale("+(n+=s)+")"}return void 0!==this.rotation&&(t+="rotate("+this.rotation+")"),(this.x||this.y)&&(t+="translate(-"+(this.x+this.px)+" -"+(this.y+this.py)+")"),this.element.setAttribute("transform",t),this}transformPoint(e,t){return this.px="number"==typeof e?e:this.width*(parseFloat(e)/100),this.py="number"==typeof t?t:this.height*(parseFloat(t)/100),this}attr(e,t){if("object"!=typeof e)return this[e]=t,super.attr(e,t);for(let t in e)"number"==typeof e[t]&&(this[t]=e[t]);return super.attr(e,t)}}navigator.getUserMedia||(navigator.getUserMedia=navigator.webkitGetUserMedia||navigator.mozGetUserMedia||navigator.msGetUserMedia),Config.UI_COLOR="white",Config.ASSETS=["assets/images/alienkitty.svg","assets/images/alienkitty_eyelid.svg"];class AlienKitty extends Interface{constructor(){super("AlienKitty");const e=this;let t,s,n,i;function r(){s.attr("href","assets/images/alienkitty.svg"),n.attr("href","assets/images/alienkitty_eyelid.svg"),i.attr("href","assets/images/alienkitty_eyelid.svg")}function o(){e.delayedCall(Utils.headsTails(a,h),Utils.random(0,1e4))}function a(){TweenManager.tween(n,{scaleY:1.5},120,"easeOutCubic",()=>{TweenManager.tween(n,{scaleY:.01},180,"easeOutCubic")}),TweenManager.tween(i,{scaleX:1.3,scaleY:1.3},120,"easeOutCubic",()=>{TweenManager.tween(i,{scaleX:1,scaleY:.01},180,"easeOutCubic",()=>{o()})})}function h(){TweenManager.tween(n,{scaleY:1.5},120,"easeOutCubic",()=>{TweenManager.tween(n,{scaleY:.01},180,"easeOutCubic")}),TweenManager.tween(i,{scaleX:1.3,scaleY:1.3},180,"easeOutCubic",()=>{TweenManager.tween(i,{scaleX:1,scaleY:.01},240,"easeOutCubic",()=>{o()})})}function c(){n.transform(),i.transform()}e.size(90,86).css({opacity:0}),t=e.initClass(SVG).size(90,86),s=t.initClass(SVG,"image").size(90,86),n=t.initClass(SVG,"image").size(24,14).attr({x:35,y:25}).transformPoint("50%",0).transform({scaleX:1.5,scaleY:.01}),i=t.initClass(SVG,"image").size(24,14).attr({x:53,y:26}).transformPoint(0,0).transform({scaleX:1,scaleY:.01}),e.events.add(Events.COMPLETE,r),this.animateIn=(()=>{o(),this.tween({opacity:1},500,"easeOutQuart"),this.startRender(c)}),this.animateOut=(e=>{this.tween({opacity:0},500,"easeInOutQuad",()=>{this.stopRender(c),this.clearTimers(),e&&e()})})}}class Progress extends Interface{constructor(){super("Progress");const e=this,t=90,s=.4*t,n=Math.PI*s*2,i=-.25;let r,o;function a(){if(e.complete)return;e.progress>=1&&(e.complete=!0,e.events.fire(Events.COMPLETE),e.stopRender(a));const t=n*e.progress;o.css("stroke-dasharray",`${t},${n-t}`)}this.progress=0,e.size(t),r=e.initClass(SVG).size(t),(o=r.initClass(SVG,"circle")).attr("fill","none"),o.attr("cx",t/2),o.attr("cy",t/2),o.attr("r",s),o.css("stroke",Config.UI_COLOR),o.css("stroke-width","1.5px"),o.css("stroke-dasharray",`0,${n}`),o.css("stroke-dashoffset",-n*i),this.startRender(a),this.update=(e=>{this.complete||TweenManager.tween(this,{progress:e.percent},500,"easeOutCubic")}),this.animateOut=(e=>{this.tween({scale:.9,opacity:0},400,"easeInCubic",e)})}}class Loader extends Interface{constructor(){super("Loader");const e=this;let t;function s(e){t.update&&t.update(e)}function n(){e.events.fire(Events.COMPLETE)}e.css({position:"static"}),function(){const t=e.initClass(AssetLoader,Config.ASSETS);e.events.add(t,Events.PROGRESS,s)}(),function(){(t=e.initClass(Progress)).center(),t.animateIn&&t.animateIn();e.events.add(t,Events.COMPLETE,n)}(),this.animateOut=(e=>{t.animateOut(e)})}}class Main{constructor(){let e,t,s;function n(){e.animateOut(()=>{e=e.destroy(),Stage.events.fire(Events.COMPLETE)})}function i(){t.tween({z:0},7e3,"easeOutCubic"),s.animateIn()}Stage.size("100%").enable3D(2e3),(t=Stage.create(".wrapper")).size("100%").transform({z:-300}).enable3D(),(s=t.initClass(AlienKitty)).center(),e=Stage.initClass(Loader),Stage.events.add(e,Events.COMPLETE,n),Stage.events.add(Events.COMPLETE,i)}}new Main;