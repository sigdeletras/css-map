const stamenWatercolor = new ol.layer.Tile({
    source: new ol.source.Stamen({
      layer: 'watercolor'
    })
  })

const statemenTerrainLabels = new ol.layer.Tile({
    source: new ol.source.Stamen({
      layer: 'terrain-labels'
    })
  })

export {stamenWatercolor, statemenTerrainLabels };