var usaCoords = [39.83, -98.58];
var mapZoomLevel = 5;

var depth1 = '#90ee90';
var depth2 = '#adff2f';
var depth3 = '#ffff00';
var depth4 = '#ffae42';
var depth5 = '#ff4500';
var depth6 = '#FF0000';

var earthquakeUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

d3.json(earthquakeUrl, function(data) {
    createMap(data);
});

function createMap(data) {
    var myTileLayer = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "streets-v11",
        accessToken: API_KEY
    });      
      
    var myMap = L.map("mapid", {
        center: usaCoords,
        zoom: mapZoomLevel
    });

    myTileLayer.addTo(myMap);

    var quakeMarkers = createQuakeMarkers(data.features);

    var quakeGroup = L.layerGroup(quakeMarkers);

    var overlayMaps = {
        "Quake Markers": quakeGroup
    };

    // Create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map
    L.control.layers(null, overlayMaps, {
        collapsed: false
    }).addTo(myMap);

    // Create a legend to display information about our map
    var info = L.control({
        position: "bottomright"
    });
  
    // When the layer control is added, insert a div with the class of "legend"
    info.onAdd = function() {
        var div = L.DomUtil.create("div", "legend");
        return div;
    };

    // Add the info legend to the map
    info.addTo(myMap);  

    updateLegend();
}

function createQuakeMarkers(features){

    var lat;
    var lon;
    var mag;
    var depth;
    var mycolor;
    var quakeGroup = [];

    for(var i = 0; i < features.length; i++)
    {
        lat = features[i].geometry.coordinates[1];
        lon = features[i].geometry.coordinates[0];
        mag = features[i].properties.mag;
        depth = features[i].geometry.coordinates[2];
        
        if (depth <= 10)
        {
            mycolor = depth1;
        }
        else if (depth > 10 && depth <= 30){
            mycolor = depth2;
        }
        else if (depth > 30 && depth <= 50){
            mycolor = depth3;
        }
        else if (depth > 50 && depth <= 730){
            mycolor = depth4;
        }
        else if (depth > 70 && depth <= 90){
            mycolor = depth5;
        }
        else if (depth > 90){
            mycolor = depth6;
        }

        var newCircle = L.circle([lat, lon], {
            color: "#000000",
            fillColor: mycolor,
            fillOpacity: 0.75,
            radius: 10000 * mag
          });
          
          quakeGroup.push(newCircle);
    }

    return quakeGroup;
}

function updateLegend()
{
    document.querySelector(".legend").innerHTML = [
        "<div class='box depth1'></div><p class='depth1'>-10 - 10</p>",
        "<div class='box depth2'></div><p class='depth2'>10 - 30</p>",
        "<div class='box depth3'></div><p class='depth3'>30 - 50</p>",
        "<div class='box depth4'></div><p class='depth4'>50 - 70</p>",
        "<div class='box depth5'></div><p class='depth5'>70 - 90</p>",
        "<div class='box depth6'></div><p class='depth6'>90+</p>"
      ].join("");    
}