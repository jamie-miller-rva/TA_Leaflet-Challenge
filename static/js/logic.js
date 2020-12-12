/* Instructions - Import & Visualize the Data:
Create a map using Leaflet that plots all of the earthquakes from your data set based on their longitude and latitude.
Your data markers should reflect the magnitude of the earthquake by their size and and depth of the earth quake by color. Earthquakes with higher magnitudes should appear larger and earthquakes with greater depth should appear darker in color.
HINT the depth of the earth can be found as the third coordinate for each earthquake.
Include popups that provide additional information about the earthquake when a marker is clicked.
Create a legend that will provide context for your map data.
Your visualization should look something like first map in the README.md file.

psuedo code / workflow:
message to console: "creating tile layers, map"
define tile layers for selectable map backgrounds
create a map object with tile layers for selectable map backgrounds
create generic map within the DOM (where id = mapid)
add an inital title layer (satellite) to the map
create layers for each dataset (earthquakes and tectonicplates)
define overlayMaps object to hold layers for for each dataset
define baseMaps object to hold tile layers

add a control layer to display selected layers (baseMaps and overlayMaps) on map

get te
*/

// Define tile layers
var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
});

var graymap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/light-v10",
    accessToken: API_KEY
});

var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "dark-v10",
    accessToken: API_KEY
});

var satellitemap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/satellite-v9",
    accessToken: API_KEY
});

// create generic map within the DOM (where id = mapid)
// confirm #mapid has a assigned height (i.e. 100%) see style.css
// view DOM to see addition of leaflet-container
// note: center of map is near Sicily,Italy to better view tectonic plates and entire dataset
var myMap = L.map("mapid", {
    center: [
        37.6, 14.0
    ],
    zoom: 2.9
});

// add satellitemap tile layer to map
satellitemap.addTo(myMap);

// create layers for each dataset (earthquakes and tectonicplates)
var earthquakes = new L.LayerGroup();
var tectonicplates = new L.LayerGroup();


// Define a baseMaps object to hold our base layers
var baseMaps = {
    "Street Map": streetmap,
    "Gray Map": graymap,
    "Dark Map": darkmap,
    "Satellite Map": satellitemap
};

// define an object to hold layers created for for each dataset
var overlayMaps = {
    "Tectonic Plates": tectonicplates,
    Earthquakes: earthquakes
};

// add a control layer to display selected layers (baseMaps and overlayMaps on map)
// note: collapsed: false will display control layers on map (top right)
L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
}).addTo(myMap);
console.log("control layers added to map");

// get techtonicplates geoJSON data from github site (https://github.com/fraxen/tectonicplates)
var UrlTectonicPlates = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json";
d3.json(UrlTectonicPlates, function (plateData) {
    // add geoJSON data and style informaiton to tectconicplates layer
    L.geoJson(plateData, {
        color: "orange",
        weight: 3
    })
        // add to tectonicplates layer using addTo() and chaining
        .addTo(tectonicplates);

    // add tectonicplates layer to myMap
    tectonicplates.addTo(myMap);
});

// define variable UrlEarthquake
var UrlEarthquake = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
console.log(`URL for USGS Earthquake geoJSON data (last 7 days): ${UrlEarthquake}`);

// get earthquakes geoJSON data from USGS site
d3.json(UrlEarthquake, function (data) {
    // function to return style data for each earthquake
    function styleInformation(feature) {
        return {
            opacity: 1,
            fillOpacity: 0.6,
            fillColor: getColor(feature.geometry.coordinates[2]),
            color: "white",
            radius: getRadius(feature.properties.mag),
            stroke: true,
            weight: 0.5
        };
    }

    // function to determine radius of marker based on magnitude
    // markers should reflect the magnitude of the earthquake by their size
    // use conditional if (magnitude === 0) return 1 to plot all earthquakes regardless of magnitude
    function getRadius(magnitude) {
        if (magnitude === 0) {
            return 1;
        }
        return magnitude * 4.5; // just a scaling factor - adjust as needed for visual appearance
    }

    // function to determine color of the marker based on depth
    // earthquakes with greater depth should appear darker in color
    function getColor(depth) {
        switch (true) {
            case depth > 90:
                return "#ea2c2c";
            case depth > 70:
                return "#ea822c";
            case depth > 50:
                return "#ee9c00";
            case depth > 30:
                return "#eecc00";
            case depth > 10:
                return "#d4ee00";
            default:
                return "#98ee00";
        }
    }

    // add geoJSON layer to map
    L.geoJson(data, {
        // create circleMarker
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng);
        },
        style: styleInformation,
        // create a popup for each marker
        onEachFeature: function (feature, layer) {
            layer.bindPopup(
                "Location: "
                + feature.properties.place
                + "<br>Magnitude: "
                + feature.properties.mag
                + "<br>Depth (km): "
                + feature.geometry.coordinates[2]
            );
        }
    })
        .addTo(earthquakes);

    // add earthquakes layer to myMap
    earthquakes.addTo(myMap);
});

// create a legend control object
var legend_depth = L.control({
    position: "bottomleft"
});

// add details to legend_depth
legend_depth.onAdd = function () {
    var div = L.DomUtil.create("div", "info legend");

    var grades = [0, 10, 30, 50, 70, 90];
    var colors = [
        "#98ee00",
        "#d4ee00",
        "#eecc00",
        "#ee9c00",
        "#ea822c",
        "#ea2c2c"
    ];

    // generate a label for each color
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML += [
            "Depth: ",
            "<i style='background: " + colors[i] + "'></i> "
            + grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + " km" + "<br>" : "+" + " km")];
    }
    return div;

};
// add legend to the map
legend_depth.addTo(myMap);

// add details to legend_size
var legend_size = L.control({
    position: "bottomright"
});

legend_size.onAdd = function () {
    var div = L.DomUtil.create("div", "info legend");

    var size = [0, 3, 5, 7, 10];

    // generate label for size     
    div.innerHTML += 
            "Size is a function of Magnitude: "
            + "smallest circles are magnitude 1 or less";
    
    return div;

};
// add legend_size to the map
legend_size.addTo(myMap);