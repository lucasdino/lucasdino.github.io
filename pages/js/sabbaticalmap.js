// Instantiating our map
var map = L.map('travel_map', {
    center: [13, 0],
    zoom: 2,
    worldCopyJump: true,
    maxBounds: [[-90, -150], [90, 180]],
    maxBoundsViscosity: 10
});
L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://stadiamaps.com/" target="_blank">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>',
}).addTo(map);


// Marker icons
function createMarkerIcon(className, svgMarkup, visualSize) {
    return L.divIcon({
        className: 'map-marker-hitbox ' + className,
        html: svgMarkup,
        iconSize: [visualSize, visualSize],
        iconAnchor: [visualSize / 2, visualSize / 2]
    });
}

var highlighted_marker = createMarkerIcon(
    'dark-donut-icon',
    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><circle cx="12" cy="12" r="7" fill="none" stroke="#D00909" stroke-width="6" /></svg>',
    24
);
var par_marker = createMarkerIcon(
    'donut-icon',
    '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18"><circle cx="9" cy="9" r="6" fill="none" stroke="#EF9A9A" stroke-width="5" /></svg>',
    18
);
var sub_marker = createMarkerIcon(
    'muted-icon',
    '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12"><circle cx="6" cy="6" r="3.75" fill="#EF9A9A" stroke="none" /></svg>',
    12
);


// Importing our map locations and setting vars
import { mapLocations } from './maplocations.js';
import { initLightbox, createStopNav } from './mapux.js';
import { createSmartPopup } from './smartpopup.js';
var singaporeLocation = [1.3595, 103.9895]
var sfLocation = [37.75, 237.55]
var initialMapView = { center: map.getCenter(), zoom: map.getZoom() };
var parentMarkers = L.layerGroup();
var subMarkers = L.layerGroup();
var revealGeneration = 0;
var openLightbox = initLightbox();
var smartPopup = createSmartPopup(map);

// Shared popup hover/close state
var popupCloseDelay = 220;
var closeTimerId = null;
var hoveredMarker = null;
var hoveredDefaultIcon = null;

function clearCloseTimer() {
    if (closeTimerId) { clearTimeout(closeTimerId); closeTimerId = null; }
}

function hidePopup() {
    clearCloseTimer();
    if (hoveredMarker && hoveredDefaultIcon) hoveredMarker.setIcon(hoveredDefaultIcon);
    hoveredMarker = null;
    hoveredDefaultIcon = null;
    smartPopup.hide();
}

function scheduleClose() {
    clearCloseTimer();
    closeTimerId = setTimeout(hidePopup, popupCloseDelay);
}

function showPopup(marker, defaultIcon, hoverIcon) {
    clearCloseTimer();
    if (hoveredMarker && hoveredMarker !== marker && hoveredDefaultIcon) {
        hoveredMarker.setIcon(hoveredDefaultIcon);
    }
    if (hoverIcon) marker.setIcon(hoverIcon);
    hoveredMarker = marker;
    hoveredDefaultIcon = defaultIcon;
    smartPopup.show(marker, marker._popupHtml, marker._hasImage);
}

smartPopup.getElement().addEventListener('mouseenter', clearCloseTimer);
smartPopup.getElement().addEventListener('mouseleave', scheduleClose);

function addHoverPopupBehavior(marker, defaultIcon, hoverIcon) {
    marker.on('mouseover', function() {
        showPopup(this, defaultIcon, hoverIcon || null);
    }).on('mouseout', function() {
        scheduleClose();
    });
}

var stopNav = createStopNav(map, {
    show: function(marker) { showPopup(marker, sub_marker, null); },
    hide: hidePopup
});

document.getElementById('travel_map').addEventListener('click', function(e) {
    if (e.target.classList.contains('lightbox-trigger')) {
        e.stopPropagation();
        openLightbox(e.target.src);
    }
});


// Code for our back button once you click in on a parent location
var backButton = L.control({ position: 'topright' });
backButton.onAdd = function () {
    var div = L.DomUtil.create('div', 'back-button');
    var button = L.DomUtil.create('button', 'back-to-map-btn', div);
    button.innerHTML = "&#x2190; Back";
    L.DomEvent.on(button, 'click', returnToMainMapView);
    return div;
};
function returnToMainMapView() {
    hidePopup();
    stopNav.hide();
    removeSubMarkers();
    hideBackButton();
    map.flyTo(initialMapView.center, initialMapView.zoom, { duration: 0.7, easeLinearity: 0.25 });
    map.once('moveend', addParentMarkers);
}

function showBackButton() { backButton.addTo(map); }
function hideBackButton() { backButton.remove(); }


// Code for our parent markers
function removeParentMarkers() { parentMarkers.clearLayers(); }
function addParentMarkers() {
    var latLngs = [];
    var edgePoints = calculateEdgePoints();
    mapLocations["MidwayLHS"].markerLocation = edgePoints.leftMostPoint;
    mapLocations["MidwayRHS"].markerLocation = edgePoints.rightMostPoint;
    mapLocations["Headin' Home"].locations[0].latLng = edgePoints.leftMostPoint;

    Object.entries(mapLocations).forEach(([category, details]) => {
        if (details.drawMarker) {
            var markerIcon = details.parent ? par_marker : sub_marker;
            var marker = L.marker(details.markerLocation, { icon: markerIcon });
            
            marker._popupHtml = `
                <div class="popup-content">
                    <h4 class="popup-title">${category}</h4>
                    <hr id="popup-hr">
                    <p class="popup-blurb">${details.parentBlurb}</p>
                    ${details.parentPhoto ? `<div class="popup-image-container"><img src="${details.parentPhoto}" class="popup-image lightbox-trigger" alt=""></div>` : ''}
                </div>
            `;
            marker._hasImage = !!details.parentPhoto;

            if (details.parent) {
                marker.on('click', function () {
                    hidePopup();
                    removeParentMarkers();
                    map.flyTo(details.center, details.zoomLevel, { duration: 0.7, easeLinearity: 0.3 });
                    map.once('moveend', function() {
                        addSubMarkers(details.locations);
                        showBackButton();
                    });
                });
                addHoverPopupBehavior(marker, markerIcon, highlighted_marker);
            } else {
                addHoverPopupBehavior(marker, markerIcon);
            }
            parentMarkers.addLayer(marker);
        }

        latLngs.push(details.markerLocation);
    });

    if (latLngs.length > 1) {
        var polyline = L.polyline(latLngs, { color: '#F8B6B6', opacity: 0.4, weight: 2, dashArray: '2, 4' }).addTo(map);
        parentMarkers.addLayer(polyline);
    }
    parentMarkers.addTo(map);
}


// Defining function to call our submarkers
function removeSubMarkers() {
    revealGeneration++;
    stopNav.hide();
    subMarkers.clearLayers();
}
function addSubMarkers(locations) {
    var gen = ++revealGeneration;
    var markedStops = [];
    var revealIdx = 0;
    var numMarked = locations.filter(function(l) { return l.mark; }).length;
    var totalDuration = Math.max(1500, (numMarked / 5) * 1000);
    var MARKER_DELAY = numMarked > 1 ? totalDuration / numMarked : 120;
    var LINE_DELAY = locations.length > 1 ? totalDuration / locations.length : 35;

    // Stagger polyline segments
    locations.forEach(function(location, index) {
        if (index >= locations.length - 1) return;
        var next = locations[index + 1];
        var opts = { color: '#F8B6B6', opacity: 0, weight: 2 };
        if (location.dashed) opts.dashArray = '2, 4';
        var segment = L.polyline([location.latLng, next.latLng], opts);
        subMarkers.addLayer(segment);
        setTimeout(function() {
            if (gen !== revealGeneration) return;
            segment.setStyle({ opacity: 0.4 });
        }, index * LINE_DELAY);
    });

    // Stagger marker reveal
    locations.forEach(function(location) {
        if (!location.mark) return;
        var delay = revealIdx * MARKER_DELAY;
        revealIdx++;

        setTimeout(function() {
            if (gen !== revealGeneration) return;
            var subMarkerObj = L.marker(location.latLng, { icon: sub_marker, opacity: 0 });
            subMarkerObj._popupHtml = `
                <div class="popup-content">
                    <h4 class="popup-title">${location.name}</h4>
                    <hr id="popup-hr">
                    <p class="popup-blurb">${location.blurb}</p>
                    ${location.photo ? `<div class="popup-image-container"><img src="${location.photo}" class="popup-image lightbox-trigger" alt=""></div>` : ''}
                </div>
            `;
            subMarkerObj._hasImage = !!location.photo;
            addHoverPopupBehavior(subMarkerObj, sub_marker);
            subMarkers.addLayer(subMarkerObj);
            requestAnimationFrame(function() { subMarkerObj.setOpacity(1); });
            markedStops.push({ marker: subMarkerObj, location: location });
        }, delay);
    });

    subMarkers.addTo(map);

    var totalMarked = numMarked;
    setTimeout(function() {
        if (gen !== revealGeneration) return;
        stopNav.show(markedStops);
    }, totalMarked * MARKER_DELAY + 200);
}


// Function to handle drawing the line from Singapore to San Francisco
function calculateEdgePoints() {
    const bounds = map.getBounds();
    const normalizedSFLongitude = (sfLocation[1] + 360) % 360;
    const normalizedSingaporeLongitude = (singaporeLocation[1] + 360) % 360;

    const slope = (sfLocation[0] - singaporeLocation[0]) / (normalizedSFLongitude - normalizedSingaporeLongitude);
    const yIntercept = singaporeLocation[0] - slope * normalizedSingaporeLongitude;

    const leftMostLongitude = bounds.getWest();
    const rightMostLongitude = bounds.getEast();
    const latitudeAtLeftMost = slope * ((leftMostLongitude + 360) % 360) + yIntercept;
    const latitudeAtRightMost = slope * ((rightMostLongitude + 360) % 360) + yIntercept;

    const adjustedLeftMostLongitude = leftMostLongitude > 180 ? leftMostLongitude - 360 : leftMostLongitude;
    const adjustedRightMostLongitude = rightMostLongitude < 0 ? rightMostLongitude + 360 : rightMostLongitude;

    return {
        leftMostPoint: [latitudeAtLeftMost, adjustedLeftMostLongitude],
        rightMostPoint: [latitudeAtRightMost, adjustedRightMostLongitude]
    };
}


function refreshMainMapView() {
    map.invalidateSize({ pan: false });
    if (subMarkers.getLayers().length > 0) return;
    removeParentMarkers();
    addParentMarkers();
}

function scheduleMainMapRefresh(delay) {
    setTimeout(refreshMainMapView, delay);
}

requestAnimationFrame(function() { scheduleMainMapRefresh(0); });
window.addEventListener('load', function() { scheduleMainMapRefresh(120); });
window.addEventListener('resize', function() { scheduleMainMapRefresh(120); });

if ('IntersectionObserver' in window) {
    var mapObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) scheduleMainMapRefresh(80);
        });
    }, { threshold: 0.15 });
    mapObserver.observe(document.getElementById('travel_map'));
}
