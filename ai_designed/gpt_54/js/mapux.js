function initLightbox() {
    var overlay = document.createElement('div');
    overlay.className = 'map-lightbox';
    overlay.innerHTML = '<img>';
    document.body.appendChild(overlay);
    var img = overlay.querySelector('img');

    function close() {
        overlay.classList.remove('active');
        setTimeout(function() { overlay.style.display = 'none'; }, 300);
    }

    overlay.addEventListener('click', close);
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') close();
    });

    return function(src) {
        img.src = src;
        overlay.style.display = 'flex';
        requestAnimationFrame(function() { overlay.classList.add('active'); });
    };
}

function createStopNav(map, popupCallbacks) {
    var stops = [];
    var idx = -1;
    var control = null;
    var counterEl, nameEl, prevBtn, nextBtn;

    var NavControl = L.Control.extend({
        options: { position: 'bottomleft' },
        onAdd: function() {
            var c = L.DomUtil.create('div', 'stop-nav');
            L.DomEvent.disableClickPropagation(c);
            L.DomEvent.disableScrollPropagation(c);

            prevBtn = L.DomUtil.create('button', 'stop-nav-btn', c);
            prevBtn.innerHTML = '&#x2190;';

            var info = L.DomUtil.create('div', 'stop-nav-info', c);
            nameEl = L.DomUtil.create('div', 'stop-nav-name', info);
            counterEl = L.DomUtil.create('div', 'stop-nav-counter', info);

            nextBtn = L.DomUtil.create('button', 'stop-nav-btn', c);
            nextBtn.innerHTML = '&#x2192;';

            L.DomEvent.on(prevBtn, 'click', function() { go(-1); });
            L.DomEvent.on(nextBtn, 'click', function() { go(1); });

            return c;
        }
    });

    function go(dir) {
        popupCallbacks.hide();
        var next = idx + dir;
        if (next < 0 || next >= stops.length) return;
        idx = next;
        var s = stops[idx];
        prevBtn.disabled = true;
        nextBtn.disabled = true;
        map.flyTo(s.location.latLng, map.getZoom(), { duration: 0.4, easeLinearity: 0.3 });
        map.once('moveend', function() {
            popupCallbacks.show(s.marker);
            render();
        });
        render();
    }

    function render() {
        if (!counterEl) return;
        counterEl.textContent = idx >= 0 ? (idx + 1) + ' / ' + stops.length : '\u2014 / ' + stops.length;
        nameEl.textContent = idx >= 0 ? stops[idx].location.name : 'Navigate stops';
        prevBtn.disabled = idx <= 0;
        nextBtn.disabled = idx >= stops.length - 1;
    }

    return {
        show: function(markedStops) {
            stops = markedStops;
            idx = -1;
            if (!control) control = new NavControl();
            control.addTo(map);
            render();
        },
        hide: function() {
            if (control) control.remove();
            stops = [];
            idx = -1;
        }
    };
}

window.initLightbox = initLightbox;
window.createStopNav = createStopNav;
