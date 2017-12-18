//   _  /._  _  r7.loader 2017-12-17 10:51pm
//  /_|///_'/ /
function _possibleConstructorReturn(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function _inherits(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}var _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},_createClass=function(){function e(e,t){for(var n=0;n<t.length;n++){var i=t[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,n,i){return n&&e(t.prototype,n),i&&e(t,i),t}}();"undefined"!=typeof Promise&&(Promise.create=function(){var e=void 0,t=void 0,n=new Promise(function(n,i){e=n,t=i});return n.resolve=e,n.reject=t,n}),Math.sign=function(e){return 0==(e=+e)||isNaN(e)?Number(e):e>0?1:-1},Math.degrees=function(e){return e*(180/Math.PI)},Math.radians=function(e){return e*(Math.PI/180)},Math.clamp=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:1;return Math.min(Math.max(e,Math.min(t,n)),Math.max(t,n))},Math.range=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:-1,n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:1,i=arguments.length>3&&void 0!==arguments[3]?arguments[3]:0,r=arguments.length>4&&void 0!==arguments[4]?arguments[4]:1,s=(e-t)*(r-i)/(n-t)+i;return arguments[5]?Math.clamp(s,Math.min(i,r),Math.max(i,r)):s},Math.mix=function(e,t,n){return e*(1-n)+t*n},Math.step=function(e,t){return t<e?0:1},Math.smoothStep=function(e,t,n){var i=Math.max(0,Math.min(1,(n-e)/(t-e)));return i*i*(3-2*i)},Math.fract=function(e){return e-Math.floor(e)},Math.mod=function(e,t){return(e%t+t)%t},Array.prototype.remove=function(e){var t=this.indexOf(e);if(~t)return this.splice(t,1)},Array.prototype.last=function(){return this[this.length-1]},String.prototype.includes=function(e){if(!Array.isArray(e))return~this.indexOf(e);for(var t=e.length-1;t>=0;t--)if(~this.indexOf(e[t]))return!0;return!1},String.prototype.clip=function(e,t){return this.length>e?this.slice(0,e)+t:this},String.prototype.capitalize=function(){return this.charAt(0).toUpperCase()+this.slice(1)},String.prototype.replaceAll=function(e,t){return this.split(e).join(t)},window.fetch||(window.fetch=function(e){function t(){var e=[],n=[],i={},s=void 0;return r.getAllResponseHeaders().replace(/^(.*?):\s*([\s\S]*?)$/gm,function(t,r,a){e.push(r=r.toLowerCase()),n.push([r,a]),s=i[r],i[r]=s?s+","+a:a}),{ok:1==(r.status/200|0),status:r.status,statusText:r.statusText,url:r.responseURL,clone:t,text:function(){return Promise.resolve(r.responseText)},json:function(){return Promise.resolve(r.responseText).then(JSON.parse)},xml:function(){return Promise.resolve(r.responseXML)},blob:function(){return Promise.resolve(new Blob([r.response]))},arrayBuffer:function(){return Promise.resolve(new ArrayBuffer([r.response]))},headers:{keys:function(){return e},entries:function(){return n},get:function(e){return i[e.toLowerCase()]},has:function(e){return e.toLowerCase()in i}}}}var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},i=Promise.create(),r=new XMLHttpRequest;r.open(n.method||"GET",e);for(var s in n.headers)r.setRequestHeader(s,n.headers[s]);return r.onload=function(){return i.resolve(t())},r.onerror=i.reject,r.send(n.body),i}),window.get=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},n=Promise.create();return t.method="GET",window.fetch(e,t).then(function(e){if(!e.ok)return n.reject(e);e.text().then(function(e){if(e.charAt(0).includes(["[","{"]))try{n.resolve(JSON.parse(e))}catch(t){n.resolve(e)}else n.resolve(e)})}).catch(n.reject),n},window.post=function(e,t){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{},i=Promise.create();return n.method="POST",n.body=JSON.stringify(t),window.fetch(e,n).then(function(e){if(!e.ok)return i.reject(e);e.text().then(function(e){if(e.charAt(0).includes(["[","{"]))try{i.resolve(JSON.parse(e))}catch(t){i.resolve(e)}else i.resolve(e)})}).catch(i.reject),i},window.getURL=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"_blank";window.open(e,t)},window.Global||(window.Global={}),window.Config||(window.Config={});var Utils=new(function(){function e(){_classCallCheck(this,e)}return _createClass(e,[{key:"random",value:function(e,t){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:0;if(void 0===e)return Math.random();if(e===t)return e;e=e||0,t=t||1;var i=Math.pow(10,n);return Math.round((e+Math.random()*(t-e))*i)/i}},{key:"headsTails",value:function(e,t){return this.random(0,1)?t:e}},{key:"queryString",value:function(e){var t=decodeURI(window.location.search.replace(new RegExp("^(?:.*[&\\?]"+encodeURI(e).replace(/[.+*]/g,"\\$&")+"(?:\\=([^&]*))?)?.*$","i"),"$1"));return!(!t.length||"0"===t||"false"===t)&&t}},{key:"getConstructorName",value:function(e){return e.constructor.name||e.constructor.toString().match(/function ([^(]+)/)[1]}},{key:"nullObject",value:function(e){for(var t in e)void 0!==e[t]&&(e[t]=null);return null}},{key:"cloneObject",value:function(e){return JSON.parse(JSON.stringify(e))}},{key:"mergeObject",value:function(){for(var e={},t=arguments.length,n=Array(t),i=0;i<t;i++)n[i]=arguments[i];var r=!0,s=!1,a=void 0;try{for(var o,u=n[Symbol.iterator]();!(r=(o=u.next()).done);r=!0){var c=o.value;for(var l in c)e[l]=c[l]}}catch(e){s=!0,a=e}finally{try{!r&&u.return&&u.return()}finally{if(s)throw a}}return e}},{key:"toArray",value:function(e){return Object.keys(e).map(function(t){return e[t]})}},{key:"cloneArray",value:function(e){return e.slice(0)}},{key:"basename",value:function(e,t){var n=e.split("/").last();return t?n:n.split(".")[0]}},{key:"extension",value:function(e){return e.split(".").last().split("?")[0].toLowerCase()}},{key:"base64",value:function(e){return window.btoa(encodeURIComponent(e).replace(/%([0-9A-F]{2})/g,function(e,t){return String.fromCharCode("0x"+t)}))}},{key:"timestamp",value:function(){return(Date.now()+this.random(0,99999)).toString()}},{key:"pad",value:function(e){return e<10?"0"+e:e}}]),e}()),Events=function e(){var t=this;_classCallCheck(this,e);var n={};this.add=function(e,t){n[e]||(n[e]=[]),n[e].push(t)},this.remove=function(e,t){n[e]&&n[e].remove(t)},this.destroy=function(){for(var e in n)for(var i=n[e].length-1;i>-1;i--)n[e][i]=null,n[e].splice(i,1);return Utils.nullObject(t)},this.fire=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};if(n[e]){Utils.cloneArray(n[e]).forEach(function(e){return e(t)})}}};Events.VISIBILITY="visibility",Events.KEYBOARD_PRESS="keyboard_press",Events.KEYBOARD_DOWN="keyboard_down",Events.KEYBOARD_UP="keyboard_up",Events.RESIZE="resize",Events.COMPLETE="complete",Events.PROGRESS="progress",Events.UPDATE="update",Events.LOADED="loaded",Events.ERROR="error",Events.READY="ready",Events.HOVER="hover",Events.CLICK="click",window.requestAnimationFrame||(window.requestAnimationFrame=window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||function(){var e=Date.now();return function(t){return setTimeout(function(){return t(Date.now()-e)},1e3/60)}}());var Render=new function e(){function t(e){var n=Math.min(s,e-a);a=e,i.TIME=e,i.DELTA=n;for(var o=r.length-1;o>=0;o--){var u=r[o];if(u)if(u.fps){if(e-u.last<1e3/u.fps)continue;u(++u.frame),u.last=e}else u(e,n);else r.remove(u)}i.paused||requestAnimationFrame(t)}var n=this;_classCallCheck(this,e);var i=this,r=[],s=200,a=performance.now();requestAnimationFrame(t),this.start=function(e,t){t&&(e.fps=t,e.last=-1/0,e.frame=-1),~r.indexOf(e)||r.unshift(e)},this.stop=function(e){r.remove(e)},this.pause=function(){n.paused=!0},this.resume=function(){n.paused&&(n.paused=!1,requestAnimationFrame(t))}},Device=new(function(){function e(){var t=this;_classCallCheck(this,e),this.agent=navigator.userAgent.toLowerCase(),this.prefix=function(){var e=window.getComputedStyle(document.documentElement,""),t=(Array.prototype.slice.call(e).join("").match(/-(webkit|moz|ms)-/)||""===e.OLink&&["","o"])[1];return{lowercase:t,js:t[0].toUpperCase()+t.substr(1)}}(),this.transformProperty=function(){var e=void 0;switch(t.prefix.lowercase){case"webkit":e="-webkit-transform";break;case"moz":e="-moz-transform";break;case"ms":e="-ms-transform";break;case"o":e="-o-transform";break;default:e="transform"}return e}(),this.pixelRatio=window.devicePixelRatio,this.os=t.detect(["iphone","ipad"])?"ios":t.detect(["android"])?"android":t.detect(["blackberry"])?"blackberry":t.detect(["mac os"])?"mac":t.detect(["windows"])?"windows":t.detect(["linux"])?"linux":"unknown",this.mobile="ontouchstart"in window&&this.detect(["iphone","ipad","android","blackberry"]),this.tablet=Math.max(screen.width,screen.height)>800,this.phone=!this.tablet}return _createClass(e,[{key:"detect",value:function(e){"string"==typeof e&&(e=[e]);for(var t=0;t<e.length;t++)if(~this.agent.indexOf(e[t]))return!0;return!1}},{key:"vendor",value:function(e){return this.prefix.js+e}},{key:"vibrate",value:function(e){navigator.vibrate&&navigator.vibrate(e)}}]),e}()),Interpolation=new function e(){var t=this;_classCallCheck(this,e),this.convertEase=function(e){return function(){var n=void 0;switch(e){case"easeInQuad":n=t.Quad.In;break;case"easeInCubic":n=t.Cubic.In;break;case"easeInQuart":n=t.Quart.In;break;case"easeInQuint":n=t.Quint.In;break;case"easeInSine":n=t.Sine.In;break;case"easeInExpo":n=t.Expo.In;break;case"easeInCirc":n=t.Circ.In;break;case"easeInElastic":n=t.Elastic.In;break;case"easeInBack":n=t.Back.In;break;case"easeInBounce":n=t.Bounce.In;break;case"easeOutQuad":n=t.Quad.Out;break;case"easeOutCubic":n=t.Cubic.Out;break;case"easeOutQuart":n=t.Quart.Out;break;case"easeOutQuint":n=t.Quint.Out;break;case"easeOutSine":n=t.Sine.Out;break;case"easeOutExpo":n=t.Expo.Out;break;case"easeOutCirc":n=t.Circ.Out;break;case"easeOutElastic":n=t.Elastic.Out;break;case"easeOutBack":n=t.Back.Out;break;case"easeOutBounce":n=t.Bounce.Out;break;case"easeInOutQuad":n=t.Quad.InOut;break;case"easeInOutCubic":n=t.Cubic.InOut;break;case"easeInOutQuart":n=t.Quart.InOut;break;case"easeInOutQuint":n=t.Quint.InOut;break;case"easeInOutSine":n=t.Sine.InOut;break;case"easeInOutExpo":n=t.Expo.InOut;break;case"easeInOutCirc":n=t.Circ.InOut;break;case"easeInOutElastic":n=t.Elastic.InOut;break;case"easeInOutBack":n=t.Back.InOut;break;case"easeInOutBounce":n=t.Bounce.InOut;break;case"linear":n=t.Linear.None}return n}()||t.Cubic.Out},this.Linear={None:function(e){return e}},this.Quad={In:function(e){return e*e},Out:function(e){return e*(2-e)},InOut:function(e){return(e*=2)<1?.5*e*e:-.5*(--e*(e-2)-1)}},this.Cubic={In:function(e){return e*e*e},Out:function(e){return--e*e*e+1},InOut:function(e){return(e*=2)<1?.5*e*e*e:.5*((e-=2)*e*e+2)}},this.Quart={In:function(e){return e*e*e*e},Out:function(e){return 1- --e*e*e*e},InOut:function(e){return(e*=2)<1?.5*e*e*e*e:-.5*((e-=2)*e*e*e-2)}},this.Quint={In:function(e){return e*e*e*e*e},Out:function(e){return--e*e*e*e*e+1},InOut:function(e){return(e*=2)<1?.5*e*e*e*e*e:.5*((e-=2)*e*e*e*e+2)}},this.Sine={In:function(e){return 1-Math.cos(e*Math.PI/2)},Out:function(e){return Math.sin(e*Math.PI/2)},InOut:function(e){return.5*(1-Math.cos(Math.PI*e))}},this.Expo={In:function(e){return 0===e?0:Math.pow(1024,e-1)},Out:function(e){return 1===e?1:1-Math.pow(2,-10*e)},InOut:function(e){return 0===e?0:1===e?1:(e*=2)<1?.5*Math.pow(1024,e-1):.5*(2-Math.pow(2,-10*(e-1)))}},this.Circ={In:function(e){return 1-Math.sqrt(1-e*e)},Out:function(e){return Math.sqrt(1- --e*e)},InOut:function(e){return(e*=2)<1?-.5*(Math.sqrt(1-e*e)-1):.5*(Math.sqrt(1-(e-=2)*e)+1)}},this.Elastic={In:function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:1,n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:.4,i=void 0;return 0===e?0:1===e?1:(!t||t<1?(t=1,i=n/4):i=n*Math.asin(1/t)/(2*Math.PI),-t*Math.pow(2,10*(e-=1))*Math.sin((e-i)*(2*Math.PI)/n))},Out:function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:1,n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:.4,i=void 0;return 0===e?0:1===e?1:(!t||t<1?(t=1,i=n/4):i=n*Math.asin(1/t)/(2*Math.PI),t*Math.pow(2,-10*e)*Math.sin((e-i)*(2*Math.PI)/n)+1)},InOut:function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:1,n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:.4,i=void 0;return 0===e?0:1===e?1:(!t||t<1?(t=1,i=n/4):i=n*Math.asin(1/t)/(2*Math.PI),(e*=2)<1?t*Math.pow(2,10*(e-=1))*Math.sin((e-i)*(2*Math.PI)/n)*-.5:t*Math.pow(2,-10*(e-=1))*Math.sin((e-i)*(2*Math.PI)/n)*.5+1)}},this.Back={In:function(e){return e*e*(2.70158*e-1.70158)},Out:function(e){return--e*e*(2.70158*e+1.70158)+1},InOut:function(e){var t=2.5949095;return(e*=2)<1?e*e*((t+1)*e-t)*.5:.5*((e-=2)*e*((t+1)*e+t)+2)}},this.Bounce={In:function(e){return 1-this.Bounce.Out(1-e)},Out:function(e){return e<1/2.75?7.5625*e*e:e<2/2.75?7.5625*(e-=1.5/2.75)*e+.75:e<2.5/2.75?7.5625*(e-=2.25/2.75)*e+.9375:7.5625*(e-=2.625/2.75)*e+.984375},InOut:function(e){return e<.5?.5*this.Bounce.In(2*e):.5*this.Bounce.Out(2*e-1)+.5}}},MathTween=function e(t,n,i,r,s,a,o){function u(){if(!t&&!n)return!1;t.mathTween=null,TweenManager.removeMathTween(l),Utils.nullObject(l),t.mathTweens&&t.mathTweens.remove(l)}var c=this;_classCallCheck(this,e);var l=this,h=void 0,f=void 0,v=void 0,d=void 0,m=void 0,p=void 0,y=void 0;!function(){!t.multiTween&&t.mathTween&&TweenManager.clearTween(t),TweenManager.addMathTween(l),t.mathTween=l,t.multiTween&&(t.mathTweens||(t.mathTweens=[]),t.mathTweens.push(l)),r=Interpolation.convertEase(r),h=performance.now(),h+=s,v=n,f={},n.spring&&(m=n.spring),n.damping&&(p=n.damping);for(var e in v)"number"==typeof t[e]&&(f[e]=t[e])}(),this.update=function(e){if(!(d||e<h)){y=(y=(e-h)/i)>1?1:y;var t=c.interpolate(y);a&&a(t),1===y&&(o&&o(),u())}},this.stop=function(){u()},this.pause=function(){d=!0},this.resume=function(){d=!1,h=performance.now()-y*i},this.interpolate=function(e){var n=r(e,m,p);for(var i in f)if("number"==typeof f[i]&&"number"==typeof v[i]){var s=f[i],a=v[i];t[i]=s+(a-s)*n}return n}},TweenManager=new(function(){function e(){_classCallCheck(this,e);var t=this;this.TRANSFORMS=["x","y","z","scale","scaleX","scaleY","rotation","rotationX","rotationY","rotationZ","skewX","skewY","perspective"],this.CSS_EASES={easeOutCubic:"cubic-bezier(0.215, 0.610, 0.355, 1.000)",easeOutQuad:"cubic-bezier(0.250, 0.460, 0.450, 0.940)",easeOutQuart:"cubic-bezier(0.165, 0.840, 0.440, 1.000)",easeOutQuint:"cubic-bezier(0.230, 1.000, 0.320, 1.000)",easeOutSine:"cubic-bezier(0.390, 0.575, 0.565, 1.000)",easeOutExpo:"cubic-bezier(0.190, 1.000, 0.220, 1.000)",easeOutCirc:"cubic-bezier(0.075, 0.820, 0.165, 1.000)",easeOutBack:"cubic-bezier(0.175, 0.885, 0.320, 1.275)",easeInCubic:"cubic-bezier(0.550, 0.055, 0.675, 0.190)",easeInQuad:"cubic-bezier(0.550, 0.085, 0.680, 0.530)",easeInQuart:"cubic-bezier(0.895, 0.030, 0.685, 0.220)",easeInQuint:"cubic-bezier(0.755, 0.050, 0.855, 0.060)",easeInSine:"cubic-bezier(0.470, 0.000, 0.745, 0.715)",easeInCirc:"cubic-bezier(0.600, 0.040, 0.980, 0.335)",easeInBack:"cubic-bezier(0.600, -0.280, 0.735, 0.045)",easeInOutCubic:"cubic-bezier(0.645, 0.045, 0.355, 1.000)",easeInOutQuad:"cubic-bezier(0.455, 0.030, 0.515, 0.955)",easeInOutQuart:"cubic-bezier(0.770, 0.000, 0.175, 1.000)",easeInOutQuint:"cubic-bezier(0.860, 0.000, 0.070, 1.000)",easeInOutSine:"cubic-bezier(0.445, 0.050, 0.550, 0.950)",easeInOutExpo:"cubic-bezier(1.000, 0.000, 0.000, 1.000)",easeInOutCirc:"cubic-bezier(0.785, 0.135, 0.150, 0.860)",easeInOutBack:"cubic-bezier(0.680, -0.550, 0.265, 1.550)",easeInOut:"cubic-bezier(0.420, 0.000, 0.580, 1.000)",linear:"linear"};var n=[];Render.start(function(e){for(var i=n.length-1;i>=0;i--){var r=n[i];r.update?r.update(e):t.removeMathTween(r)}}),this.addMathTween=function(e){n.push(e)},this.removeMathTween=function(e){n.remove(e)}}return _createClass(e,[{key:"tween",value:function(e,t,n,i,r,s,a){"number"!=typeof r&&(a=s,s=r,r=0);var o=null;"undefined"!=typeof Promise&&(o=Promise.create(),s&&o.then(s),s=o.resolve);var u=new MathTween(e,t,n,i,r,a,s);return o||u}},{key:"clearTween",value:function(e){if(e.mathTween&&e.mathTween.stop(),e.mathTweens){for(var t=e.mathTweens,n=0;n<t.length;n++){var i=t[n];i&&i.stop()}e.mathTweens=null}}},{key:"parseTransform",value:function(e){var t="";if(void 0!==e.x||void 0!==e.y||void 0!==e.z){var n="";n+=(e.x||0)+"px, ",n+=(e.y||0)+"px, ",t+="translate3d("+(n+=(e.z||0)+"px")+")"}return void 0!==e.scale?t+="scale("+e.scale+")":(void 0!==e.scaleX&&(t+="scaleX("+e.scaleX+")"),void 0!==e.scaleY&&(t+="scaleY("+e.scaleY+")")),void 0!==e.rotation&&(t+="rotate("+e.rotation+"deg)"),void 0!==e.rotationX&&(t+="rotateX("+e.rotationX+"deg)"),void 0!==e.rotationY&&(t+="rotateY("+e.rotationY+"deg)"),void 0!==e.rotationZ&&(t+="rotateZ("+e.rotationZ+"deg)"),void 0!==e.skewX&&(t+="skewX("+e.skewX+"deg)"),void 0!==e.skewY&&(t+="skewY("+e.skewY+"deg)"),void 0!==e.perspective&&(t+="perspective("+e.perspective+"px)"),t}},{key:"isTransform",value:function(e){return~this.TRANSFORMS.indexOf(e)}},{key:"getAllTransforms",value:function(e){for(var t={},n=this.TRANSFORMS.length-1;n>-1;n--){var i=this.TRANSFORMS[n],r=e[i];0!==r&&"number"==typeof r&&(t[i]=r)}return t}},{key:"getEase",value:function(e){return this.CSS_EASES[e]||this.CSS_EASES.easeOutCubic}}]),e}()),CSSTransition=function e(t,n,i,r,s,a){function o(){return!c||c.kill||!t||!t.element}function u(){o()||(c.kill=!0,t.element.style[Device.vendor("Transition")]="",t.cssTween=null,t.willChange(null),t=n=null,Utils.nullObject(c))}_classCallCheck(this,e);var c=this,l=void 0,h=void 0;!function(){var e=TweenManager.getAllTransforms(t),i=[];for(var r in n)TweenManager.isTransform(r)?(e.use=!0,e[r]=n[r],delete n[r]):("number"==typeof n[r]||~r.indexOf("-"))&&i.push(r);e.use&&(i.push(Device.transformProperty),delete e.use),l=e,h=i}(),function(){if(!o()){t.cssTween&&(t.cssTween.kill=!0),t.cssTween=c;var e=function(e,t,n){for(var i="",r="",s=0;s<h.length;s++){var a=h[s];i+=(i.length?", ":"")+a,r+=(r.length?", ":"")+a+" "+e+"ms "+TweenManager.getEase(t)+" "+n+"ms"}return{props:i,transition:r}}(i,r,s);t.willChange(e.props),setTimeout(function(){o()||(t.element.style[Device.vendor("Transition")]=e.transition,t.css(n),t.transform(l),setTimeout(function(){o()||(u(),a&&a())},i+s))},50)}}(),this.stop=u},Interface=function(){function e(t){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"div",i=arguments[2];if(_classCallCheck(this,e),this.events=new Events,this.classes=[],this.timers=[],this.loops=[],void 0!==t){if("string"==typeof t){if(this.name=t,this.type=n,"svg"===this.type){var r=i||"svg";i=!0,this.element=document.createElementNS("http://www.w3.org/2000/svg",r),this.element.setAttributeNS("http://www.w3.org/2000/xmlns/","xmlns:xlink","http://www.w3.org/1999/xlink")}else this.element=document.createElement(this.type),"."!==t[0]?this.element.id=t:this.element.className=t.substr(1);this.element.style.position="absolute",i||(window.Alien&&window.Alien.Stage?window.Alien.Stage:document.body).appendChild(this.element)}else this.element=t;this.element.object=this}}return _createClass(e,[{key:"initClass",value:function(e){for(var t=arguments.length,n=Array(t>1?t-1:0),i=1;i<t;i++)n[i-1]=arguments[i];var r=new(Function.prototype.bind.apply(e,[null].concat(n)));return this.add(r),r}},{key:"add",value:function(e){var t=this.element;return e.element?(t.appendChild(e.element),this.classes.push(e),e.parent=this):e.nodeName&&t.appendChild(e),this}},{key:"delayedCall",value:function(e){for(var t=arguments.length,n=Array(t>2?t-2:0),i=2;i<t;i++)n[i-2]=arguments[i];var r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,s=setTimeout(function(){e&&e.apply(void 0,n)},r);return this.timers.push(s),this.timers.length>50&&this.timers.shift(),s}},{key:"clearTimers",value:function(){for(var e=this.timers.length-1;e>=0;e--)clearTimeout(this.timers[e]);this.timers.length=0}},{key:"startRender",value:function(e,t){this.loops.push(e),Render.start(e,t)}},{key:"stopRender",value:function(e){this.loops.remove(e),Render.stop(e)}},{key:"clearRenders",value:function(){for(var e=this.loops.length-1;e>=0;e--)this.stopRender(this.loops[e]);this.loops.length=0}},{key:"destroy",value:function(){this.removed=!0;var e=this.parent;e&&!e.removed&&e.remove&&e.remove(this);for(var t=this.classes.length-1;t>=0;t--){var n=this.classes[t];n&&n.destroy&&n.destroy()}return this.classes.length=0,this.element.object=null,this.clearRenders(),this.clearTimers(),this.events.destroy(),Utils.nullObject(this)}},{key:"remove",value:function(e){e.element.parentNode.removeChild(e.element),this.classes.remove(e)}},{key:"create",value:function(t,n){var i=new e(t,n);return this.add(i),i}},{key:"clone",value:function(){return new e(this.element.cloneNode(!0))}},{key:"empty",value:function(){return this.element.innerHTML="",this}},{key:"text",value:function(e){return void 0===e?this.element.textContent:(this.element.textContent=e,this)}},{key:"html",value:function(e){return void 0===e?this.element.innerHTML:(this.element.innerHTML=e,this)}},{key:"hide",value:function(){return this.element.style.display="none",this}},{key:"show",value:function(){return this.element.style.display="",this}},{key:"visible",value:function(){return this.element.style.visibility="visible",this}},{key:"invisible",value:function(){return this.element.style.visibility="hidden",this}},{key:"setZ",value:function(e){return this.element.style.zIndex=e,this}},{key:"clearAlpha",value:function(){return this.element.style.opacity="",this}},{key:"size",value:function(e,t){return void 0!==e&&(void 0===t&&(t=e),"string"==typeof e?("string"!=typeof t&&(t+="px"),this.element.style.width=e,this.element.style.height=t):(this.element.style.width=e+"px",this.element.style.height=t+"px",this.element.style.backgroundSize=e+"px "+t+"px")),this.width=this.element.offsetWidth,this.height=this.element.offsetHeight,this}},{key:"mouseEnabled",value:function(e){return this.element.style.pointerEvents=e?"auto":"none",this}},{key:"fontStyle",value:function(e,t,n,i){return this.css({fontFamily:e,fontSize:t,color:n,fontStyle:i}),this}},{key:"bg",value:function(e,t,n,i){return e.includes(["data:","."])?this.element.style.backgroundImage="url("+e+")":this.element.style.backgroundColor=e,void 0!==t&&(t="number"==typeof t?t+"px":t,n="number"==typeof n?n+"px":n,this.element.style.backgroundPosition=t+" "+n),i&&(this.element.style.backgroundSize="",this.element.style.backgroundRepeat=i),"cover"!==t&&"contain"!==t||(this.element.style.backgroundSize=t,this.element.style.backgroundRepeat="no-repeat",this.element.style.backgroundPosition=void 0!==n?n+" "+i:"center"),this}},{key:"center",value:function(e,t,n){var i={};return void 0===e?(i.left="50%",i.top="50%",i.marginLeft=-this.width/2,i.marginTop=-this.height/2):(e&&(i.left="50%",i.marginLeft=-this.width/2),t&&(i.top="50%",i.marginTop=-this.height/2)),n&&(delete i.left,delete i.top),this.css(i),this}},{key:"mask",value:function(e){return this.element.style[Device.vendor("Mask")]=(~e.indexOf(".")?"url("+e+")":e)+" no-repeat",this.element.style[Device.vendor("MaskSize")]="contain",this}},{key:"blendMode",value:function(e,t){return this.element.style[t?"background-blend-mode":"mix-blend-mode"]=e,this}},{key:"css",value:function(e,t){if("object"!==(void 0===e?"undefined":_typeof(e))){if(t)return this.element.style[e]=t,this;var n=this.element.style[e];return"number"!=typeof n&&(~n.indexOf("px")&&(n=Number(n.slice(0,-2))),"opacity"===e&&(n=isNaN(Number(this.element.style.opacity))?1:Number(this.element.style.opacity))),n||(n=0),n}for(var i in e){var r=e[i];"string"!=typeof r&&"number"!=typeof r||("string"!=typeof r&&"opacity"!==i&&"zIndex"!==i&&(r+="px"),this.element.style[i]=r)}return this}},{key:"transform",value:function(e){if(e)for(var t in e)"number"==typeof e[t]&&(this[t]=e[t]);else e=this;return this.element.style[Device.vendor("Transform")]=TweenManager.parseTransform(e),this}},{key:"willChange",value:function(e){if("boolean"==typeof e)this.willChangeLock=e;else if(this.willChangeLock)return;var t="string"==typeof e;this.element.style["will-change"]=e?t?e:Device.transformProperty+", opacity":""}},{key:"backfaceVisibility",value:function(e){this.element.style[Device.vendor("BackfaceVisibility")]=e?"visible":"hidden"}},{key:"enable3D",value:function(e,t,n){return this.element.style[Device.vendor("TransformStyle")]="preserve-3d",e&&(this.element.style[Device.vendor("Perspective")]=e+"px"),void 0!==t&&(t="number"==typeof t?t+"px":t,n="number"==typeof n?n+"px":n,this.element.style[Device.vendor("PerspectiveOrigin")]=t+" "+n),this}},{key:"disable3D",value:function(){return this.element.style[Device.vendor("TransformStyle")]="",this.element.style[Device.vendor("Perspective")]="",this}},{key:"transformPoint",value:function(e,t,n){var i="";return void 0!==e&&(i+="number"==typeof e?e+"px ":e+" "),void 0!==t&&(i+="number"==typeof t?t+"px ":t+" "),void 0!==n&&(i+="number"==typeof n?n+"px":n),this.element.style[Device.vendor("TransformOrigin")]=i,this}},{key:"tween",value:function(e,t,n,i,r){"number"!=typeof i&&(r=i,i=0);var s=null;"undefined"!=typeof Promise&&(s=Promise.create(),r&&s.then(r),r=s.resolve);var a=new CSSTransition(this,e,t,n,i,r);return s||a}},{key:"clearTransform",value:function(){return"number"==typeof this.x&&(this.x=0),"number"==typeof this.y&&(this.y=0),"number"==typeof this.z&&(this.z=0),"number"==typeof this.scale&&(this.scale=1),"number"==typeof this.scaleX&&(this.scaleX=1),"number"==typeof this.scaleY&&(this.scaleY=1),"number"==typeof this.rotation&&(this.rotation=0),"number"==typeof this.rotationX&&(this.rotationX=0),"number"==typeof this.rotationY&&(this.rotationY=0),"number"==typeof this.rotationZ&&(this.rotationZ=0),"number"==typeof this.skewX&&(this.skewX=0),"number"==typeof this.skewY&&(this.skewY=0),this.element.style[Device.transformProperty]="",this}},{key:"clearTween",value:function(){return this.cssTween&&this.cssTween.stop(),this.mathTween&&this.mathTween.stop(),this}},{key:"attr",value:function(e,t){return void 0===t?this.element.getAttribute(e):(""===t?this.element.removeAttribute(e):this.element.setAttribute(e,t),this)}},{key:"convertTouchEvent",value:function(e){var t={};return t.x=0,t.y=0,e?(e.touches||e.changedTouches?e.touches.length?(t.x=e.touches[0].pageX,t.y=e.touches[0].pageY):(t.x=e.changedTouches[0].pageX,t.y=e.changedTouches[0].pageY):(t.x=e.pageX,t.y=e.pageY),t):t}},{key:"click",value:function(e){var t=this,n=function(n){if(!t.element)return!1;n.object="hit"===t.element.className?t.parent:t,n.action="click",e&&e(n)};return this.element.addEventListener("click",n,!0),this.element.style.cursor="pointer",this}},{key:"hover",value:function(e){var t=this,n=function(n){if(!t.element)return!1;n.object="hit"===t.element.className?t.parent:t,n.action="mouseout"===n.type?"out":"over",e&&e(n)};return this.element.addEventListener("mouseover",n,!0),this.element.addEventListener("mouseout",n,!0),this}},{key:"press",value:function(e){var t=this,n=function(n){if(!t.element)return!1;n.object="hit"===t.element.className?t.parent:t,n.action="mousedown"===n.type?"down":"up",e&&e(n)};return this.element.addEventListener("mousedown",n,!0),this.element.addEventListener("mouseup",n,!0),this}},{key:"bind",value:function(e,t){var n=this;"touchstart"!==e||Device.mobile?"touchmove"!==e||Device.mobile?"touchend"!==e||Device.mobile||(e="mouseup"):e="mousemove":e="mousedown",this.events["bind_"+e]||(this.events["bind_"+e]=[]);var i=this.events["bind_"+e];i.push({target:this.element,callback:t});var r=function(e){var t=n.convertTouchEvent(e);e instanceof MouseEvent||(e.x=t.x,e.y=t.y),i.forEach(function(t){t.target===e.currentTarget&&t.callback(e)})};return this.events["fn_"+e]||(this.events["fn_"+e]=r,this.element.addEventListener(e,r,!0)),this}},{key:"unbind",value:function(e,t){"touchstart"!==e||Device.mobile?"touchmove"!==e||Device.mobile?"touchend"!==e||Device.mobile||(e="mouseup"):e="mousemove":e="mousedown";var n=this.events["bind_"+e];return n?(n.forEach(function(e,i){e.callback===t&&n.splice(i,1)}),this.events["fn_"+e]&&!n.length&&(this.element.removeEventListener(e,this.events["fn_"+e],!0),this.events["fn_"+e]=null),this):this}},{key:"interact",value:function(e,t){return this.hit=this.create(".hit"),this.hit.css({position:"absolute",left:0,top:0,width:"100%",height:"100%",zIndex:99999}),Device.mobile?this.hit.touchClick(e,t):this.hit.hover(e).click(t),this}},{key:"touchClick",value:function(e,t){var n=this,i={},r=void 0,s=void 0,a=void 0,o=function(e){var t=n.convertTouchEvent(e);e.touchX=t.x,e.touchY=t.y,i.x=e.touchX,i.y=e.touchY};return this.element.addEventListener("touchmove",function(e){if(!n.element)return!1;a=n.convertTouchEvent(e),s=function(e,t){var n=t.x-e.x,i=t.y-e.y;return Math.sqrt(n*n+i*i)}(i,a)>5},{passive:!0}),this.element.addEventListener("touchstart",function(t){if(!n.element)return!1;r=performance.now(),t.object="hit"===n.element.className?n.parent:n,t.action="over",o(t),e&&!s&&e(t)},{passive:!0}),this.element.addEventListener("touchend",function(i){if(!n.element)return!1;var a=performance.now();i.object="hit"===n.element.className?n.parent:n,o(i),r&&a-r<750&&t&&!s&&(i.action="click",t(i)),e&&(i.action="out",e(i)),s=!1},{passive:!0}),this}},{key:"split",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"",t={position:"relative",display:"block",width:"auto",height:"auto",margin:0,padding:0,cssFloat:"left"},n=[],i=this.text().split(e);this.empty()," "===e&&(e="&nbsp;");for(var r=0;r<i.length;r++)" "===i[r]&&(i[r]="&nbsp;"),n.push(this.create(".t","span").html(i[r]).css(t)),""!==e&&r<i.length-1&&n.push(this.create(".t","span").html(e).css(t));return n}}]),e}(),Stage=new(function(e){function t(){function e(){i.size(),i.orientation=window.innerWidth>window.innerHeight?"landscape":"portrait"}_classCallCheck(this,t);var n=_possibleConstructorReturn(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,"Stage")),i=n,r=void 0;return i.css({overflow:"hidden"}),window.addEventListener("focus",function(){"focus"!==r&&(r="focus",i.events.fire(Events.VISIBILITY,{type:"focus"}))},!0),window.addEventListener("blur",function(){"blur"!==r&&(r="blur",i.events.fire(Events.VISIBILITY,{type:"blur"}))},!0),window.addEventListener("keydown",function(){return i.events.fire(Events.KEYBOARD_DOWN)},!0),window.addEventListener("keyup",function(){return i.events.fire(Events.KEYBOARD_UP)},!0),window.addEventListener("keypress",function(){return i.events.fire(Events.KEYBOARD_PRESS)},!0),window.addEventListener("resize",function(){return i.events.fire(Events.RESIZE)},!0),i.events.add(Events.RESIZE,e),e(),n}return _inherits(t,Interface),t}()),Canvas=function(){function e(t){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:t,i=arguments[2];_classCallCheck(this,e),this.element=document.createElement("canvas"),this.context=this.element.getContext("2d"),this.object=new Interface(this.element),this.children=[],this.retina=i,this.size(t,n,i)}return _createClass(e,[{key:"size",value:function(e,t,n){var i=n?2:1;this.element.width=e*i,this.element.height=t*i,this.width=e,this.height=t,this.scale=i,this.object.size(this.width,this.height),this.context.scale(i,i),this.element.style.width=e+"px",this.element.style.height=t+"px"}},{key:"toDataURL",value:function(e,t){return this.element.toDataURL(e,t)}},{key:"render",value:function(e){"boolean"==typeof e&&e||this.clear();for(var t=0;t<this.children.length;t++)this.children[t].render()}},{key:"clear",value:function(){this.context.clearRect(0,0,this.element.width,this.element.height)}},{key:"add",value:function(e){e.setCanvas(this),e.parent=this,this.children.push(e),e.z=this.children.length}},{key:"remove",value:function(e){e.canvas=null,e.parent=null,this.children.remove(e)}},{key:"destroy",value:function(){for(var e=0;e<this.children.length;e++)this.children[e].destroy();return this.object.destroy(),Utils.nullObject(this)}},{key:"getImageData",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0,t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:this.element.width,i=arguments.length>3&&void 0!==arguments[3]?arguments[3]:this.element.height;return this.imageData=this.context.getImageData(e,t,n,i),this.imageData}},{key:"getPixel",value:function(e,t,n){this.imageData&&!n||this.getImageData();var i={},r=4*(e+t*this.element.width),s=this.imageData.data;return i.r=s[r],i.g=s[r+1],i.b=s[r+2],i.a=s[r+3],i}},{key:"putImageData",value:function(e){this.context.putImageData(e,0,0)}}]),e}(),Images=new(function(){function e(){_classCallCheck(this,e),this.CORS=null}return _createClass(e,[{key:"createImg",value:function(e,t){var n=new Image;return n.crossOrigin=this.CORS,n.src=e,n.onload=t,n.onerror=t,n}},{key:"promise",value:function(e){"string"==typeof e&&(e=this.createImg(e));var t=Promise.create();return e.onload=t.resolve,e.onerror=t.resolve,t}}]),e}()),AssetLoader=function(){function e(t,n){function i(){r.events.fire(Events.PROGRESS,{percent:++a/s}),a===s&&(r.events.fire(Events.COMPLETE),n&&n())}_classCallCheck(this,e),Array.isArray(t)&&(t=t.map(function(e){return Utils.basename(e)}).reduce(function(e,n,i){return e[n]=t[i],e},{}));var r=this;this.events=new Events,this.CDN=Config.CDN||"";var s=Object.keys(t).length,a=0;for(var o in t)!function(e,t){var n=Utils.extension(t);if(!n.includes(["jpg","jpeg","png","gif","svg"]))return n.includes(["mp3","m4a","ogg","wav","aif"])?window.AudioContext&&window.WebAudio?void window.WebAudio.createSound(e,t,i):i():void window.get(t).then(function(e){"js"===n?window.eval(e.replace("use strict","")):n.includes(["fs","vs","glsl"])&&window.Shaders&&window.Shaders.parse(e,t),i()}).catch(function(){i()});Images.createImg(t,i)}(o,this.CDN+t[o])}return _createClass(e,null,[{key:"loadAssets",value:function(t,n){var i=Promise.create();return n||(n=i.resolve),i.loader=new e(t,n),i}}]),e}();window.AudioContext||(window.AudioContext=window.webkitAudioContext||window.mozAudioContext||window.oAudioContext),Config.UI_COLOR="white",Config.ASSETS=["assets/images/alienkitty.svg","assets/images/alienkitty_eyelid.svg"];var AlienKitty=function(e){function t(){function e(){a.loaded=!0,o.bg("assets/images/alienkitty.svg"),u.bg("assets/images/alienkitty_eyelid.svg"),c.bg("assets/images/alienkitty_eyelid.svg")}function n(){a.delayedCall(Utils.headsTails(i,r),Utils.random(0,1e4))}function i(){u.tween({scaleY:1.5},120,"easeOutCubic",function(){u.tween({scaleY:.01},180,"easeOutCubic")}),c.tween({scaleX:1.3,scaleY:1.3},120,"easeOutCubic",function(){c.tween({scaleX:1,scaleY:.01},180,"easeOutCubic",function(){n()})})}function r(){u.tween({scaleY:1.5},120,"easeOutCubic",function(){u.tween({scaleY:.01},180,"easeOutCubic")}),c.tween({scaleX:1.3,scaleY:1.3},180,"easeOutCubic",function(){c.tween({scaleX:1,scaleY:.01},240,"easeOutCubic",function(){n()})})}_classCallCheck(this,t);var s=_possibleConstructorReturn(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,"AlienKitty")),a=s,o=void 0,u=void 0,c=void 0;return a.size(90,86).center().css({opacity:0}),o=a.create(".alienkitty").size(90,86),u=o.create(".eyelid1").size(24,14).css({left:35,top:25}).transformPoint("50%",0).transform({scaleX:1.5,scaleY:.01}),c=o.create(".eyelid2").size(24,14).css({left:53,top:26}).transformPoint(0,0).transform({scaleX:1,scaleY:.01}),Stage.events.add(Events.COMPLETE,e),s.animateIn=function(){n(),s.tween({opacity:1},500,"easeOutQuart")},s.animateOut=function(e){s.tween({opacity:0},500,"easeInOutQuad",e)},s}return _inherits(t,Interface),t}(),Progress=function(e){function t(){function e(){i.progress>=1&&!i.complete&&(i.complete=!0,i.events.fire(Events.COMPLETE),i.stopRender(e)),a.clearRect(0,0,r,r);var t=i.progress||0,n=r/2,s=r/2,o=.4*r,u=Math.radians(-90),c=Math.radians(-90)+Math.radians(360*t);a.beginPath(),a.arc(n,s,o,u,c,!1),a.strokeStyle=Config.UI_COLOR,a.stroke()}_classCallCheck(this,t);var n=_possibleConstructorReturn(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,"Progress")),i=n,r=90,s=void 0,a=void 0;return i.size(r,r).center(),i.progress=0,s=i.initClass(Canvas,r,r,!0),(a=s.context).lineWidth=5,n.startRender(e),n.update=function(e){n.complete||TweenManager.tween(n,{progress:e.percent},500,"easeOutCubic")},n.animateOut=function(e){n.tween({scale:.9,opacity:0},400,"easeInCubic",e)},n}return _inherits(t,Interface),t}(),Loader=function(e){function t(){function e(e){s.update(e)}function n(){r.loaded=!0,r.events.fire(Events.COMPLETE)}_classCallCheck(this,t);var i=_possibleConstructorReturn(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,"Loader")),r=i,s=void 0;return r.size("100%"),new AssetLoader(Config.ASSETS).events.add(Events.PROGRESS,e),(s=r.initClass(Progress)).events.add(Events.COMPLETE,n),i.animateOut=function(e){s.animateOut(e)},i}return _inherits(t,Interface),t}(),Main=function e(){function t(){i.loaded=!0,r.animateOut(function(){r=r.destroy(),Stage.events.fire(Events.COMPLETE)})}function n(){s.tween({z:0},7e3,"easeOutCubic"),a.animateIn()}_classCallCheck(this,e);var i=this,r=void 0,s=void 0,a=void 0;Stage.size("100%").enable3D(2e3),(s=Stage.create(".wrapper")).size("100%").transform({z:-300}).enable3D(),a=s.initClass(AlienKitty),(r=Stage.initClass(Loader)).events.add(Events.COMPLETE,t),Stage.events.add(Events.COMPLETE,n)};new Main;
