// ==UserScript==
// @name     txt2bookpage
// @version  1
// @include    file://*.txt#*
// @include    file://*.txt
// @grant    none
// @run-at	 document-end
// ==/UserScript==

(function () {
    console.log('load txt book');
    var style = "html{background-color:#DCCB9C;}body{background-color: #EDE8D5;margin:0px 250px;padding: 0 30px;color: #666;} a{color:#666;}"
        + ".pb{font-weight: bold;} .active{background-color:#EFD161;}.active a{color: #D35452;}"
        + "ul{padding-left: 10px;height: 90%;overflow-y: auto;display: inline-block;position:fixed;width:250px;"
        + "top:5px;left: 0px;list-style: none;} ul li{padding:3px;width: 130px;}"
        + "ul div span {display: inline-block;width:20px;height:20px;border:1px solid #ccc;margin-right: 5px;}"
        + "p {text-indent: 40px;font-size: 20px;line-height: 38px;letter-spacing: 2px;}"
    var se = document.createElement('style');
    se.textContent = style;
    unsafeWindow.document.head.appendChild(se);

    var c = unsafeWindow.document.getElementsByTagName('pre')[0];

    var html = c.textContent.replace(/\n/g, '</p><p>');

    c.innerHTML = '<p>' + html + '</p>';

    var result = true, p = null, c = '', i = cn = 1, clist = '', top = 0,
        clist = '<div id="bgcolor"><span style="background-color:#f6f4ec;" data-pbg="#EBE5D8">'
            + '</span><span style="background-color:#F6ECCB;" data-pbg="#DCCB9C"></span>'
            + '<span style="background-color:#E5F1E5;" data-pbg="#CFE1CF"></span>'
            + '<span style="background-color:#161819;" data-pbg="#0E0F11"></span>'
            + '<span style="background-color:#DEDEDE;" data-pbg="#CFCFCF"></span></div>';
    while (result) {
        result = document.evaluate('/html/body/pre/p[' + i + ']', document.body, null, XPathResult.FIRST_ORDERED_NODE_TYPE);
        if (result === null) {
            break;
        }
        p = result.singleNodeValue;
        if (p === null) {
            break;
        }
        c = p.textContent.replace(/^\s*/, '');
        p.textContent = c;
        res = c.match(/^\s*第[一二三四五六七八九十0-9]+[章节回][\s\n]*/);
        p.setAttribute('id', 'c-p-' + i);

        if (res) {
            p.setAttribute('class', 'pb');
            top = p.offsetTop;
            clist += '<li data-top="' + top + '"><a href="#p-' + i + '">' + c + '</a></li>';
            cn++;
        }
        i++;
    }
    var ul = document.createElement('ul');
    ul.innerHTML = clist;
    unsafeWindow.document.body.appendChild(ul);
    var scriptText = function () {
        function hashCode(str) {
            var hash = 0, i, chr;
            if (str.length === 0) return hash;
            for (i = 0; i < str.length; i++) {
                chr = str.charCodeAt(i);
                hash = ((hash << 5) - hash) + chr;
                hash |= 0; // Convert to 32bit integer
            }
            return hash;
        };
        var fileHash = hashCode(window.location.pathname);
        document.getElementById('bgcolor').addEventListener('click', function (e) {
            var ele = e.target;
            if (ele.tagName == 'SPAN') {
                document.body.style.backgroundColor = ele.style.backgroundColor;
                document.getElementsByTagName('html')[0].style.backgroundColor = ele.getAttribute('data-pbg');
            }
        });;
        window.__gmk_nowActive = null;
        window.__gmk_nowParagraph = 1; window.__gmk_preTop = 1;
        window.__gmk_resizeStatus = false;
        function __gmk_getActive() {
            if(window.__gmk_resizeStatus) {
                window.__gmk_resizeStatus = false;
                return;
            }
            var top = window.scrollY;
            var lis = document.getElementsByTagName('li');
            var ison = 0;
            for (var k = 0; k < lis.length; k++) {
                if (top >= lis[k].getAttribute('data-top')) {
                    ison = k;
                } else if (top < lis[k].getAttribute('data-top')) {
                    break;
                }
            }
            if (window.__gmk_nowActive) {
                window.__gmk_nowActive.className = '';
            }
            lis[ison].className = 'active';
            window.__gmk_nowActive = lis[ison];
            var pnum = window.__gmk_nowParagraph;
            var result = p = null, ptop = 0;
            while (true) {
                result = document.evaluate('/html/body/pre/p[' + pnum + ']', document.body, null, XPathResult.FIRST_ORDERED_NODE_TYPE);
                if (result === null) {
                    break;
                }
                p = result.singleNodeValue;
                if (p === null) {
                    break;
                }
                ptop = p.offsetTop + p.parentNode.offsetTop;
                if (window.__gmk_preTop > top) {
                    if (ptop >= top) { window.__gmk_nowParagraph = pnum; } else if ((ptop + p.offsetHeight) < top) { break; }
                    pnum--;
                } else {
                    if ((ptop + p.offsetHeight) <= top) { window.__gmk_nowParagraph = pnum; } else if (ptop > top) { break; }
                    pnum++;
                }
            }
            if (p) {
                var pageIndex = p.id.substr(2);
                window.location.hash = pageIndex;
                window.localStorage.setItem(fileHash, pageIndex);
            }
            window.__gmk_preTop = top;
        }
        window.document.body.onscroll = __gmk_getActive;
        var pageIndex = window.localStorage.getItem(fileHash);
        if (pageIndex) {
            window.location.hash = '#c-' + pageIndex;
        }
        if (window.scrollY > 0) {
            if (window.location.hash) { window.location.hash = '#c-' + window.location.hash.split('#')[1]; }
            __gmk_getActive();
        }
        document.getElementsByTagName('ul')[0].addEventListener('click', function (e) {
            var ele = e.target;
            if (ele.tagName == 'LI') {
                ele = ele.getElementsByTagName('a')[0];
            }
            if (ele.tagName == 'A') {
                window.location.hash = '#c-' + ele.href.split('#')[1];
            }
        });
        window.onresize = function() {
            window.__gmk_resizeStatus = true;
            var lis = document.getElementsByTagName('ul')[0].getElementsByTagName('li');
            var hash = window.location.href.split('#')[1];
            var i = pos = 0;
            for(i=0; i<lis.length;i++) {
                if(lis[i].nodeType == 1) {
                    pos = lis[i].getElementsByTagName('a')[0].href.split('#')[1];
                    lis[i].setAttribute('data-top',document.getElementById('c-'+pos).offsetTop);
                }
            }
            window.scrollTo(0,document.getElementById('c-'+hash).offsetTop);
        };
    };
    var script = document.createElement('script');
    script.type = "text/javascript";
    script.innerHTML = '(' + scriptText.toString() + ')();';
    unsafeWindow.document.body.appendChild(script);
})();