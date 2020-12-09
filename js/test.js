mapboxgl.accessToken = 'pk.eyJ1IjoieXVuaW5nbGl1IiwiYSI6ImNrNm9tMW94cDBudGUza3Bnbm05ZHgzemsifQ.3A1elLHNbR-RboygoyQyMw';


var client_id = 'TKSJMNNJIQREY5NVZBLJLBRX1ZR5HGYH1LRJJORMUQC1YRRC';
var client_secret = 'D3MO5ZX5V05BNSWFM2QUTNHIPBX1OBYZMXU05JTHPXDX5ONZ';
var ll = '45.5051,-122.6750';
var query = 'gas station';
var gasStation = $.ajax({
    url:"https://api.foursquare.com/v2/venues/search?client_id="+client_id+"&client_secret="+client_secret+"&ll="+ll+"&query="+query+"&v=20201010&limit=30",
    dataType: "json",
    success: console.log("County data successfully loaded."),
    error: function (xhr) {
      alert(xhr.statusText)
    }
  })
  // Specify that this code should run once the county data request is complete
  $.when(gasStation).done(function() {
      console.log(gasStation.responseJSON.response.venues[0].location.labeledLatLngs[0].lat);
    var map = new mapboxgl.Map({
        container: 'map', // container id
        // style: 'mapbox://styles/yuningliu/ckfxohc0106s11aqfyvkhjz05', // style URL
        style: 'mapbox://styles/yuningliu/ckhclv0tr04my19mr8zlb19ps',
        center: [-120.0542, 43.8041], // starting position [lng, lat]
        zoom: 6 ,// starting zoom
        // maxBounds: [[-124.763068,32.534156],[-111.043564,49.002494]] // Sets bounds(list: [[Southwest coordinates],[Northeast coordinates]]) as max
    });

    for (var i = 0; i < gasStation.responseJSON.response.venues.length; i++) {
        var lat= gasStation.responseJSON.response.venues[i].location.labeledLatLngs[0].lat; 
        var lng= gasStation.responseJSON.response.venues[i].location.labeledLatLngs[0].lng; 
        console.log(gasStation.responseJSON.response.venues[i]);
        var marker = new mapboxgl.Marker()
        .setLngLat([lng, lat])
        .setPopup(new mapboxgl.Popup().setHTML("<p>"+gasStation.responseJSON.response.venues[i].name+"<p>")) // add popup
        .addTo(map);
    };


  });