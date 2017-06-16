//   _  /._  _  r3.banner 2017-06-15 7:53pm
//  /_|///_'/ /
var _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},classCallCheck=function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")},createClass=function(){function e(e,t){for(var n=0;n<t.length;n++){var i=t[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,n,i){return n&&e(t.prototype,n),i&&e(t,i),t}}(),inherits=function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)},possibleConstructorReturn=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t};window.Events||(window.Events={BROWSER_FOCUS:"browser_focus",KEYBOARD_DOWN:"keyboard_down",KEYBOARD_UP:"keyboard_up",KEYBOARD_PRESS:"keyboard_press",RESIZE:"resize",COMPLETE:"complete",PROGRESS:"progress",UPDATE:"update",LOADED:"loaded",ERROR:"error",READY:"ready",HOVER:"hover",CLICK:"click"});var EventManager=function e(){classCallCheck(this,e);var t=[];this.add=function(e,n){t.push({event:e,callback:n})},this.remove=function(e,n){for(var i=t.length-1;i>-1;i--)t[i].event===e&&t[i].callback===n&&t.splice(i,1)},this.fire=function(e){for(var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},i=0;i<t.length;i++)t[i].event===e&&t[i].callback(n)}};window.events||(window.events=new EventManager),window.requestAnimationFrame||(window.requestAnimationFrame=window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||function(e){Delayed(e,1e3/60)});var Render=function e(){function t(e){"focus"===e.type&&(i=Date.now())}function n(){var e=Date.now(),u=e-s,c=0,l=60;i&&(l=1e3/(c=e-i)),i=e;for(var h=r.length-1;h>-1;h--){var f=r[h];if(f){if(f.fps){if((a+=c>200?0:c)<1e3/f.fps)continue;a-=1e3/f.fps}f(e,u,c,l,f.frameCount++)}}r.length?window.requestAnimationFrame(n):(o=!1,window.events.remove(Events.BROWSER_FOCUS,t))}classCallCheck(this,e);var i=void 0,r=[],s=Date.now(),a=0,o=!1;this.start=function(e){e.frameCount=0,-1===r.indexOf(e)&&r.push(e),r.length&&!o&&(o=!0,window.requestAnimationFrame(n),window.events.add(Events.BROWSER_FOCUS,t))},this.stop=function(e){var t=r.indexOf(e);t>-1&&r.splice(t,1)}},DynamicObject=function e(t){var n=this;classCallCheck(this,e);for(var i in t)this[i]=t[i];this.lerp=function(e,i){for(var r in t)n[r]+=(e[r]-n[r])*i;return n}},Utils=function(){function e(){classCallCheck(this,e)}return createClass(e,[{key:"rand",value:function(e,t){return new DynamicObject({v:e}).lerp({v:t},Math.random()).v}},{key:"doRandom",value:function(e,t,n){if("number"==typeof n){var i=Math.pow(10,n);return Math.round(this.rand(e,t)*i)/i}return Math.round(this.rand(e-.5,t+.5))}},{key:"headsTails",value:function(e,t){return this.doRandom(0,1)?t:e}},{key:"toDegrees",value:function(e){return e*(180/Math.PI)}},{key:"toRadians",value:function(e){return e*(Math.PI/180)}},{key:"findDistance",value:function(e,t){var n=t.x-e.x,i=t.y-e.y;return Math.sqrt(n*n+i*i)}},{key:"timestamp",value:function(){return(Date.now()+this.doRandom(0,99999)).toString()}},{key:"clamp",value:function(e,t,n){return Math.min(Math.max(e,t),n)}},{key:"constrain",value:function(e,t,n){return Math.min(Math.max(e,Math.min(t,n)),Math.max(t,n))}},{key:"convertRange",value:function(e,t,n,i,r,s){var a=(e-t)*(r-i)/(n-t)+i;return s?this.constrain(a,i,r):a}},{key:"nullObject",value:function(e){for(var t in e)void 0!==e[t]&&(e[t]=null);return null}},{key:"cloneObject",value:function(e){return JSON.parse(JSON.stringify(e))}},{key:"mergeObject",value:function(){for(var e={},t=arguments.length,n=Array(t),i=0;i<t;i++)n[i]=arguments[i];var r=!0,s=!1,a=void 0;try{for(var o,u=n[Symbol.iterator]();!(r=(o=u.next()).done);r=!0){var c=o.value;for(var l in c)e[l]=c[l]}}catch(e){s=!0,a=e}finally{try{!r&&u.return&&u.return()}finally{if(s)throw a}}return e}},{key:"cloneArray",value:function(e){return e.slice(0)}},{key:"queryString",value:function(e){return decodeURI(window.location.search.replace(new RegExp("^(?:.*[&\\?]"+encodeURI(e).replace(/[\.\+\*]/g,"\\$&")+"(?:\\=([^&]*))?)?.*$","i"),"$1"))}}]),e}(),Device=function(){function e(){var t=this;classCallCheck(this,e),this.agent=navigator.userAgent.toLowerCase(),this.prefix=function(){var e="",n="",i=window.getComputedStyle(document.documentElement,"");e=(Array.prototype.slice.call(i).join("").match(/-(moz|webkit|ms)-/)||""===i.OLink&&["","o"])[1],n="WebKit|Moz|MS|O".match(new RegExp("("+e+")","i"))[1];var r=t.detect("trident");return{unprefixed:r&&!t.detect("msie 9"),dom:n,lowercase:e,css:"-"+e+"-",js:(r?e[0]:e[0].toUpperCase())+e.substr(1)}}(),this.transformProperty=function(){var e=void 0;switch(t.prefix.lowercase){case"webkit":e="-webkit-transform";break;case"moz":e="-moz-transform";break;case"o":e="-o-transform";break;case"ms":e="-ms-transform";break;default:e="transform"}return e}()}return createClass(e,[{key:"detect",value:function(e){"string"==typeof e&&(e=[e]);for(var t=0;t<e.length;t++)if(this.agent.indexOf(e[t])>-1)return!0;return!1}},{key:"vendor",value:function(e){return this.prefix.js+e}}]),e}(),Interpolation=function e(){var t=this;classCallCheck(this,e),this.convertEase=function(e){return function(){var n=void 0;switch(e){case"easeInQuad":n=t.Quad.In;break;case"easeInCubic":n=t.Cubic.In;break;case"easeInQuart":n=t.Quart.In;break;case"easeInQuint":n=t.Quint.In;break;case"easeInSine":n=t.Sine.In;break;case"easeInExpo":n=t.Expo.In;break;case"easeInCirc":n=t.Circ.In;break;case"easeInElastic":n=t.Elastic.In;break;case"easeInBack":n=t.Back.In;break;case"easeInBounce":n=t.Bounce.In;break;case"easeOutQuad":n=t.Quad.Out;break;case"easeOutCubic":n=t.Cubic.Out;break;case"easeOutQuart":n=t.Quart.Out;break;case"easeOutQuint":n=t.Quint.Out;break;case"easeOutSine":n=t.Sine.Out;break;case"easeOutExpo":n=t.Expo.Out;break;case"easeOutCirc":n=t.Circ.Out;break;case"easeOutElastic":n=t.Elastic.Out;break;case"easeOutBack":n=t.Back.Out;break;case"easeOutBounce":n=t.Bounce.Out;break;case"easeInOutQuad":n=t.Quad.InOut;break;case"easeInOutCubic":n=t.Cubic.InOut;break;case"easeInOutQuart":n=t.Quart.InOut;break;case"easeInOutQuint":n=t.Quint.InOut;break;case"easeInOutSine":n=t.Sine.InOut;break;case"easeInOutExpo":n=t.Expo.InOut;break;case"easeInOutCirc":n=t.Circ.InOut;break;case"easeInOutElastic":n=t.Elastic.InOut;break;case"easeInOutBack":n=t.Back.InOut;break;case"easeInOutBounce":n=t.Bounce.InOut;break;case"linear":n=t.Linear.None}return n}()||t.Cubic.Out},this.Linear={None:function(e){return e}},this.Quad={In:function(e){return e*e},Out:function(e){return e*(2-e)},InOut:function(e){return(e*=2)<1?.5*e*e:-.5*(--e*(e-2)-1)}},this.Cubic={In:function(e){return e*e*e},Out:function(e){return--e*e*e+1},InOut:function(e){return(e*=2)<1?.5*e*e*e:.5*((e-=2)*e*e+2)}},this.Quart={In:function(e){return e*e*e*e},Out:function(e){return 1- --e*e*e*e},InOut:function(e){return(e*=2)<1?.5*e*e*e*e:-.5*((e-=2)*e*e*e-2)}},this.Quint={In:function(e){return e*e*e*e*e},Out:function(e){return--e*e*e*e*e+1},InOut:function(e){return(e*=2)<1?.5*e*e*e*e*e:.5*((e-=2)*e*e*e*e+2)}},this.Sine={In:function(e){return 1-Math.cos(e*Math.PI/2)},Out:function(e){return Math.sin(e*Math.PI/2)},InOut:function(e){return.5*(1-Math.cos(Math.PI*e))}},this.Expo={In:function(e){return 0===e?0:Math.pow(1024,e-1)},Out:function(e){return 1===e?1:1-Math.pow(2,-10*e)},InOut:function(e){return 0===e?0:1===e?1:(e*=2)<1?.5*Math.pow(1024,e-1):.5*(2-Math.pow(2,-10*(e-1)))}},this.Circ={In:function(e){return 1-Math.sqrt(1-e*e)},Out:function(e){return Math.sqrt(1- --e*e)},InOut:function(e){return(e*=2)<1?-.5*(Math.sqrt(1-e*e)-1):.5*(Math.sqrt(1-(e-=2)*e)+1)}},this.Elastic={In:function(e){var t=void 0,n=.1;return 0===e?0:1===e?1:(!n||n<1?(n=1,t=.1):t=.4*Math.asin(1/n)/(2*Math.PI),-n*Math.pow(2,10*(e-=1))*Math.sin((e-t)*(2*Math.PI)/.4))},Out:function(e){var t=void 0,n=.1;return 0===e?0:1===e?1:(!n||n<1?(n=1,t=.1):t=.4*Math.asin(1/n)/(2*Math.PI),n*Math.pow(2,-10*e)*Math.sin((e-t)*(2*Math.PI)/.4)+1)},InOut:function(e){var t=void 0,n=.1;return 0===e?0:1===e?1:(!n||n<1?(n=1,t=.1):t=.4*Math.asin(1/n)/(2*Math.PI),(e*=2)<1?n*Math.pow(2,10*(e-=1))*Math.sin((e-t)*(2*Math.PI)/.4)*-.5:n*Math.pow(2,-10*(e-=1))*Math.sin((e-t)*(2*Math.PI)/.4)*.5+1)}},this.Back={In:function(e){var t=1.70158;return e*e*((t+1)*e-t)},Out:function(e){var t=1.70158;return--e*e*((t+1)*e+t)+1},InOut:function(e){var t=2.5949095;return(e*=2)<1?e*e*((t+1)*e-t)*.5:.5*((e-=2)*e*((t+1)*e+t)+2)}},this.Bounce={In:function(e){return 1-t.Bounce.Out(1-e)},Out:function(e){return e<1/2.75?7.5625*e*e:e<2/2.75?7.5625*(e-=1.5/2.75)*e+.75:e<2.5/2.75?7.5625*(e-=2.25/2.75)*e+.9375:7.5625*(e-=2.625/2.75)*e+.984375},InOut:function(e){return e<.5?.5*t.Bounce.In(2*e):.5*t.Bounce.Out(2*e-1)+.5}}},MathTween=function e(t,n,i,r,s,a){function o(e){if(t.mathTween=null,!e)for(var n in h)"number"==typeof h[n]&&(t[n]=h[n]);TweenManager.removeMathTween(u)}classCallCheck(this,e);var u=this,c=void 0,l=void 0,h=void 0,f=void 0,v=void 0;!function(){TweenManager.clearTween(t),TweenManager.addMathTween(u),t.mathTween=u,r=Interpolation.convertEase(r),c=Date.now(),c+=s,h=n,l={};for(var e in h)"number"==typeof t[e]&&(l[e]=t[e])}(),this.update=function(e){if(!(f||e<c)){var n=r(v=(v=(e-c)/i)>1?1:v);for(var s in l)if("number"==typeof l[s]){var u=l[s],d=h[s];t[s]=u+(d-u)*n}1===v&&(o(),a&&a())}},this.pause=function(){f=!0},this.resume=function(){f=!1,c=Date.now()-v*i},this.stop=function(){return o(!0)}},SpringTween=function e(t,n,i,r,s,a){function o(e){if(t.mathTween=null,!e)for(var n in h)"number"==typeof h[n]&&(t[n]=h[n]);TweenManager.removeMathTween(u)}classCallCheck(this,e);var u=this,c=void 0,l=void 0,h=void 0,f=void 0,v=void 0,d=void 0,p=void 0;!function(){TweenManager.clearTween(t),TweenManager.addMathTween(u),t.mathTween=u,c=Date.now(),c+=s,h={},f={},l={},(n.x||n.y||n.z)&&(void 0===n.x&&(n.x=t.x),void 0===n.y&&(n.y=t.y),void 0===n.z&&(n.z=t.z)),d=0,v=n.damping||.1,delete n.damping;for(var e in n)"number"==typeof n[e]&&(l[e]=0,h[e]=n[e]);for(var i in n)"number"==typeof t[i]&&(f[i]=t[i]||0,n[i]=f[i])}(),this.update=function(e){if(!(p||e<c)){var r=void 0;for(var s in f)if("number"==typeof f[s]){var u=(h[s]-n[s])*v;l[s]+=u,l[s]*=i,n[s]+=l[s],t[s]=n[s],r=l[s]}Math.abs(r)<.001&&++d>30&&(o(),a&&a())}},this.pause=function(){p=!0},this.stop=function(){return o(!0)}},TweenManager=function(){function e(){function t(e){if(n.length)for(var r=0;r<n.length;r++)n[r].update(e);else i=!1,Render.stop(t)}classCallCheck(this,e),this.TRANSFORMS=["x","y","z","scale","scaleX","scaleY","rotation","rotationX","rotationY","rotationZ","skewX","skewY","perspective"],this.CSS_EASES={easeOutCubic:"cubic-bezier(0.215, 0.610, 0.355, 1.000)",easeOutQuad:"cubic-bezier(0.250, 0.460, 0.450, 0.940)",easeOutQuart:"cubic-bezier(0.165, 0.840, 0.440, 1.000)",easeOutQuint:"cubic-bezier(0.230, 1.000, 0.320, 1.000)",easeOutSine:"cubic-bezier(0.390, 0.575, 0.565, 1.000)",easeOutExpo:"cubic-bezier(0.190, 1.000, 0.220, 1.000)",easeOutCirc:"cubic-bezier(0.075, 0.820, 0.165, 1.000)",easeOutBack:"cubic-bezier(0.175, 0.885, 0.320, 1.275)",easeInCubic:"cubic-bezier(0.550, 0.055, 0.675, 0.190)",easeInQuad:"cubic-bezier(0.550, 0.085, 0.680, 0.530)",easeInQuart:"cubic-bezier(0.895, 0.030, 0.685, 0.220)",easeInQuint:"cubic-bezier(0.755, 0.050, 0.855, 0.060)",easeInSine:"cubic-bezier(0.470, 0.000, 0.745, 0.715)",easeInCirc:"cubic-bezier(0.600, 0.040, 0.980, 0.335)",easeInBack:"cubic-bezier(0.600, -0.280, 0.735, 0.045)",easeInOutCubic:"cubic-bezier(0.645, 0.045, 0.355, 1.000)",easeInOutQuad:"cubic-bezier(0.455, 0.030, 0.515, 0.955)",easeInOutQuart:"cubic-bezier(0.770, 0.000, 0.175, 1.000)",easeInOutQuint:"cubic-bezier(0.860, 0.000, 0.070, 1.000)",easeInOutSine:"cubic-bezier(0.445, 0.050, 0.550, 0.950)",easeInOutExpo:"cubic-bezier(1.000, 0.000, 0.000, 1.000)",easeInOutCirc:"cubic-bezier(0.785, 0.135, 0.150, 0.860)",easeInOutBack:"cubic-bezier(0.680, -0.550, 0.265, 1.550)",easeInOut:"cubic-bezier(0.420, 0.000, 0.580, 1.000)",linear:"linear"};var n=[],i=!1;this.addMathTween=function(e){n.push(e),i||(i=!0,Render.start(t))},this.removeMathTween=function(e){var t=n.indexOf(e);t>-1&&n.splice(t,1)}}return createClass(e,[{key:"tween",value:function(e,t,n,i,r,s){"number"!=typeof r&&(s=r,r=0);var a=null;"undefined"!=typeof Promise&&(a=Promise.create(),s&&a.then(s),s=a.resolve);var o="spring"===i?new SpringTween(e,t,n,i,r,s):new MathTween(e,t,n,i,r,s);return a||o}},{key:"clearTween",value:function(e){e.mathTween&&e.mathTween.stop()}},{key:"clearCSSTween",value:function(e){e.cssTween&&e.cssTween.stop()}},{key:"checkTransform",value:function(e){return this.TRANSFORMS.indexOf(e)>-1}},{key:"getEase",value:function(e){var t=this.CSS_EASES;return t[e]||t.easeOutCubic}},{key:"getAllTransforms",value:function(e){for(var t={},n=this.TRANSFORMS.length-1;n>-1;n--){var i=this.TRANSFORMS[n],r=e[i];0!==r&&"number"==typeof r&&(t[i]=r)}return t}},{key:"parseTransform",value:function(e){var t="";if(void 0!==e.x||void 0!==e.y||void 0!==e.z){var n="";n+=(e.x||0)+"px, ",n+=(e.y||0)+"px, ",t+="translate3d("+(n+=(e.z||0)+"px")+")"}return void 0!==e.scale?t+="scale("+e.scale+")":(void 0!==e.scaleX&&(t+="scaleX("+e.scaleX+")"),void 0!==e.scaleY&&(t+="scaleY("+e.scaleY+")")),void 0!==e.rotation&&(t+="rotate("+e.rotation+"deg)"),void 0!==e.rotationX&&(t+="rotateX("+e.rotationX+"deg)"),void 0!==e.rotationY&&(t+="rotateY("+e.rotationY+"deg)"),void 0!==e.rotationZ&&(t+="rotateZ("+e.rotationZ+"deg)"),void 0!==e.skewX&&(t+="skewX("+e.skewX+"deg)"),void 0!==e.skewY&&(t+="skewY("+e.skewY+"deg)"),void 0!==e.perspective&&(t+="perspective("+e.perspective+"px)"),t}}]),e}(),CSSTransition=function e(t,n,i,r,s,a){function o(){t.element.style[Device.vendor("Transition")]="",t.cssTween=null}classCallCheck(this,e);var u=this,c=TweenManager.getAllTransforms(t),l=[];!function(){for(var e in n)TweenManager.checkTransform(e)?(c.use=!0,c[e]=n[e],delete n[e]):("number"==typeof n[e]||e.indexOf("-")>-1)&&l.push(e);c.use&&l.push(Device.transformProperty),delete c.use}(),function(){TweenManager.clearCSSTween(t),t.cssTween=u;for(var e="",h=0;h<l.length;h++)e+=(e.length?", ":"")+l[h]+" "+i+"ms "+TweenManager.getEase(r)+" "+s+"ms";Delayed(function(){t.element.style[Device.vendor("Transition")]=e,t.css(n),t.transform(c),Delayed(function(){o(),a&&a()},i+s)},50)}(),this.stop=function(){return o()}},SVG=function e(){classCallCheck(this,e);var t=[];this.defineSymbol=function(e,n,i,r){var s=document.createElementNS("http://www.w3.org/2000/svg","svg");s.setAttribute("style","display: none;"),s.setAttribute("width",n),s.setAttribute("height",i),s.setAttributeNS("http://www.w3.org/2000/xmlns/","xmlns:xlink","http://www.w3.org/1999/xlink"),s.innerHTML='<symbol id="'+e+'">'+r+"</symbol>",document.body.insertBefore(s,document.body.firstChild),t.push({id:e,width:n,height:i})},this.getSymbolConfig=function(e){for(var n=0;n<t.length;n++)if(t[n].id===e)return t[n];return null}},Interface=function(){function e(t){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"div",i=arguments[2];classCallCheck(this,e),this.events=new EventManager,this.name=t,this.type=n,"svg"===this.type?(this.element=document.createElementNS("http://www.w3.org/2000/svg",this.type),this.element.setAttributeNS("http://www.w3.org/2000/xmlns/","xmlns:xlink","http://www.w3.org/1999/xlink")):(this.element=document.createElement(this.type),"."===t[0]?this.element.className=t.substr(1):this.element.id=t),this.element.style.position="absolute",i||(window.Alien&&window.Alien.Stage?window.Alien.Stage:document.body).appendChild(this.element)}return createClass(e,[{key:"initClass",value:function(e){for(var t=arguments.length,n=Array(t>1?t-1:0),i=1;i<t;i++)n[i-1]=arguments[i];var r=new(Function.prototype.bind.apply(e,[null].concat(n)));return r.element&&this.element.appendChild(r.element),r.parent=this,r}},{key:"create",value:function(t,n){var i=new e(t,n);return this.element.appendChild(i.element),i.parent=this,i}},{key:"destroy",value:function(){return this.loop&&Render.stop(this.loop),this.element.parentNode.removeChild(this.element),Utils.nullObject(this)}},{key:"empty",value:function(){return this.element.innerHTML="",this}},{key:"text",value:function(e){return void 0===e?this.element.textContent:(this.element.textContent=e,this)}},{key:"html",value:function(e){return void 0===e?this.element.innerHTML:(this.element.innerHTML=e,this)}},{key:"hide",value:function(){return this.element.style.display="none",this}},{key:"show",value:function(){return this.element.style.display="",this}},{key:"visible",value:function(){return this.element.style.visibility="visible",this}},{key:"invisible",value:function(){return this.element.style.visibility="hidden",this}},{key:"setZ",value:function(e){return this.element.style.zIndex=e,this}},{key:"clearAlpha",value:function(){return this.element.style.opacity="",this}},{key:"size",value:function(e,t){return void 0!==e&&(void 0===t&&(t=e),"string"==typeof e?("string"!=typeof t&&(t+="px"),this.element.style.width=e,this.element.style.height=t):(this.element.style.width=e+"px",this.element.style.height=t+"px",this.element.style.backgroundSize=e+"px "+t+"px")),this.width=this.element.offsetWidth,this.height=this.element.offsetHeight,this}},{key:"mouseEnabled",value:function(e){return this.element.style.pointerEvents=e?"auto":"none",this}},{key:"fontStyle",value:function(e,t,n,i){return this.css({fontFamily:e,fontSize:t,color:n,fontStyle:i}),this}},{key:"bg",value:function(e,t,n,i){return-1===e.indexOf(".")?this.element.style.backgroundColor=e:this.element.style.backgroundImage="url("+e+")",void 0!==t&&(t="number"==typeof t?t+"px":t,n="number"==typeof n?n+"px":n,this.element.style.backgroundPosition=t+" "+n),i&&(this.element.style.backgroundSize="",this.element.style.backgroundRepeat=i),"cover"!==t&&"contain"!==t||(this.element.style.backgroundSize=t,this.element.style.backgroundRepeat="no-repeat",this.element.style.backgroundPosition=void 0!==n?n+" "+i:"center"),this}},{key:"center",value:function(e,t,n){var i={};return void 0===e?(i.left="50%",i.top="50%",i.marginLeft=-this.width/2,i.marginTop=-this.height/2):(e&&(i.left="50%",i.marginLeft=-this.width/2),t&&(i.top="50%",i.marginTop=-this.height/2)),n&&(delete i.left,delete i.top),this.css(i),this}},{key:"mask",value:function(e){return this.element.style[Device.vendor("Mask")]=(e.indexOf(".")>-1?"url("+e+")":e)+" no-repeat",this.element.style[Device.vendor("MaskSize")]="contain",this}},{key:"blendMode",value:function(e,t){return this.element.style[t?"background-blend-mode":"mix-blend-mode"]=e,this}},{key:"css",value:function(e,t){if("object"!==(void 0===e?"undefined":_typeof(e))){if(t)return this.element.style[e]=t,this;var n=this.element.style[e];return"number"!=typeof n&&(n.indexOf("px")>-1&&(n=Number(n.slice(0,-2))),"opacity"===e&&(n=isNaN(Number(this.element.style.opacity))?1:Number(this.element.style.opacity))),n||(n=0),n}for(var i in e){var r=e[i];"string"!=typeof r&&"number"!=typeof r||("string"!=typeof r&&"opacity"!==i&&"zIndex"!==i&&(r+="px"),this.element.style[i]=r)}return this}},{key:"transform",value:function(e){if(e)for(var t in e)"number"==typeof e[t]&&(this[t]=e[t]);else e=this;return this.element.style[Device.vendor("Transform")]=TweenManager.parseTransform(e),this}},{key:"enable3D",value:function(e,t,n){return this.element.style[Device.vendor("TransformStyle")]="preserve-3d",e&&(this.element.style[Device.vendor("Perspective")]=e+"px"),void 0!==t&&(t="number"==typeof t?t+"px":t,n="number"==typeof n?n+"px":n,this.element.style[Device.vendor("PerspectiveOrigin")]=t+" "+n),this}},{key:"disable3D",value:function(){return this.element.style[Device.vendor("TransformStyle")]="",this.element.style[Device.vendor("Perspective")]="",this}},{key:"transformPoint",value:function(e,t,n){var i="";return void 0!==e&&(i+="number"==typeof e?e+"px ":e+" "),void 0!==t&&(i+="number"==typeof t?t+"px ":t+" "),void 0!==n&&(i+="number"==typeof n?n+"px":n),this.element.style[Device.vendor("TransformOrigin")]=i,this}},{key:"tween",value:function(e,t,n,i,r){"number"!=typeof i&&(r=i,i=0);var s=null;"undefined"!=typeof Promise&&(s=Promise.create(),r&&s.then(r),r=s.resolve);var a=new CSSTransition(this,e,t,n,i,r);return s||a}},{key:"clearTransform",value:function(){return"number"==typeof this.x&&(this.x=0),"number"==typeof this.y&&(this.y=0),"number"==typeof this.z&&(this.z=0),"number"==typeof this.scale&&(this.scale=1),"number"==typeof this.scaleX&&(this.scaleX=1),"number"==typeof this.scaleY&&(this.scaleY=1),"number"==typeof this.rotation&&(this.rotation=0),"number"==typeof this.rotationX&&(this.rotationX=0),"number"==typeof this.rotationY&&(this.rotationY=0),"number"==typeof this.rotationZ&&(this.rotationZ=0),"number"==typeof this.skewX&&(this.skewX=0),"number"==typeof this.skewY&&(this.skewY=0),this.element.style[Device.transformProperty]="",this}},{key:"stopTween",value:function(){return this.cssTween&&this.cssTween.stop(),this.mathTween&&this.mathTween.stop(),this}},{key:"attr",value:function(e,t){return void 0===t?this.element.getAttribute(e):(""===t?this.element.removeAttribute(e):this.element.setAttribute(e,t),this)}},{key:"svgSymbol",value:function(e,t,n){var i=SVG.getSymbolConfig(e);this.html('<svg viewBox="0 0 '+i.width+" "+i.height+'" width="'+t+'" height="'+n+'"><use xlink:href="#'+i.id+'" x="0" y="0"/></svg>')}},{key:"startRender",value:function(e){this.loop=e,Render.start(e)}},{key:"stopRender",value:function(e){this.loop=null,Render.stop(e)}},{key:"click",value:function(e){var t=this;return this.element.addEventListener("click",function(n){n.object="hit"===t.element.className?t.parent:t,n.action="click",e&&e(n)},!0),this.element.style.cursor="pointer",this}},{key:"hover",value:function(e){var t=this,n=function(n){n.object="hit"===t.element.className?t.parent:t,n.action="mouseout"===n.type?"out":"over",e&&e(n)};return this.element.addEventListener("mouseover",n,!0),this.element.addEventListener("mouseout",n,!0),this}},{key:"press",value:function(e){var t=this,n=function(n){n.object="hit"===t.element.className?t.parent:t,n.action="mousedown"===n.type?"down":"up",e&&e(n)};return this.element.addEventListener("mousedown",n,!0),this.element.addEventListener("mouseup",n,!0),this}},{key:"bind",value:function(e,t){return this.element.addEventListener(e,t,!0),this}},{key:"unbind",value:function(e,t){return this.element.removeEventListener(e,t,!0),this}},{key:"interact",value:function(e,t){return this.hit=this.create(".hit").css({position:"absolute",left:0,top:0,width:"100%",height:"100%",zIndex:99999}),this.hit.hover(e).click(t),this}},{key:"split",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"",t={position:"relative",display:"block",width:"auto",height:"auto",margin:0,padding:0,cssFloat:"left"},n=[],i=this.text().split(e);this.empty();for(var r=0;r<i.length;r++)" "===i[r]&&(i[r]="&nbsp;"),n.push(this.create(".t","span").html(i[r]).css(t)),""!==e&&r<i.length-1&&n.push(this.create(".t","span").html(e).css(t));return n}}]),e}(),Canvas=function(e){function t(e,n){var i=arguments.length>2&&void 0!==arguments[2]?arguments[2]:n,r=arguments[3],s=arguments[4];classCallCheck(this,t);var a=possibleConstructorReturn(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e,"canvas",s));a.children=[],a.retina=r,a.context=a.element.getContext("2d");var o=r?2:1;return a.element.width=n*o,a.element.height=i*o,a.context.scale(o,o),a.size(n,i),a}return inherits(t,e),createClass(t,[{key:"toDataURL",value:function(e,t){return this.element.toDataURL(e,t)}},{key:"render",value:function(e){"boolean"==typeof e&&e||this.clear();for(var t=0;t<this.children.length;t++)this.children[t].render()}},{key:"clear",value:function(){this.context.clearRect(0,0,this.element.width,this.element.height)}},{key:"add",value:function(e){e.setCanvas(this),e.parent=this,this.children.push(e),e.z=this.children.length}},{key:"remove",value:function(e){e.canvas=null,e.parent=null;var t=this.children.indexOf(e);t>-1&&this.children.splice(t,1)}},{key:"destroy",value:function(){this.stopRender();for(var e=0;e<this.children.length;e++)this.children[e].destroy();return Utils.nullObject(this)}},{key:"getImageData",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0,t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:this.element.width,i=arguments.length>3&&void 0!==arguments[3]?arguments[3]:this.element.height;return this.imageData=this.context.getImageData(e,t,n,i),this.imageData}},{key:"getPixel",value:function(e,t,n){this.imageData&&!n||this.getImageData();var i={},r=4*(e+t*this.element.width),s=this.imageData.data;return i.r=s[r],i.g=s[r+1],i.b=s[r+2],i.a=s[r+3],i}},{key:"putImageData",value:function(e){this.context.putImageData(e,0,0)}}]),t}(Interface),CanvasObject=function(){function e(){classCallCheck(this,e),this.visible=!0,this.blendMode="normal",this.x=0,this.y=0,this.px=0,this.py=0,this.clipX=0,this.clipY=0,this.clipWidth=0,this.clipHeight=0,this.width=0,this.height=0,this.rotation=0,this.scale=1,this.opacity=1,this.children=[]}return createClass(e,[{key:"updateValues",value:function(){this.scaleX=this.scaleX||this.scale,this.scaleY=this.scaleY||this.scale}},{key:"render",value:function(e){if(!this.visible)return!1;this.updateValues(),this.draw&&this.draw(e);for(var t=0;t<this.children.length;t++)this.children[t].render(e)}},{key:"startDraw",value:function(e){var t=this.canvas.context;t.save(),e||(t.globalCompositeOperation=this.blendMode),t.translate(this.x+this.px,this.y+this.py),t.rotate(this.rotation),t.scale(this.scaleX,this.scaleY),t.globalAlpha=this.opacity}},{key:"endDraw",value:function(){this.canvas.context.restore()}},{key:"add",value:function(e){e.canvas=this.canvas,e.parent=this,this.children.push(e),e.z=this.children.length}},{key:"setCanvas",value:function(e){this.canvas=e;for(var t=this.children.length-1;t>-1;t--)this.children[t].setCanvas(e)}},{key:"remove",value:function(e){e.canvas=null,e.parent=null;var t=this.children.indexOf(e);t>-1&&this.children.splice(t,1)}},{key:"isMask",value:function(){for(var e=this;e;){if(e.masked)return!0;e=e.parent}return!1}},{key:"unmask",value:function(){this.masked.mask(null),this.masked=null}},{key:"setZ",value:function(e){this.z=e,this.parent.children.sort(function(e,t){return e.z-t.z})}},{key:"follow",value:function(e){return this.x=e.x,this.y=e.y,this.px=e.px,this.py=e.py,this.clipX=e.clipX,this.clipY=e.clipY,this.clipWidth=e.clipWidth,this.clipHeight=e.clipHeight,this.width=e.width,this.height=e.height,this.rotation=e.rotation,this.scale=e.scale,this.scaleX=e.scaleX||e.scale,this.scaleY=e.scaleY||e.scale,this}},{key:"visible",value:function(){return this.visible=!0,this}},{key:"invisible",value:function(){return this.visible=!1,this}},{key:"transform",value:function(e){for(var t in e)"number"==typeof e[t]&&(this[t]=e[t]);return this}},{key:"transformPoint",value:function(e,t){return this.px="number"==typeof e?e:this.width*(parseFloat(e)/100),this.py="number"==typeof t?t:this.height*(parseFloat(t)/100),this}},{key:"clip",value:function(e,t,n,i){return this.clipX=e,this.clipY=t,this.clipWidth=n,this.clipHeight=i,this}},{key:"destroy",value:function(){for(var e=0;e<this.children.length;e++)this.children[e].destroy();return Utils.nullObject(this)}}]),e}(),Color=function e(t){function n(t){t instanceof e?i(t):"number"==typeof t?r(t):Array.isArray(t)?s(t):r(Number("0x"+t.slice(1)))}function i(e){u.r=e.r,u.g=e.g,u.b=e.b}function r(e){e=Math.floor(e),u.r=(e>>16&255)/255,u.g=(e>>8&255)/255,u.b=(255&e)/255}function s(e){u.r=e[0],u.g=e[1],u.b=e[2]}function a(e,t,n){return n<0&&(n+=1),n>1&&(n-=1),n<1/6?e+6*(t-e)*n:n<.5?t:n<2/3?e+6*(t-e)*(2/3-n):e}var o=this;classCallCheck(this,e);var u=this;this.r=1,this.g=1,this.b=1,n(t),this.set=function(e){return n(e),o},this.setRGB=function(e,t,n){return o.r=e,o.g=t,o.b=n,o},this.setHSL=function(e,t,n){if(0===t)o.r=o.g=o.b=n;else{var i=n<=.5?n*(1+t):n+t-n*t,r=2*n-i;o.r=a(r,i,e+1/3),o.g=a(r,i,e),o.b=a(r,i,e-1/3)}return o},this.offsetHSL=function(e,t,n){var i=o.getHSL();return i.h+=e,i.s+=t,i.l+=n,o.setHSL(i.h,i.s,i.l),o},this.getStyle=function(){return"rgb("+(255*o.r|0)+","+(255*o.g|0)+","+(255*o.b|0)+")"},this.getHex=function(){return 255*o.r<<16^255*o.g<<8^255*o.b<<0},this.getHexString=function(){return"#"+("000000"+o.getHex().toString(16)).slice(-6)},this.getHSL=function(){o.hsl=o.hsl||{h:0,s:0,l:0};var e=o.hsl,t=o.r,n=o.g,i=o.b,r=Math.max(t,n,i),s=Math.min(t,n,i),a=void 0,u=void 0,c=(s+r)/2;if(s===r)a=0,u=0;else{var l=r-s;switch(u=c<=.5?l/(r+s):l/(2-r-s),r){case t:a=(n-i)/l+(n<i?6:0);break;case n:a=(i-t)/l+2;break;case i:a=(t-n)/l+4}a/=6}return e.h=a,e.s=u,e.l=c,e},this.add=function(e){o.r+=e.r,o.g+=e.g,o.b+=e.b},this.mix=function(e,t){o.r*=1-t+e.r*t,o.g*=1-t+e.g*t,o.b*=1-t+e.b*t},this.addScalar=function(e){o.r+=e,o.g+=e,o.b+=e},this.multiply=function(e){o.r*=e.r,o.g*=e.g,o.b*=e.b},this.multiplyScalar=function(e){o.r*=e,o.g*=e,o.b*=e},this.clone=function(){return new e([o.r,o.g,o.b])},this.toArray=function(){return o.array||(o.array=[]),o.array[0]=o.r,o.array[1]=o.g,o.array[2]=o.b,o.array}},Images=function(){function e(){classCallCheck(this,e)}return createClass(e,[{key:"createImg",value:function(e,t){var n=this,i=new Image;return i.src=e,i.onload=function(){n.complete=!0,t&&t()},i}}]),e}(),CanvasGraphics=function(e){function t(){function e(e){for(var t in s.props){var n=s.props[t];e[t]=n instanceof Color?n.getHexString():n}}var n=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0,i=arguments.length>1&&void 0!==arguments[1]?arguments[1]:n;classCallCheck(this,t);var r=possibleConstructorReturn(this,(t.__proto__||Object.getPrototypeOf(t)).call(this)),s=r;r.width=n,r.height=i,r.props={};var a={},o=[],u=void 0;return r.draw=function(t){if(r.isMask()&&!t)return!1;var n=r.canvas.context;r.startDraw(t),e(n),r.clipWidth&&r.clipHeight&&(n.beginPath(),n.rect(r.clipX,r.clipY,r.clipWidth,r.clipHeight),n.clip());for(var i=0;i<o.length;i++){var s=o[i];if(s){var a=s.shift();n[a].apply(n,s),s.unshift(a)}}r.endDraw(),u&&(n.globalCompositeOperation=u.blendMode,u.render(!0))},r.clear=function(){for(var e=0;e<o.length;e++)o[e].length=0;o.length=0},r.arc=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0,t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:0,i=arguments.length>3&&void 0!==arguments[3]?arguments[3]:r.radius||r.width/2,s=arguments.length>4&&void 0!==arguments[4]?arguments[4]:0,a=arguments.length>5&&void 0!==arguments[5]&&arguments[5];e&&!t&&(n=e,e=0,t=0),n-=90,s-=90,o.push(["beginPath"]),o.push(["arc",e,t,i,Utils.toRadians(s),Utils.toRadians(n),a])},r.quadraticCurveTo=function(e,t,n,i){o.push(["quadraticCurveTo",e,t,n,i])},r.bezierCurveTo=function(e,t,n,i,r,s){o.push(["bezierCurveTo",e,t,n,i,r,s])},r.fillRect=function(e,t,n,i){o.push(["fillRect",e,t,n,i])},r.clearRect=function(e,t,n,i){o.push(["clearRect",e,t,n,i])},r.strokeRect=function(e,t,n,i){o.push(["strokeRect",e,t,n,i])},r.moveTo=function(e,t){o.push(["moveTo",e,t])},r.lineTo=function(e,t){o.push(["lineTo",e,t])},r.stroke=function(){o.push(["stroke"])},r.fill=function(){u||o.push(["fill"])},r.beginPath=function(){o.push(["beginPath"])},r.closePath=function(){o.push(["closePath"])},r.fillText=function(e,t,n){o.push(["fillText",e,t,n])},r.strokeText=function(e,t,n){o.push(["strokeText",e,t,n])},r.setLineDash=function(e){o.push(["setLineDash",e])},r.createImage=function(e,t){if(!a[e]||t){var n=Images.createImg(e);if(t)return n;a[e]=n}return a[e]},r.drawImage=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:0,i=arguments.length>3&&void 0!==arguments[3]?arguments[3]:e.width,s=arguments.length>4&&void 0!==arguments[4]?arguments[4]:e.height,a=arguments.length>5&&void 0!==arguments[5]?arguments[5]:0,u=arguments.length>6&&void 0!==arguments[6]?arguments[6]:0,c=arguments.length>7&&void 0!==arguments[7]?arguments[7]:e.width,l=arguments.length>8&&void 0!==arguments[8]?arguments[8]:e.height;"string"==typeof e&&(e=r.createImage(e)),o.push(["drawImage",e,t,n,i,s,a+(r.px?-r.px:0),u+(r.py?-r.py:0),c,l])},r.mask=function(e){if(!e)return u=null;u=e,e.masked=r;for(var t=0;t<o.length;t++)"fill"!==o[t][0]&&"stroke"!==o[t][0]||(o[t].length=0,o.splice(t,1))},r.clone=function(){var e=new t(r.width,r.height);return e.visible=r.visible,e.blendMode=r.blendMode,e.opacity=r.opacity,e.follow(r),e.props=Utils.cloneObject(r.props),e.setDraw(Utils.cloneArray(o)),e},r.setDraw=function(e){o=e},r}return inherits(t,e),createClass(t,[{key:"strokeStyle",set:function(e){this.props.strokeStyle=e},get:function(){return this.props.strokeStyle}},{key:"fillStyle",set:function(e){this.props.fillStyle=e},get:function(){return this.props.fillStyle}},{key:"lineWidth",set:function(e){this.props.lineWidth=e},get:function(){return this.props.lineWidth}},{key:"lineCap",set:function(e){this.props.lineCap=e},get:function(){return this.props.lineCap}},{key:"lineDashOffset",set:function(e){this.props.lineDashOffset=e},get:function(){return this.props.lineDashOffset}},{key:"lineJoin",set:function(e){this.props.lineJoin=e},get:function(){return this.props.lineJoin}},{key:"miterLimit",set:function(e){this.props.miterLimit=e},get:function(){return this.props.miterLimit}},{key:"font",set:function(e){this.props.font=e},get:function(){return this.props.font}},{key:"textAlign",set:function(e){this.props.textAlign=e},get:function(){return this.props.textAlign}},{key:"textBaseline",set:function(e){this.props.textBaseline=e},get:function(){return this.props.textBaseline}}]),t}(CanvasObject),CanvasImage=function(e){function t(e,n,i){var r=arguments.length>3&&void 0!==arguments[3]?arguments[3]:i;classCallCheck(this,t);var s=possibleConstructorReturn(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,i,r)),a=e.initClass(Canvas,n,i,r);return s.img=function(e){return s.drawImage(e,0,0,i,r),a.add(s),s},s}return inherits(t,e),t}(CanvasGraphics),AssetLoader=function e(t,n){function i(){o=++a/s,r.events.fire(Events.PROGRESS,{percent:o}),a===s&&(r.complete=!0,r.events.fire(Events.COMPLETE),n&&n())}classCallCheck(this,e);var r=this;this.events=new EventManager,this.CDN=Config.CDN||"";for(var s=t.length,a=0,o=0,u=0;u<t.length;u++)!function(e){var t=new Image;t.src=e,t.onload=i}(this.CDN+t[u])};AssetLoader.loadAssets=function(e,t){var n=Promise.create();return t||(t=n.resolve),new AssetLoader(e,t),n};var Stage=function(e){function t(){function e(){i.size()}classCallCheck(this,t);var n=possibleConstructorReturn(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,"Stage")),i=n,r=void 0;return i.css({overflow:"hidden"}),window.addEventListener("focus",function(){"focus"!==r&&(r="focus",window.events.fire(Events.BROWSER_FOCUS,{type:"focus"}))},!0),window.addEventListener("blur",function(){"blur"!==r&&(r="blur",window.events.fire(Events.BROWSER_FOCUS,{type:"blur"}))},!0),window.addEventListener("keydown",function(){return window.events.fire(Events.KEYBOARD_DOWN)},!0),window.addEventListener("keyup",function(){return window.events.fire(Events.KEYBOARD_UP)},!0),window.addEventListener("keypress",function(){return window.events.fire(Events.KEYBOARD_PRESS)},!0),window.addEventListener("resize",function(){return window.events.fire(Events.RESIZE)},!0),window.events.add(Events.RESIZE,e),e(),n}return inherits(t,e),t}(Interface),FontLoader=function e(t,n){classCallCheck(this,e);var i=this;this.events=new EventManager;var r=void 0;!function(){Array.isArray(t)||(t=[t]),r=Stage.create("FontLoader");for(var e=0;e<t.length;e++)r.create("font").fontStyle(t[e],12,"#000").text("LOAD").css({top:-999})}(),Delayed(function(){r.destroy(),i.complete=!0,i.events.fire(Events.COMPLETE),n&&n()},500)};FontLoader.loadFonts=function(e,t){var n=Promise.create();return t||(t=n.resolve),new FontLoader(e,t),n},"undefined"!=typeof Promise&&(Promise.create=function(){var e=void 0,t=void 0,n=new Promise(function(n,i){e=n,t=i});return n.resolve=e,n.reject=t,n}),window.getURL=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"_blank";return window.open(e,t)},window.Delayed=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,n=arguments[2];return window.setTimeout(function(){e&&e(n)},t)},window.Global||(window.Global={}),window.Config||(window.Config={}),Function(function(){var e="";return["Render","Utils","Device","Mouse","TweenManager","Interpolation","Images","XHR","Stage"].forEach(function(t){e+="try {"+t+" = new "+t+"();} catch(e) {}"}),e}())(),Config.ASSETS=["assets/alienkitty.svg","assets/alienkitty_eyelid.svg"];var Main=function e(){function t(e){c.loaded&&("over"===e.action?TweenManager.tween(l,{z:50},100,"easeOutCubic"):TweenManager.tween(l,{z:0},300,"easeOutCubic"))}function n(e){getURL(e.object.url)}function i(){c.loaded=!0,h.bg("assets/alienkitty.svg"),f.bg("assets/alienkitty_eyelid.svg"),v.bg("assets/alienkitty_eyelid.svg"),Stage.events.fire(Events.COMPLETE)}function r(){c.playing=!0,Stage.startRender(s),TweenManager.tween(l,{z:0},7e3,"easeOutCubic"),h.tween({opacity:1},500,"easeOutQuart"),a()}function s(){l.transform()}function a(){Delayed(Utils.headsTails(o,u),Utils.doRandom(0,1e4))}function o(){f.tween({scaleY:1.5},120,"easeOutCubic",function(){f.tween({scaleY:.01},180,"easeOutCubic")}),v.tween({scaleX:1.3,scaleY:1.3},120,"easeOutCubic",function(){v.tween({scaleX:1,scaleY:.01},180,"easeOutCubic",function(){a()})})}function u(){f.tween({scaleY:1.5},120,"easeOutCubic",function(){f.tween({scaleY:.01},180,"easeOutCubic")}),v.tween({scaleX:1.3,scaleY:1.3},180,"easeOutCubic",function(){v.tween({scaleX:1,scaleY:.01},240,"easeOutCubic",function(){a()})})}classCallCheck(this,e);var c=this;this.playing=!1;var l=void 0,h=void 0,f=void 0,v=void 0;Stage.size(300,250).enable3D(2e3),(l=Stage.create(".wrapper")).size(90,86).center().transform({z:-300}).enable3D(),h=l.create(".alienkitty").size(90,86).css({opacity:0}),f=h.create(".eyelid1").size(24,14).css({left:35,top:25}).transformPoint("50%",0).transform({scaleX:1.5,scaleY:.01}),v=h.create(".eyelid2").size(24,14).css({left:53,top:26}).transformPoint(0,0).transform({scaleX:1,scaleY:.01}),Stage.url=window.clickTag,Stage.interact(t,n),new AssetLoader(Config.ASSETS).events.add(Events.COMPLETE,i),Stage.events.add(Events.COMPLETE,r)};new Main;
