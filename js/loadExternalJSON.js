<script>
	mapboxgl.accessToken = '<access_token>';
var map = new mapboxgl.Map({
container: 'map',
style: 'mapbox://styles/mapbox/satellite-v9',
zoom: 0
});
 
map.on('load', function() {
// We use D3 to fetch the JSON here so that we can parse and use it separately
// from GL JS's use in the added source. You can use any request method (library
// or otherwise) that you want.
d3.json(
'https://docs.mapbox.com/mapbox-gl-js/assets/hike.geojson', //the geoJSON data file
function(err, data) {
if (err) throw err;
 
// save full coordinate list for later
var coordinates = data.features[0].geometry.coordinates;
 
// start by showing just the first coordinate
data.features[0].geometry.coordinates = [coordinates[0]];
 
// add it to the map
map.addSource('trace', { type: 'geojson', data: data });
map.addLayer({
'id': 'trace',
'type': 'line',
'source': 'trace',
'paint': {
'line-color': 'yellow',
'line-opacity': 0.75,
'line-width': 5
}
});
 
 


}
);
});
</script>