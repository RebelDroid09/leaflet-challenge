var newYorkCoords = [39.83, 98.58];
var mapZoomLevel = 5;

var depth1 = '#90ee90';
var depth2 = '#adff2f';
var depth3 = '#ffff00';
var depth4 = '#ffae42';
var depth5 = '#ff4500';
var depth6 = '#FF0000';

var earthquakeUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

d3.json(citiBikeUrl, function(data) {
    createMap(data);
});

function createMap(data) {
    var myTileLayer = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/streets-v11",
        accessToken: API_KEY
      });
      
      var myMap = L.map("map-id", {
        center: newYorkCoords,
        zoom: mapZoomLevel
      });

      var quakeMarkers = createQuakeMarkers(data.features);

}

function createQuakeMarkers(features){

    var lat;
    var lon;
    var mag;
    var depth;
    var color;

    for(var i = 0; i < features.length; i++)
    {
        lat = features[i].geometry.coordinates[1];
        lon = features[i].geometry.coordinates[0];
        mag = features[i].properties.mag;
        depth = features[i].geometry.depth;

        if (depth <= 10)
        {
            color = depth1;
        }
        else if (depth > 10 && depth <= 30){
            color = depth2;
        }
        else if (depth > 30 && depth <= 50){
            color = depth3;
        }
        else if (depth > 50 && depth <= 730){
            color = depth4;
        }
        else if (depth > 70 && depth <= 90){
            color = depth5;
        }
        else if (depth > 90){
            color = depth6;
        }

        var newCircle = L.circle([lat, lon], {
            color: "#000000",
            fillColor: color,
            fillOpacity: 0.75,
            radius: 50 * mag
          });
    }
}