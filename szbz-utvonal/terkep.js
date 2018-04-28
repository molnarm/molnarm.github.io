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

    map.addLayer(satellite);

    addUtvonal(layerControl);
}

function addUtvonal(layerControl) {
    var files = [
        "Győr-Pannonhalma.gpx",
        "Pannonhalma-Bakonyszentlászló.gpx",
        "Bakonyszentlászló-Bakonybél (Kőris).gpx",
        "Bakonyszentlászló-Bakonybél (Zirc).gpx",
        "Bakonybél-Veszprém.gpx",
        "Veszprém-Tótvázsony.gpx",
        "Tótvázsony-Tihany.gpx"
    ];
    var layers = [];

    for (var i = 0; i < files.length; i++) {
        var file = files[i];
        layers.push(new L.GPX('gpx/' + file, { async: true }).on("addline", addSegment));
    }

    var layerGroup = L.layerGroup(layers);
    layerControl.addOverlay(layerGroup, 'Útvonal');
    map.addLayer(layerGroup);
}

function addSegment(eventData) {
    var style = {
        color: "#AFEEEE",
        weight: 5
    };

    var extensionsElements = eventData.element.getElementsByTagName("extensions");
    if (extensionsElements.length !== 0) {
        var namespace = "http://molnarm.github.io/szbz-utvonal";
        var szbzElements = extensionsElements[0].getElementsByTagNameNS(namespace, "szbz");
        if (szbzElements.length !== 0) {
            var szbz = szbzElements[0];
            var tags = ["id", "title", "description", "from", "to", "sign", "type"];
            var data = {};

            for (var i = 0; i < tags.length; i++) {
                var elements = szbz.getElementsByTagNameNS(namespace, tags[i]);
                if (elements.length === 1)
                    data[tags[i]] = elements[0].textContent;
                else
                    data[tags[i]] = "";
            }

            applyStyle(style, data.sign);
            eventData.line.bindPopup(
                "<b>" +
                data.title +
                "</b> (" +
                data.id +
                ")<br />" +
                data.description +
                "<br />" +
                data.from +
                " - " +
                data.to +
                "<br />" +
                "Jelzés: " +
                data.sign +
                "<br />" +
                "Típus: " +
                data.type
            );
        }
    }

    eventData.line.setStyle(style);
}

function applyStyle(style, sign) {
    if (!sign || sign.length === 0)
        return;

    var c = sign[0];
    if (c === c.toLowerCase())
        style.dashArray = "5 10";

    var jelzes = c.toUpperCase();
    var colors = {
        "K": "#0000FF",
        "Z": "#008000",
        "P": "#FF0000",
        "S": "#FFFF00",
        "L": "#800080"
    }
    if (colors.hasOwnProperty(jelzes))
        style.color = colors[jelzes];
}
