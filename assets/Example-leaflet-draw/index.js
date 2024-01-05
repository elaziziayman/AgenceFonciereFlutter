
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

       L.control.layers(baseMaps).addTo(map);


        let drawItems = new L.FeatureGroup();
        map.addLayer(drawItems);
        let drawControl = new L.Control.Draw({
            edit: {
                featureGroup : drawItems,
            },
        });
        map.addControl(drawControl);


        map.on(L.Draw.Event.CREATED, function (e) {
                var type = e.layerType,
                    layer = e.layer;
                // Do whatever else you need to. (save to db; add to map etc)
                drawItems.addLayer(layer);

                });


        map.on('draw:edited', function (e) {
                var layers = e.layers;
                layers.eachLayer(function (layer) {
                    //do whatever you want; most likely save back to db

                });
            });

        var featureGroup = L.featureGroup().addTo(map);

     /*  function init(les_parcs,les_malls,les_hotels){
            featureGroup.clearLayers();
            var geojsonHotels = L.geoJson(les_hotels,{
                onEachFeature: processHotels
            });
            var geojsonMalls = L.geoJson(les_malls,{
                onEachFeature: processMalls
            });
            var geojsonParcs = L.geoJson(les_parcs,{
                onEachFeature: processParcs,
                coordsToLatLng: function (coords) {
                    return new L.LatLng(coords[1], coords[0]);
                }
            });

            featureGroup.addLayer(geojsonHotels);
            //featureGroup.addLayer(geojsonMalls);
            //featureGroup.addLayer(geojsonParcs);

       }*/
       function init(les_hotels){
                   featureGroup.clearLayers();
                   var geojsonHotels = L.geoJson(les_hotels,{
                       onEachFeature: processHotels
                   });


                   featureGroup.addLayer(geojsonHotels);


              }


        function processHotels(feature,layer){
            let popupTxt = "<b>"+feature.properties.Type+"</b><br/>"+feature.properties.Name;
            popupTxt += "<br/><button id='hotel_survey_"+feature.properties.Id+"'>Remplir questionnaire</button>";
            let popupObj = layer.bindPopup(popupTxt,{className: "hotelPopup", offset: L.point(0,-16)});
            layer.setIcon(L.icon({
                        iconUrl:'images/'+feature.properties.Stars+'stars.png',
                        iconSize: [48,48],
                        iconAnchor: [16, 32]
                    }));
            var modal = document.getElementById("myModal");
            popupObj.on('popupopen',()=>{
                document.getElementById("hotel_survey_"+feature.properties.Id).addEventListener("click",e => {
                    modal.style.display = "block";
                });
                document.getElementsByClassName("close")[0].addEventListener("click",e => {
                    modal.style.display = "none";
                });
            });
        }

        function processMalls(feature,layer){
            //let popupTxt = "<b>"+feature.properties.Type+"</b><br/>"+feature.properties.Name;
            let popupTxt ='<div class="card" style="width:auto;">'+
                '<img class="card-img-top" src="images/'+feature.properties.Image+'" alt="Card image" style="width:100%">'+
                '<div class="card-body">'+
                '<h4 class="card-title">'+feature.properties.Type+' : '+feature.properties.Name+'</h4>'+
                '<p class="card-text">'+feature.properties.Desc+'</p>'+
                '<a href="#" class="btn" onclick="alert('+"'edit'"+');">Edit</a>'+
                '</div>'+
                '</div>';
            let popupObj = layer.bindPopup(popupTxt);
            layer.setIcon(L.icon({
                        iconUrl:'images/mall.png',
                        iconSize: [48,48],
                        iconAnchor: [16, 32]
                    }))
        }

        function processParcs(feature,layer){
          let popupTxt ='<div class="card" style="width:auto;">'+
                '<img class="card-img-top" src="images/'+feature.properties.Image+'" alt="Card image" style="width:100%">'+
                '<div class="card-body">'+
                '<h4 class="card-title">'+feature.properties.Type+' : '+feature.properties.Name+'</h4>'+
                '<p class="card-text">'+feature.properties.Desc+'</p>'+
                '<a href="#" class="btn" onclick="">Edit</a>'+
                '</div>'+
                '</div>';
            let popupObj = layer.bindPopup(popupTxt);
            drawItems.addLayer(layer);
        }

      function getEditedData(){
         return JSON.stringify(drawItems.toGeoJSON());
        //console.log(drawItems.toGeoJSON());

        }
