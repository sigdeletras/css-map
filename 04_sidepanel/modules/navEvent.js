const zoomTo = (coordinates, zoom) => {
    map.getView().setCenter(coordinates)
    map.getView().setZoom(zoom);
}


export { zoomTo };