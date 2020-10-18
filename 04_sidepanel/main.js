import { ortoPNOA, IGNBaseTodogris, IGNBaseOrto } from './modules/ignLayerRepository.js';
import { stamenWatercolor, statemenTerrainLabels } from './modules/osmLayerRepository.js';

import getData from './modules/getData.js'


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



// layerSwitcher

const layerSwitcher = new ol.control.LayerSwitcher({
  tipLabel: 'Legend',
  groupSelectStyle: 'children'
});
map.addControl(layerSwitcher);


// Buttons

function zoomTo(coordinates, zoom) {
  map.getView().setCenter(coordinates)
  map.getView().setZoom(zoom);
}

function getZoomLevel() {
  let currentZoom = Math.round(map.getView().getZoom());

  alert(`Current Zoom Level: ${currentZoom}`)
}

function getCurrentExtent() {
  let currentExtent = map.getView().calculateExtent(map.getSize());
  let projectionCode = map.getView().getProjection().code_;
  let transformExtent = ol.proj.transformExtent(currentExtent, projectionCode, 'EPSG:4326');

  alert(`Extend: ${transformExtent.toString()}`)
}

let initViewButton = document.getElementById('init-view');
initViewButton.addEventListener('click', () => zoomTo(centerCoordinates, initialZoom));


let viewZoomButton = document.getElementById('view-zoom');
viewZoomButton.addEventListener('click', getZoomLevel);


let viewExtentButton = document.getElementById('view-extent');
viewExtentButton.addEventListener('click', getCurrentExtent);


// List

function zoomToItem(coordinates) {

  let itemCoordinates = ol.proj.fromLonLat(coordinates,);

  map.getView().setCenter(itemCoordinates)
  map.getView().setZoom(14);
}

let resultsList = document.getElementsByClassName('resultList')[0];

let dotStyle = new ol.style.Style({
  image: new ol.style.Icon({
    color: '#BADA55',
    crossOrigin: 'anonymous',
    // For Internet Explorer 11
    imgSize: [20, 20],
    src: 'data/dot.svg',
  }),
})

const arrayDatos = getData();

function drawResultsList(data) {
  data.then((datos) => {
    let cities = datos.cities.sort((a, b) => (a.name > b.name ? 1 : -1))

    cities.forEach(element => {
      let name = element.name;
      let pop = element.pop_max.toLocaleString();
      let coord = element.coordinates;

      let item = `
      <div class='resultList__item'>
        <div class='resultList__item--name' id='pan-to' point=${coord}>${name}</div>
        <div class='resultList__item--pop'>Population ${pop}</div>
      </div>`

      resultsList.innerHTML += item;
    });

    let elements = document.getElementsByClassName('resultList__item--name');

    for (let i = 0; i < elements.length; i++) {
      let point = elements[i].getAttribute('point');
      console.log(point);
      elements[i].addEventListener("click", function () {
        zoomToItem(point.split(","))
      });
    }
  })
}

drawResultsList(arrayDatos);

function drawGeoLayer(data, map) {
  let geoFeatures = []
  data.then((datos) => {
    let cities = datos.cities
    cities.forEach(element => {

      let coord = element.coordinates;

      let cityPoint = new ol.Feature({
        geometry: new ol.geom.Point(ol.proj.fromLonLat(coord)),
      });

      cityPoint.setStyle(dotStyle);

      geoFeatures.push(cityPoint)
    });

    let vectorSource = new ol.source.Vector({
      features: geoFeatures,
    });

    let vectorLayer = new ol.layer.Vector({
      source: vectorSource,
    });

    map.addLayer(vectorLayer);

  })
}
drawGeoLayer(arrayDatos, map)