/* Inicializo array de prueba */
let pointsArray = [
    {
    "pointId":0,
    "nombre":"AEROTERRA S.A.",
    "direccion":"Av. Eduardo Madero 1020",
    "telefono":"54 9 11 5272 0900",
    "category":"Comercial",
    "latitud":"-34.595986",
    "longitud":"-58.3724715"
}
];
/* Configuro el mapa e importo dependencias */
function handleMap () {
    require(["esri/config",
    "esri/Map", 
    "esri/views/MapView",
    "esri/Graphic",
    "esri/layers/GraphicsLayer",
    "esri/layers/FeatureLayer",
    "esri/widgets/Search"
    ], function (esriConfig, Map, MapView, Graphic, GraphicsLayer, FeatureLayer, Search) {
    /* Seteo Api Key */
    esriConfig.apiKey = "AAPK6c3e09a7857b4a01804a74239ff414aeIjVfG8LY5TvnzHY4FYcp-lIOSuLeWuT5SgtemI1fnAVqSnCPajQifw8WmwtgeQNp";
    /* Creo un mapa arcgis-navigation */
    const map = new Map({
        basemap: "arcgis-navigation"
    });
    /* Seteo los parametros iniciales del mapa */
    const view = new MapView({
        map: map,
        center: [-58.368158, -34.627152],       /* Parametros:  Longitud, Latitud */
        zoom: 10,                               /* Nivel de zoom */
        container: "viewDiv"                    /* Div contenedor de mapa */
    });
    const graphicsLayer = new GraphicsLayer();
    map.add(graphicsLayer);
    /* Mapeo array de puntos */
    var graphics = pointsArray.map(function (place) {
        return new Graphic({
          attributes: {
            name: place.nombre,
            markerId: place.id,
            address: place.direccion,
            phone: place.telefono,
            category: place.category,
            coordenates: place.longitud + ", " + place.latitud
          },
          geometry: {
            type: "point",
            longitude: place.longitud,
            latitude: place.latitud
          },
          symbol: {
            type: "simple-marker",
            color: [226, 119, 40],
            outline: {
              color: [255, 255, 255],
              width: 2
            }
          }
        });
    });
    /* Creo template de popup y a??ado el layer al grafico */
    const featureLayer = new FeatureLayer({
        source: graphics,
        fields: [
            {
                name: "name",
                alias: "name",
                type: "string"
            },
            {
                name: "markerId",
                alias: "markerId",
                type: "oid"
            },
            {
                name: "address",
                alias: "address",
                type: "string"
            },
            {
                name: "phone",
                alias: "phone",
                type: "string"
            },
            {
                name: "category",
                alias: "category",
                type: "string"
            },
            {
                name: "coordenates",
                alias: "coordenates",
                type: "string"
            },
        ],
        objectIdField: "markerId",  
        geometryType: "point",
        renderer: {
            type: "simple", 
            symbol: {
                type: "simple-marker",
                size: 6,
                color: "black",
                outline: {
                    width: 0.5,
                    color: "white"
                }
            }
        },
        popupTemplate: {
            title: "{name}",
            content: [{
                type: "fields",
                fieldInfos: [
                  {
                    fieldName: "address",
                    label: "Direccion",
                    visible: true
                  },
                  {
                    fieldName: "phone",
                    label: "Telefono",
                    visible: true
                  },
                  {
                    fieldName: "category",
                    label: "Categoria",
                    visible: true
                  },
                  {
                    fieldName: "coordenates",
                    label: "(X,Y)",
                    visible: true
                  }
                ]
              }],
            actions: [{
                title: "Eliminar marcador",
                id: "delete-marker",
                image: "./media/remove.png"
            }]
        }
    });
    /* Capturo accionamiento de boton eliminador de marcadores
        y elimino el marcador actual */
    view.popup.on("trigger-action", (event) => {
        if (event.action.id === "delete-marker") {
            let idActual = view.popup.selectedFeature.attributes.markerId - 1;
            pointsArray.splice(idActual, 1);
            /* Actualizo marcadores en mapa y en select */
            handleMap();
            fillSelector(pointsArray);
        }
    });
    var search = new Search({
        view: view,
    });
    map.layers.add(featureLayer);
    view.on("hold", function (evt) {
        /* Obtengo direccion apuntando al evento "evt" y a??ado marcador cuando la promesa se resuelve */
        search.search(evt.mapPoint)
        .then(e => {
            /* A??adir point al array */
            let direccionEventual = e.results[0].results[0].name
            let latitudClick = evt.mapPoint.latitude;
            let longitudClick = evt.mapPoint.longitude;
            let lastId = (pointsArray[pointsArray.length - 1].pointId) || 0;
            let nombreLugar = e.results[0].results[0].target.attributes.PlaceName;
            console.log(e.results[0].results[0].target.attributes.PlaceName)
            pointsArray.push({
                "pointId": lastId + 1 ,
                "nombre":  nombreLugar || "Marcador N??: " + (lastId + 2),
                "direccion":  direccionEventual,
                "telefono": "No encontrado",
                "category": "No encontrado",
                "latitud": latitudClick,
                "longitud": longitudClick
            });
            /* Actualizo marcadores en mapa y en select */
            handleMap();
            fillSelector(pointsArray);
        })

        search.resultGraphicEnabled = false;
    });
});
}
/* Inicializo el mapa */
handleMap();

/* Evito el refresco de paginal cuando se env??e el form */
var form = document.getElementById("formMapId");
function handleForm(event) { event.preventDefault(); } 
form.addEventListener('submit', handleForm);


let counter = 0;
/* Creo funcion para actualizar select eliminador de marcadores */
function fillSelector(pointsArray) {
    document.getElementById("marcadoresId").innerHTML = "<option>Seleccionar</option>";	
    var modelList = document.getElementById("marcadoresId"); 
    for (var i in pointsArray) { 
        // creamos un elemento de tipo option
        var opt = document.createElement("option");
        // le damos un valor
        opt.value = pointsArray[i].nombre;
        // le ponemos un texto
        opt.textContent = pointsArray[i].nombre;
        // lo agregamos al select
        modelList.options.add(opt);
    }
} 
/* Inicializo el select con el ejemplo */
fillSelector(pointsArray); 
function deleteMarkerFromButton(){
    let nameToDelete = document.getElementById("marcadoresId").value;
    let indexArray = pointsArray.findIndex(objeto => {
        return objeto.nombre === nameToDelete
    })
    pointsArray.splice(indexArray, 1);
    console.log(pointsArray);
    /* Recargo mapa y select */
    handleMap();
    fillSelector(pointsArray);
}

/* Funcion para limpiar campos de texto */
function cleanForm(){
    document.formMap.nameInput.value = "";
    document.formMap.nameInput.value = "";
    document.formMap.direccionInput.value = "";
    document.formMap.telefonoInput.value = "";
    document.formMap.categoryInput.value = "";
    document.formMap.coordenadasInput.value = "";
}


/* Valido los input del form */
function validate() {
    /* Guardo inputs de formMap */
    let nameInput = document.formMap.nameInput;
    let direccionInput = document.formMap.direccionInput;
    let telefonoInput = document.formMap.telefonoInput;
    let categoryInput = document.formMap.categoryInput;
    let coordenadasInput = document.formMap.coordenadasInput;
    let coordenadasArray = coordenadasInput.value.split(",",2)
    /* Valido inputs de form */
    if( nameInput.value == "" ) {
        nameInput.focus();
        document.getElementsByName('nameInput')[0].placeholder='Campo obligatorio';
    return false;
    }
    if( direccionInput.value == "" ) {
        direccionInput.focus();
        document.getElementsByName('direccionInput')[0].placeholder='Campo obligatorio';
    return false;
    }
    if( telefonoInput.value == "") {
        telefonoInput.focus();
        document.getElementsByName('telefonoInput')[0].placeholder='Campo obligatorio';
    return false;
    }
    if( categoryInput.value == "-1" ) {
        categoryInput.focus();
    return false;
    }
    if( coordenadasInput.value == "" || coordenadasArray[1]  < -180 || coordenadasArray[1] > 180 || coordenadasArray[0]  < -90 || coordenadasArray[0] > 90 ) {
        coordenadasInput.focus();
        coordenadasInput.innerHTML = "";
        document.getElementsByName('coordenadasInput')[0].placeholder='Campo obligatorio';
        return false;
    }
    counter++;

    console.log(coordenadasArray);
    /* Guardo data en array pointsArray */
    pointsArray.push({
        "pointId": counter,
        "nombre": nameInput.value,
        "direccion": direccionInput.value,
        "telefono": telefonoInput.value,
        "category": categoryInput.value,
        "latitud": coordenadasArray[0],
        "longitud": coordenadasArray[1]
    });
    pointsArray.map(marcador => {
        document.getElementById("marcadoresId").innerHTML = "<option value="+ marcador.nombre +">" + marcador.nombre + "</option>"
    })
    /* Actualizo select para eliminar marcadores */
    fillSelector(pointsArray); 
    /* Creo el mapa con nuevo marcador */
    handleMap();
    /* Lipio campos de texto */
    cleanForm();
    return true;
}


function eliminarMarcador () {
    console.log(document.getElementById("marcadoresId").value)
}

/* Guardo los marcadores por archivo Json */
document.getElementById("uploadJson").addEventListener("click", handleFiles);

function handleFiles() {
    var file = document.getElementById("jsonFile").files[0];

    if (file) {
        var reader = new FileReader();
        reader.readAsText(file, "UTF-8");
        reader.onload = function(evt) {
            try {
                var newPoints = JSON.parse(evt.target.result);
            } catch (err) {
                alert("Error en el JSON\n" + err.message);
            }
            if (newPoints) {
                newPoints.forEach(point => {
                    pointsArray.push({
                        "pointId": point.pointId,
                        "nombre": point.nombre,
                        "direccion": point.direccion,
                        "telefono": point.telefono,
                        "category": point.category,
                        "latitud": point.latitud,
                        "longitud": point.longitud
                    });
                });
            }
            /* Actualizo select para eliminar marcadores */
            fillSelector(pointsArray); 
            /* Creo el mapa con nuevo marcador */
            handleMap();
        }
        reader.onerror = function(evt) {
            alert("Error al leer el archivo");
        }
    } else {
        alert("Ningun archivo cargado.");
    }
};

/* Descargar marcadores ACTUALES como Json */
document.getElementById("downloadPoints").addEventListener("click", function() {
    if (pointsArray.length) {
        console.log("a")
        var data = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(pointsArray));
        console.log(data)
        var buttonDownload = document.getElementById('downloadPoints');
        buttonDownload.setAttribute("href", data);
        buttonDownload.setAttribute("download", "points.json");
        buttonDownload.click();
    } else {
        alert("No hay puntos en el mapa para descargar.");
    }

});