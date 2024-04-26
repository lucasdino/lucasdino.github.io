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


// Styling for our markers
var highlighted_marker = L.divIcon({
    className: 'dark-donut-icon',
    html: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><circle cx="12" cy="12" r="7" fill="none" stroke="#D00909" stroke-width="6" /></svg>',
    iconSize: [24, 24],
    iconAnchor: [12, 12]
});
var par_marker = L.divIcon({
    className: 'donut-icon',
    html: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18"><circle cx="9" cy="9" r="6" fill="none" stroke="#EF9A9A" stroke-width="5" /></svg>',
    iconSize: [18, 18],
    iconAnchor: [9, 9]
});
var sub_marker = L.divIcon({
    className: 'muted-icon',
    html: '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12"><circle cx="6" cy="6" r="3.75" fill="#EF9A9A" stroke="none" /></svg>',
    iconSize: [12, 12],
    iconAnchor: [6, 6]
});


// Importing our map locations / blurbs / links to pics and defining initial vars for our map
import { mapLocations } from '/assets/js/maplocations.js';
var singaporeLocation = [1.3595, 103.9895]
var sfLocation = [37.75, 237.55]
var initialMapView = { center: map.getCenter(), zoom: map.getZoom() };
var parentMarkers = L.layerGroup();
var subMarkers = L.layerGroup();


// Code for our back button once you click in on a parent location
var backButton = L.control({ position: 'topright' });
backButton.onAdd = function () {
    var div = L.DomUtil.create('div', 'back-button');
    var button = L.DomUtil.create('button', 'back-to-map-btn', div);
    button.innerText = "Back to Main Map";
    L.DomEvent.on(button, 'click', returnToMainMapView);
    return div;
};
function returnToMainMapView() {
    function onMoveEnd() {
        removeSubMarkers();
        addParentMarkers();
        hideBackButton();
        map.off('moveend', onMoveEnd);
    }

    map.on('moveend', onMoveEnd);
    map.setView(initialMapView.center, initialMapView.zoom);
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
            
            var popupContent = `
                <div class="popup-content">
                    <h4 class="popup-title">${category}</h4>
                    <hr id="popup-hr">
                        <p class="popup-blurb">${details.parentBlurb}</p>
                        ${details.parentPhoto ? `<div class="popup-image-container"><img src="${details.parentPhoto}" class="popup-image" alt="Location Image"></div>` : ''}
                </div>
            `;
            marker.bindPopup(popupContent, {
                autoPan: false
            });

            // Marker events
            marker._clicked = false;
            
            map.on('click', function(e) {
                if (marker._clicked) {
                    marker._clicked = false;
                    marker.closePopup();
                }
            });
            
            marker.getPopup().on('close', function() {
                marker._clicked = false;
            });
        
            if (details.parent) {
                marker.on('click', function () {
                    map.setView(details.center, details.zoomLevel);
                    addSubMarkers(details.locations);
                    showBackButton();
                    removeParentMarkers();
                }).on('mouseover', function (e) {
                    if (this.options.icon !== highlighted_marker) {
                        this.setIcon(highlighted_marker);
                    }
                    this.openPopup();
                }).on('mouseout', function () {
                    this.setIcon(markerIcon);
                    this.closePopup();
                });
            } else {
                marker.on('click', function(e) {
                    this._clicked = true;
                    this.openPopup();
                    L.DomEvent.stop(e);
                }).on('mouseover', function() {
                    if (!this._clicked) {
                        this.openPopup();
                    }
                }).on('mouseout', function() {
                    if (!this._clicked) {
                        this.closePopup();
                    }
                });
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
function removeSubMarkers() { subMarkers.clearLayers(); }
function addSubMarkers(locations) {

    locations.forEach(function (location, index) {
        if (location.mark) {
            var subMarker = L.marker(location.latLng, { icon: sub_marker });

            var popupContent = `
                <div class="popup-content">
                    <h4 class="popup-title">${location.name}</h4>
                    <hr id="popup-hr">
                        <p class="popup-blurb">${location.blurb}</p>
                        ${location.photo ? `<div class="popup-image-container"><img src="${location.photo}" class="popup-image" alt="Location Image"></div>` : ''}
                </div>
            `;
            subMarker.bindPopup(popupContent);

            
            // Marker events
            subMarker._clicked = false;
            
            map.on('click', function(e) {
                if (subMarker._clicked) {
                    subMarker._clicked = false;
                    subMarker.closePopup();
                }
            });
            
            subMarker.getPopup().on('close', function() {
                subMarker._clicked = false;
            });
            
            subMarker.on('click', function(e) {
                this._clicked = true;
                this.openPopup();
                L.DomEvent.stop(e);
            }).on('mouseover', function() {
                if (!this._clicked) {
                    this.openPopup();
                }
            }).on('mouseout', function() {
                if (!this._clicked) {
                    this.closePopup();
                }
            });
            subMarkers.addLayer(subMarker);
        }

        // Create individual polyline for each segment
        if (index < locations.length - 1) { // Ensure there is a next location
            var nextLocation = locations[index + 1];
            var segmentLatLngs = [location.latLng, nextLocation.latLng];
            var polylineOptions = {
                color: '#F8B6B6',
                opacity: 0.4,
                weight: 2
            };
            if (location.dashed) {
                polylineOptions.dashArray = '2, 4';
            }
            var segmentPolyline = L.polyline(segmentLatLngs, polylineOptions).addTo(map);
            subMarkers.addLayer(segmentPolyline);
        }
    });
    subMarkers.addTo(map);
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


// Initial view
addParentMarkers();