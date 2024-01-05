
        //Create map with open streetmap background
        var map = L.map('map', {
            center: [33.993,-6.85],
            zoom: 13
        });
       var OSM=L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
           maxZoom: 19,
           attribution: '© OpenStreetMap'
       });

       var googleMaps = L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
           attribution: 'Map data ©2022 Google, GeoBasis-DE/BKG (©2009)',
           subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
       });
       var arcGIS = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
       }).addTo(map);

       var baseMaps = {
           "OSM" : OSM,
           "Google Maps" : googleMaps,
           "Arc GIS": arcGIS
       };



        let drawItems = new L.FeatureGroup();
        map.addLayer(drawItems);
        let drawControl = new L.Control.Draw({
            draw: {
                marker: true,
                polyline: false,
                rectangle: false,
                circle: false,
                circlemarker: false,
                polygon: false,
            },
            edit: {
                featureGroup: drawItems,
            },
        });
        map.addControl(drawControl);


        map.on(L.Draw.Event.CREATED, function (e) {
                var type = e.layerType,
                    layer = e.layer;
                    layer.setIcon(L.icon({
                                                 iconUrl:'images/construction.png',
                                                 iconSize: [48,48],
                                                 iconAnchor: [16, 32]
                                             }));
                // Do whatever else you need to. (save to db; add to map etc)
                drawItems.addLayer(layer);
               // featureGroup.addLayer(layer);
                featureGroup_constructions.addLayer(layer);


                });


        map.on('draw:edited', function (e) {
                var layers = e.layers;
                layers.eachLayer(function (layer) {
                    //do whatever you want; most likely save back to db

                });
            });

       // var featureGroup = L.featureGroup().addTo(map);
         var featureGroup_constructions = L.featureGroup().addTo(map);
         var featureGroup_polygones = L.featureGroup().addTo(map);

       function init(les_constructions){
            featureGroup_constructions.clearLayers();
            var geojsonConstructions = L.geoJson(les_constructions,{
                onEachFeature: processConstructions
            });


            featureGroup_constructions.addLayer(geojsonConstructions);
        

       }

       function initPolygon(les_constructions_polygone){
            featureGroup_polygones.clearLayers();
             geojsonConstructionsPolygone = L.geoJson(les_constructions_polygone,{
                                          onEachFeature: processConstructionsPolygone
                                      });



            featureGroup_polygones.addLayer(geojsonConstructionsPolygone);




                     }

        function processConstructions(feature,layer){
           /* let popupTxt = "<b>"+feature.properties.Type+"</b><br/>"+feature.properties.Nom;
            popupTxt += "<br/><button id='hotel_survey_"+feature.properties.Id+"'>Remplir questionnaire</button>";
            let popupObj = layer.bindPopup(popupTxt,{className: "hotelPopup", offset: L.point(0,-16)});*/
            layer.setIcon(L.icon({
                        iconUrl:'images/construction.png',
                        iconSize: [48,48],
                        iconAnchor: [16, 32]
                    }));
     /*       var modal = document.getElementById("myModal");
            popupObj.on('popupopen',()=>{
                document.getElementById("hotel_survey_"+feature.properties.Id).addEventListener("click",e => {
                    modal.style.display = "block";
                });
                document.getElementsByClassName("close")[0].addEventListener("click",e => {
                    modal.style.display = "none";
                });
            });*/
        }

         function processConstructionsPolygone(feature, layer) {
                    let popupTxt = "";

                              if (feature.properties.type === "" && feature.properties.contact === "" && feature.properties.adresse === "") {
                                  // Si l'une des propriétés est vide, afficher le formulaire
                                  popupTxt += "<b>Les informations ne sont pas encore renseignées</b> ";
                              } else {
                                  // Si toutes les propriétés sont remplies, afficher les informations dans une popup
                                  popupTxt += "<b>Type:</b> " + feature.properties.type + "<br/>";
                                  popupTxt += "<b>Contact:</b> " + feature.properties.contact + "<br/>";
                                  popupTxt += "<b>Adresse:</b> " + feature.properties.adresse + "<br/>";
                              }

                              let popupObj = layer.bindPopup(popupTxt, { className: "popup", offset: L.point(0, -16) });




                }

                var overlayMaps = {
                    "Constructions": featureGroup_constructions,
                    "Constructions Polygone": featureGroup_polygones
                };

                L.control.layers(baseMaps, overlayMaps).addTo(map);


       

      function getEditedData(){
         return JSON.stringify(drawItems.toGeoJSON());


        }
        function getAllData() {
            // Get GeoJSON data from the featureGroup (existing + drawn)
            var allDataGeoJSON = featureGroup_constructions.toGeoJSON();

          /*  allDataGeoJSON.features = allDataGeoJSON.features.filter(function (feature) {
                           return feature.geometry.type === "Point";
                       });*/

            // Convert the GeoJSON object back to a JSON string
            return JSON.stringify(allDataGeoJSON);
        }
