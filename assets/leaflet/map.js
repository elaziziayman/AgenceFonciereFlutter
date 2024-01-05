//TP1
var map=L.map('mapid',{drawControl: true}).setView([33.808975,-7.045327],8);
var OSM=L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
}).addTo(map);

//TP2
// Ajout marqueurs
//marqueur1
var point_depart = L.marker([33.9716, -6.8498],
    {
        title: 'Start point',
        draggable:true

    }).addTo(map);
//marqueur2
var point_arrive = L.marker([33.573,-7.5898],
    {
        title: 'Destination',
        draggable:true
    }).addTo(map);

function calculerDistance(latlng1,latlng2){
        return (latlng1.distanceTo(latlng2)/1000)| 0;
}
point_arrive.on('drag', function (e) {
    var distance=calculerDistance(e.latlng,point_depart.getLatLng());
    document.getElementById('distance-info').innerHTML = 'Distance : ' + distance.toFixed(2) + ' Km';
});
point_depart.on('drag', function (e) {
    var distance=calculerDistance(e.latlng,point_arrive.getLatLng());
    document.getElementById('distance-info').innerHTML = 'Distance : ' + distance.toFixed(2) + ' Km';

});


//TP3
var googleMaps = L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
    attribution: 'Map data ©2022 Google, GeoBasis-DE/BKG (©2009)',
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
});
var arcGIS = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
});

var baseMaps = {
    "OSM" : OSM,
    "Google Maps" : googleMaps,
    "Arc GIS": arcGIS
};

L.control.layers(baseMaps).addTo(map);
//TP4

//var map = L.map('mapid').setView([48.8566, 2.3522], 15); // Centré sur Paris
map.setView([48.8566, 2.3522], 15); // Centré sur Paris


// Fonction pour créer une icône personnalisée
const createCustomIcon = (iconUrl, iconSize) => {
    return L.icon({
        iconUrl: iconUrl,
        iconSize: iconSize,
    });
};


const defaultIcon = createCustomIcon('images/marker-icon.png', [25, 41]);

const selectedIcon = createCustomIcon('./images/default.png', [60, 60]);

const poiData = {
    "type": "FeatureCollection",
    "features": [
        {
            "type": "Feature",
            "properties": {
                "nom": "Musée d'Art Moderne",
                "type": "Musée"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [2.3522, 48.8566]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "nom": "Jardin Botanique",
                "type": "Jardin"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [2.3386, 48.8497]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "nom": "Cathédrale Notre-Dame",
                "type": "Église"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [2.3499, 48.8530]
            }
        }
    ]
};
const poiLayer = L.geoJSON(poiData, {
    pointToLayer: function (feature, latlng) {
        return L.marker(latlng, { icon: defaultIcon });
    },
}).addTo(map);

// Variable pour suivre le marker sélectionné
let selectedMarker = null;

// Écoutez les changements de sélection dans la liste déroulante
const select = document.getElementById('poi-select');
select.addEventListener('change', function () {
    const selectedPoi = select.value;

    // Boucle à travers les entités GeoJSON pour trouver le POI sélectionné
    poiLayer.eachLayer(function (layer) {
        const properties = layer.feature.properties;
        if (properties.nom === selectedPoi) {
            // Centrez la carte sur le POI
            map.setView(layer.getLatLng(), 15);

            // Si un marker était précédemment sélectionné, rétablissez son icône par défaut
            if (selectedMarker) {
                selectedMarker.setIcon(defaultIcon);
            }

            // Mettez en surbrillance le marker sélectionné en utilisant l'icône personnalisée
            layer.setIcon(selectedIcon);
            selectedMarker = layer; // Mémorisez le marker sélectionné
        }
    });
});


                