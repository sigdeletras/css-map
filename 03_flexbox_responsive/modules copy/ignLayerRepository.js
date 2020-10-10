const ortoPNOA = new ol.layer.Tile({
    source: new ol.source.TileWMS({
        url: 'https://www.ign.es/wms-inspire/pnoa-ma?',
        params: { 'LAYERS': 'OI.OrthoimageCoverage', 'TILED': true },
        attributions:
        '© <a href="https://www.ign.es/web/ign/portal">Instituto Geográfico Nacional</a>',
    })
})

const IGNBaseTodogris = new ol.layer.Tile({
    source: new ol.source.TileWMS({
        url: 'https://www.ign.es/wms-inspire/ign-base?',
        params: { 'LAYERS': 'IGNBaseTodo-gris', 'TILED': true },
    }),
})

const IGNBaseOrto = new ol.layer.Tile({
    source: new ol.source.TileWMS({
        url: 'https://www.ign.es/wms-inspire/ign-base?',
        params: { 'LAYERS': 'IGNBaseOrto', 'TILED': true },
    }),
})

export { ortoPNOA, IGNBaseTodogris, IGNBaseOrto };