var map = L.map('map').setView([55.680,17.302], 6);



L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);


var regularStyle = {
    stroke: true,
    fillOpacity: 0.2,
    color: '#f5f542',
    opacity: 0.7,
    weight: 1
    };
    
var highlightStyle = {
    stroke: true,
    fillOpacity: 0,
    color: '#ff0202',
    opacity: 1,
    weight: 4
    };

vector = new L.GeoJSON.AJAX("data/datacube_wgs84.geojson", {onEachFeature: checkHover});
vector.addTo(map);
vector.on('data:loaded', function() {
vector.setStyle(regularStyle);
vector.bringToFront()
}.bind(this));

function checkHover(feature, layer) {
    layer.bindTooltip(
        "<b>Number of scenes</b><br>" +
        "Landsat 5: " + layer.feature.properties.Landsat5 + "<br>" +
        "Landsat 7: " + layer.feature.properties.Landsat7 + "<br>" +
        "Landsat 7: " + layer.feature.properties.Landsat8 + "<br>" +
        "Landsat 9: " + layer.feature.properties.Landsat9 + "<br>" +
        "Sentinel-2A: " + layer.feature.properties.Sentinel2A + "<br>" +
        "Sentinel-2B: " + layer.feature.properties.Sentinel2B + "<br>" +
        "Total scenes : " + layer.feature.properties.Total + "<br>" 
    )
    layer.on({
        mouseover: function(e) {
        layer.setStyle(highlightStyle)
        },
    mouseout: function(e) {
        layer.setStyle(regularStyle)
        },
    click: function(e) {
        }
    });
    }