var map = L.map('map').setView([55.680,17.302], 5);

var osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
});

var Esri_WorldImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 19,
	attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
});

var baseMaps = {
    "OpenStreetMap": osm,
    "Esri satellite": Esri_WorldImagery,
};

Esri_WorldImagery.addTo(map)
L.control.layers(baseMaps).addTo(map);


var regularStyle = {
    stroke: true,
    fillOpacity: 0.3,
    color: '#000000',
    fillColor: '#00c800',
    opacity: 1,
    weight: 1
    };
    
var highlightStyle = {
    stroke: true,
    fillOpacity: 0,
    color: '#ff0000',
    fillColor: 'green',
    opacity: 1,
    weight: 4
    };

vector = new L.GeoJSON.AJAX("data/datacube_wgs84.geojson", {onEachFeature: checkHover});
vector.addTo(map);
vector.on('data:loaded', function() {
vector.setStyle(regularStyle);
vector.bringToFront()
}.bind(this));

let currentChart = null; 

function checkHover(feature, layer) {
    layer.bindTooltip(
        `<b>${layer.feature.properties.Tile_ID}</b><br>Click for details`)
    layer.on({
        mouseover: function(e) {
        layer.setStyle(highlightStyle)
        },
    mouseout: function(e) {
        layer.setStyle(regularStyle)
        },
    click: function(e) {
        // content =   `<strong>X:</strong>${layer.feature.properties.Tile_X}<br>
        //             <strong>Y:</strong>${layer.feature.properties.Tile_Y}<br>`;
        // content = `<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>a`
        // document.getElementById('datatext').innerHTML = content

        if (currentChart) {
            currentChart.destroy(); // Destroy the existing chart instance
        }
        const xValues = ["Landsat 5", "Landsat 7", "Landsat 8", "Landsat 9", "Sentinel-2A", "Sentinel-2A"];
        const yValues = [layer.feature.properties.Landsat5,
                        layer.feature.properties.Landsat7,
                        layer.feature.properties.Landsat8,
                        layer.feature.properties.Landsat9,
                        layer.feature.properties.Sentinel2A,
                        layer.feature.properties.Sentinel2B
                    ];
        const barColors = ["#e6e035", "#b4d121","#6ed1ff","#2fc4b8","#9334e0","#de2f95"];

        currentChart = new Chart(document.getElementById("myChart"), {
            type: "bar",
            data: {
            labels: xValues,
            datasets: [{
                backgroundColor: barColors,
                data: yValues
                    }]},
            options: {
            legend: {display: false},
            title: {
                display: true,
                text: layer.feature.properties.Tile_ID + " - Total scenes: "  + layer.feature.properties.Total.toString(),
                animation: {
                    duration: 0 // This disables animations
                    }
                },
            maintainAspectRatio: false
            }
        });
        }
    });
}



