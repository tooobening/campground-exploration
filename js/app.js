mapboxgl.accessToken =
  "pk.eyJ1IjoieXVuaW5nbGl1IiwiYSI6ImNrNm9tMW94cDBudGUza3Bnbm05ZHgzemsifQ.3A1elLHNbR-RboygoyQyMw";
var map = new mapboxgl.Map({
  container: "map", // container id
  // style: 'mapbox://styles/yuningliu/ckfxohc0106s11aqfyvkhjz05', // style URL
  style: "mapbox://styles/yuningliu/ckhclv0tr04my19mr8zlb19ps",
  center: [-118.5383, 37.8651], // starting position [lng, lat]
  zoom: 5.85, // starting zoom
  maxBounds: [
    [-130, 30],
    [-100, 50],
  ],
  // maxBounds: [[-124.763068,32.534156],[-111.043564,49.002494]] // Sets bounds(list: [[Southwest coordinates],[Northeast coordinates]]) as max
});

//URL for Source data
var campsiteURL =
  "https://raw.githubusercontent.com/tooobening/campground-exploration/main/data/fed_campsites.geojson";
var gasURL =
  "https://raw.githubusercontent.com/tooobening/campground-exploration/main/data/gas_station.geojson";
var groceryURL =
  "https://raw.githubusercontent.com/tooobening/campground-exploration/main/data/grocery_store.geojson";
var sportsURL =
  "https://raw.githubusercontent.com/tooobeningcampground-exploration/main/data/sporting_store.geojson";
var sportsURL =
  "https://raw.githubusercontent.com/tooobening/campground-exploration/main/data/sporting_store.geojson";
//menu for POI
var SourceIdArray = ["Campsite", "Gas", "Grocery", "Sports"];
//number of the result for POI
var pipCampsiteNum = "";
var pipGasNum = "";
var pipGroceryNum = "";
var pipSportsNum = "";
var num = 1;

function afterSearch() {
  window.location.href = "index.html";
  console.log("afterSearch function executed.");
  start = document.getElementById("start").value;
  end = document.getElementById("end").value;

  //geocoding
  var resultPoint = [];
  var index = [start, end];
  var request = new XMLHttpRequest();
  (function loop(i, length) {
    if (i >= length) {
      return;
    }
    var url =
      "https://api.mapbox.com/geocoding/v5/mapbox.places/" +
      index[i] +
      ".json?access_token=" +
      mapboxgl.accessToken;
    request.open("GET", url);
    request.responseType = "json";
    request.onreadystatechange = function () {
      if (
        request.readyState === XMLHttpRequest.DONE &&
        request.status === 200
      ) {
        var data = request.response.features[0].center;
        resultPoint.push(data);
        loop(i + 1, length);
      }
      var startPoint = resultPoint[0];
      var endPoint = resultPoint[1];

      console.log("61", startPoint, endPoint);
      //run direction
      runDirection(startPoint, endPoint);
    };
    request.send();
  })(0, index.length);
  console.log(start, end);
}

function loadJSON(path, success, error) {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      if (xhr.status === 200) {
        if (success) success(JSON.parse(xhr.responseText));
      } else {
        if (error) error(xhr);
      }
    }
  };
  xhr.open("GET", path, true);
  xhr.send();
}

//when the map is only first loaded, execute this function.
function loadCampsiteLayer() {
  // var campsiteURL = 'https://raw.githubusercontent.com/tooobening/geog778/master/data/fed_campsites.geojson'
  //draw points from a GeoJSON collection to a map
  map.addSource("campsite", {
    type: "geojson",
    data: campsiteURL, //using Github Page to store data on the fly
  });
  // Add a symbol layer
  map.addLayer({
    id: "Campsite",
    type: "symbol", //symbol
    source: "campsite",
    layout: {
      // make layer visible by default
      visibility: "visible",
      "icon-image": "campsite-24", //'custom-marker',
      // get the title name from the source's "title" property
      "text-field": ["get", "title"],
      "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
      "text-offset": [0, 1.25],
      "text-anchor": "top",
    },
  });
  //pop up on click
  map.on("click", "Campsite", function (e) {
    var coordinates = e.features[0].geometry.coordinates.slice();
    var campsiteType = e.features[0].properties.CampsiteType;
    var campsiteState = e.features[0].properties.AddressStateCode;
    var campsiteOrg = e.features[0].properties.OrgAbbrevName;
    console.log(e);

    // Ensure that if the map is zoomed out such that multiple
    // copies of the feature are visible, the popup appears
    // over the copy being pointed to.
    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
      coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }
    var popupContent =
      "Type:" +
      campsiteType +
      "<br/>State:" +
      campsiteState +
      "<br/>Organization:" +
      campsiteOrg +
      "<br/>";

    if (e.features[0].geometry) {
      popupContent += '<div class="google-maps-icon-container">';
      popupContent +=
        '<div><a target="_blank" href="https://www.google.com/maps/search/?api=1&query=' +
        e.features[0].geometry.coordinates[1] +
        "," +
        e.features[0].geometry.coordinates[0] +
        '"><img border="0" alt="google maps" src="https://raw.githubusercontent.com/tooobening/geog778/master/img/google-maps-48.png" width="40" height="40"></img></a></div>';
      popupContent +=
        '<div><a target="_blank" href="https://www.google.com/maps/search/?api=1&query=' +
        e.features[0].geometry.coordinates[1] +
        "," +
        e.features[0].geometry.coordinates[0] +
        '">Show on Google Maps</a><div>';
      popupContent += "</div>";
    }
    new mapboxgl.Popup()
      .setLngLat(coordinates)
      .setHTML(popupContent)
      .addTo(map);
  });

  // Change the cursor to a pointer when the mouse is over the places layer.
  map.on("mouseenter", "Campsite", function () {
    map.getCanvas().style.cursor = "pointer";
  });

  // Change it back to a pointer when it leaves.
  map.on("mouseleave", "Campsite", function () {
    map.getCanvas().style.cursor = "";
  });
}
function loadGasLayer() {
  //draw points from a GeoJSON collection to a map
  map.addSource("gas", {
    type: "geojson",
    data: gasURL, //using Github Page to store data on the fly
  });
  // Add a symbol layer
  map.addLayer({
    id: "Gas",
    type: "symbol", //symbol
    source: "gas",
    layout: {
      // make layer visible by default
      visibility: "none",
      "icon-image": "gas-24", //'custom-marker',
      // get the title name from the source's "title" property
      "text-field": ["get", "title"],
      "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
      "text-offset": [0, 1.25],
      "text-anchor": "top",
    },
  });
  //pop up on click
  map.on("click", "Gas", function (e) {
    var coordinates = e.features[0].geometry.coordinates.slice();
    // Ensure that if the map is zoomed out such that multiple
    // copies of the feature are visible, the popup appears
    // over the copy being pointed to.
    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
      coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }
    var gasCategory = e.features[0].properties.top_category;
    var gasSubCategory = e.features[0].properties.sub_category;
    var gasRegion = e.features[0].properties.region;
    if (e.features[0].properties.brands === "null") {
      var popupContent =
        "Class:" +
        gasCategory +
        "<br/>Sub-Class: " +
        gasSubCategory +
        "<br/>State:" +
        gasRegion +
        "<br/>";
    } else {
      var gasBrand = e.features[0].properties.brands;
      var popupContent =
        "Brand:" +
        gasBrand +
        "<br/>Class:" +
        gasCategory +
        "<br/>Sub-Class: " +
        gasSubCategory +
        "<br/>State:" +
        gasRegion +
        "<br/>";
    }

    if (e.features[0].geometry) {
      popupContent += '<div class="google-maps-icon-container">';
      popupContent +=
        '<div><a target="_blank" href="https://www.google.com/maps/search/?api=1&query=' +
        e.features[0].geometry.coordinates[1] +
        "," +
        e.features[0].geometry.coordinates[0] +
        '"><img border="0" alt="google maps" src="https://raw.githubusercontent.com/tooobening/geog778/master/img/google-maps-48.png" width="40" height="40"></img></a></div>';
      popupContent +=
        '<div><a target="_blank" href="https://www.google.com/maps/search/?api=1&query=' +
        e.features[0].geometry.coordinates[1] +
        "," +
        e.features[0].geometry.coordinates[0] +
        '">Show on Google Maps</a><div>';
      popupContent += "</div>";
    }
    new mapboxgl.Popup()
      .setLngLat(coordinates)
      .setHTML(popupContent)
      .addTo(map);
  });

  // Change the cursor to a pointer when the mouse is over the places layer.
  map.on("mouseenter", "Gas", function () {
    map.getCanvas().style.cursor = "pointer";
  });

  // Change it back to a pointer when it leaves.
  map.on("mouseleave", "Gas", function () {
    map.getCanvas().style.cursor = "";
  });
}
function loadGroceryLayer() {
  //draw points from a GeoJSON collection to a map
  map.addSource("grocery", {
    type: "geojson",
    data: groceryURL, //using Github Page to store data on the fly
  });
  // Add a symbol layer
  map.addLayer({
    id: "Grocery",
    type: "symbol", //symbol
    source: "grocery",
    layout: {
      // make layer none by default
      visibility: "none",
      "icon-image": "grocery-24", //'custom-marker',
      // get the title name from the source's "title" property
      "text-field": ["get", "title"],
      "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
      "text-offset": [0, 1.25],
      "text-anchor": "top",
    },
  });
  //pop up on click
  map.on("click", "Grocery", function (e) {
    var coordinates = e.features[0].geometry.coordinates.slice();
    // Ensure that if the map is zoomed out such that multiple
    // copies of the feature are visible, the popup appears
    // over the copy being pointed to.
    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
      coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }
    var groceryCategory = e.features[0].properties.top_category;
    var grocerySubCategory = e.features[0].properties.sub_category;
    var groceryRegion = e.features[0].properties.region;
    if (e.features[0].properties.brands === "null") {
      var popupContent =
        "Class:" +
        groceryCategory +
        "<br/>Sub-Class: " +
        grocerySubCategory +
        "<br/>State:" +
        groceryRegion +
        "<br/>";
    } else {
      var groceryBrands = e.features[0].properties.brands;
      var popupContent =
        "Brand: " +
        groceryBrands +
        "<br/>Class:" +
        groceryCategory +
        "<br/>Sub-Class: " +
        grocerySubCategory +
        "<br/>State:" +
        groceryRegion +
        "<br/>";
    }
    console.log(e);

    if (e.features[0].geometry) {
      popupContent += '<div class="google-maps-icon-container">';
      popupContent +=
        '<div><a target="_blank" href="https://www.google.com/maps/search/?api=1&query=' +
        e.features[0].geometry.coordinates[1] +
        "," +
        e.features[0].geometry.coordinates[0] +
        '"><img border="0" alt="google maps" src="https://raw.githubusercontent.com/tooobening/geog778/master/img/google-maps-48.png" width="40" height="40"></img></a></div>';
      popupContent +=
        '<div><a target="_blank" href="https://www.google.com/maps/search/?api=1&query=' +
        e.features[0].geometry.coordinates[1] +
        "," +
        e.features[0].geometry.coordinates[0] +
        '">Show on Google Maps</a><div>';
      popupContent += "</div>";
    }
    new mapboxgl.Popup()
      .setLngLat(coordinates)
      .setHTML(popupContent)
      .addTo(map);
  });

  // Change the cursor to a pointer when the mouse is over the places layer.
  map.on("mouseenter", "Grocery", function () {
    map.getCanvas().style.cursor = "pointer";
  });

  // Change it back to a pointer when it leaves.
  map.on("mouseleave", "Grocery", function () {
    map.getCanvas().style.cursor = "";
  });
}
function loadSportsLayer() {
  //draw points from a GeoJSON collection to a map
  map.addSource("sports", {
    type: "geojson",
    data: sportsURL, //using Github Page to store data on the fly
  });
  // Add a symbol layer
  map.addLayer({
    id: "Sports",
    type: "symbol", //symbol
    source: "sports",
    layout: {
      // make layer visible by default
      visibility: "none",
      "icon-image": "sports-24", //'custom-marker',
      // get the title name from the source's "title" property
      "text-field": ["get", "title"],
      "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
      "text-offset": [0, 1.25],
      "text-anchor": "top",
    },
  });
  //pop up on click
  map.on("click", "Sports", function (e) {
    var coordinates = e.features[0].geometry.coordinates.slice();
    // Ensure that if the map is zoomed out such that multiple
    // copies of the feature are visible, the popup appears
    // over the copy being pointed to.
    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
      coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }

    var sportsCategory = e.features[0].properties.top_category;
    var sportsSubCategory = e.features[0].properties.sub_category;
    var sportsRegion = e.features[0].properties.region;
    if (e.features[0].properties.brands === "null") {
      var popupContent =
        "Class:" +
        sportsCategory +
        "<br/>Sub-Class: " +
        sportsSubCategory +
        "<br/>State:" +
        sportsRegion +
        "<br/>";
    } else {
      var sportsBrands = e.features[0].properties.brands;
      var popupContent =
        "Brand: " +
        sportsBrands +
        "<br/>Class:" +
        sportsCategory +
        "<br/>Sub-Class: " +
        sportsSubCategory +
        "<br/>State:" +
        sportsRegion +
        "<br/>";
    }

    if (e.features[0].geometry) {
      popupContent += '<div class="google-maps-icon-container">';
      popupContent +=
        '<div><a target="_blank" href="https://www.google.com/maps/search/?api=1&query=' +
        e.features[0].geometry.coordinates[1] +
        "," +
        e.features[0].geometry.coordinates[0] +
        '"><img border="0" alt="google maps" src="https://raw.githubusercontent.com/tooobening/geog778/master/img/google-maps-48.png" width="40" height="40"></img></a></div>';
      popupContent +=
        '<div><a target="_blank" href="https://www.google.com/maps/search/?api=1&query=' +
        e.features[0].geometry.coordinates[1] +
        "," +
        e.features[0].geometry.coordinates[0] +
        '">Show on Google Maps</a><div>';
      popupContent += "</div>";
    }
    new mapboxgl.Popup()
      .setLngLat(coordinates)
      .setHTML(popupContent)
      .addTo(map);
  });

  // Change the cursor to a pointer when the mouse is over the places layer.
  map.on("mouseenter", "Sports", function () {
    map.getCanvas().style.cursor = "pointer";
  });

  // Change it back to a pointer when it leaves.
  map.on("mouseleave", "Sports", function () {
    map.getCanvas().style.cursor = "";
  });
}

//base layer, loaded everytime
function loadBaseLayers() {
  console.log("executed loadBaseLayers func");
  var layers = map.getStyle().layers;
  // Find the index of the first symbol layer in the map style
  var firstSymbolId;
  for (var i = 0; i < layers.length; i++) {
    if (layers[i].type === "fill") {
      //layer .type is 'symbol', others:
      firstSymbolId = layers[i].id; //that layer's .id
      break;
    }
  }

  // ------------------load POI source: campsite-------------------------------//

  //-------------------add multiple base layers: nps, nfs, places...---------------------------//
  map.addSource("nps", {
    type: "geojson",
    data:
      "https://services1.arcgis.com/fBc8EJBxQRMcHlei/arcgis/rest/services/NPS_Land_Resources_Division_Boundary_and_Tract_Data_Service/FeatureServer/2/query?where=REGION%20in%20(%27PW%27,%27IM%27)&outFields=*&outSR=4326&f=geojson",
  });
  map.addSource("nfs", {
    type: "geojson",
    data:
      "https://apps.fs.usda.gov/arcx/rest/services/EDW/EDW_ProclaimedForestBoundaries_01/MapServer/0/query?where=1%3D1&outFields=FORESTNAME&geometry=-129.954%2C29.9%2C-109.455%2C50.748&geometryType=esriGeometryEnvelope&inSR=4326&spatialRel=esriSpatialRelIntersects&outSR=4326&f=geojson",
    // 'https://apps.fs.usda.gov/arcx/rest/services/EDW/EDW_ProclaimedForestBoundaries_01/MapServer/0/query?where=1%3D1&outFields=*&geometry=-124.863068%2C32.434156%2C-110.043564%2C49.102494&outSR=4326&f=geojson'
  });
  map.addSource("place", {
    type: "geojson",
    data:
      // 'https://opendata.arcgis.com/datasets/d8e6e822e6b44d80b4d3b5fe7538576d_0.geojson'
      "https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/USA_Census_Populated_Places/FeatureServer/0/query?where=ST%20in%20(%27WA%27,%27OR%27,%27CA%27,%27CO%27,%27UT%27,%27WY%27,%27NV%27,%27ID%27,%27MT%27)&outFields=ST,NAME&outSR=4326&f=geojson",
  });
  //add the layer (2 args:object, str) again, on top of the source
  map.addLayer(
    {
      //this obj is what the layer as
      id: "National Park",
      type: "fill",
      source: "nps", // defined from .addSource
      layout: {
        // make layer visible by default
        visibility: "visible",
      },
      paint: {
        "fill-color": "#578b2c",
        "fill-opacity": 0.5,
      },
      //if the other layer exists in the stylesheet already,
      //the new layer will be positioned right before that layer in the stack,
      //making it possible to put 'overlays' anywhere in the layer stack.
      // Insert the layer beneath the first symbol layer.
    },
    firstSymbolId //this str('symbol') representing another layer's name
  );
  map.addLayer(
    {
      //this obj is what the layer as
      id: "National Forest",
      type: "fill",
      source: "nfs", // defined from .addSource
      layout: {
        // make layer visible by default
        visibility: "visible",
      },
      paint: {
        "fill-color": "#636d45",
        "fill-opacity": 0.5,
      },
      //if the other layer exists in the stylesheet already,
      //the new layer will be positioned right before that layer in the stack,
      //making it possible to put 'overlays' anywhere in the layer stack.
      // Insert the layer beneath the first symbol layer.
    },
    firstSymbolId //this str('symbol') representing another layer's name
  );
  map.addLayer(
    {
      //this obj is what the layer as
      id: "Place",
      type: "fill",
      source: "place", // defined from .addSource
      layout: {
        // make layer visible by default
        visibility: "visible",
      },
      paint: {
        "fill-color": "#e42634",
        "fill-opacity": 0.5,
      },
    },
    firstSymbolId //this str('symbol') representing another layer's name
  );
} //end of map.on()

//toggleable menu for 'POI':
function toggleMenu(SourceIdArray) {
  var toggleableLayerImgs = [
    "img/campsite-96.png",
    "img/gas-96.png",
    "img/grocery-96.png",
    "img/sports-96.png",
  ];
  var toggleableLayerImgsAfter = [
    "img/campsite-96-al.png",
    "img/gas-96-al.png",
    "img/grocery-96-al.png",
    "img/sports-96-al.png",
  ];
  for (var i = 0; i < toggleableLayerImgs.length; i++) {
    if (
      [
        "Campsite",
        "Pip-campsite",
        "Pip-gas",
        "Pip-grocery",
        "Pip-sports",
      ].indexOf(SourceIdArray[i]) >= 0
    ) {
      var id = SourceIdArray[i];
      var link = document.createElement("a");
      link.href = "#";
      link.className = "active";
      // link.textContent = id;
      link.innerHTML = "<img src=" + toggleableLayerImgs[i] + ">";
      link.id = id;
    } else {
      var id = SourceIdArray[i];
      var link = document.createElement("a");
      link.href = "#";
      link.className = "";
      // link.textContent = id;
      link.innerHTML = "<img src=" + toggleableLayerImgsAfter[i] + ">";
      link.id = id;
    }

    link.onclick = function (e) {
      var clickedLayer = this.id;
      var ind = SourceIdArray.indexOf(clickedLayer);
      console.log(clickedLayer, e);
      e.preventDefault();
      e.stopPropagation();

      var visibility = map.getLayoutProperty(clickedLayer, "visibility");
      if (clickedLayer === "Campsite") {
        if (visibility === "visible") {
          map.setLayoutProperty(clickedLayer, "visibility", "none");
          this.className = "";
          this.innerHTML = "<img src=" + toggleableLayerImgsAfter[ind] + ">";
        } else {
          this.className = "active";
          map.setLayoutProperty(clickedLayer, "visibility", "visible");
          this.innerHTML = "<img src=" + toggleableLayerImgs[ind] + ">";
        }
      } else {
        // toggle layer visibility by changing the layout object's visibility property
        if (visibility === "none") {
          map.setLayoutProperty(clickedLayer, "visibility", "visible");
          this.className = "active";
          this.innerHTML = "<img src=" + toggleableLayerImgs[ind] + ">";
        } else {
          this.className = "";
          map.setLayoutProperty(clickedLayer, "visibility", "none");
          this.innerHTML = "<img src=" + toggleableLayerImgsAfter[ind] + ">";
        }
      }
    };
    var layers = document.getElementById("poi");
    layers.appendChild(link);
  }
}

function runDirection(ori, des) {
  //re-create new map layer after delete current map layer
  map = new mapboxgl.Map({
    container: "map", // container id
    // style: 'mapbox://styles/yuningliu/ckfxohc0106s11aqfyvkhjz05', // style URL
    style: "mapbox://styles/yuningliu/ckhclv0tr04my19mr8zlb19ps",
    center: [-120.5542, 43.8041], // starting position [lng, lat]
    zoom: 5, // starting zoom
    // maxBounds: [[-124.763068,32.534156],[-111.043564,49.002494]] // Sets bounds(list: [[Southwest coordinates],[Northeast coordinates]]) as max
  });

  var startLng = ori[0];
  var startLat = ori[1];
  var endLng = des[0];
  var endLat = des[1];

  var routeURL =
    "https://api.mapbox.com/directions/v5/mapbox/driving/" +
    startLng +
    "%2C" +
    startLat +
    "%3B" +
    endLng +
    "%2C" +
    endLat +
    "?alternatives=false&geometries=geojson&steps=false&access_token=" +
    mapboxgl.accessToken;
  loadJSON(
    routeURL,
    function (jsonobject) {
      // The API response is GeoJSON which has coordinates in lon/lat order
      var coordinates = jsonobject.routes[0].geometry.coordinates; //a lineString array containg multiple points as items
      map.on("load", loadBaseLayers);
      map.on("load", function () {
        var pt1 = {
          type: "Feature",
          properties: { name: "1" },
          geometry: {
            type: "Point",
            coordinates: coordinates[0],
          },
        };
        var pt2 = {
          type: "Feature",
          properties: { name: "2" },
          geometry: {
            type: "Point",
            coordinates: coordinates[coordinates.length - 1],
          },
        };
        var line = {
          type: "Feature",
          properties: {},
          geometry: {
            type: "LineString",
            coordinates: coordinates,
          },
        };
        var buffered = turf.buffer(line, 100, { units: "miles" });
        var results = turf.featureCollection([pt1, pt2, buffered, line]);
        bounds = turf.bbox(buffered);
        // var bounds = result.reduce(function (bounds, coord) {
        //     return bounds.extend(coord);
        // }, new mapboxgl.LngLatBounds(result[0], result[0]))
        map.addSource("result", {
          type: "geojson",
          data: results,
        });
        map.addLayer({
          id: "resultBuf",
          type: "fill",
          source: "result",
          paint: {
            "fill-color": "#888888",
            "fill-opacity": 0.2,
          },
          filter: ["==", "$type", "Polygon"],
        });
        map.addLayer({
          id: "resultRoute",
          type: "line",
          source: "result",
          filter: ["==", "$type", "LineString"],
          layout: {
            "line-join": "round",
            "line-cap": "round",
          },
          paint: {
            "line-color": "#e42634",
            "line-opacity": 0.5,
            "line-width": 5,
          },
        });
        map.addLayer({
          id: "day1",
          type: "symbol",
          source: "result",
          layout: {
            "icon-image": "number-1",
          },
          filter: ["==", "name", "1"],
        });
        map.addLayer({
          id: "day2",
          type: "symbol",
          source: "result",
          layout: {
            "icon-image": "number-2",
          },
          filter: ["==", "name", "2"],
        });

        //-----Fly to the center of the result using FlyTo, center needs to be the coordinates array
        // var resultPt =  {
        //     type: 'FeatureCollection',
        //     features: [pt1,pt2]
        // }
        // var resultCenter = turf.center(resultPt).geometry.coordinates
        // map.flyTo({
        //     center: resultCenter,
        //     essential: true // this animation is considered essential with respect to prefers-reduced-motion
        //     });

        map.fitBounds(bounds, {
          padding: 100,
        });
        //campsite points in Poly result
        loadJSON(
          campsiteURL,
          function (jsonobject) {
            // The API response is GeoJSON which has coordinates in lon/lat order
            var coordinates = jsonobject.features;
            var pip_array = [];

            //iterate the features within the buffered zone
            coordinates.forEach(function (feature) {
              //a feature is a point in {} format, with keys like "type","geometry","properties"
              // Using Turf,
              // If a nearest library is found
              if (
                typeof feature.geometry.coordinates[1] == "number" &&
                typeof feature.geometry.coordinates[1] == "number"
              ) {
                if (turf.booleanPointInPolygon(feature, buffered)) {
                  pip_array.push(feature);
                }
              }
            });
            pipCampsiteNum = pip_array.length;
            const result = document.getElementById("result");
            result.innerHTML +=
              "<p><b>, " +
              pipCampsiteNum +
              " campsites </b>in total. Enjoy it :)</p>";
            //add a new source with the id 'pip-campsite'
            map.addSource("pip-campsite", {
              type: "geojson",
              data: {
                type: "FeatureCollection",
                features: [],
              },
            });
            // Update the 'pip-campsite' data source to include campsite point in buffer zone
            map.getSource("pip-campsite").setData({
              type: "FeatureCollection",
              features: pip_array,
            });
            // var pipCampsiteData = {
            //     type: 'FeatureCollection',
            //     features: pip_array
            // }
            // Add a symbol layer
            map.addLayer({
              id: "Pip-campsite",
              type: "symbol", //symbol
              source: "pip-campsite",
              layout: {
                // make layer visible by default
                visibility: "visible",
                "icon-image": "campsite-24", //'custom-marker',
                // get the title name from the source's "title" property
                "text-field": ["get", "title"],
                "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
                "text-offset": [0, 1.25],
                "text-anchor": "top",
              },
              // 'paint':{
              //     'circle-color':'#ffffff',
              //     'circle-radius':10,
              // }
            });
            //pop up on click
            map.on("click", "Pip-campsite", function (e) {
              var coordinates = e.features[0].geometry.coordinates.slice();
              var campsiteType = e.features[0].properties.CampsiteType;
              var campsiteState = e.features[0].properties.AddressStateCode;
              var campsiteOrg = e.features[0].properties.OrgAbbrevName;
              console.log(e);

              // Ensure that if the map is zoomed out such that multiple
              // copies of the feature are visible, the popup appears
              // over the copy being pointed to.
              while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
              }
              var popupContent =
                "Type:" +
                campsiteType +
                "<br/>State:" +
                campsiteState +
                "<br/>Organization:" +
                campsiteOrg +
                "<br/>";

              if (e.features[0].geometry) {
                popupContent += '<div class="google-maps-icon-container">';
                popupContent +=
                  '<div><a target="_blank" href="https://www.google.com/maps/search/?api=1&query=' +
                  e.features[0].geometry.coordinates[1] +
                  "," +
                  e.features[0].geometry.coordinates[0] +
                  '"><img border="0" alt="google maps" src="https://raw.githubusercontent.com/tooobening/geog778/master/img/google-maps-48.png" width="40" height="40"></img></a></div>';
                popupContent +=
                  '<div><a target="_blank" href="https://www.google.com/maps/search/?api=1&query=' +
                  e.features[0].geometry.coordinates[1] +
                  "," +
                  e.features[0].geometry.coordinates[0] +
                  '">Show on Google Maps</a><div>';
                popupContent += "</div>";
              }
              new mapboxgl.Popup()
                .setLngLat(coordinates)
                .setHTML(popupContent)
                .addTo(map);
            });

            // Change the cursor to a pointer when the mouse is over the places layer.
            map.on("mouseenter", "Pip-campsite", function () {
              map.getCanvas().style.cursor = "pointer";
            });

            // Change it back to a pointer when it leaves.
            map.on("mouseleave", "Pip-campsite", function () {
              map.getCanvas().style.cursor = "";
            });
          },
          function (error) {
            console.log(error);
          }
        ); //end of loadJSON(poiURL)
        //gas points in Poly result
        loadJSON(
          gasURL,
          function (jsonobject) {
            // The API response is GeoJSON which has coordinates in lon/lat order
            var coordinates = jsonobject.features;
            var pip_array = [];

            //iterate the features within the buffered zone
            coordinates.forEach(function (feature) {
              //a feature is a point in {} format, with keys like "type","geometry","properties"
              // Using Turf,
              if (
                typeof feature.geometry.coordinates[1] == "number" &&
                typeof feature.geometry.coordinates[1] == "number"
              ) {
                if (turf.booleanPointInPolygon(feature, buffered)) {
                  pip_array.push(feature);
                }
              }
            });
            window.pipGasNum = pip_array.length;
            const result = document.getElementById("result");
            result.innerHTML +=
              "<p>, <b>" + pipGasNum + "</b> gas station.</p>";

            // result.innerHTML += '</br><p>There are '+pipGasNum+' gas stations.</p>';
            //add a new source with the id 'pip-campsite'
            map.addSource("pip-gas", {
              type: "geojson",
              data: {
                type: "FeatureCollection",
                features: [],
              },
            });
            // Update the 'pip-campsite' data source to include campsite point in buffer zone
            map.getSource("pip-gas").setData({
              type: "FeatureCollection",
              features: pip_array,
            });
            map.addLayer({
              id: "Pip-gas",
              type: "symbol", //symbol
              source: "pip-gas",
              layout: {
                // make layer visible by default
                visibility: "visible",
                "icon-image": "gas-24", //'custom-marker',
                // get the title name from the source's "title" property
                "text-field": ["get", "title"],
                "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
                "text-offset": [0, 1.25],
                "text-anchor": "top",
              },
              // 'paint':{
              //     'circle-color':'#ffffff',
              //     'circle-radius':10,
              // }
            });
            //pop up on click
            map.on("click", "Pip-gas", function (e) {
              var coordinates = e.features[0].geometry.coordinates.slice();
              // Ensure that if the map is zoomed out such that multiple
              // copies of the feature are visible, the popup appears
              // over the copy being pointed to.
              while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
              }
              var gasCategory = e.features[0].properties.top_category;
              var gasSubCategory = e.features[0].properties.sub_category;
              var gasRegion = e.features[0].properties.region;
              if (e.features[0].properties.brands === "null") {
                var popupContent =
                  "Class:" +
                  gasCategory +
                  "<br/>Sub-Class: " +
                  gasSubCategory +
                  "<br/>State:" +
                  gasRegion +
                  "<br/>";
              } else {
                var gasBrand = e.features[0].properties.brands;
                var popupContent =
                  "Brand:" +
                  gasBrand +
                  "<br/>Class:" +
                  gasCategory +
                  "<br/>Sub-Class: " +
                  gasSubCategory +
                  "<br/>State:" +
                  gasRegion +
                  "<br/>";
              }

              if (e.features[0].geometry) {
                popupContent += '<div class="google-maps-icon-container">';
                popupContent +=
                  '<div><a target="_blank" href="https://www.google.com/maps/search/?api=1&query=' +
                  e.features[0].geometry.coordinates[1] +
                  "," +
                  e.features[0].geometry.coordinates[0] +
                  '"><img border="0" alt="google maps" src="https://raw.githubusercontent.com/tooobening/geog778/master/img/google-maps-48.png" width="40" height="40"></img></a></div>';
                popupContent +=
                  '<div><a target="_blank" href="https://www.google.com/maps/search/?api=1&query=' +
                  e.features[0].geometry.coordinates[1] +
                  "," +
                  e.features[0].geometry.coordinates[0] +
                  '">Show on Google Maps</a><div>';
                popupContent += "</div>";
              }
              new mapboxgl.Popup()
                .setLngLat(coordinates)
                .setHTML(popupContent)
                .addTo(map);
            });

            // Change the cursor to a pointer when the mouse is over the places layer.
            map.on("mouseenter", "Pip-gas", function () {
              map.getCanvas().style.cursor = "pointer";
            });

            // Change it back to a pointer when it leaves.
            map.on("mouseleave", "Pip-gas", function () {
              map.getCanvas().style.cursor = "";
            });
          },
          function (error) {
            console.log(error);
          }
        ); //end of loadJSON(gas)
        //grocery points in Poly result
        loadJSON(
          groceryURL,
          function (jsonobject) {
            // The API response is GeoJSON which has coordinates in lon/lat order
            var coordinates = jsonobject.features;
            var pip_array = [];

            //iterate the features within the buffered zone
            coordinates.forEach(function (feature) {
              //a feature is a point in {} format, with keys like "type","geometry","properties"
              // Using Turf,
              if (
                typeof feature.geometry.coordinates[1] == "number" &&
                typeof feature.geometry.coordinates[1] == "number"
              ) {
                if (turf.booleanPointInPolygon(feature, buffered)) {
                  pip_array.push(feature);
                }
              }
            });
            window.pipGroceryNum = pip_array.length;
            const result = document.getElementById("result");
            result.innerHTML +=
              "<p>, <b>" + pipGroceryNum + "</b> grocery stores, and</p>";

            //add a new source with the id 'pip-campsite'
            map.addSource("pip-grocery", {
              type: "geojson",
              data: {
                type: "FeatureCollection",
                features: [],
              },
            });
            // Update the 'pip-campsite' data source to include campsite point in buffer zone
            map.getSource("pip-grocery").setData({
              type: "FeatureCollection",
              features: pip_array,
            });
            map.addLayer({
              id: "Pip-grocery",
              type: "symbol", //symbol
              source: "pip-grocery",
              layout: {
                // make layer visible by default
                visibility: "visible",
                "icon-image": "grocery-24", //'custom-marker',
                // get the title name from the source's "title" property
                "text-field": ["get", "title"],
                "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
                "text-offset": [0, 1.25],
                "text-anchor": "top",
              },
              // 'paint':{
              //     'circle-color':'#ffffff',
              //     'circle-radius':10,
              // }
            });
            //pop up on click
            map.on("click", "Pip-grocery", function (e) {
              var coordinates = e.features[0].geometry.coordinates.slice();
              // Ensure that if the map is zoomed out such that multiple
              // copies of the feature are visible, the popup appears
              // over the copy being pointed to.
              while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
              }
              var groceryCategory = e.features[0].properties.top_category;
              var grocerySubCategory = e.features[0].properties.sub_category;
              var groceryRegion = e.features[0].properties.region;
              if (e.features[0].properties.brands === "null") {
                var popupContent =
                  "Class:" +
                  groceryCategory +
                  "<br/>Sub-Class: " +
                  grocerySubCategory +
                  "<br/>State:" +
                  groceryRegion +
                  "<br/>";
              } else {
                var groceryBrands = e.features[0].properties.brands;
                var popupContent =
                  "Brand: " +
                  groceryBrands +
                  "<br/>Class:" +
                  groceryCategory +
                  "<br/>Sub-Class: " +
                  grocerySubCategory +
                  "<br/>State:" +
                  groceryRegion +
                  "<br/>";
              }
              console.log(e);

              if (e.features[0].geometry) {
                popupContent += '<div class="google-maps-icon-container">';
                popupContent +=
                  '<div><a target="_blank" href="https://www.google.com/maps/search/?api=1&query=' +
                  e.features[0].geometry.coordinates[1] +
                  "," +
                  e.features[0].geometry.coordinates[0] +
                  '"><img border="0" alt="google maps" src="https://raw.githubusercontent.com/tooobening/geog778/master/img/google-maps-48.png" width="40" height="40"></img></a></div>';
                popupContent +=
                  '<div><a target="_blank" href="https://www.google.com/maps/search/?api=1&query=' +
                  e.features[0].geometry.coordinates[1] +
                  "," +
                  e.features[0].geometry.coordinates[0] +
                  '">Show on Google Maps</a><div>';
                popupContent += "</div>";
              }
              new mapboxgl.Popup()
                .setLngLat(coordinates)
                .setHTML(popupContent)
                .addTo(map);
            });

            // Change the cursor to a pointer when the mouse is over the places layer.
            map.on("mouseenter", "Pip-grocery", function () {
              map.getCanvas().style.cursor = "pointer";
            });

            // Change it back to a pointer when it leaves.
            map.on("mouseleave", "Pip-grocery", function () {
              map.getCanvas().style.cursor = "";
            });
          },
          function (error) {
            console.log(error);
          }
        ); //end of loadJSON(grocery)
        //sports points in Poly result
        loadJSON(
          sportsURL,
          function (jsonobject) {
            // The API response is GeoJSON which has coordinates in lon/lat order
            var coordinates = jsonobject.features;
            var pip_array = [];

            //iterate the features within the buffered zone
            coordinates.forEach(function (feature) {
              //a feature is a point in {} format, with keys like "type","geometry","properties"
              // Using Turf,
              if (
                typeof feature.geometry.coordinates[1] == "number" &&
                typeof feature.geometry.coordinates[1] == "number"
              ) {
                if (turf.booleanPointInPolygon(feature, buffered)) {
                  pip_array.push(feature);
                }
              }
            });
            window.pipSportsNum = pip_array.length;
            const result = document.getElementById("result");
            result.innerHTML +=
              "<p>In this area (100-miles buffered zone), you can find</p><p>, <b>" +
              pipSportsNum +
              "</b> sporting goods stores.</p>";
            //add a new source with the id 'pip-campsite'
            map.addSource("pip-sports", {
              type: "geojson",
              data: {
                type: "FeatureCollection",
                features: [],
              },
            });
            // Update the 'pip-campsite' data source to include campsite point in buffer zone
            map.getSource("pip-sports").setData({
              type: "FeatureCollection",
              features: pip_array,
            });
            map.addLayer({
              id: "Pip-sports",
              type: "symbol", //symbol
              source: "pip-sports",
              layout: {
                // make layer visible by default
                visibility: "visible",
                "icon-image": "sports-24", //'custom-marker',
                // get the title name from the source's "title" property
                "text-field": ["get", "title"],
                "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
                "text-offset": [0, 1.25],
                "text-anchor": "top",
              },
              // 'paint':{
              //     'circle-color':'#ffffff',
              //     'circle-radius':10,
              // }
            });
            //pop up on click
            map.on("click", "Pip-sports", function (e) {
              var coordinates = e.features[0].geometry.coordinates.slice();
              // Ensure that if the map is zoomed out such that multiple
              // copies of the feature are visible, the popup appears
              // over the copy being pointed to.
              while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
              }

              var sportsCategory = e.features[0].properties.top_category;
              var sportsSubCategory = e.features[0].properties.sub_category;
              var sportsRegion = e.features[0].properties.region;
              if (e.features[0].properties.brands === "null") {
                var popupContent =
                  "Class:" +
                  sportsCategory +
                  "<br/>Sub-Class: " +
                  sportsSubCategory +
                  "<br/>State:" +
                  sportsRegion +
                  "<br/>";
              } else {
                var sportsBrands = e.features[0].properties.brands;
                var popupContent =
                  "Brand: " +
                  sportsBrands +
                  "<br/>Class:" +
                  sportsCategory +
                  "<br/>Sub-Class: " +
                  sportsSubCategory +
                  "<br/>State:" +
                  sportsRegion +
                  "<br/>";
              }

              if (e.features[0].geometry) {
                popupContent += '<div class="google-maps-icon-container">';
                popupContent +=
                  '<div><a target="_blank" href="https://www.google.com/maps/search/?api=1&query=' +
                  e.features[0].geometry.coordinates[1] +
                  "," +
                  e.features[0].geometry.coordinates[0] +
                  '"><img border="0" alt="google maps" src="https://raw.githubusercontent.com/tooobening/geog778/master/img/google-maps-48.png" width="40" height="40"></img></a></div>';
                popupContent +=
                  '<div><a target="_blank" href="https://www.google.com/maps/search/?api=1&query=' +
                  e.features[0].geometry.coordinates[1] +
                  "," +
                  e.features[0].geometry.coordinates[0] +
                  '">Show on Google Maps</a><div>';
                popupContent += "</div>";
              }
              new mapboxgl.Popup()
                .setLngLat(coordinates)
                .setHTML(popupContent)
                .addTo(map);
            });

            // Change the cursor to a pointer when the mouse is over the places layer.
            map.on("mouseenter", "Pip-sports", function () {
              map.getCanvas().style.cursor = "pointer";
            });

            // Change it back to a pointer when it leaves.
            map.on("mouseleave", "Pip-sports", function () {
              map.getCanvas().style.cursor = "";
            });
          },
          function (error) {
            console.log(error);
          }
        ); //end of loadJSON(sports)
        var SourcePipIdArray = [
          "Pip-campsite",
          "Pip-gas",
          "Pip-grocery",
          "Pip-sports",
        ];
        const poi = document.getElementById("poi");
        poi.innerHTML = "";
        toggleMenu(SourcePipIdArray);
      }); //end of map.on
    },
    function (error) {
      console.log(error);
    }
  ); //end of loadJSON(routeURL)
}

function submitForm(event) {
  event.preventDefault();
  // delete current map layer
  map.remove();
  //get form data
  start = document.getElementById("start").value;
  end = document.getElementById("end").value;

  //geocoding
  var resultPoint = [];
  var index = [start, end];
  var request = new XMLHttpRequest();
  (function loop(i, length) {
    if (i >= length) {
      return;
    }
    //add geocoding api, with parameter
    var searchType = "place,poi";
    var proximity = "-120.0542,43.8041";
    var searchBbox = "-124.763068,32.534156,-111.043564,49.002494";
    var url =
      "https://api.mapbox.com/geocoding/v5/mapbox.places/" +
      index[i] +
      ".json?proximity=" +
      proximity +
      "&bbox=" +
      searchBbox +
      "&type=" +
      searchType +
      "&autocomplete=true&country=us&access_token=" +
      mapboxgl.accessToken;
    request.open("GET", url);
    request.responseType = "json";
    request.onreadystatechange = function () {
      if (
        request.readyState === XMLHttpRequest.DONE &&
        request.status === 200
      ) {
        var data = request.response.features[0].center;
        resultPoint.push(data);
        loop(i + 1, length);
      }
      var startPoint = resultPoint[0];
      var endPoint = resultPoint[1];

      console.log("61", startPoint, endPoint);
      //run direction
      runDirection(startPoint, endPoint);
    };
    request.send();
  })(0, index.length);
  const result = document.getElementById("result");
  result.innerHTML = "<h1>RESULT</h1>";
  // document.getElementById('form').reset();
}
const form = document.getElementById("form");
form.addEventListener("submit", submitForm);

//---------------------------menu----------------------------------//
// enumerate ids of the layers
var toggleableLayerIds = ["National Park", "National Forest", "Place"];
// set up the corresponding toggle button for each layer
for (var i = 0; i < toggleableLayerIds.length; i++) {
  var id = toggleableLayerIds[i];
  var link = document.createElement("a");
  link.href = "#";
  link.className = "active";
  link.textContent = id;
  link.id = id;
  link.onclick = function (e) {
    var clickedLayer = this.textContent;
    console.log("374", clickedLayer);
    e.preventDefault();
    e.stopPropagation();

    var visibility = map.getLayoutProperty(clickedLayer, "visibility");

    // toggle layer visibility by changing the layout object's visibility property
    if (visibility === "visible") {
      map.setLayoutProperty(clickedLayer, "visibility", "none");
      this.className = "";
    } else {
      this.className = "active";
      map.setLayoutProperty(clickedLayer, "visibility", "visible");
    }
  };
  var layers = document.getElementById("menu");
  layers.appendChild(link);
}

map.on("load", loadBaseLayers);
map.on("load", loadCampsiteLayer);
map.on("load", loadGasLayer);
map.on("load", loadGroceryLayer);
map.on("load", loadSportsLayer);
map.on("load", toggleMenu(SourceIdArray));
