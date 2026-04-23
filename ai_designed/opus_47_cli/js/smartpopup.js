var GAP = 14;
var PAD = 12;
var CARET_PAD = 16;
var CARET_HALF = 5;

export function createSmartPopup(map) {
    var container = map.getContainer();

    var el = document.createElement('div');
    el.className = 'smart-popup';
    el.innerHTML = '<div class="smart-popup-caret"></div><div class="smart-popup-body"></div>';
    el.style.display = 'none';
    container.appendChild(el);

    var body = el.querySelector('.smart-popup-body');
    var caret = el.querySelector('.smart-popup-caret');
    var activeMarker = null;
    var activeHasImage = false;

    function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

    function reposition() {
        if (!activeMarker) return;
        var mapW = container.clientWidth;
        var mapH = container.clientHeight;
        var pt = map.latLngToContainerPoint(activeMarker.getLatLng());
        var pw = el.offsetWidth;
        var ph = el.offsetHeight;

        var spR = mapW - pt.x - PAD;
        var spL = pt.x - PAD;
        var spT = pt.y - PAD;
        var spB = mapH - pt.y - PAD;

        var hBonus = activeHasImage ? 200 : 0;
        var candidates = [
            { dir: 'right', fits: spR >= pw + GAP, space: spR },
            { dir: 'left',  fits: spL >= pw + GAP, space: spL },
            { dir: 'top',   fits: spT >= ph + GAP, space: spT },
            { dir: 'bottom',fits: spB >= ph + GAP, space: spB },
        ];
        candidates.forEach(function(c) {
            c.score = (c.fits ? 1000 : 0) + c.space;
            if (c.dir === 'left' || c.dir === 'right') c.score += hBonus;
        });
        candidates.sort(function(a, b) { return b.score - a.score; });
        var dir = candidates[0].dir;

        el.setAttribute('data-dir', dir);
        caret.style.top = '';
        caret.style.left = '';

        var left, top;
        if (dir === 'right') {
            left = pt.x + GAP;
            top = clamp(pt.y - ph / 2, PAD, mapH - ph - PAD);
            caret.style.top = clamp(pt.y - top - CARET_HALF, CARET_PAD, ph - CARET_PAD) + 'px';
        } else if (dir === 'left') {
            left = pt.x - GAP - pw;
            top = clamp(pt.y - ph / 2, PAD, mapH - ph - PAD);
            caret.style.top = clamp(pt.y - top - CARET_HALF, CARET_PAD, ph - CARET_PAD) + 'px';
        } else if (dir === 'top') {
            left = clamp(pt.x - pw / 2, PAD, mapW - pw - PAD);
            top = pt.y - GAP - ph;
            caret.style.left = clamp(pt.x - left - CARET_HALF, CARET_PAD, pw - CARET_PAD) + 'px';
        } else {
            left = clamp(pt.x - pw / 2, PAD, mapW - pw - PAD);
            top = pt.y + GAP;
            caret.style.left = clamp(pt.x - left - CARET_HALF, CARET_PAD, pw - CARET_PAD) + 'px';
        }

        el.style.left = left + 'px';
        el.style.top = top + 'px';
    }

    function show(marker, html, withImage) {
        activeMarker = marker;
        activeHasImage = !!withImage;
        body.innerHTML = html;
        el.style.display = 'block';
        el.style.opacity = '0';
        requestAnimationFrame(function() {
            reposition();
            el.style.opacity = '1';
        });
    }

    function hide() {
        activeMarker = null;
        el.style.display = 'none';
        el.style.opacity = '0';
    }

    map.on('move zoom', reposition);

    body.addEventListener('load', function(e) {
        if (e.target.tagName === 'IMG' && activeMarker) reposition();
    }, true);

    return {
        show: show,
        hide: hide,
        reposition: reposition,
        getElement: function() { return el; },
        getActiveMarker: function() { return activeMarker; }
    };
}
