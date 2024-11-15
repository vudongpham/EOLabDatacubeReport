
const geoJSON_file = 'data/datacube_wgs84.geojson';
const dataJSON_file = 'data/data.json';
const startYear = 1984;
const endYear = 2023;

year_list = [];

for (var i = startYear; i <= endYear; i++) {
    year_list.push(i.toString());
}

var json_data = (function () {
    var json = null;
    $.ajax({
        'async': false,
        'global': false,
        'url': dataJSON_file,
        'dataType': "json",
        'success': function (data) {
            json = data;
        }
    });
    return json;
})(); 


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

vector = new L.GeoJSON.AJAX(geoJSON_file, {onEachFeature: checkHover});
vector.addTo(map);
vector.on('data:loaded', function() {
vector.setStyle(regularStyle);
vector.bringToFront()
}.bind(this));

let currentChart = null; 

function checkHover(feature, layer) {
    layer.bindTooltip(
        `<b>X: ${layer.feature.properties.Tile_X} Y: ${layer.feature.properties.Tile_Y}</b><br>Click for details`)
    layer.on({
        mouseover: function(e) {
        layer.setStyle(highlightStyle)
        },
    mouseout: function(e) {
        layer.setStyle(regularStyle)
        },
    click: function(e) {
        if (currentChart) {
            currentChart.destroy();
        }
        
        var data_LND05 = []
        var data_LND07 = []
        var data_LND08 = []
        var data_LND09 = []
        var data_SEN2A = []
        var data_SEN2B = []
        for (let i = 0; i < year_list.length; i++) {
            data_LND05.push(json_data[layer.feature.properties.Tile_ID][year_list[i]]['LND05']);
            data_LND07.push(json_data[layer.feature.properties.Tile_ID][year_list[i]]['LND07']);
            data_LND08.push(json_data[layer.feature.properties.Tile_ID][year_list[i]]['LND08']);  
            data_LND09.push(json_data[layer.feature.properties.Tile_ID][year_list[i]]['LND09']);  
            data_SEN2A.push(json_data[layer.feature.properties.Tile_ID][year_list[i]]['SEN2A']);
            data_SEN2B.push(json_data[layer.feature.properties.Tile_ID][year_list[i]]['SEN2B']);       
        }
        const total_scences = data_LND05

        const ctx = document.getElementById('myChart').getContext('2d');
        currentChart = new Chart(ctx, {
            type: "bar",
            data: {
                labels: year_list,
                datasets: [
                {
                    label: 'Landsat 5',
                    backgroundColor: "#e6e035",
                    data: data_LND05
                },

                {
                    label: 'Landsat 7',
                    backgroundColor: "#b4d121",
                    data: data_LND07
                },

                {
                    label: 'Landsat 8',
                    backgroundColor: "#6ed1ff",
                    data: data_LND08
                },

                {
                    label: 'Landsat 9',
                    backgroundColor: "#2fc4b8",
                    data: data_LND09
                },

                {
                    label: 'Senintel-2A',
                    backgroundColor: "#9334e0",
                    data: data_SEN2A
                },

                {
                    label: 'Senintel-2B',
                    backgroundColor: "#de2f95",
                    data: data_SEN2B
                }
            ]
            },
            options: {
                legend: { display: true },
                plugins: {
                    title: {
                        display: true,
                        text: "Number of satellite scenes in Tile X: " + layer.feature.properties.Tile_X.toString() + " Y: " + layer.feature.properties.Tile_Y.toString()
                    }
                },
                animation: {
                    duration: 2000 // This disables animations
                },
                maintainAspectRatio: false,
                responsive: true,
                scales: {
                    x : {
                        stacked:true,
                        title: {
                            display: true,
                            text: 'Years'
                          }
                    },
                    y: {
                        stacked:true,
                        title: {
                            display: true,
                            text: 'Number of scenes'
                          }
                    }

                }
            }
        });
 
        }
    });
}



