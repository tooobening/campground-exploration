mapboxgl.accessToken = 'pk.eyJ1IjoieXVuaW5nbGl1IiwiYSI6ImNrNm9tMW94cDBudGUza3Bnbm05ZHgzemsifQ.3A1elLHNbR-RboygoyQyMw';
var map = new mapboxgl.Map({
    container: 'map', // container id
    // style: 'mapbox://styles/yuningliu/ckfxohc0106s11aqfyvkhjz05', // style URL
    style: 'mapbox://styles/yuningliu/ckhclv0tr04my19mr8zlb19ps',
    center: [-120.5542, 43.8041], // starting position [lng, lat]
    zoom: 5 ,// starting zoom
    // maxBounds: [[-124.763068,32.534156],[-111.043564,49.002494]] // Sets bounds(list: [[Southwest coordinates],[Northeast coordinates]]) as max
});

var from = null;
var to =null;
// var geocoder = new MapboxGeocoder({
//     accessToken: mapboxgl.accessToken,
//     marker: {
//     color: 'orange'
//     },
//     mapboxgl: mapboxgl
// });
// //2
// var geocoder1 = new MapboxGeocoder({
//     accessToken: mapboxgl.accessToken,
//     marker: {
//     color: 'orange'
//     },
//     mapboxgl: mapboxgl
// });

// geocoder.on('result', function(ev) {
//     var searchResult = ev.result.geometry;
//     console.log('first result',searchResult.coordinates)
//     var from = searchResult.coordinates;
//     window.from = from;
// });
// geocoder1.on('result', function(ev) {
//     var searchResult = ev.result.geometry;
//     console.log('second result',searchResult.coordinates)
//     var to = searchResult.coordinates;
//     console.log('93',from,to)    
// });   
// document.getElementById('geocoder').appendChild(geocoder.onAdd(map));
// document.getElementById('geocoder1').appendChild(geocoder1.onAdd(map));

// function runDirection(ori,des){
//     //re-create new map layer after delete current map layer
//     map = new mapboxgl.Map({
//         container: 'map', // container id
//         // style: 'mapbox://styles/yuningliu/ckfxohc0106s11aqfyvkhjz05', // style URL
//         style: 'mapbox://styles/yuningliu/ckhclv0tr04my19mr8zlb19ps',
//         center: [-120.5542, 43.8041], // starting position [lng, lat]
//         zoom: 5 ,// starting zoom
//         maxBounds: [[-124.763068,32.534156],[-111.043564,49.002494]] // Sets bounds(list: [[Southwest coordinates],[Northeast coordinates]]) as max
//     });
//     var dir = //xxx;
//     dir.route(
//         [ori,des]
//     )

// }

// function submitForm(event){
//     event.preventDefault();
//     // delete current map layer
//     map.remove();
//     //get form data
//     start = document.getElementById("start").Value;
//     end = document.getElementById("end").Value;
//     //run direction
//     runDirection(start,end);
//     //resrt form 
//     document.getElementById('form').reset();


// }
// const form = document.getElementById('form');
// form.addEventListener('submit',submitForm);

//load the main map
map.on('load', function () {
    var layers = map.getStyle().layers;
    // Find the index of the first symbol layer in the map style
    var firstSymbolId;
    for (var i = 0; i < layers.length; i++) {
        if (layers[i].type === 'fill') { //layer .type is 'symbol', others: 
            firstSymbolId = layers[i].id; //that layer's .id
            
            break;
        }
    
    }
    
    //draw points from a GeoJSON collection to a map
    map.loadImage(
        'https://raw.githubusercontent.com/tooobening/geog778/master/img/campsite-24.png', //using Github Page to store data on the fly
        function(error, image) {
          if (error) throw error;
          map.addImage('custom-marker', image);
          // Add a GeoJSON source with 2 points
          map.addSource('points', {
            'type': 'geojson',
            'data': 'https://raw.githubusercontent.com/tooobening/geog778/master/data/fed_campsites.geojson' //using Github Page to store data on the fly
          });
          // Add a symbol layer
          map.addLayer({
            'id': 'points',
            'type': 'symbol',
            'source': 'points',
            'layout': {
              'icon-image': 'custom-marker',
              // get the title name from the source's "title" property
              'text-field': ['get', 'title'],
              'text-font': [
                'Open Sans Semibold',
                'Arial Unicode MS Bold'
              ],
              'text-offset': [0, 1.25],
              'text-anchor': 'top'
            }
          });
        }
      );
    //pop up on click
    map.on('click', 'points', function (e) {
        var coordinates = e.features[0].geometry.coordinates.slice();
        var campsiteType = e.features[0].properties.CampsiteType;
        var campsiteState = e.features[0].properties.AddressStateCode;
        var campsiteOrg = e.features[0].properties.OrgAbbrevName;

        // Ensure that if the map is zoomed out such that multiple
        // copies of the feature are visible, the popup appears
        // over the copy being pointed to.
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }
        var popupContent = 'Type:'+campsiteType+'<br/>State:'+campsiteState+'<br/>Organization:'+campsiteOrg+'<br/>'
        
        if (e.features[0].geometry) {
            popupContent += '<div class="google-maps-icon-container">'
            popupContent += '<div><a target="_blank" href="https://www.google.com/maps/search/?api=1&query='+e.features[0].geometry.coordinates[1]+','+e.features[0].geometry.coordinates[0]+'"><img border="0" alt="google maps" src="https://raw.githubusercontent.com/tooobening/geog778/master/img/google-maps-48.png" width="40" height="40"></img></a></div>'
            popupContent += '<div><a target="_blank" href="https://www.google.com/maps/search/?api=1&query='+e.features[0].geometry.coordinates[1]+','+e.features[0].geometry.coordinates[0]+'">Show on Google Maps</a><div>'
            popupContent += '</div>'
          }
        new mapboxgl.Popup()
            .setLngLat(coordinates)
            .setHTML(popupContent)
            .addTo(map);
    });

    // Change the cursor to a pointer when the mouse is over the places layer.
    map.on('mouseenter', 'points', function () {
        map.getCanvas().style.cursor = 'pointer';
    });

    // Change it back to a pointer when it leaves.
    map.on('mouseleave', 'points', function () {
        map.getCanvas().style.cursor = '';
    });
    
    //-------------------add multiple base layers: nps, nfs, places...---------------------------//
    map.addSource('nps', {
        'type': 'geojson',
        'data':
        'https://services1.arcgis.com/fBc8EJBxQRMcHlei/arcgis/rest/services/NPS_Land_Resources_Division_Boundary_and_Tract_Data_Service/FeatureServer/2/query?where=REGION=%27PW%27&outFields=*&outSR=4326&f=geojson'
        });
    map.addSource('nfs', {
        'type': 'geojson',
        'data':
        'https://apps.fs.usda.gov/arcx/rest/services/EDW/EDW_ProclaimedForestBoundaries_01/MapServer/0/query?where=1%3D1&outFields=*&geometry=-124.763068%2C32.534156%2C-111.043564%2C49.002494&geometryType=esriGeometryEnvelope&inSR=4326&spatialRel=esriSpatialRelIntersects&outSR=4326&f=geojson'
        });
    map.addSource('place', {
        'type': 'geojson',
        'data':
        'https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/USA_Census_Populated_Places/FeatureServer/0/query?where=ST%20IN%20(%27WA%27,%27OR%27,%27NV%27,%27ID%27,%27CA%27)&outFields=FID,ObjectID,NAME,CLASS,ST,STFIPS,PLACEFIPS,POP2012,POP_CLASS,SQMI&geometry=-124.763068%2C32.534156%2C-102.041524%2C49.5&geometryType=esriGeometryEnvelope&inSR=4326&spatialRel=esriSpatialRelIntersects&outSR=4326&f=geojson'
        });
    //add the layer (2 args:object, str) again, on top of the source
    map.addLayer(
    { //this obj is what the layer as
        'id': 'National Park',
        'type': 'fill',
        'source': 'nps', // defined from .addSource
        'layout': {},
        'paint': {
            'fill-color': '#578b2c',
            'fill-opacity': 0.5
        }
    //if the other layer exists in the stylesheet already, 
    //the new layer will be positioned right before that layer in the stack,
    //making it possible to put 'overlays' anywhere in the layer stack.
    // Insert the layer beneath the first symbol layer.
    },
    firstSymbolId //this str('symbol') representing another layer's name
    );
    map.addLayer(
        { //this obj is what the layer as
            'id': 'National Forest',
            'type': 'fill',
            'source': 'nfs', // defined from .addSource
            'layout': {},
            'paint': {
                'fill-color': '#636d45',
                'fill-opacity': 0.5
            }
        //if the other layer exists in the stylesheet already, 
        //the new layer will be positioned right before that layer in the stack,
        //making it possible to put 'overlays' anywhere in the layer stack.
        // Insert the layer beneath the first symbol layer.
        },
        firstSymbolId //this str('symbol') representing another layer's name
        );
    map.addLayer(
    { //this obj is what the layer as
        'id': 'Place',
        'type': 'fill',
        'source': 'place', // defined from .addSource
        'layout': {},
        'paint': {
            'fill-color': '#e42634',
            'fill-opacity': 0.5
        }
    },
    firstSymbolId //this str('symbol') representing another layer's name
    );
    } 
);//end of map.on()

//---------------------------menu----------------------------------//
// enumerate ids of the layers
var toggleableLayerIds = ['National Park','National Forest','Place'];
 
// set up the corresponding toggle button for each layer
for (var i = 0; i < toggleableLayerIds.length; i++) {
    var id = toggleableLayerIds[i];
    var link = document.createElement('a');
    link.href = '#';
    link.className = 'active';
    link.textContent = id;
    link.id = id;
    link.onclick = function (e) {
        var clickedLayer = this.textContent;
        e.preventDefault();
        e.stopPropagation();

        var visibility = map.getLayoutProperty(clickedLayer, 'visibility');
 
        // toggle layer visibility by changing the layout object's visibility property
        if (visibility === 'visible') {
            map.setLayoutProperty(clickedLayer, 'visibility', 'none');
            this.className = '';
        } else {
            this.className = 'active';
            map.setLayoutProperty(clickedLayer, 'visibility', 'visible');
        }
    };
    var layers = document.getElementById('menu');
    layers.appendChild(link);
}

