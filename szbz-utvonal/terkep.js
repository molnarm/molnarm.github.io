var map = L.map('terkep').setView([47.3025, 17.769], 9);

setupLayers(map);

function setupLayers(map) {
    var roadmap = new L.gridLayer.googleMutant({ type: 'roadmap' }),
        satellite = new L.gridLayer.googleMutant({ type: 'satellite' }),
        hybrid = new L.gridLayer.googleMutant({ type: 'hybrid' }),
        terrain = L.gridLayer.googleMutant({ type: 'terrain' });

    var baseMaps = {
        'Térkép': roadmap,
        'Műhold': satellite,
        'Hibrid': hybrid,
        'Domborzat': terrain
    };

    var turaterkep = L.tileLayer('//{s}.map.turistautak.hu/tiles/lines/{z}/{x}/{y}.png', {
        attribution: '<a href="http://turistautak.hu">turistautak.hu</a>',
        minZoom: 8,
        maxZoom: 21,
        subdomains: 'abcd'
    });

    var layerControl = new L.Control.Layers(baseMaps, { 'Turistautak': turaterkep }, { collapsed: false });
    map.addControl(layerControl);

    map.addLayer(roadmap);

    addUtvonal(layerControl);
}

function addUtvonal(layerControl) {
    var files = ["Győr-Pannonhalma.gpx", "Pannonhalma-Bakonyszentlászló.gpx", "Bakonyszentlászló-Bakonybél.gpx", "Bakonybél-Veszprém.gpx", "Veszprém-Tótvázsony.gpx", "Tótvázsony-Tihany.gpx"];
    var layers = [];

    for (var i = 0; i < files.length; i++) {
        var file = files[i];
        layers.push(new L.GPX('/gpx/' + file, { async: true }));
    }

    var layerGroup = L.layerGroup(layers);
    layerControl.addOverlay(layerGroup, 'Útvonal');
    map.addLayer(layerGroup);
}
