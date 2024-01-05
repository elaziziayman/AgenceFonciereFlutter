
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


var numberOfPolygons = 0;
var geojsonConstructionsPolygone;
var geojsonConstructions;

        let drawItems = new L.FeatureGroup();
        map.addLayer(drawItems);
        let drawControl = new L.Control.Draw({
            draw: {
                marker: false,
                polyline: false,
                rectangle: false,
                circle: false,
                circlemarker: false,
                polygon: true,
            },
            edit: {
                featureGroup: drawItems,
            },
        });
        map.addControl(drawControl);


       map.on(L.Draw.Event.CREATED, function (e) {
           var type = e.layerType,
               layer = e.layer;

           // Ajouter des propriétés supplémentaires à la couche (polygone)
           var id = numberOfPolygons + 1;
           layer.feature = {
               type: "Feature",
               geometry: layer.toGeoJSON().geometry,
               properties: {
                   id: id,
                   type: "", // Remplacez par le type approprié
                   contact: "", // Remplacez par le contact approprié
                   adresse: "" // Remplacez par l'adresse appropriée
               }
           };

           // Mettre à jour la variable globale numberOfPolygons
           numberOfPolygons++;

           // Ajouter la couche à la carte et au groupe de fonctionnalités
           drawItems.addLayer(layer);
           featureGroup_polygones.addLayer(layer);

           processFeature(layer.feature, layer);

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
            geojsonConstructions = L.geoJson(les_constructions,{
                onEachFeature: processConstructions
            });


          // featureGroup.addLayer(geojsonConstructions);
           featureGroup_constructions.addLayer(geojsonConstructions);





       }

        function initPolygon(les_constructions_polygone){
                    featureGroup_polygones.clearLayers();

                   geojsonConstructionsPolygone = L.geoJson(les_constructions_polygone,{
                                   onEachFeature: processConstructionsPolygone
                               });

                   numberOfPolygons = geojsonConstructionsPolygone.toGeoJSON().features.length;




                  //  featureGroup.addLayer(geojsonConstructionsPolygone);
                    featureGroup_polygones.addLayer(geojsonConstructionsPolygone);





              }

        function processConstructions(feature,layer){
          /*  let popupTxt = "<b>"+feature.properties.Type+"</b><br/>"+feature.properties.Nom;
            popupTxt += "<br/><button id='hotel_survey_"+feature.properties.Id+"'>Remplir questionnaire</button>";
            let popupObj = layer.bindPopup(popupTxt,{className: "hotelPopup", offset: L.point(0,-16)});*/
            layer.setIcon(L.icon({
                        iconUrl:'images/construction.png',
                        iconSize: [48,48],
                        iconAnchor: [16, 32]
                    }));
         /*   var modal = document.getElementById("myModal");
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
            let popupObj="";

            if (feature.properties.type === "" && feature.properties.contact === "" && feature.properties.adresse === "") {
                // Si l'une des propriétés est vide, afficher le formulaire
                const formId = "formulaire_" + feature.properties.id;

                popupTxt += `<br/><button id='survey_${feature.properties.id}'>Renseigner les informations</button>`;

                const formHtml = `
                    <form id='${formId}'>
                        <label for="type">Type :</label>
                        <input type="text" id="type_${feature.properties.id}" name="type">
                        <label for="contact">Contact :</label>
                        <input type="text" id="contact_${feature.properties.id}" name="contact">
                        <label for="adresse">Adresse :</label>
                        <input type="text" id="adresse_${feature.properties.id}" name="adresse">
                        <input type="submit" value="Soumettre">
                    </form>
                `;

                popupObj = layer.bindPopup(popupTxt, { className: "popup", offset: L.point(0, -16) });

                var modal = document.getElementById("myModal");

                popupObj.on('popupopen', () => {
                    // Si l'une des propriétés est vide, attacher un événement pour afficher le formulaire
                    document.getElementById(`survey_${feature.properties.id}`).addEventListener("click", e => {
                        modal.style.display = "block";

                        // Ajouter le formulaire au div modal body
                        var modalBody = document.querySelector(".modal-body");
                        modalBody.innerHTML = formHtml;

                        // Ajouter l'événement de soumission pour le formulaire généré
                        var form = document.getElementById(formId);
                        form.addEventListener("submit", function (e) {
                            e.preventDefault(); // Empêcher le rechargement de la page

                            // Mettre à jour les propriétés de l'objet feature avec les valeurs du formulaire
                            feature.properties.type = document.getElementById(`type_${feature.properties.id}`).value;
                            feature.properties.contact = document.getElementById(`contact_${feature.properties.id}`).value;
                            feature.properties.adresse = document.getElementById(`adresse_${feature.properties.id}`).value;
                            popupTxt = "<b>Type:</b> " + feature.properties.type + "<br/>";
                            popupTxt += "<b>Contact:</b> " + feature.properties.contact + "<br/>";
                            popupTxt += "<b>Adresse:</b> " + feature.properties.adresse + "<br/>";
                            layer.setPopupContent(popupTxt);
                            // Fermer le modal
                            modal.style.display = "none";
                        });
                    });

                    document.getElementsByClassName("close")[0].addEventListener("click", e => {
                        modal.style.display = "none";
                    });
                });
            }
             else {
                                  // Si toutes les propriétés sont remplies, afficher les informations dans une popup
                                  popupTxt += "<b>Type:</b> " + feature.properties.type + "<br/>";
                                  popupTxt += "<b>Contact:</b> " + feature.properties.contact + "<br/>";
                                  popupTxt += "<b>Adresse:</b> " + feature.properties.adresse + "<br/>";

                                  popupObj = layer.bindPopup(popupTxt, { className: "popup", offset: L.point(0, -16) });



                              }
        }


      function processFeature(feature, layer) {
              let popupTxt = "";
              let popupObj ="";

              if (feature.properties.type === "" && feature.properties.contact === "" && feature.properties.adresse === "") {
                  // Si l'une des propriétés est vide, afficher le formulaire
                  const formIdFeature = "formulairefeature_" + feature.properties.id;

                  popupTxt += `<br/><button id='survey_${feature.properties.id}'>Renseigner les informations</button>`;
                   const formHtml = `
                                        <form id='${formIdFeature}'>
                                            <label for="type">Type :</label>
                                            <input type="text" id="type_${feature.properties.id}" name="type">
                                            <label for="contact">Contact :</label>
                                            <input type="text" id="contact_${feature.properties.id}" name="contact">
                                            <label for="adresse">Adresse :</label>
                                            <input type="text" id="adresse_${feature.properties.id}" name="adresse">
                                            <input type="submit" value="Soumettre">
                                        </form>
                                    `;
                    popupObj = layer.bindPopup(popupTxt, { className: "popup", offset: L.point(0, -16) });

                    var modal = document.getElementById("myModal");

                                      popupObj.on('popupopen', () => {
                                          // Si l'une des propriétés est vide, attacher un événement pour afficher le formulaire
                                          document.getElementById(`survey_${feature.properties.id}`).addEventListener("click", e => {
                                              modal.style.display = "block";

                                              // Ajouter le formulaire au div modal body
                                              var modalBody = document.querySelector(".modal-body");
                                              modalBody.innerHTML = formHtml;

                                              // Ajouter l'événement de soumission pour le formulaire généré
                                              var form = document.getElementById(formIdFeature);
                                              form.addEventListener("submit", function (e) {
                                                  e.preventDefault(); // Empêcher le rechargement de la page

                                                  // Mettre à jour les propriétés de l'objet feature avec les valeurs du formulaire
                                                  feature.properties.type = document.getElementById(`type_${feature.properties.id}`).value;
                                                  feature.properties.contact = document.getElementById(`contact_${feature.properties.id}`).value;
                                                  feature.properties.adresse = document.getElementById(`adresse_${feature.properties.id}`).value;

                                                  popupTxt = "<b>Type:</b> " + feature.properties.type + "<br/>";
                                                                  popupTxt += "<b>Contact:</b> " + feature.properties.contact + "<br/>";
                                                                  popupTxt += "<b>Adresse:</b> " + feature.properties.adresse + "<br/>";
                                                  layer.setPopupContent(popupTxt);

                                                  // Fermer le modal
                                                  modal.style.display = "none";
                                              });
                                          });

                                          document.getElementsByClassName("close")[0].addEventListener("click", e => {
                                              modal.style.display = "none";
                                          });
                                      });

                  }
                    else {
                         popupTxt += "<b>Type:</b> " + feature.properties.type + "<br/>";
                         popupTxt += "<b>Contact:</b> " + feature.properties.contact + "<br/>";
                         popupTxt += "<b>Adresse:</b> " + feature.properties.adresse + "<br/>";

                         popupObj = layer.bindPopup(popupTxt, { className: "popup", offset: L.point(0, -16) });

                                    }










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
           var allDataGeoJSON = featureGroup_polygones.toGeoJSON();

           // Filter out point features and keep only polygon features
          /* allDataGeoJSON.features = allDataGeoJSON.features.filter(function (feature) {
               return feature.geometry.type === "Polygon";
           });*/

           // Convert the GeoJSON object back to a JSON string
           return JSON.stringify(allDataGeoJSON);
       }

