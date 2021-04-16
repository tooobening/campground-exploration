# CAMPGROUND EXPLORATION
## Web GIS application

![Image of Yaktocat](./images/gif.gif)


<center>
<h2>
<a href='https://tooobening.github.io/campground-exploration/'>LIVE DEMO</a>
<h2>
</center>

## Introduction

A web tools for planning a two-day trip is an interactive map with UI/UX design. It including all the populated places, national parks and national forests in the Western U.S (9 states in total), with ability to navigate to Google Maps.
This map render a variety of layers: national parks, national forest, populated places and points of interest (POI). Users are allowed to get optimized routes after setting the original place and the destination, and the result also show all the POIs surrounding these routes within 100-mile buffer zone.

## How to use:
### Step1: 
Input Sacremento for day one & Death Valley for day two, click “let’s go”.

### Step2: 
Show the result (result should have the route).

### Step3: 
Click the two button randomly ( red circles ) and to let it switch btw visible/invisible on the map.

## Getting Started

This application is based on JavaScript/CSS/HTML using open-source APIs and modular engine written in JavaScript.
<br>To clone the repository: `git clone https://github.com/tooobening/campground-exploration.git`

## Built with?

- [Mapbox GL JS](https://docs.mapbox.com/mapbox-gl-js/api/) - A JavaScript library that uses WebGL to render interactive maps from vector tiles and Mapbox styles.
- [ArcGIS REST API](https://developers.arcgis.com/arcgis-rest-js/) - A collection of JavaScript modules for accessing location services, ArcGIS Online and ArcGIS Enterprise REST APIs.
- [turf.js](https://turfjs.org/) - A JavaScript library for spatial analysis. It includes traditional spatial operations, helper functions for creating GeoJSON data, and data classification and statistics tools.

## About the project

- **navigate**
  Users firstly input the desired cities/natural areas for each day. The map then help draw a connecting route with optimization navigation API from @Mapbox
- **overlayed data in the buffered zone**
  Alongside the optimized route, campgrounds with some useful POIs will also be showed in the 100-mile buffer zones, e.g. gas stations, grocery stores, and sporting goods stores, using geospatial analysis modules from @Turf.js (BooleanInPolygon()). – Trigger base layers
  Base maps which created by @Mapbox Studio that allows customized geometries and labels on its original vector-tiled maps. In this project, the following datasets datasets are included: [national parks](https://public-nps.opendata.arcgis.com/datasets/nps-boundary-1?geometry=-144.334%2C-20.479%2C119.338%2C70.899), [national forest](https://hub.arcgis.com/datasets/3451bcca1dbc45168ed0b3f54c6098d3_0?geometry=-128.332%2C43.003%2C-113.512%2C45.750&orderBy=FORESTNAME) and [populated places](https://hub.arcgis.com/datasets/esri::usa-census-populated-places/data?geometry=-128.016%2C41.904%2C-113.196%2C44.701), retrieving from ArcGIS RESTful API.

## Example for HOW TO retrieve data using ArcGIS RESTful API:

#### Step1: Initiate a mapboxgl.Map

`var map = new mapboxgl.Map({` <br> `container: 'map', // container id` <br> `style: 'mapbox://styles/yuningliu/ckfxohc0106s11aqfyvkhjz05', // style URL `<br>
`center: [-118.5383, 37.8651], // starting position [lng, lat] `<br>`zoom: 5.85 ,// starting zoom });`

#### Step2: Add source from ArcGIS Restful API

`map.addSource('nps', { //source id`<br>
`'type': 'geojson', `<br>
` 'data': 'https://services1.arcgis.com/…' //your ArcGIS RESTful API`<br>
` });`

#### Step3: Add a layer from map.addSource()

`map.addLayer('id': 'National Park', `<br>
`'type': 'fill',` <br>
`'source': 'nps', // defined from .addSource`<br>
`'layout': {…}`<br>
` )`

## Browser Support

This is an open-source project, including usage of open-source web mapping APIs, so check out the links below to configure the most recent version of APIs:

1. [Mapbox GL JS](https://docs.mapbox.com/help/troubleshooting/mapbox-browser-support/#mapbox-gl-js) : It is supported in most modern browsers. Starting with v2.0.0, Mapbox GL JS is no longer compatible with any version of Internet Explorer.
2. [ArcGIS API for JavaScript](https://developers.arcgis.com/javascript/latest/system-requirements/) : For best performance, Esri recommends the 64-bit version of the latest modern, standards-based browsers: Chrome, Firefox, Microsoft Edge, Safari.

## Authors and Contact information

Yu-Ning Liu, Master’s in GIS/Cartography at UW-Madison. For more contact information, check out the Github page [@tooobening](https://github.com/tooobening/) and Twitter [@tooobening](https://twitter.com/tooobening)
