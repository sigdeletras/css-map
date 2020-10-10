import { ortoPNOA, IGNBaseTodogris, IGNBaseOrto } from './modules/ignLayerRepository.js';
import { stamenWatercolor, statemenTerrainLabels } from './modules/osmLayerRepository.js';

const centerCoordinates = ol.proj.fromLonLat([-3.74922, 40.463667,]);
const initialZoom = 5

const view = new ol.View({
  center: centerCoordinates,
  zoom: initialZoom
})

const view2 = new ol.View({
  center: ol.proj.transform([-0.92, 52.96], 'EPSG:4326', 'EPSG:3857'),
  zoom: 6
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
      layers: [stamenWatercolor, statemenTerrainLabels ]
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