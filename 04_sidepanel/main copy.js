import { ortoPNOA, IGNBaseTodogris, IGNBaseOrto } from './modules/ignLayerRepository.js';
import { stamenWatercolor, statemenTerrainLabels } from './modules/osmLayerRepository.js';

const centerCoordinates = ol.proj.fromLonLat([-3.74922, 40.463667,]);
const initialZoom = 5

const view = new ol.View({
  center: centerCoordinates,
  zoom: initialZoom
})


const PNOA_group = new ol.layer.Group({
  title: 'PNOA Base',
  type: 'base',
  combine: true,
  visible: false,
  layers: [IGNBaseTodogris, ortoPNOA, IGNBaseOrto]
})

const base_maps = new ol.layer.Group({
  title: 'Base maps',
  layers: [
    new ol.layer.Group({
      title: 'Stamen Water color',
      type: 'base',
      combine: true,
      visible: false,
      layers: [stamenWatercolor, statemenTerrainLabels]
    }),
    new ol.layer.Tile({
      title: 'OSM',
      type: 'base',
      visible: true,
      source: new ol.source.OSM()
    }),
    PNOA_group,
  ]
})

const map = new ol.Map({
  target: 'map',
  layers: [base_maps],
  view: view
});

var myStyle = new ol.style.Style({
  image: new ol.style.Circle({
    radius: 7,
    fill: new ol.style.Fill({ 
      color: 'black' 
    }),
    stroke: new ol.style.Stroke({
      color: [255, 0, 0],
      width: 2
    })
  })
})

var style = new ol.style.Style({
    image: new ol.style.Circle({
      radius: 5,
      fill: new ol.style.Fill({color: '#666666'}),
      stroke: new ol.style.Stroke({color: '#bada55', width: 1}),
    }),
  });


const vector = new ol.layer.Vector({
  source: new ol.source.Vector({
    url: './data/cities.geojson',
    format: new ol.format.GeoJSON(),
    style: style
  })
});

map.addLayer(vector);


const layerSwitcher = new ol.control.LayerSwitcher({
  tipLabel: 'Legend',
  groupSelectStyle: 'children' // Can be 'children' [default], 'group' or 'none'
});
map.addControl(layerSwitcher);

function zoomTo(coordinates, zoom) {
  map.getView().setCenter(coordinates)
  map.getView().setZoom(zoom);
}

let initViewButton = document.getElementById('init-view');
initViewButton.addEventListener('click', () => zoomTo(centerCoordinates, initialZoom));

function getZoomLevel() {
  let currentZoom = Math.round(map.getView().getZoom());

  alert(`Current Zoom Level: ${currentZoom}`)
}

let viewZoomButton = document.getElementById('view-zoom');
viewZoomButton.addEventListener('click', getZoomLevel);

function getCurrentExtent() {
  let currentExtent = map.getView().calculateExtent(map.getSize());
  let projectionCode = map.getView().getProjection().code_;
  let transformExtent = ol.proj.transformExtent(currentExtent, projectionCode, 'EPSG:4326');

  alert(`Extend: ${transformExtent.toString()}`)
}

let viewExtentButton = document.getElementById('view-extent');
viewExtentButton.addEventListener('click', getCurrentExtent);

let resultsList = document.getElementById('resultList');

for (let i = 1; i < 10; i++) {
  var item = `<p id='pan-to' point=${randomLat()} class='item'>Points ${i}</p>`
  resultsList.innerHTML += item;
}

let elements = document.getElementsByClassName('item');

for (let i = 0; i < elements.length; i++) {
  let point = elements[i].getAttribute('point');
  elements[i].addEventListener("click", function () {
    drawZoomLocation(point)
  });
}

function drawZoomLocation(idPoints) {
  alert(idPoints);
  zoomTo(idPoints, 10)
}

function randomLat() {
  //   Latitude : max/min +90 to -90
  // Longitude : max/min +180 to -180
  // {
  //   "name": "Maine",
  //   "min_lat": 42.9182,
  //   "max_lat": 47.455,
  //   "min_lng": -71.0829,
  //   "max_lng": -66.8628
  // },
  let max = 47.455;
  let min = 42.9182;
  let lat = Math.random() * (max - min) + min;

  let maxLng = -66.8628;
  let minLng = -71.0829;
  let lng = Math.random() * (maxLng - minLng) + minLng;
  return [lng, lat]

}

console.log(randomLat());